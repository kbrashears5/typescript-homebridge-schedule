# Homebridge-Schedule
This [Homebridge](https://github.com/nfarina/homebridge) plugin allows you to create Homekit automations for more than just the default "A time of day occurrs"

The original thought for this was to create an hourly automation to check my thermostat in the house and send me a notification if it was above or below a certain threshold

Homebridge-Schedule is similar to [Homebridge-Dummy](https://github.com/nfarina/homebridge-dummy), in the sense that it creates some dummy switches in Homekit that turn on at your desired interval. They will turn off one second later. This is useful for triggering automations, or even shortcuts.

## Installation
```
sudo npm i homebridge-schedule@latest -g
```

## Usage
### Interval Based
Add accessories to your `config.json` similar to below for interval based schedules:
```json
{
  "accessories": [
    {
      "accessory": "Schedule",
      "name": "Hourly",
      "interval": 60
    }
  ]
}
```
| Property | Description |
| --- | --- |
| Accessory | Must be "Schedule" |
| Name | Unique name for the dummy switch |
| Interval | Interval, in minutes |

Upon startup of Homebridge, the device will turn on at the specified interval

#### Notes
The interval starts when Homebridge is started up. If you want something to run hourly on the hour, then you need to make sure Homebridge is started up on the hour

### Cron Based
Add accessories to your `config.json` similar to below for cron based schedules:
```json
{
  "accessories": [
    {
      "accessory": "Schedule",
      "name": "Hourly",
      "cron": "* * * * * *"
    }
  ]
}
```
| Property | Description |
| --- | --- |
| Accessory | Must be "Schedule" |
| Name | Unique name for the dummy switch |
| Cron | Cron string |

## Use Cases
I have created a "room" called Automation in my Homekit, which then allows me to create an automation "When the Automation Hourly turns on" to check my thrermostat temperature, check the current outside temperature at my house, and based on some conditions, set the thermostat.

Steps:
1. Create new automation based on "An Accessory is Controlled"
2. Find your newly created dummy switch
3. Select Turns On and add any desired time or people conditions
4. You can then choose a scene or another accessory to control, or at the very bottom, you can create a shortcut
5. Done! You now have one automation for things you want to happen hourly rather than 24

## Creating HomeKit Automations
Create new Accessory automation:
![Step1](images\step1.jpg)

Choose the accessory created by homebridge-schedule:
![Step2](images\step2.jpg)

Select when it turns on or turns off and any time or people configurations
![Step3](images\step3.jpg)

Scroll all the way to the bottom and choose `Convert to Shortcut`
![Step4](images\step4.jpg)

Create shortcut:
1. Get the current temperature of a Homekit thermostat
2. Convert to Fahrenheit
3. If the indoor temperature is greater than a threshold
   - Get current weather outside
   - Convert to Fahrenheit
   - If the current weather outside is also above a threshold
      - Turn on fans, set thermostat, etc.

![Step5](images\step5_1.jpg)
![Step5](images\step5_2.jpg)