import { Injectable, Body } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Config } from 'src/models';
import { CheckAppVersionDTO } from './config.entity';
import { Constants } from 'src/utils';

@Injectable()
export class ConfigService {

	constructor(
		@InjectModel(Config) private configModel: typeof Config
	) {}

	async checkAppVersion(body: CheckAppVersionDTO) {
		try {
      const config = await this.configModel.findOne({ order: [['id','DESC']] });
			let mustUpdate = false;

			if (body.platform === Constants.PLATFORM.ANDROID) {
				mustUpdate = this.isNewerVersion(body.version, config.app_android_version);
			}

			if (body.platform === Constants.PLATFORM.IOS) {
				mustUpdate = this.isNewerVersion(body.version, config.app_ios_version);
			}

			return { mustUpdate };

		} catch (error) {
			throw error;
		}
	}

	private isNewerVersion (userVer: string, lastVer: string) {
		const oldParts = userVer.split('.');
		const newParts = lastVer.split('.');
		for (var i = 0; i < newParts.length; i++) {
			const a = ~~newParts[i]; // parse int
			const b = ~~oldParts[i]; // parse int
			if (a > b) return true;
			if (a < b) return false;
		}
		return false;
	}
}
