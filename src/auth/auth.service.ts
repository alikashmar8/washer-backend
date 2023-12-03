import { Wallet } from 'src/wallets/entities/wallet.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Address } from 'src/addresses/entities/address.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Currency } from 'src/common/enums/currency.enum';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { MailService } from 'src/common/mail/mail.service';
import {
  calculateDistance,
  removeSpecialCharacters,
} from 'src/common/utils/functions';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PasswordResetDTO } from './dtos/forget-password.dto';
import { LoginDTO } from './dtos/login.dto';
import { LogoutDTO } from './dtos/logout.dto';
import { RegisterUserDTO } from './dtos/register.dto';
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import {
  getWhatsappQrCode,
  isWhatsappReady,
  sendWhatsappMessage,
  sendWhatsappTestMessage,
  // terminateWhatsappConfiguration,
} from './whatsapp';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private employeesService: EmployeesService,
    private deviceTokensService: DeviceTokensService,
    private dataSource: DataSource,
    private mailService: MailService,
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async sendWhatsappTestMessage() {
    return await sendWhatsappTestMessage();
  }

  async getWhatsappQrCode() {
    const qrCode = getWhatsappQrCode();
    return { qrCode };
  }

  async checkWhatsappStatus() {
    return await isWhatsappReady();
  }

  async sendMobileVerificationCode(id: string) {
    const user = await this.usersService.findOneOrFail(id);
    if (!user || !user.phoneNumber || user.isMobileVerified)
      throw new BadRequestException('Invalid User!');

    const verificationCode: number = Math.floor(
      100000 + Math.random() * 900000,
    );
    const verificationCodeExpires: Date = new Date();
    const expirationTime = 2 * 24 * 60 * 60 * 1000;
    verificationCodeExpires.setTime(
      verificationCodeExpires.getTime() + expirationTime,
    );

    user.mobileVerificationCode = verificationCode.toString();
    user.mobileVerificationCodeExpiry = verificationCodeExpires;

    await this.usersRepository.save(user).catch((err) => {
      throw new BadRequestException('Error updating user', err);
    });
    return await sendWhatsappMessage(
      user.phoneNumber.toString(),
      'You verification code is: ' + verificationCode,
    );
  }

  async sendEmailVerificationCode(id: string) {
    const user = await this.usersService.findOneOrFail(id);
    if (!user || !user.email || user.isEmailVerified)
      throw new BadRequestException('Invalid User!');

    const verificationCode: number = Math.floor(
      100000 + Math.random() * 900000,
    );
    const verificationCodeExpires: Date = new Date();
    const expirationTime = 2 * 24 * 60 * 60 * 1000;
    verificationCodeExpires.setTime(
      verificationCodeExpires.getTime() + expirationTime,
    );

    user.emailVerificationCode = verificationCode.toString();
    user.emailVerificationCodeExpiry = verificationCodeExpires;

    await this.usersRepository.save(user).catch((err) => {
      throw new BadRequestException('Error updating user', err);
    });

    this.mailService.send({
      from: process.env.MAIL_FROM_USER,
      to: user.email,
      subject: 'Clean Clinic Verification Code',
      text: `Your email verification code is: ${verificationCode.toString()}`,
      html: `<h3>Dear ${user.firstName},</h3>
            <p>Your email verification code is: ${verificationCode.toString()}</p>
            <p>Thank you for using Clean Clinic!</p>`,
    });
  }

  async verifyMobileNumber(id: string, code: string): Promise<boolean> {
    if (!code) return false;

    const user = await this.usersService.findOneOrFail(id);

    if (user.isMobileVerified)
      throw new BadRequestException('Mobile already verified');

    if (user.mobileVerificationCode != code) {
      throw new BadRequestException('Invalid code');
    }

    const todayDate = new Date();
    if (todayDate > user.mobileVerificationCodeExpiry) {
      throw new BadRequestException('Verification code expired');
    }

    user.isMobileVerified = true;
    user.mobileVerificationDate = new Date();
    await this.usersRepository.save(user).catch((err) => {
      throw new BadRequestException(err);
    });

    return true;
  }

  async verifyEmail(id: string, code: string): Promise<boolean> {
    if (!code) return false;

    const user = await this.usersService.findOneOrFail(id);

    if (user.isEmailVerified)
      throw new BadRequestException('Email already verified');

    if (user.emailVerificationCode != code) {
      throw new BadRequestException('Invalid email');
    }

    const todayDate = new Date();
    if (todayDate > user.emailVerificationCodeExpiry) {
      throw new BadRequestException('Verification email expired');
    }

    user.isEmailVerified = true;
    user.emailVerificationDate = new Date();
    await this.usersRepository.save(user).catch((err) => {
      throw new BadRequestException(err);
    });

    return true;
  }

  async registerUser(data: RegisterUserDTO) {
    const exists =
      (await this.usersService.findByEmail(data.email)) ||
      (await this.usersService.findByUsername(data.username)) ||
      (await this.usersService.findByPhoneNumber(
        removeSpecialCharacters(data.phoneNumber),
      ));
    if (exists) throw new BadRequestException('User already exists!');

    if (data.addresses && data.addresses.length < 1)
      throw new BadRequestException('At least 1 address should be provided!');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();
    try {
      const referralCode = data.referralCode;
      delete data.referralCode;

      // in case a referral code was provided, find the referral code owner then add 10 000 points to his balance & 10 000 to his wallet
      if (referralCode) {
        const referralUser = await this.findUserByReferralCode(referralCode, [
          'wallet',
        ]);
        if (!referralUser)
          throw new BadRequestException('Referral Code is not valid!');
        const newUserPoints = referralUser.points + 10000;
        await queryRunner.manager.update(User, referralUser.id, {
          points: newUserPoints,
        });

        const newWalletBalance = referralUser.wallet.balance + 10000;
        await queryRunner.manager.update(Wallet, referralUser.wallet.id, {
          balance: newWalletBalance,
        });
      }

      let addresses: any[] = data.addresses;
      delete data.addresses;
      let user = this.usersRepository.create({
        // email: data.email,
        // firstName: data.firstName,
        // lastName: data.lastName,
        // phoneNumber: data.phoneNumber,
        // password: data.password,
        // username: data.username,
        // addresses: data.addresses,
        ...data,
        wallet: {
          balance: 0,
          currency: Currency.LBP,
        },
      });

      user = await queryRunner.manager.save(user);

      // validate addresses:
      const branches = await queryRunner.manager.find(Branch, {
        relations: ['address'],
      });

      for (let address of addresses) {
        const userLat = address.lat;
        const userLon = address.lon;

        let nearestBranch: Branch;
        let nearestDistance: number = Number.MAX_VALUE;
        for (const branch of branches) {
          const branchLat = branch.address.lat;
          const branchLon = branch.address.lon;

          const distance = calculateDistance(
            { lat: userLat, lon: userLon },
            { lat: branchLat, lon: branchLon },
          );

          if (distance < nearestDistance) {
            nearestBranch = branch;
            nearestDistance = distance;
          }
        }

        if (
          nearestDistance == Number.MAX_VALUE ||
          !nearestBranch ||
          nearestBranch.coverageArea < nearestDistance
        ) {
          queryRunner.rollbackTransaction();
          throw new BadRequestException(
            'No close branch was found near your address!',
          );
        }

        address.userId = user.id;
      }

      await queryRunner.manager.save(Address, addresses);

      // data.addresses.forEach(async address => {
      //   address.userId = user.id;
      //   address.branchId = null;
      //   await queryRunner.manager.save(Address, address)
      // })

      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
      // throw new BadRequestException('Error registering user!');
    } finally {
      await queryRunner.release();
    }
  }
  async findUserByReferralCode(referralCode: string, relations?: string[]) {
    return await this.usersRepository.findOne({
      where: { referralCode },
      relations,
    });
  }

  async loginUsers(
    data: LoginDTO,
  ): Promise<{ access_token: string; user: User }> {
    if (!data.email && !data.username && !data.phoneNumber)
      throw new BadRequestException('Error empty credentials!');

    let user: User = null;

    if (data.email) {
      user = await this.usersService.findByEmail(data.email);
    }
    if (!user && data.username) {
      user = await this.usersService.findByUsername(data.username);
    }
    if (!user && data.phoneNumber) {
      user = await this.usersService.findByPhoneNumber(data.phoneNumber);
    }

    if (!user) throw new BadRequestException('Error user not found!');

    const match = await argon.verify(user.password, data.password);
    if (!match) throw new BadRequestException('Password incorrect!');

    // const access_token = jwt.sign(
    //   { user, type: JWTDataTypeEnum.USER },
    //   JWT_SECRET,
    //   {
    //     expiresIn: JWT_USERS_EXPIRY_TIME,
    //   },
    // );

    const token = uuid();

    await this.deviceTokensService.createUserDeviceToken({
      fcmToken: data.fcmToken,
      token: token,
      status: DeviceTokenStatus.ACTIVE,
      ...data.deviceInfo,
      userId: user.id,
    });

    return {
      access_token: token,
      user,
    };
  }

  async loginStaffs(
    data: LoginDTO,
  ): Promise<{ access_token: string; employee: Employee }> {
    if (!data.email && !data.username && !data.phoneNumber)
      throw new BadRequestException('Error empty credentials!');

    let employee: Employee = null;

    employee = data.email
      ? await this.employeesService.findByEmailOrFail(data.email)
      : data.username
      ? await this.employeesService.findByUsernameOrFail(data.username)
      : await this.employeesService.findByPhoneNumberOrFail(data.phoneNumber);

    if (!employee) throw new BadRequestException('Error employee not found!');

    const match = await argon.verify(employee.password, data.password);
    if (!match) throw new BadRequestException('Password incorrect!');

    // const access_token = jwt.sign(
    //   { employee, type: JWTDataTypeEnum.EMPLOYEE },
    //   JWT_SECRET,
    //   {
    //     expiresIn: JWT_USERS_EXPIRY_TIME,
    //   },
    // );

    const token = uuid();

    await this.deviceTokensService.createEmployeeDeviceToken({
      fcmToken: data.fcmToken,
      token: token,
      employeeId: employee.id,
      status: DeviceTokenStatus.ACTIVE,
      ...data.deviceInfo,
    });

    return {
      access_token: token,
      employee,
    };
  }

  async updateUserPassword(id: string, body: UpdatePasswordDTO) {
    const user: User = await this.usersService.findById(id);

    const match = await argon.verify(user.password, body.oldPassword);

    if (!match) throw new BadRequestException('Old password incorrect!');

    if (body.newPassword !== body.confirmPassword)
      throw new BadRequestException(
        'New password and confirm password do not match!',
      );
    user.password = await argon.hash(body.newPassword);
    return await this.usersRepository.save(user).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error updating password');
    });
  }

  async updateEmployeePassword(id: string, body: UpdatePasswordDTO) {
    const employee: Employee = await this.employeesService.findById(id);

    const match = await argon.verify(employee.password, body.oldPassword);

    if (!match) throw new BadRequestException('Old password incorrect!');

    if (body.newPassword !== body.confirmPassword)
      throw new BadRequestException(
        'New password and confirm password do not match!',
      );
    employee.password = await argon.hash(body.newPassword);
    return await this.employeesRepository.save(employee).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error updating password');
    });
  }

  async logout(body: LogoutDTO) {
    const deviceToken = await this.deviceTokensRepository
      .findOneOrFail({
        where: {
          token: body.token,
        },
      })
      .catch(() => {
        throw new BadRequestException('Session not found!');
      });

    return await this.deviceTokensService.remove(deviceToken.id);
  }

  async terminateWhatsapp() {
    // return await terminateWhatsappConfiguration();
  }

  async sendTestEmail() {
    try {
      return this.mailService.send({
        from: process.env.MAIL_FROM_USER,
        to: 'alikashmar888888888@gmail.com',
        subject: 'Test Email From Washer Backend',
        text: 'This is a test email from the Washer Backend!',
        html: 'This is a test email from the Washer Backend!',
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Error sending test email');
    }
  }

  async forgetPasswordByEmail(email: string): Promise<{ success: boolean }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Error user not found!');
    if (user.isSocialMediaLogin)
      throw new BadRequestException('Invalid action for social media account');

    const passwordResetCode: number = Math.floor(
      100000 + Math.random() * 900000,
    );
    const passwordResetExpires: Date = new Date();
    const codeExpireIn = 120; //minutes
    passwordResetExpires.setTime(
      passwordResetExpires.getTime() + codeExpireIn * 60 * 1000, //120 minutes
    );

    user.passwordResetCode = passwordResetCode + '';
    user.passwordResetExpiry = passwordResetExpires;

    await this.usersRepository.save(user).catch((err) => {
      console.log("Error saving user's password reset code");
      throw new BadRequestException('Error generating code', err);
    });

    const mailData = {
      from: process.env.MAIL_FROM_USER,
      to: user.email,
      subject: 'Reset Password Code',
      text: `Please use this code ${passwordResetCode} to reset your password. Code will expire in ${codeExpireIn} minutes.`,
      html: `
          <h3>Hello ${user.firstName}!</h3>
          <p>Please use this code ${passwordResetCode} to reset your password. Code will expire in ${codeExpireIn} minutes.</p>
      `,
    };

    this.mailService.send(mailData);

    return { success: true };
  }

  async passwordReset(data: PasswordResetDTO) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException('Error user not found!');
    if (user.passwordResetCode != data.passwordResetCode)
      throw new BadRequestException('Invalid code');

    const todayDate = new Date();
    if (todayDate > user.passwordResetExpiry)
      throw new BadRequestException('Reset code expired');

    const hash = await argon.hash(data.newPassword);
    user.password = hash;

    return await this.usersRepository.save(user).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error updating password!', err);
    });
  }

  async loginOrRegisterByGoogleAccount(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    token: string,
  ): Promise<any> {
    let user: User;

    if (email) user = await this.usersService.findByEmail(email);
    else user = await this.usersService.findByGoogleId(id);

    if (user) return user;

    return await this.usersService.createBySocialMediaAccount(
      id,
      email,
      firstName,
      lastName,
      token,
    );
  }
}
