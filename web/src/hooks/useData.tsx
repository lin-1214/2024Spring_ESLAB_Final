import React, { FC, createContext, useState, useContext} from "react";

interface DataProps {
    start: boolean;
    gameover: boolean;
    relaod: boolean;
    // 0: same, 1: right, -1: left
    planeState: number;
    planePos: number;
    speed: number;
    // 0 ~ 6: to bimomial is the position of the obstacle
    obstaclePos: number;
    collision: boolean;
    planeBorder: number[]; 
    // obstaclesBorder: number[][];
    life: number;
    collisionRange: number;
    // modulate the sending frequency of data
    tick: number;
    // stm32 sample frequency
    sample_freq: number;
    score: number;
    // player region
    region: number[];

    setStart: (start: boolean) => void;
    setGameOver: (gameover: boolean) => void;
    setReload: (reload: boolean) => void;
    setPlaneState: (planeState: number) => void;
    setPlanePos: (planePos: number) => void;
    setSpeed: (speed: number) => void;
    setObstaclePos: (obstaclePos: number) => void;
    setCollision: (collision: boolean) => void;
    setplaneBorder: (planeBorder: number[]) => void;
    // setObstaclesBorder: (obstaclesBorder: number[][]) => void;
    setLife: (life: number) => void;
    setCollisionRange: (collisionRange: number) => void;
    setTick: (tick: number) => void;
    setSampleFreq: (sample_freq: number) => void;
    setScore: (score: number) => void;
    setRegion: (region: number[]) => void;
}

const Data = createContext<DataProps>({
    start: false,
    gameover: false,
    relaod: false,
    planeState: 0,
    planePos: 0,
    speed: 0,
    obstaclePos: 0,
    collision: false,
    planeBorder: [0, 0],
    // obstaclesBorder: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    life: 0,
    collisionRange: 0,
    tick: 0,
    sample_freq: 0,
    score: 0,
    region: [0, 0],

    setStart: () => {},
    setGameOver: () => {},
    setReload: () => {},
    setPlaneState: () => {},
    setPlanePos: () => {},
    setSpeed: () => {},
    setObstaclePos: () => {},
    setCollision: () => {},
    setplaneBorder: () => {},
    // setObstaclesBorder: () => {},
    setLife: () => {},
    setCollisionRange: () => {},
    setTick: () => {},
    setSampleFreq: () => {},
    setScore: () => {},
    setRegion: () => {},
});

interface UserDataProviderProps {
    children: React.ReactNode;
}

const DataProvider: FC<UserDataProviderProps> = (props) => {
    const [start, setStart] = useState(false);
    const [gameover, setGameOver] = useState(false);
    const [relaod, setReload] = useState(false);
    const [planeState, setPlaneState] = useState(0);
    const [planePos, setPlanePos] = useState(0);
    const [speed, setSpeed] = useState(40);
    const [obstaclePos, setObstaclePos] = useState(0);
    const [collision, setCollision] = useState(false);
    const [planeBorder, setplaneBorder] = useState([0, 0]);
    // const [obstaclesBorder, setObstaclesBorder] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    const [life, setLife] = useState(3);
    const [collisionRange, setCollisionRange] = useState(0);
    const [tick, setTick] = useState(0);
    const [sample_freq, setSampleFreq] = useState(10); // 10Hz
    const [score, setScore] = useState(0);
    const [region, setRegion] = useState([0, 0]);

    return (
        <Data.Provider
            value={{
                start,
                gameover,
                relaod,
                planeState,
                planePos,
                speed,
                obstaclePos,
                collision,
                planeBorder,
                // obstaclesBorder,
                life,
                collisionRange,
                tick,
                sample_freq,
                score,
                region,
                setStart,
                setGameOver,
                setReload,
                setPlaneState,
                setPlanePos,
                setSpeed,
                setObstaclePos,
                setCollision,
                setplaneBorder,
                // setObstaclesBorder,
                setLife,
                setCollisionRange,
                setTick,
                setSampleFreq,
                setScore,
                setRegion
            }}
            {...props}
        ></Data.Provider>
    );
}

const useData = () => {
    return useContext(Data);
};

export {DataProvider, useData}