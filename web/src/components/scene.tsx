// Scene.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Block from "./block";

interface SceneProps {
    roll: number;
    pitch: number;
    yaw: number;
}

const Scene: React.FC<SceneProps> = ({ roll, pitch, yaw }) => {
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Block roll={roll} pitch={pitch} yaw={yaw} />
            <OrbitControls />
        </Canvas>
    );
};

export default Scene;
