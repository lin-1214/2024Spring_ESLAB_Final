#ifndef __BLE_SENSOR_SERVICE_H__
#define __BLE_SENSOR_SERVICE_H__

#include "ble/BLE.h"
#include "ble/GattServer.h"

#define CUSTOM_GYRO_CHAR_UUID      "43080fde-e247-4bd5-b7b2-6c80ec3e526e"
#define CUSTOM_SENSOR_SERVICE_UUID "e31368d2-3247-4b01-8ece-3a2bf602808f"

class SensorService : public ble::GattServer::EventHandler {
public:
    const static uint16_t WRITABLE_CHARACTERISTIC_UUID = 0xA001;

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

        const UUID uuid = WRITABLE_CHARACTERISTIC_UUID;
        _writable_characteristic = new ReadWriteGattCharacteristic<uint8_t>(uuid, &_characteristic_value);

        if (!_writable_characteristic) {
            printf("Allocation of ReadWriteGattCharacteristic failed\r\n");
        }

        GattCharacteristic *charTable[] = {&GyroCharacteristic, _writable_characteristic};

        GattService sensorService(CUSTOM_SENSOR_SERVICE_UUID, charTable, sizeof(charTable) / sizeof(GattCharacteristic *));

        ble.gattServer().addService(sensorService);
        ble.gattServer().setEventHandler(this); // 设置事件处理程序
        serviceAdded = true;
    }

    void updateGyroDataXYZ(GyroType_t newpGyroDataXYZ)
    {
        pGyroDataXYZ.x = newpGyroDataXYZ.x;
        pGyroDataXYZ.y = newpGyroDataXYZ.y;
        pGyroDataXYZ.z = newpGyroDataXYZ.z;
        ble.gattServer().write(GyroCharacteristic.getValueHandle(), (uint8_t *)&pGyroDataXYZ, sizeof(GyroType_t));
    }

    virtual void onDataWritten(const GattWriteCallbackParams &params) override
    {
        if ((params.handle == _writable_characteristic->getValueHandle()) && (params.len == 1)) {
            printf("New characteristic value written: %x\r\n", *(params.data));
        }
    }

private:
    BLE& ble;

    GyroType_t pGyroDataXYZ;
    uint8_t command;

    GattCharacteristic GyroCharacteristic;

    ReadWriteGattCharacteristic<uint8_t> *_writable_characteristic = nullptr;
    uint8_t _characteristic_value = 0;
};

#endif
