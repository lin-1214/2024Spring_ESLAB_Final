import React, { useEffect, useState } from "react";
import { useData } from "../hooks/useData";
import './obstacle.css'

function Obstacle() {
  const { obstaclePos, setObstaclePos } = useData();
  const [pos1, setPos1] = useState('0');
  const [pos2, setPos2] = useState('1');
  const [pos3, setPos3] = useState('0');
  var mapping = '010'

  const dec2bin = (dec: number) => {
    return (dec >>> 0).toString(2);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setObstaclePos(Math.floor((Math.random() * 6 + 1)));

      mapping = dec2bin(obstaclePos);
      while (mapping.length < 3) {
        mapping = '0' + mapping;
      }

      setPos1(mapping[0]);
      setPos2(mapping[1]);
      setPos3(mapping[2]);
      
    }, 5000);

    return () => {
      console.log(mapping);
      console.log(obstaclePos);
      clearInterval(interval);
    }
  }, [obstaclePos])

  return (
    <>
      {
      obstaclePos !== 0? <div className="Obstacles">
      {pos1 === '1'? <div className="Obstacle" ></div>: <div className="Obstacle" style={{opacity: 0}}></div>}
      {pos2 === '1'? <div className="Obstacle" ></div>: <div className="Obstacle" style={{opacity: 0}}></div>}
      {pos3 === '1'? <div className="Obstacle" ></div>: <div className="Obstacle" style={{opacity: 0}}></div>}
      </div>: <div className="Obstacles" style={{opacity: 0}}></div>
      }
    </>
    
  )
}

export {Obstacle}