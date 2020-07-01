import {
	AccessoryConfig,
	AccessoryPlugin,
	API,
	CharacteristicEventTypes,
	CharacteristicGetCallback,
	CharacteristicSetCallback,
	CharacteristicValue,
	HAP,
	Logging,
	Service,
} from 'homebridge';
import { ObjectOperations } from 'typescript-helper-functions';
import { CronJob } from 'cron';

let hap: HAP;

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
	hap = api.hap;
	api.registerAccessory('Schedule', ScheduleAccessory);
};

class ScheduleAccessory implements AccessoryPlugin {
	private readonly log: Logging;
	private readonly name: string;
	private scheduleOn = false;

	private readonly switchService: Service;
	private readonly informationService: Service;

	private readonly objectOperations: ObjectOperations;

	constructor(log: Logging,
		config: AccessoryConfig) {

		this.objectOperations = new ObjectOperations();

		this.log = log;
		this.name = config.name;

		log.debug(`Name: [${config.name}]`)
		log.debug(`Interval: [${config.interval}]`)
		log.debug(`Cron: [${config.cron}]`)

		log.info(`Creating schedule accessory [${config.name}]`);

		this.switchService = new hap.Service.Switch(this.name);

		this.switchService.getCharacteristic(hap.Characteristic.On)
			.on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
				this.log.info(`Schedule: [${this.scheduleOn ? 'ON' : 'OFF'}]`);

				callback(undefined, this.scheduleOn);
			})
			.on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
				this.scheduleOn = value as boolean;

				this.log.info(`Schedule was set to: [${this.scheduleOn ? 'ON' : 'OFF'}]`);

				if (value) {
					setTimeout(() => {
						this.switchService.setCharacteristic('On', false);
					}, 1000);
				}

				callback();
			});

		this.informationService = new hap.Service.AccessoryInformation()
			.setCharacteristic(hap.Characteristic.Manufacturer, 'Homebridge Schedule')
			.setCharacteristic(hap.Characteristic.SerialNumber, '123456789')
			.setCharacteristic(hap.Characteristic.Model, config.interval);

		log.info('Initialization complete');

		// determine what was provided by config
		const interval = this.objectOperations.IsNullOrWhitespace(config.interval);
		const cron = this.objectOperations.IsNullOrWhitespace(config.cron);

		// interval
		if (interval && !cron) {
			log.info(`Sarting [${config.interval}] minute interval`);

			setInterval(() => {
				this.switchService.setCharacteristic('On', true);
			}, (config.interval * 60000));
		}
		// cron
		else if (!interval && cron) {
			log.info(`Sarting [${config.cron}] cron job`);

			const job = new CronJob(config.cron, () => {
				this.switchService.setCharacteristic('On', true);
			});

			job.start();
		}
		// error - neither supplied
		else if (!config && !cron) {
			log.error('Must supply either interval or cron')
		}
		// error - both supplied
		else if (config && cron) {
			log.error('Cannot have both interval and cron. Choose one or the other')

		}
	}

	/*
	 * This method is called directly after creation of this instance.
	 * It should return all services which should be added to the accessory.
	 */
	getServices(): Service[] {
		return [
			this.informationService,
			this.switchService,
		];
	}
}
