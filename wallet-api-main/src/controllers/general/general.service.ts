import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FundsSource, PaymentMethod } from 'src/models';

@Injectable()
export class GeneralService {

	constructor(
		@InjectModel(FundsSource) private fundsSourceModel: typeof FundsSource,
		@InjectModel(PaymentMethod) private paymentMethodModel: typeof PaymentMethod,
	) {}

	phoneCodes() {
		return [
			{ value: '0212', label: '0212' },
			{ value: '0412', label: '0412' },
			{ value: '0414', label: '0414' },
			{ value: '0416', label: '0416' },
			{ value: '0424', label: '0424' },
			{ value: '0426', label: '0426' },
		];
	}

	async fundsSources() {
		try {
      return await this.fundsSourceModel.findAll({
				attributes: ['id','name'],
				order: [['name','ASC']],
			});

		} catch (error) {
			throw error;
		}
	}

	async paymentMethods() {
		const STATUS = {
			INACTIVE: 0,
			ACTIVE: 1,
		};

		try {
      return await this.paymentMethodModel.findAll({
				attributes: ['id','name','order'],
				where: { status: STATUS.ACTIVE },
				order: [['order','ASC']],
			});

		} catch (error) {
			throw error;
		}
	}
}
