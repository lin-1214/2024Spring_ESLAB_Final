import React, { FC, createContext, useState, useContext} from "react";

interface DataProps {
    start: boolean;
    relaod: boolean;
    // 0: same, 1: right, -1: left
    planeState: number;
    planePos: number;
    speed: number;
    // 0 ~ 6: to bimomial is the position of the obstacle
    obstaclePos: number;
    collision: boolean;
    // [0]: top, [1]: bottom, [2]: left, [3]: right
    planeBorder: number[]; 
    obstaclesBorder: number[][];

    setStart: (start: boolean) => void;
    setReload: (reload: boolean) => void;
    setPlaneState: (planeState: number) => void;
    setPlanePos: (planePos: number) => void;
    setSpeed: (speed: number) => void;
    setObstaclePos: (obstaclePos: number) => void;
    setCollision: (collision: boolean) => void;
    setplaneBorder: (planeBorder: number[]) => void;
    setObstaclesBorder: (obstaclesBorder: number[][]) => void;
}

const Data = createContext<DataProps>({
    start: false,
    relaod: false,
    planeState: 0,
    planePos: 0,
    speed: 0,
    obstaclePos: 0,
    collision: false,
    planeBorder: [0, 0, 0, 0],
    obstaclesBorder: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],

    setStart: () => {},
    setReload: () => {},
    setPlaneState: () => {},
    setPlanePos: () => {},
    setSpeed: () => {},
    setObstaclePos: () => {},
    setCollision: () => {},
    setplaneBorder: () => {},
    setObstaclesBorder: () => {},
});

interface UserDataProviderProps {
    children: React.ReactNode;
}

const DataProvider: FC<UserDataProviderProps> = (props) => {
    const [start, setStart] = useState(false);
    const [relaod, setReload] = useState(false);
    const [planeState, setPlaneState] = useState(0);
    const [planePos, setPlanePos] = useState(0);
    const [speed, setSpeed] = useState(40);
    const [obstaclePos, setObstaclePos] = useState(0);
    const [collision, setCollision] = useState(false);
    const [planeBorder, setplaneBorder] = useState([0, 0, 0, 0]);
    const [obstaclesBorder, setObstaclesBorder] = useState([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);

    return (
        <Data.Provider
            value={{
                start,
                relaod,
                planeState,
                planePos,
                speed,
                obstaclePos,
                collision,
                planeBorder,
                obstaclesBorder,
                setStart,
                setReload,
                setPlaneState,
                setPlanePos,
                setSpeed,
                setObstaclePos,
                setCollision,
                setplaneBorder,
                setObstaclesBorder
            }}
            {...props}
        ></Data.Provider>
    );
}

const useData = () => {
    return useContext(Data);
};

export {DataProvider, useData}