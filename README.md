# 2024Spring_ESLAB_Final

## Description

This project is a game developed using the STM32 IoT Node and web interactions. It aims to implement game functionalities through actual hardware controls and web interactions.

## Installation for stm32

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
## Connection

## How to play
