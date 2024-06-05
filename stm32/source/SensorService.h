#ifndef __BLE_SENSOR_SERVICE_H__
#define __BLE_SENSOR_SERVICE_H__

#include <cmath>
#include <cstdint>
#include <cstdio>

#include "arm_math.h"
#include "ble/BLE.h"
#include "ble/GattServer.h"
#include "mbed.h"
#include <chrono>

#define CUSTOM_GYRO_CHAR_UUID "43080fde-e247-4bd5-b7b2-6c80ec3e526e"
#define CUSTOM_SENSOR_SERVICE_UUID "e31368d2-3247-4b01-8ece-3a2bf602808f"
#ifndef PI
    #define PI 3.14159265358979
#endif
#define COMMAND_MIN 20
class SensorService : public ble::GattServer::EventHandler {
   public:
    const static uint16_t WRITABLE_CHARACTERISTIC_UUID = 0xA001;

    typedef struct {
        float32_t x;
        float32_t y;
        float32_t z;
        float32_t mx;
        float32_t my;
        float32_t mz;
    } GyroType_t;

    SensorService(BLE &_ble)
        : ble(_ble),
          pwm(PA_15),
          GyroCharacteristic(CUSTOM_GYRO_CHAR_UUID, (uint8_t *)&pGyroDataXYZ, sizeof(GyroType_t),
                             sizeof(GyroType_t),
                             GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_READ |
                                 GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_NOTIFY) {
        static bool serviceAdded =
            false; /* We should only ever need to add the information service once. */
        if (serviceAdded) {
            return;
        }

        const UUID uuid = WRITABLE_CHARACTERISTIC_UUID;
        _writable_characteristic =
            new ReadWriteGattCharacteristic<uint8_t>(uuid, &_characteristic_value);

        if (!_writable_characteristic) {
            printf("Allocation of ReadWriteGattCharacteristic failed\r\n");
        }

        GattCharacteristic *charTable[] = {&GyroCharacteristic, _writable_characteristic};

        GattService sensorService(CUSTOM_SENSOR_SERVICE_UUID, charTable,
                                  sizeof(charTable) / sizeof(GattCharacteristic *));

        ble.gattServer().addService(sensorService);
        ble.gattServer().setEventHandler(this);  // 设置事件处理程序
        serviceAdded = true;
    }

    void updateGyroDataXYZ(GyroType_t newpGyroDataXYZ) {
        short vel = convertToVelocity(newpGyroDataXYZ);
        // GyroType_t vel = convertToVelocity(newpGyroDataXYZ);
        printf("[vel]: %d\n", vel);
        ble.gattServer().write(GyroCharacteristic.getValueHandle(), (uint8_t *)&vel,
                               sizeof(short));
    }
    void write(int16_t command) {
        if (command < COMMAND_MIN) {
            command += COMMAND_MIN;
        }
        printf("[command]: %d\n", command);
        ble.gattServer().write(GyroCharacteristic.getValueHandle(), (uint8_t *)&command,
                               sizeof(int16_t));
    }

    inline void vibrate(std::chrono::milliseconds duration, int repetitions, std::chrono::milliseconds interval = 500ms) {
        for (int i = 0; i < repetitions; ++i) {
            pwm.write(0.5); // 50%的占空比，調整來改變震動強度
            ThisThread::sleep_for(duration); // 震動持續時間
            pwm.write(0.0); // 停止震動
            if (i < repetitions - 1) {
                ThisThread::sleep_for(interval); // 間隔時間，最後一次不需要間隔
            }
        }
    }   

    virtual void onDataWritten(const GattWriteCallbackParams &params) override {
        if ((params.handle == _writable_characteristic->getValueHandle()) && (params.len == 1)) {
            printf("New characteristic value written: %x\r\n", *(params.data));
            uint8_t value = *(params.data);
            switch (value) {
                case 1:
                    // 震動1秒1次
                    vibrate(1s, 1);
                    break;
                case 2:
                    // 震動0.5秒2次
                    vibrate(500ms, 2);
                    break;
                case 3:
                    // 震動2秒1次
                    vibrate(2s, 1);
                    break;
                case 4:
                    // 震動0.5秒4次
                    vibrate(500ms, 4);
                    break;
                default:
                    // not work
                    pwm.write(0.0); //stop working 
                    break;
            }
        }
    }
    int16_t convertToVelocity(GyroType_t GyroDataXYZ) {
        float32_t roll = atan2(GyroDataXYZ.y, GyroDataXYZ.z);
        float32_t pitch = atan2(-GyroDataXYZ.x, sqrt( GyroDataXYZ.y* GyroDataXYZ.y + GyroDataXYZ.z* GyroDataXYZ.z));

        float32_t sinRoll = sin(roll);
        float32_t cosRoll = cos(roll);
        float32_t sinPitch = sin(pitch);
        float32_t cosPitch = cos(pitch);

        float32_t mx = GyroDataXYZ.mx;
        float32_t my = GyroDataXYZ.my;
        float32_t mz = GyroDataXYZ.mz;
        // Transform magnetometer readings
        float32_t mx2 = mx * cosPitch + mz * sinPitch;
        float32_t my2 = mx * sinRoll * sinPitch + my * cosRoll - mz * sinRoll * cosPitch;

        // Calculate yaw (heading)
        float32_t yaw = atan2(-my2, mx2);
        // float32_t yaw = atan2(GyroDataXYZ.x, GyroDataXYZ.y);

        // printf("Roll: %f, Pitch: %f, Yaw: %f, RP norm %f\n", roll * 180 / PI, pitch * 180 / PI, yaw * 180 / PI, sqrt(roll*roll + pitch*pitch)* 180 / PI);
        // GyroType_t angle;
        // angle.x = roll;
        // angle.y = pitch;
        // angle.z = yaw;
        return int16_t(roll* 180 / PI)/10;
    }

   private:
    BLE &ble;

    GyroType_t pGyroDataXYZ;
    uint8_t command;

    PwmOut pwm;

    GattCharacteristic GyroCharacteristic;

    ReadWriteGattCharacteristic<uint8_t> *_writable_characteristic = nullptr;
    uint8_t _characteristic_value = 0;
};

#endif
