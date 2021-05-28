<h1 align="center">Homebridge-Schedule</h1>

<div align="center">
    
<b>Automate Homebridge based on interval or cron</b>
    
[![CI/CD](https://github.com/kbrashears5/homebridge-schedule/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/kbrashears5/homebridge-schedule/actions/workflows/ci-cd.yml)

[![npm](https://img.shields.io/npm/v/homebridge-schedule)](https://img.shields.io/npm/v/homebridge-schedule)
[![downloads](https://img.shields.io/npm/dt/homebridge-schedule)](https://img.shields.io/npm/dt/homebridge-schedule)

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

</div>

This [Homebridge](https://github.com/nfarina/homebridge) plugin allows you to create HomeKit automations for more than just the default "A time of day occurs"

The original thought for this was to create an hourly automation to check my thermostat in the house and send me a notification if it was above or below a certain threshold

Homebridge-Schedule is similar to [Homebridge-Dummy](https://github.com/nfarina/homebridge-dummy), in the sense that it creates some dummy switches in HomeKit that turn on at your desired interval. They will turn off one second later. This is useful for triggering automations, or even shortcuts.

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

| Property  | Description                      |
| --------- | -------------------------------- |
| Accessory | Must be "Schedule"               |
| Name      | Unique name for the dummy switch |
| Interval  | Interval, in minutes             |

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

| Property  | Description                      |
| --------- | -------------------------------- |
| Accessory | Must be "Schedule"               |
| Name      | Unique name for the dummy switch |
| Cron      | Cron string                      |

Cron string details: https://www.npmjs.com/package/cron

Cron string uses seconds, so for an hourly cron string use:

> "0 0 \* \* \* \*"

> "{seconds} {minutes} {hours} {days} {months} {weeks}"

## Use Cases

I have created a "room" called Automation in my HomeKit, which then allows me to create an automation "When the Automation Hourly turns on" to check my thermostat temperature, check the current outside temperature at my house, and based on some conditions, set the thermostat.

Steps:

1. Create new automation based on "An Accessory is Controlled"
2. Find your newly created dummy switch
3. Select Turns On and add any desired time or people conditions
4. You can then choose a scene or another accessory to control, or at the very bottom, you can create a shortcut
5. Done! You now have one automation for things you want to happen hourly rather than 24

## Creating HomeKit Automations

Create new Accessory automation:
![Step1](https://github.com/kbrashears5/homebridge-schedule/blob/master/images/step1.jpg?raw=true)

Choose the accessory created by homebridge-schedule:
![Step2](https://github.com/kbrashears5/homebridge-schedule/blob/master/images/step2.jpg?raw=true)

Select when it turns on or turns off and any time or people configurations
![Step3](https://github.com/kbrashears5/homebridge-schedule/blob/master/images/step3.jpg?raw=true)

Scroll all the way to the bottom and choose `Convert to Shortcut`
![Step4](https://github.com/kbrashears5/homebridge-schedule/blob/master/images/step4.jpg?raw=true)

Create shortcut:

1. Get the current temperature of a HomeKit thermostat
2. Convert to Fahrenheit
3. If the indoor temperature is greater than a threshold
   - Get current weather outside
   - Convert to Fahrenheit
   - If the current weather outside is also above a threshold
     - Turn on fans, set thermostat, etc.

![Step5](https://github.com/kbrashears5/homebridge-schedule/blob/master/images/step5_1.jpg?raw=true)
![Step5](https://github.com/kbrashears5/homebridge-schedule/blob/master/images/step5_2.jpg?raw=true)

## Development

Clone the latest and run

```npm
npm run prep
```

to install packages and prep the git hooks
