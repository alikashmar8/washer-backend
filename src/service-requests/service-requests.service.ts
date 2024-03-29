import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressesService } from 'src/addresses/addresses.service';
import { Address } from 'src/addresses/entities/address.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { EXCHANGE_RATE } from 'src/common/constants';
import { EmployeeRole } from 'src/common/enums/employee-role.enum';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { PaymentType } from 'src/common/enums/payment-type.enum';
import { RequestStatus } from 'src/common/enums/request-status.enum';
import { calculateDistance } from 'src/common/utils/functions';
import { Employee } from 'src/employees/entities/employee.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PromosService } from 'src/promos/promos.service';
import { ServiceTypesService } from 'src/service-types/service-types.service';
import { Setting } from 'src/settings/entities/setting.entity';
import { SettingsService } from 'src/settings/settings.service';
import { User } from 'src/users/entities/user.entity';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Wallet } from './../wallets/entities/wallet.entity';
import {
  CreateServiceRequestDto,
  CreateServiceRequestItemDTO,
} from './dto/create-service-request.dto';
import { UpdateServiceRequestPaymentStatusDto } from './dto/update-service-request-payment-status.dto';
import { UpdateServiceRequestStatusDto } from './dto/update-service-request-status.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequest } from './entities/service-request.entity';
import { ServiceRequestItem } from './entities/service-request-item.entity';

@Injectable()
export class ServiceRequestsService {
  constructor(
    private addressesService: AddressesService,
    private vehiclesService: VehiclesService,
    private serviceTypesService: ServiceTypesService,
    private settingsService: SettingsService,
    @InjectRepository(ServiceRequest)
    private requestsRepository: Repository<ServiceRequest>,
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,
    private promoService: PromosService,
    private dataSource: DataSource,
    private notificationsService: NotificationsService,
  ) {}

