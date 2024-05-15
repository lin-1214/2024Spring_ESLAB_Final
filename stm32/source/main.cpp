#include <events/mbed_events.h>
#include "ble/BLE.h"
#include "ble/gap/Gap.h"
#include "ble/services/HeartRateService.h"
#include "pretty_printer.h"
#include "mbed-trace/mbed_trace.h"
#include "EnvironmentalService.h"
#include "SensorService.h"

#include "stm32l475e_iot01_gyro.h"

using namespace std::literals::chrono_literals;

const static char DEVICE_NAME[] = "FUCK_ESLAB";

static events::EventQueue event_queue(/* event count */ 16 * EVENTS_EVENT_SIZE);

class SensorDemo : ble::Gap::EventHandler {
public:
    SensorDemo(BLE &ble, events::EventQueue &event_queue) :
        _ble(ble),
        _event_queue(event_queue),       
        _sensor_uuid(CUSTOM_SENSOR_SERVICE_UUID),//added
        _sensor_service(ble),//added
        _adv_data_builder(_adv_buffer)
    {
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
            printf("Ble initialization failed.");
            return;
        }

        print_mac_address();

        /* this allows us to receive events like onConnectionComplete() */
        _ble.gap().setEventHandler(this);

        /* heart rate value updated every second */
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

        //UUID service_uuids[] = {_heartrate_uuid, _sensor_uuid};
        _adv_data_builder.setLocalServiceList({&_sensor_uuid, 1});
        //_adv_data_builder.setLocalServiceList(service_uuids, sizeof(service_uuids) / sizeof(UUID));
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

        printf("Heart rate sensor advertising, please connect\r\n");
    }

    void update_sensor_value()
    {
        float pGyroDataXYZ[3];
        BSP_GYRO_GetXYZ(pGyroDataXYZ);
        _GyroDataXYZ.x=pGyroDataXYZ[0];
        _GyroDataXYZ.y=pGyroDataXYZ[1];
        _GyroDataXYZ.z=pGyroDataXYZ[2];
        _sensor_service.updateGyroDataXYZ(_GyroDataXYZ);//added
    }

    /* these implement ble::Gap::EventHandler */
private:
    /* when we connect we stop advertising, restart advertising so others can connect */
    virtual void onConnectionComplete(const ble::ConnectionCompleteEvent &event)
    {
        if (event.getStatus() == ble_error_t::BLE_ERROR_NONE) {
            printf("Client connected, you may now subscribe to updates\r\n");
        }
    }

    /* when we connect we stop advertising, restart advertising so others can connect */
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

    UUID _sensor_uuid;// added
    
    SensorService::GyroType_t _GyroDataXYZ;//added
    //float pGyroDataXYZ[3];
    
    SensorService _sensor_service;//added

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

