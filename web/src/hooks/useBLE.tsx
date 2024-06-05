/// <reference types="web-bluetooth" />
import React, { FC, createContext, useState, useContext} from "react";

// interface BLEProps {
//     server: BluetoothRemoteGATTServer;
//     readCharacteristic: BluetoothRemoteGATTCharacteristic;
//     writeCharacteristic: BluetoothRemoteGATTCharacteristic;
//     velocity: number;
//     command: number;

//     connect: () => void;
//     write: (data: Int16Array) => void
// }

const BLEContext = createContext({
    server: null,
    readCharacteristic: null,
    writeCharacteristic: null,
    connect: () => {},
    write: (data: Int16Array) => {},
    velocity: 0,
    command: 0,
    bleStatus: false,
    setBLEStatus: () => {},
});

interface BLEProviderProps {
    children: React.ReactNode;
}

const BLEProvider: FC<BLEProviderProps> = (props: any) => {
    const [server, setServer] = useState<BluetoothRemoteGATTServer>(null!);
    const [readCharacteristic, setReadCharacteristic] = useState<BluetoothRemoteGATTCharacteristic>(
        null!
    );
    const [writeCharacteristic, setWriteCharacteristic] =
        useState<BluetoothRemoteGATTCharacteristic>(null!);
    const [velocity, setVelocity] = useState(0);
    const [command, setCommand] = useState(0);
    const [bleStatus, setBLEStatus] = useState(false);

    const connect = async () => {
        const device = await navigator.bluetooth.requestDevice({
            filters: [
                {
                    services: ["e31368d2-3247-4b01-8ece-3a2bf602808f"],
                },
            ],
        });

        if (!device.gatt) {
            console.error(
                "Web Bluetooth API is not available. Please make sure the Web Bluetooth flag is enabled in chrome://flags."
            );
            return;
        }
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService("e31368d2-3247-4b01-8ece-3a2bf602808f");
        const readCharacteristic = await service.getCharacteristic(
            "43080fde-e247-4bd5-b7b2-6c80ec3e526e"
        );
        console.log("Connected to the device");
        // tell webpage the BLE is connected
        setBLEStatus(true);
        readCharacteristic.addEventListener("characteristicvaluechanged", handleData);
        readCharacteristic.startNotifications();

        const writeCharacteristic = await service.getCharacteristic(0xa001);
        console.log("Got write char.");
        setServer(server);
        setReadCharacteristic(readCharacteristic);
        setWriteCharacteristic(writeCharacteristic);
        return { server, readCharacteristic, writeCharacteristic };
    };
    const handleData = (event: Event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        if (!value) {
            return;
        }
        let data = new Int16Array(value.buffer);
        // console.log("Data received: ", data);
        // console.log(data[0])
        if (data[0] > 16) {
            setCommand(data[0]);
        } else {
            setCommand(0);
            setVelocity(data[0]);
        }
    };
    const write = (data: Int16Array) => {
        if (!writeCharacteristic) {
            console.error("Write characteristic is not available");
            return;
        }
        // writecharacteristic?.writeValue(new Uint8Array([0x02]));
        writeCharacteristic.writeValueWithResponse(data);
    };
    return (
        <BLEContext.Provider
            value={{ server, readCharacteristic, writeCharacteristic, connect, velocity, write, bleStatus, command}}
            {...props}
        />
    );
};

const useBLE = () => {
    return useContext(BLEContext);
};

export { useBLE, BLEProvider };