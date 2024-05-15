#ifndef __BLE_SENSOR_SERVICE_H__
#define __BLE_SENSOR_SERVICE_H__

#include "ble/BLE.h"

#define CUSTOM_GYRO_CHAR_UUID      "43080fde-e247-4bd5-b7b2-6c80ec3e526e"
#define CUSTOM_SENSOR_SERVICE_UUID "e31368d2-3247-4b01-8ece-3a2bf602808f"

class SensorService {
public:
    typedef struct {
        float x;
        float y;
        float z;
    } GyroType_t; 

    SensorService(BLE& _ble) :
        ble(_ble),
        GyroCharacteristic(CUSTOM_GYRO_CHAR_UUID, (uint8_t *)&pGyroDataXYZ, sizeof(GyroType_t), sizeof(GyroType_t),
                           GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_READ | GattCharacteristic::BLE_GATT_CHAR_PROPERTIES_NOTIFY)
    {
        static bool serviceAdded = false; /* We should only ever need to add the information service once. */
        if (serviceAdded) {
            return;
        }

        GattCharacteristic *charTable[] = {&GyroCharacteristic };

        GattService sensorService(CUSTOM_SENSOR_SERVICE_UUID, charTable, sizeof(charTable) / sizeof(GattCharacteristic *));

        ble.gattServer().addService(sensorService);
        serviceAdded = true;
    }

    void updateGyroDataXYZ(GyroType_t newpGyroDataXYZ)
    {
        pGyroDataXYZ.x = newpGyroDataXYZ.x;
        pGyroDataXYZ.y = newpGyroDataXYZ.y;
        pGyroDataXYZ.z = newpGyroDataXYZ.z;
        ble.gattServer().write(GyroCharacteristic.getValueHandle(), (uint8_t *)&pGyroDataXYZ, sizeof(GyroType_t));
    }

private:
    BLE& ble;

    GyroType_t pGyroDataXYZ;

    GattCharacteristic GyroCharacteristic;
};

#endif