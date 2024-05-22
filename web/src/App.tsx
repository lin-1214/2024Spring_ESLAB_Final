import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    const connectBLE = async () => {
        const device = await navigator.bluetooth.requestDevice({
            // acceptAllDevices: true,
            filters: [
                {
                    // namePrefix: "FUCK_TA",
                    services: ["e31368d2-3247-4b01-8ece-3a2bf602808f"],
                },
            ],
            // optionalServices: [0x181c],
        });

        if (!device.gatt) {
            console.error(
                "Web Bluetooth API is not available. Please make sure the Web Bluetooth flag is enabled in chrome://flags."
            );
            return;
        }
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService("e31368d2-3247-4b01-8ece-3a2bf602808f");
        const characteristic = await service.getCharacteristic(
            "43080fde-e247-4bd5-b7b2-6c80ec3e526e"
        );
        characteristic.addEventListener("characteristicvaluechanged", handleData);
        characteristic.startNotifications();
        return { server, characteristic };
    };
    const handleData = (event: Event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value;
        // Your data handling code goes here
        // Example:
        console.log(value);
        // const decoder = new TextDecoder("hex");
        // const text = decoder.decode(value);
        // console.log(text);
    };
    useEffect(() => {
        // Your BLE connection setup code goes here
        // Example:
        // Function to handle incoming data from BLE
        // Cleanup function
        return () => {
            // Disconnect from BLE device and remove event listener
            // Example:
            // characteristic.removeEventListener('characteristicvaluechanged', handleData);
            // server.disconnect();
        };
    }, []);

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => connectBLE()}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </>
    );
}

export default App;
