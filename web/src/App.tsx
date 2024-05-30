import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LineChart from "./components/line_chart";
import Scene from "./components/scene";
import { optimize } from "./components/adjust_angle";
var timestamp = new Date().getTime();
function App() {
    const [angle, setAngle] = useState([[0.0, 0.0, 0.0]]);
    const [targetRoll, setTargetRoll] = useState(0);
    const [targetYaw, setTargetYaw] = useState(0);
    const [targetPitch, setTargetPitch] = useState(0);
    const [server, setServer] = useState<BluetoothRemoteGATTServer | null>(null);
    const [readcharacteristic, setReadCharacteristic] =
        useState<BluetoothRemoteGATTCharacteristic | null>(null);
    const [writecharacteristic, setWriteCharacteristic] =
        useState<BluetoothRemoteGATTCharacteristic | null>(null);
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
        const readCharacteristic = await service.getCharacteristic(
            "43080fde-e247-4bd5-b7b2-6c80ec3e526e"
        );
        console.log("Connected to the device");
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
        // Your data handling code goes here
        // Example:
        if (!value) {
            return;
        }
        let data = new Int16Array(value.buffer);
        console.log("Data received: ", data[0]);
        // console.log("FPS: ", 1000 / (new Date().getTime() - timestamp));
        setAngle((e) => [[data[0], data[1], data[2]], ...e]);
    };
    useEffect(() => {
        // Your BLE connection setup code goes here
        // Example:
        // Function to handle incoming data from BLE
        // Cleanup function
        if (angle.length > 100) {
            // console.log("angle length:", angle.length);
            setAngle((e) => e.slice(0, 100));
        }
        return () => {
            // Disconnect from BLE device and remove event listener
            // Example:
            // characteristic.removeEventListener('characteristicvaluechanged', handleData);
            // server.disconnect();
        };
    }, [angle]);
    const calc = () => {
        console.log(
            "Calculating..., length:",
            angle.length,
            "targetYaw:",
            targetYaw,
            "targetPitch:",
            targetPitch,
            "targetRoll:",
            targetRoll
        );
        const data: number[][] = JSON.parse(JSON.stringify(angle));
        const expected: number[] = [targetYaw, targetPitch, targetRoll];
        console.log(optimize(data, expected));
    };
    const send = () => {
        writecharacteristic?.writeValue(new Uint8Array([0x02]));
        console.log("Sending command");
    };
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
            <div className="card">
                <button onClick={() => connectBLE()}>Connect to BLE</button>
            </div>
            <div className="calc">
                <button onClick={() => calc()}>Calculate Rotation angle</button>
            </div>
            <div className="send">
                <button onClick={() => send()}>send command</button>
            </div>
            <LineChart data={[angle[0][0], angle[0][1], angle[0][2]]}></LineChart>
            <div>
                <label>
                    TargetRoll:
                    <input
                        type="number"
                        // value={targetRoll}
                        onChange={(e) => setTargetRoll((Number(e.target.value) * Math.PI) / 180)}
                        step="0.1"
                    />
                </label>
                <label>
                    TargetPitch:
                    <input
                        type="number"
                        // value={targetPitch}
                        onChange={(e) => setTargetPitch((Number(e.target.value) * Math.PI) / 180)}
                        step="0.1"
                    />
                </label>
                <label>
                    TargetYaw:
                    <input
                        type="number"
                        // value={targetYaw}
                        onChange={(e) => setTargetYaw((Number(e.target.value) * Math.PI) / 180)}
                        step="0.1"
                    />
                </label>
            </div>
            <Scene roll={angle[0][0]} pitch={angle[0][1]} yaw={angle[0][2]} />
        </>
    );
}

export default App;
