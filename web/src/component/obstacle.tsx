import React, { useEffect, useState, useRef } from "react";
import { useData } from "../hooks/useData";
import './obstacle.css'

function Obstacle() {
  const { obstaclePos, setObstaclePos, collision, setCollision, planeBorder, tick, life, setTick, setLife, region } = useData();
  const [pos1, setPos1] = useState('0');
  const [pos2, setPos2] = useState('0');
  const [pos3, setPos3] = useState('0');
  const [broken1, setBroken1] = useState(false);
  const [broken2, setBroken2] = useState(false);
  const [broken3, setBroken3] = useState(false);

  // reference not used
  // const ref_1 = useRef<HTMLDivElement | null>(null);
  // const ref_2 = useRef<HTMLDivElement | null>(null);
  // const ref_3 = useRef<HTMLDivElement | null>(null);
  let mapping = '000'
  

  const dec2bin = (dec: number) => {
    return (dec >>> 0).toString(2);
  }

  const resetObstacle = (t: number) => {
    if (t >= -20000) setTick(t);
    setCollision(false);
    setBroken1(false);
    setBroken2(false);
    setBroken3(false);
  }

  useEffect(() => {
    console.log(tick)
    if (tick >= 180 && tick <= 215) {
      // collision region 1 [260, 425+125]
      // console.log(planeBorder[0], planeBorder[1])
      // console.log(region[0] + 180, region[0] + 180 + region[1]/5)
      // console.log(region[0] + 200 + 3*region[1]/10, region[0] + 7 * region[1] / 10 - 200)
      // console.log(region[0] + 4 * region[1] / 5 - 180, region[0] + region[1] - 180)
      if (pos1 === '1' && ((planeBorder[0] >= region[0] + 180 && planeBorder[0] <= region[0] + 180 + region[1]/5) || (planeBorder[1] >= region[0] + 200 && planeBorder[1] <= region[0] + 180 + region[1]/5) || (planeBorder[0] <= region[0] + 200 && planeBorder[1] >= region[0] + 180 + region[1]/5))) {
        setCollision(true)
        setBroken1(true)
        setLife(life - 1)
        setTick(-5000)       // set to -100 to prevent multiple collision
      }

      // collision region 2 [825-110, 825+110]
      if (pos2 === '1' && ((planeBorder[0] >= region[0] + 200 + 3*region[1]/10 && planeBorder[0] <= region[0] + 7 * region[1] / 10 - 200) || (planeBorder[1] >= region[0] + 200 + 3*region[1]/10 && planeBorder[1] <= region[0] + 7 * region[1] / 10 - 200) || (planeBorder[0] <= region[0] + 200 + 3*region[1]/10 && planeBorder[1] >= region[0] + 7 * region[1] / 10 - 200))) {
        setCollision(true)
        setBroken2(true)
        setLife(life - 1)
        setTick(-5000)
      }

      // collision region 3 [1225-125, 1225+150]
      if (pos3 === '1' && ((planeBorder[0] >= region[0] + 4 * region[1] / 5 - 180 && planeBorder[0] <= region[0] + region[1] - 180) || (planeBorder[1] >= region[0] + 4 * region[1] / 5 - 180 && planeBorder[1] <= region[0] + region[1] - 180) || (planeBorder[0] <= region[0] + 4 * region[1] / 5 - 180 && planeBorder[1] >= region[0] + region[1] - 180))) {
        setCollision(true)
        setBroken3(true)
        setLife(life - 1)
        setTick(-5000)
      }
    }
      
  }, [tick])

  useEffect(() => {
    const interval = setInterval(() => {
      resetObstacle(0);
      setObstaclePos(Math.floor((Math.random() * 6 + 1)));
      // if (life <= 0) setLife(life - 1) 
      // console.log(obstaclePos)

      mapping = dec2bin(obstaclePos);
      while (mapping.length < 3) {
        mapping = '0' + mapping;
      }
      // console.log(obstaclePos)
      // check tick
      if (tick >= 0 && tick <= 500) {
        setPos1(mapping[0]);
        setPos2(mapping[1]);
        setPos3(mapping[2]);
      } else {
        setPos1('0');
        setPos2('0');
        setPos3('0');
        resetObstacle(-25000);
      }
      
    }, 5000);

    return () => {
      // resetObstacle(0);
      clearInterval(interval);
    }
  }, [obstaclePos])

  return (
    <>
      {
      (obstaclePos !== 0 || !collision)? <div className="Obstacles">
      {broken1 && tick < 0? <div className="ObstacleBroken"></div>: pos1 === '1'? <div className="Obstacle"></div>: <div className="Obstacle" style={{opacity: 0}}></div>}
      {broken2 && tick < 0? <div className="ObstacleBroken"></div>: pos2 === '1'? <div className="Obstacle"></div>: <div className="Obstacle" style={{opacity: 0}}></div>}
      {broken3 && tick < 0? <div className="ObstacleBroken"></div>:pos3 === '1'? <div className="Obstacle"></div>: <div className="Obstacle" style={{opacity: 0}}></div>}
      </div>: <div className="Obstacles" style={{opacity: 0}}></div>
      }
    </>
    
  )
}

export {Obstacle}