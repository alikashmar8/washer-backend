import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { Currency } from 'src/common/enums/currency.enum';
import { DeviceTokenStatus } from 'src/common/enums/device-token-status.enum';
import { removeSpecialCharacters } from 'src/common/utils/functions';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { EmployeesService } from 'src/employees/employees.service';
import { Employee } from 'src/employees/entities/employee.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Code, DataSource, Repository } from 'typeorm';
import { LoginDTO } from './dtos/login.dto';
import { LogoutDTO } from './dtos/logout.dto';
import { RegisterUserDTO } from './dtos/register.dto';
import { UpdatePasswordDTO } from './dtos/update-password-dto';
import { uuid } from 'uuidv4';
import {
  isWhatsappReady,
  getWhatsappQrCode,
  sendWhatsappMessage,
} from './whatsapp';

@Injectable()
export class AuthService {
  async sendWhatsappMessage() {
    return await sendWhatsappMessage('+96170089069', 'Hellooo');
  }

  async getWhatsappQrCode() {
    return getWhatsappQrCode();
  }

  async checkWhatsappStatus() {
    console.log('whatsapp');

    return await isWhatsappReady();
  }

  async generateWhatsappCode(id: string) {
    const mobileVerificationCode = '123456';
    await this.usersRepository.update(id, { mobileVerificationCode });
    return mobileVerificationCode;
  }

  async checkValidWhatsAppCode(id: string, code: string): Promise<boolean> {
    if (!code) return false;

    const user = await this.usersRepository.findOne({ where: { id } });
    if (user.mobileVerificationCode == code) {
      user.isMobileVerified = true;
      user.mobileVerificationDate = new Date();
      return true;
    }
    return false;
  }
  async sendCodeByWhatsapp(code: string, mobile: string) {
    if (!code) throw new BadRequestException("Code not valid!");
    if (!mobile) throw new BadRequestException("mobile not valid!");

    return await sendWhatsappMessage(mobile, code);
    
  }

  constructor(
    private usersService: UsersService,
    private employeesService: EmployeesService,
    private deviceTokensService: DeviceTokensService,
    private dataSource: DataSource,
    @InjectRepository(DeviceToken)
    private deviceTokensRepository: Repository<DeviceToken>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async registerUser(data: RegisterUserDTO) {
    const exists =
      (await this.usersService.findByEmail(data.email)) ||
      (await this.usersService.findByPhoneNumber(
        removeSpecialCharacters(data.phoneNumber),
      ));
    if (exists)
      throw new BadRequestException('Email or Phone Number is already in use!');

    if (data.addresses && data.addresses.length < 1)
      throw new BadRequestException('At least 1 address should be provided!');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();
    try {
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

      // data.addresses.forEach(async address => {
      //   address.userId = user.id;
      //   address.branchId = null;
      //   await queryRunner.manager.save(Address, address)
      // })

      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error registering user!');
    } finally {
      await queryRunner.release();
    }
  }

  async loginUsers(
    data: LoginDTO,
  ): Promise<{ access_token: string; user: User }> {
    if (!data.email && !data.username && !data.phoneNumber)
      throw new BadRequestException('Error empty credentials!');

    let user: User = null;

    user = data.email
      ? await this.usersService.findByEmail(data.email)
      : data.username
      ? await this.usersService.findByUsernameOrFail(data.username)
      : await this.usersService.findByPhoneNumber(data.phoneNumber);

    if (!user) throw new BadRequestException('Error user not found!');

    // const match = await argon.verify(user.password, data.password);
    // if (!match) throw new BadRequestException('Password incorrect!');

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

    // const match = await argon.verify(employee.password, data.password);
    // if (!match) throw new BadRequestException('Password incorrect!');

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
}
