// Block.tsx
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BlockProps {
    roll: number;
    pitch: number;
    yaw: number;
}

const Block: React.FC<BlockProps> = ({ roll, pitch, yaw }) => {
    const blockRef = useRef<THREE.Mesh>(null!);

    useFrame(() => {
        if (blockRef.current) {
            blockRef.current.rotation.x = pitch;
            blockRef.current.rotation.y = yaw;
            blockRef.current.rotation.z = roll;
        }
    });

    return (
        <mesh ref={blockRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
            <axesHelper args={[3]} />
        </mesh>
    );
};

export default Block;
