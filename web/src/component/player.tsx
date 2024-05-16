import React, { useEffect, useRef } from "react";
import { useData } from "../hooks/useData";
import './player.css'

declare global {
    interface WindowEventMap {
        keydown: React.KeyboardEvent<HTMLInputElement>
    }
}


function Player() {
  // 0: same, 1: right, -1: left, 2: turning right, -2: turning left
  const { planeState, setPlaneState, relaod, setReload, planePos, setPlanePos, speed, setSpeed, planeRef} = useData();
  const handleUserKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event
      // mapping
      // ArrowRight -> right, ArrowLeft -> left, ArrowDown -> middle
      if (key === 'ArrowRight' && planePos + speed <= 1080) {
        setPlaneState(1)
        setPlanePos(planePos + speed)
      } else if (key === 'ArrowLeft' && planePos - speed >= -1080) {
        setPlaneState(-1)
        setPlanePos(planePos - speed)
      } else if (key === 'ArrowDown' && planeState == 1) {
        setPlaneState(2)
      } else if (key === 'ArrowDown' && planeState == -1) {
        setPlaneState(-2)
      } else if (key === 'ArrowDown') {
        setPlaneState(0)
      }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress)

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress)
    }
  })
  
  return (
    <>{planeState === 0? <div className="Player" style={{marginLeft: planePos}}></div>:
      planeState === 1? <div className="Player-R" style={{marginLeft: planePos, rotate: '45deg'}}></div>:
      planeState === -1? <div className="Player-L" style={{marginLeft: planePos, rotate: '-45deg'}}></div>:
      planeState === 2? <div className="Player-RB" style={{marginLeft: planePos}}></div>:
      planeState === -2? <div className="Player-LB"  style={{marginLeft: planePos}}></div>:
      <div></div>
    }</>
    
  );
}

export {Player}