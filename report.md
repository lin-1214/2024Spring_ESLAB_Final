# Report

This is the report of the eslab final project.

Group: 3\
Members: B10901027楊竣凱、B10901059林咏毅、B10502139許禎勻

## Motivaiton

- Design a PC game with peripheral game pad.
Videos on YT looks cool
- Try using STM32 to realize the function of a game pad
- We love playing games!

## Method

- STM32 IoT node

  - BLE connection
    - Sensor Service
    - Notify Characteristic - Read BSP Sensor value.
    - Writable Characteristic - Accept the signal from web and make reaction.
  - DMA programming - Low Pass Filter
  - PWM wave - Send different signals to the vibration motor.
- Web

## Result



## Reference

- [DIY Bluetooth GamePad for Android, PlayStation and PC.](https://www.youtube.com/watch?v=zOuCZpH0Dqg)