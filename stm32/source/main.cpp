#include "mbed.h"
#include <cstdint>
#include <events/mbed_events.h>
#include "ble/BLE.h"
#include "ble/gap/Gap.h"
#include "pretty_printer.h"
#include "mbed-trace/mbed_trace.h"
#include "SensorService.h"

#include "stm32l475e_iot01_gyro.h"

#include <stdio.h>
#include <stdlib.h>
#include <cstdio>
#include <string>
#include "arm_math.h"
#include "math_helper.h"

using namespace std::literals::chrono_literals;

const static char DEVICE_NAME[] = "SENSOR_DEVICE";

// Filter related constants
#define NUM_TAPS 29
#define BLOCK_SIZE 32
static float32_t firStateF32[BLOCK_SIZE + NUM_TAPS - 1];
static const float32_t firCoeffs32[NUM_TAPS] = {
    -0.0018225230f, -0.0015879294f, +0.0000000000f, +0.0036977508f, +0.0080754303f, +0.0085302217f, -0.0000000000f, -0.0173976984f,
    -0.0341458607f, -0.0333591565f, +0.0000000000f, +0.0676308395f, +0.1522061835f, +0.2229246956f, +0.2504960933f, +0.2229246956f,
    +0.1522061835f, +0.0676308395f, +0.0000000000f, -0.0333591565f, -0.0341458607f, -0.0173976984f, -0.0000000000f, +0.0085302217f,
    +0.0080754303f, +0.0036977508f, +0.0000000000f, -0.0015879294f, -0.0018225230f
};

arm_fir_instance_f32 S;

static events::EventQueue event_queue(/* event count */ 16 * EVENTS_EVENT_SIZE);

class SensorDemo : ble::Gap::EventHandler {
public:
    SensorDemo(BLE &ble, events::EventQueue &event_queue) :
        _ble(ble),
        _event_queue(event_queue),       
        _sensor_uuid(CUSTOM_SENSOR_SERVICE_UUID),
        _sensor_service(ble),
        _adv_data_builder(_adv_buffer)
    {
        arm_fir_init_f32(&S, NUM_TAPS, (float32_t *)&firCoeffs32[0], &firStateF32[0], BLOCK_SIZE);
    }

    void start()
    {
        _ble.init(this, &SensorDemo::on_init_complete);

        _event_queue.dispatch_forever();
    }

private:
    /** Callback triggered when the ble initialization process has finished */
    void on_init_complete(BLE::InitializationCompleteCallbackContext *params)
    {
        if (params->error != BLE_ERROR_NONE) {
            printf("Ble initialization failed.\r\n");
            return;
        }

        print_mac_address();

        /* This allows us to receive events like onConnectionComplete() */
        _ble.gap().setEventHandler(this);

        /* Sensor value updated every second */
        _event_queue.call_every(
            1000ms,
            [this] {
                update_sensor_value();
            }
        );

        start_advertising();
    }

    void start_advertising()
    {
        /* Create advertising parameters and payload */

        ble::AdvertisingParameters adv_parameters(
            ble::advertising_type_t::CONNECTABLE_UNDIRECTED,
            ble::adv_interval_t(ble::millisecond_t(100))
        );

        _adv_data_builder.setFlags();
        _adv_data_builder.setAppearance(ble::adv_data_appearance_t::GENERIC_HEART_RATE_SENSOR);
        _adv_data_builder.setLocalServiceList({&_sensor_uuid, 1});
        _adv_data_builder.setName(DEVICE_NAME);

        /* Setup advertising */

        ble_error_t error = _ble.gap().setAdvertisingParameters(
            ble::LEGACY_ADVERTISING_HANDLE,
            adv_parameters
        );

        if (error) {
            printf("_ble.gap().setAdvertisingParameters() failed\r\n");
            return;
        }

        error = _ble.gap().setAdvertisingPayload(
            ble::LEGACY_ADVERTISING_HANDLE,
            _adv_data_builder.getAdvertisingData()
        );

        if (error) {
            printf("_ble.gap().setAdvertisingPayload() failed\r\n");
            return;
        }

        /* Start advertising */

        error = _ble.gap().startAdvertising(ble::LEGACY_ADVERTISING_HANDLE);

        if (error) {
            printf("_ble.gap().startAdvertising() failed\r\n");
            return;
        }

        printf("Sensor service advertising, please connect\r\n");
    }

    void update_sensor_value()
    {
        float sensorData[3];
        BSP_GYRO_GetXYZ(sensorData);

        // Filter
        float filteredData[3];
        for (int i = 0; i < 3; i++) {
            arm_fir_f32(&S, &sensorData[i], &filteredData[i], 1);
        }

        _GyroDataXYZ.x = filteredData[0];
        _GyroDataXYZ.y = filteredData[1];
        _GyroDataXYZ.z = filteredData[2];
        _sensor_service.updateGyroDataXYZ(_GyroDataXYZ);
    }

    /* These implement ble::Gap::EventHandler */
private:
    virtual void onConnectionComplete(const ble::ConnectionCompleteEvent &event)
    {
        if (event.getStatus() == ble_error_t::BLE_ERROR_NONE) {
            printf("Client connected, you may now subscribe to updates\r\n");
        }
    }

    virtual void onDisconnectionComplete(const ble::DisconnectionCompleteEvent &event)
    {
        printf("Client disconnected, restarting advertising\r\n");

        ble_error_t error = _ble.gap().startAdvertising(ble::LEGACY_ADVERTISING_HANDLE);

        if (error) {
            printf("_ble.gap().startAdvertising() failed\r\n");
            return;
        }
    }

private:
    BLE &_ble;
    events::EventQueue &_event_queue;

    UUID _sensor_uuid;
    
    SensorService::GyroType_t _GyroDataXYZ;    
    SensorService _sensor_service;

    uint8_t _adv_buffer[ble::LEGACY_ADVERTISING_MAX_SIZE];
    ble::AdvertisingDataBuilder _adv_data_builder;
};

/* Schedule processing of events from the BLE middleware in the event queue. */
void schedule_ble_events(BLE::OnEventsToProcessCallbackContext *context)
{
    event_queue.call(Callback<void()>(&context->ble, &BLE::processEvents));
}

int main()
{
    mbed_trace_init();
    BSP_GYRO_Init();

    BLE &ble = BLE::Instance();
    ble.onEventsToProcess(schedule_ble_events);

    SensorDemo demo(ble, event_queue);
    demo.start();

    return 0;
}
