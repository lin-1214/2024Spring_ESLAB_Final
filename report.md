# Report

This is the report of the eslab final project.

Group: 3\
Members: B10901027楊竣凱、B10901059林咏毅、B10502139許禎勻

## Description

This project is a game developed using the STM32 IoT Node and web interactions. It aims to implement game functionalities through actual hardware controls and web interactions.

## Motivaiton

- Design a PC game with peripheral game pad.
Videos on YT looks cool
- Try using STM32 to realize the function of a game pad
- We love playing games!

## Technology

- ***STM32 IoT node***

  - **BLE connection**
    - Sensor Service
    - Notify Characteristic
    - Writable Characteristic - Accept the signal from web and make reaction, i.e. `collision response`.
  - **DMA programming** - Low Pass Filter
  - **PWM wave** - Send signals to the beeper.
  - **Data Acquisition** - read BSP sensor and send to buffer.
  - **Circular buffer**
  
- ***Web***
  - **file structure**
  ![image](/img/img08.png)
  - **BLE connection**
    - Apply the React BLE API to achieve the BLE connection between website and STM32.
    - Writable Characteristic - Accept signal from STM32 to make corresponding response, i.e. `moving`, and `startup` the game.
    - Send signal back to STM32 when collision happens to trigger the buzzer on STM32.
  - **React Programming**
    - Game page - Start page, Game page, and Gameover page
    - Game component - In `./web/src/component`. Define game object.
    - BLE function & Variable - In `./web/src/hooks`. Implement BLE API and declare variables used to control the game status.
    - Game animation - In `./web/src/style`.  Written in css to design the Game display and animation.
- ***Joystick***
  - **Usage** - For user to control the spaceship to dodge the meteorite by tilting the device.
  - **Function**
    - The more the device tilted, the faster can the player move.
    - When collision happens, the buzzer connected will notify the user.
  - **Design**
  ![image](./img/img07.jpg)

## Installation of STM32

Follow these steps to install the project:

1. Clone the project:

   ```bash
   git clone https://github.com/lin-1214/2024Spring_ESLAB_Final.git

2. Open the project with Mbed Studio.
3. Fix the required libraries:\
   ![screenshot](/img/img02.png)
4. Open `mbed-dsp/cmsis_dsp/TransformFunctions/arm_bitreversal2.S` and add `#define __CC_ARM` on line 43
   ![screenshot](/img/img01.png)
5. Set the target hardware to ***DISCO-L475VG-IOT01A or B-L475E-IOT01A****.
6. Build the project and run.

## Web

1. Clone the project:

   ```bash
   git clone https://github.com/lin-1214/2024Spring_ESLAB_Final.git

2. Go to the web directory

   ```
   cd ./web
3. Install the packages

   ```
   pnpm install
4. Run up the website

   ```
   pnpm vite
5. Connect STM32 by BLE and enjoy the game  

## BLE Connection

1. Set up the web browser and STM32 following the steps mentioned above.
2. Press the button to start finding BLE device
   ![image](/img/img04.png)

3. Once the STM32 connected, you can start the game!

## How to play
1. Press the blue button on STM32 to start the game
![image](/img/img05.png)

2. Gaming display
![image](/img/img06.png)

2. Try your best to dodge the meteorite and get a higher score!

3. Once your life become 0, the game is over, and you can press the blue button on STM32 to start over again.

## Result

- Build project
- BLE connection with web
- Control
- Animation
- Response

## Reference

- [DIY Bluetooth GamePad for Android, PlayStation and PC.](https://www.youtube.com/watch?v=zOuCZpH0Dqg)