  async create(data: CreateServiceRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const branches = await this.branchesRepository.find({
        relations: ['address'],
        where: {
          isActive: true,
        },
      });
      let branch: any = {};
      const initialDistance = 99999999;
      branch.distance = initialDistance;

      const requestAddress = await queryRunner.manager.findOneOrFail(Address, {
        where: { id: data.addressId },
      });

      branches.forEach((b) => {
        const dist = calculateDistance(
          {
            lat: requestAddress.lat,
            lon: requestAddress.lon,
          },
          {
            lat: b.address.lat,
            lon: b.address.lon,
          },
        );

        if (dist < branch.distance) {
          branch = b;
          branch.distance = dist;
        }
      });

      if (branch.distance == initialDistance)
        throw new BadRequestException('No branch was found close to you!');

      const user = await queryRunner.manager
        .findOneOrFail(User, {
          where: {
            id: data.userId,
          },
          relations: ['wallet'],
        })
        .catch((err) => {
          console.error(err);
          throw new BadRequestException('User not found!', err);
        });
      data.branchId = branch.id;

      //to modify
      const costObj = await this.calculateRequestTotalCost({
        serviceRequestItems: data.serviceRequestItems,
        tips: data.tips,
        userId: data.userId,
        promoCode: data.promoCode,
      });

      data.cost = costObj.total;
      let request = queryRunner.manager.create(ServiceRequest, data);
      request = await queryRunner.manager.save(request);

      if (data.paymentType == PaymentType.WALLET) {
        const walletBalance = user.wallet.balance;
        if (walletBalance < costObj.totalLBP)
          throw new BadRequestException(
            "You don't have enough balance to perform this reservation",
          );

        const newBalance = walletBalance - costObj.totalLBP;

        // deduct amount from wallet balance
        await queryRunner.manager
          .update(Wallet, user.wallet.id, {
            balance: newBalance,
          })
          .catch((err) => {
            console.error(err);
            throw new BadRequestException(
              'Error deducting amount from your wallet!',
              err,
            );
          });

        //make request as paid
        request.isPaid = true;
        queryRunner.manager.save(ServiceRequest, request).catch((err) => {
          console.error(err);
          throw new BadRequestException('Error saving your request!', err);
        });
      }

      let promoIsValid = false;

      promoIsValid = await this.promoService.checkValidity(
        data.userId,
        data.promoCode,
      );

      if (promoIsValid == true)
        await this.promoService.consumePromo(
          queryRunner,
          data.userId,
          data.promoCode,
        );

      await queryRunner.commitTransaction();

      return request;
    } catch (err) {
      console.log('Error creating request:');
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    filters: {
      search?: string;
      userId?: string;
      employeeId?: string;
      branchId?: string;
      fromDate?: string;
      confirmedDate?: string;
      toDate?: string;
      status?: RequestStatus;
      isPaid?: boolean;
      take?: number;
      skip?: number;
    },
    currentEmployee: Employee,
    currentUser: User,
  ) {
    const take = filters.take || 10;
    const skip = filters.skip || 0;

    let isFirstWhere = true;

    let query: any = this.requestsRepository
      .createQueryBuilder('req')
      .withDeleted()
      .leftJoinAndSelect('req.user', 'user')
      .leftJoinAndSelect('req.serviceRequestItems', 'item')
      .leftJoinAndSelect('item.type', 'type')
      .leftJoinAndSelect('item.vehicle', 'vehicle')
      .leftJoinAndSelect('req.employee', 'employee')
      .leftJoinAndSelect('req.address', 'address')
      .leftJoinAndSelect('type.category', 'category')
      .where('req.id IS NOT NULL');
    isFirstWhere = false;
    if (filters.userId || currentUser) {
      let uid = filters.userId;
      if (currentUser) uid = currentUser.id;
      query = query.andWhere('req.userId = :uId', { uId: uid });
    }

    if (filters.branchId) {
      if (isFirstWhere)
        query = query.where('req.branchId = :bId', { bId: filters.branchId });
      else
        query = query.andWhere('req.branchId = :bId', {
          bId: filters.branchId,
        });
      isFirstWhere = false;
    }

    if (filters.status) {
      const statuses = filters.status.split(',');
      query = query.andWhere('req.status IN  (:...status)', {
        status: statuses,
      });
    }

    if (filters.isPaid != null) {
      if (typeof filters.isPaid == 'string') {
        if (filters.isPaid == 'true') {
          filters.isPaid = true;
        } else if (filters.isPaid == 'false') {
          filters.isPaid = false;
        }
      }

      if (isFirstWhere)
        query = query.where('req.isPaid = :isPaid', {
          isPaid: filters.isPaid,
        });
      else
        query = query.andWhere('req.isPaid = :isPaid', {
          isPaid: filters.isPaid,
        });
      isFirstWhere = false;
    }

    if (filters.confirmedDate) {
      const startDate = new Date(filters.confirmedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(filters.confirmedDate);
      endDate.setHours(23, 59, 59, 999);

      query = query
        .andWhere('req.confirmedDate >= :startDate', {
          startDate: startDate,
        })
        .andWhere('req.confirmedDate <= :endDate', {
          endDate: endDate,
        });
    }

    if (filters.fromDate) {
      const startDate = new Date(filters.fromDate);
      startDate.setHours(0, 0, 0, 0);

      const innerQuery = new Brackets((qb) => {
        qb.where('req.requestedDate >= :fromDate', {
          fromDate: startDate,
        })
          .orWhere('req.confirmedDate >= :fromDate', {
            fromDate: startDate,
          })
          .orWhere('req.createdAt >= :fromDate', {
            fromDate: startDate,
          });
      });
      if (isFirstWhere) query = query.where(innerQuery);
      else query = query.andWhere(innerQuery);
      isFirstWhere = false;
    }

    if (filters.toDate) {
      const endDate = new Date(filters.toDate);
      endDate.setHours(23, 59, 59, 999);
      const innerQuery = new Brackets((qb) => {
        qb.where('req.requestedDate <= :toDate', {
          toDate: endDate,
        })
          .orWhere('req.confirmedDate <= :toDate', {
            toDate: endDate,
          })
          .orWhere('req.createdAt <= :toDate', {
            toDate: endDate,
          });
      });
      if (isFirstWhere) query = query.where(innerQuery);
      else query = query.andWhere(innerQuery);
      isFirstWhere = false;
    }

    // TODO: check if this logic is needed
    // if (currentEmployee && currentEmployee.role == EmployeeRole.DRIVER) {
    //   // if employee is driver => he will be able to see his requests or non assigned ones
    //   // TODO: query to be tested
    //   const innerQuery = new Brackets((qb) => {
    //     qb.where('req.employeeId = :eid', {
    //       eid: currentEmployee.id,
    //     }).orWhere('req.employeeId is null');
    //     // .orWhere('req.employeeId = :eid', {
    //     //   eid: null,
    //     // });
    //   });
    //   if (isFirstWhere) {
    //     isFirstWhere = false;
    //     query = query.where(innerQuery);
    //   } else {
    //     query = query.andWhere(innerQuery);
    //   }
    // } else {
    // filter by employee normally
    if (filters.employeeId) {
      query = query.andWhere('req.employeeId = :eId', {
        eId: filters.employeeId,
      });
    } else if (currentEmployee && currentEmployee.role == EmployeeRole.DRIVER) {
      // if employee is driver, get unassigned requests by default
      query = query.andWhere('req.employeeId is null');
    }
    // }

    if (filters.search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('user.firstName like :name', { name: `%${filters.search}%` })
            .orWhere('user.lastName like :name', {
              name: `%${filters.search}%`,
            })
            .orWhere('employee.firstName like :name', {
              name: `%${filters.search}%`,
            })
            .orWhere('employee.lastName like :name', {
              name: `%${filters.search}%`,
            })
            .orWhere('req.id like :id', { id: `%${filters.search}%` });
        }),
      );
    }

    query = await query
      .orderBy('req.requestedDate', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    // TODO: to be uncommented later on
    // if (currentEmployee && currentEmployee.role == EmployeeRole.DRIVER) {
    //   query[0].forEach(function (element, index) {
    //     if (element.employeeId != currentEmployee.id){
    //       // => request is not for current driver
    //       let dist = calculateDistance(
    //         {
    //           lat: currentEmployee.lat,
    //           lon: currentEmployee.lon,
    //         },
    //         {
    //           lat: element.address.lat,
    //           lon: element.address.lon,
    //         },
    //       );

    //       if (dist <= 3000) {
    //         query[0].splice(index, 1);
    //       }
    //     }
    //   });
    // }

    const exchangeRateSetting: Setting = await this.settingsRepository
      .findOneOrFail({
        where: {
          key: EXCHANGE_RATE,
        },
      })
      .catch((err) => {
        throw new BadRequestException('Error calculating prices', err);
      });
    const exchangeRate = Number(exchangeRateSetting.value);

    query[0].forEach((req) => {
      req.totalLBP = Number(req.cost) * exchangeRate;
    });
    return {
      data: query[0],
      count: query[1],
    };
  }

  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.requestsRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        console.error(err);
        throw new BadRequestException('Service request not found!');
      });
  }

  async update(id: string, updateServiceRequestDto: UpdateServiceRequestDto) {
    return await this.requestsRepository
      .update(id, {
        confirmedDate: updateServiceRequestDto.confirmedDate,
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating request!');
      });
  }

  remove(id: number) {
    return `This action removes a #${id} serviceRequest`;
  }

  async updateStatus(id: string, data: UpdateServiceRequestStatusDto) {
    const serviceRequest = await this.findOneByIdOrFail(id, ['user']);
    let res;
    if (data.status == RequestStatus.APPROVED && !data.confirmedDate)
      throw new BadRequestException('Please specify the confirmed date!');

    if (
      data.status == RequestStatus.CANCELLED &&
      [
        RequestStatus.CANCELLED,
        RequestStatus.DONE,
        RequestStatus.REJECTED,
        RequestStatus.FIVE_MINUTES,
        RequestStatus.IN_PROGRESS,
        RequestStatus.IN_ROUTE,
      ].includes(serviceRequest.status)
    )
      throw new BadRequestException('You cannot cancel this service request!');

    this.dataSource.transaction(async (manager) => {
      const requestsRepository = manager.getRepository(ServiceRequest);
      try {
        res = await requestsRepository.update(id, {
          status: data.status,
          cancelReason:
            data.status == RequestStatus.CANCELLED
              ? data.cancelReason
              : serviceRequest.cancelReason,

          confirmedDate:
            data.status == RequestStatus.APPROVED
              ? data.confirmedDate
              : serviceRequest.confirmedDate,
        });

        switch (data.status) {
          case RequestStatus.CANCELLED:
            const isPaidByWallet =
              serviceRequest.paymentType == PaymentType.WALLET;
            if (isPaidByWallet) {
              const exchangeRateSetting: Setting = await this.settingsRepository
                .findOneOrFail({
                  where: {
                    key: EXCHANGE_RATE,
                  },
                })
                .catch((err) => {
                  throw new BadRequestException(
                    'Error cancelling service request',
                    err,
                  );
                });
              const exchangeRate = Number(exchangeRateSetting.value);
              const user = await manager.findOneOrFail(User, {
                where: {
                  id: serviceRequest.userId,
                },
                relations: ['wallet'],
              });
              const amountToRefundUSD =
                serviceRequest.cost + serviceRequest.tips;
              const amountToRefund = amountToRefundUSD * exchangeRate;
              const newBalance = user.wallet.balance + amountToRefund;
              await manager.update(Wallet, user.wallet.id, {
                balance: newBalance,
              });
            }
            // this.notificationsService.createAndNotify({
            //   title: 'Request update.',
            //   body: 'Your Request have been accepted!',
            //   userId: serviceRequest.userId,
            //   type: NotificationType.REQUEST_ACCEPTED,
            // });
            break;
          case RequestStatus.APPROVED:
            this.notificationsService.createAndNotify({
              title: 'Request update.',
              body: 'Your Request have been accepted!',
              userId: serviceRequest.userId,
              type: NotificationType.REQUEST_ACCEPTED,
            });
            break;
          case RequestStatus.IN_ROUTE:
            this.notificationsService.createAndNotify({
              title: 'Request update.',
              body: 'Driver is on his way and will start soon!',
              userId: serviceRequest.userId,
              type: NotificationType.REQUEST_DRIVER_IN_ROUTE,
            });
            break;
          case RequestStatus.IN_PROGRESS:
            this.notificationsService.createAndNotify({
              title: 'Request update.',
              body: 'Driver has started!',
              userId: serviceRequest.userId,
              type: NotificationType.REQUEST_IN_PROGRESS,
            });
            break;
            break;
          case RequestStatus.FIVE_MINUTES:
            this.notificationsService.createAndNotify({
              title: 'Request update.',
              body: 'Driver needs 5 minutes to arrive!',
              userId: serviceRequest.userId,
              type: NotificationType.REQUEST_IN_PROGRESS,
            });
            break;
          case RequestStatus.DONE:
            this.notificationsService.createAndNotify({
              title: 'Request update.',
              body: 'Your request is done! Thank you for your business.',
              userId: serviceRequest.userId,
              type: NotificationType.REQUEST_DONE,
            });
            break;
          default:
            break;
        }
      } catch (err) {
        console.error(err);
        throw new BadRequestException('Error updating status', err);
      }
      return res;
    });
  }

  async calculateRequestItemCost(
    serviceRequestItem: CreateServiceRequestItemDTO,
  ): Promise<{ cost: number }> {
    let cost = 0;

    const serviceType = await this.serviceTypesService.findOneByIdOrFail(
      serviceRequestItem.typeId,
    );
    let quantity = 0;
    quantity = serviceType.showQuantityInput ? serviceRequestItem.quantity : 1;
    cost += serviceType.price * quantity;

    if (serviceRequestItem.vehicleId) {
      const vehicle = await this.vehiclesService.findOneByIdOrFail(
        serviceRequestItem.vehicleId,
      );
      const key = vehicle.type + '_COST';
      const setting = await this.settingsService.findByKey(key);
      if (setting && setting.value != null) {
        cost += Number(setting.value);
      }
    }
    return { cost };
  }

  async calculateRequestTotalCost(data: {
    serviceRequestItems: CreateServiceRequestItemDTO[];
    promoCode?: string;
    tips: number;
    userId: string;
  }): Promise<{
    total: number;
    totalLBP: number;
    discountAmount: number;
    discountAmountLBP: number;
  }> {
    let total = 0;
    if (!data.tips) data.tips = 0;

    const exchangeRateSetting: Setting = await this.settingsRepository
      .findOneOrFail({
        where: {
          key: EXCHANGE_RATE,
        },
      })
      .catch((err) => {
        throw new BadRequestException('Error calculating prices', err);
      });
    const exchangeRate = Number(exchangeRateSetting.value);

    for (const serviceItem of data.serviceRequestItems) {
      total += (await this.calculateRequestItemCost(serviceItem)).cost;
    }

    let discountAmount = 0;
    let promoIsValid = false;
    const promo = await this.promoService.findOne(data.promoCode);
    promoIsValid = await this.promoService.checkValidity(
      data.userId,
      data.promoCode,
    );

    if (promoIsValid && promo.discountPercentage) {
      discountAmount = (total * promo.discountPercentage) / 100;
    } else {
      if (promoIsValid && promo.discountAmount)
        discountAmount = promo.discountAmount;
    }

    if (total < discountAmount) {
      discountAmount = total;
      total = 0;
    } else {
      total -= discountAmount;
    }

    const tipsUSD = data.tips / exchangeRate;
    total += tipsUSD;

    // todo: check for fees or other costs in case of payment by credit cards
    const totalLBP = total * exchangeRate;
    const discountAmountLBP = discountAmount * exchangeRate;
    return { total, totalLBP, discountAmount, discountAmountLBP };
  }

  async updatePaymentStatus(
    id: string,
    data: UpdateServiceRequestPaymentStatusDto,
  ) {
    return await this.requestsRepository.update(id, data).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error updating payment status');
    });
  }

  async assignEmployee(id: string, employeeId: string) {
    const serviceRequest = await this.findOneByIdOrFail(id);
    serviceRequest.employeeId = employeeId;
    const res = await this.requestsRepository
      .save(serviceRequest)
      .catch((err) => {
        throw new BadRequestException('Error assigning employee');
      });
    this.notificationsService.createAndNotify({
      title: 'New Request Assignment',
      body: `You have been assigned a new request id: ${id}`,
      type: NotificationType.REQUEST_ASSIGNED,
      employeeId: employeeId,
    });

    return res;
  }
}
