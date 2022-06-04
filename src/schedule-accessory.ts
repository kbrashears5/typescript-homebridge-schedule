/* eslint-disable no-undefined */
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

class ScheduleAccessory implements AccessoryPlugin {
  private readonly log: Logging;
  private readonly name: string;
  private readonly serial: string;
  private scheduleOn = false;

  private readonly switchService: Service;
  private readonly informationService: Service;

  private readonly objectOperations: ObjectOperations;

  constructor(log: Logging, config: AccessoryConfig) {
    this.objectOperations = new ObjectOperations();

    this.log = log;
    this.name = config.name;
    this.serial = (config.serial ?? '123456789').trim();

    // log config parameters
    log.debug(`Name: [${config.name}]`);
    log.debug(`Interval: [${config.interval}]`);
    log.debug(`Cron: [${config.cron}]`);
    log.debug(`Serial: [${config.serial}]`);

    // determine what was provided by config
    let intervalSupplied = true;
    if (config.interval === undefined) {
      intervalSupplied = false;
    }
    log.debug(`Interval param supplied: [${intervalSupplied}]`);

    const cronSupplied = !this.objectOperations.IsNullOrWhitespace(config.cron);
    log.debug(`Cron param supplied: [${cronSupplied}]`);

    // if neither params were supplied
    if (!intervalSupplied && !cronSupplied) {
      log.error('Must supply either interval or cron');
    }
    // if both supplied
    else if (intervalSupplied && cronSupplied) {
      log.error('Cannot have both interval and cron. Choose one or the other');
    }

    // create accessory
    log.info(`Creating schedule accessory [${config.name}]`);

    this.switchService = new hap.Service.Switch(this.name);

    this.switchService
      .getCharacteristic(hap.Characteristic.On)
      .on(
        CharacteristicEventTypes.GET,
        (callback: CharacteristicGetCallback) => {
          this.log.debug(`Schedule: [${this.scheduleOn ? 'ON' : 'OFF'}]`);

          callback(undefined, this.scheduleOn);
        },
      )
      .on(
        CharacteristicEventTypes.SET,
        (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
          this.scheduleOn = value as boolean;

          this.log.info(
            `Schedule was set to: [${this.scheduleOn ? 'ON' : 'OFF'}]`,
          );

          if (value) {
            setTimeout(() => {
              this.switchService.setCharacteristic('On', false);
            }, 1000);
          }

          callback();
        },
      );

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'Homebridge Schedule')
      .setCharacteristic(hap.Characteristic.SerialNumber, this.serial)
      .setCharacteristic(hap.Characteristic.Model, config.interval);

    log.info('Initialization complete');

    // interval
    if (intervalSupplied && !cronSupplied) {
      log.info(`Starting [${config.interval}] minute interval`);

      setInterval(() => {
        this.switchService.setCharacteristic('On', true);
      }, config.interval * 60000);
    }
    // cron
    else if (!intervalSupplied && cronSupplied) {
      log.info(`Starting [${config.cron}] cron job`);

      const job = new CronJob(config.cron, () => {
        this.switchService.setCharacteristic('On', true);
      });

      job.start();
    } else {
      log.error('Nothing started - check config');
    }
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [this.informationService, this.switchService];
  }
}

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
  hap = api.hap;
  api.registerAccessory('homebridge-schedule', 'Schedule', ScheduleAccessory);
};
