import React, { useEffect, useRef } from "react";
import { useData } from "../hooks/useData";
import { useBLE } from "../hooks/useBLE";
import '../styles/player.css'

declare global {
    interface WindowEventMap {
        keydown: React.KeyboardEvent<HTMLInputElement>
    }
}


function Player() {
  // 0: same, 1: right, -1: left, 2: turning right, -2: turning left
  const { start, tick, score, life, setLife, collision, setCollision,planeState, setPlaneState, planePos, setPlanePos, planeBorder, setplaneBorder, setTick, setScore } = useData();
  const playerRef = useRef<HTMLDivElement | null>(null);
  const { velocity, write, command } = useBLE()
  const mul = 0.2     // velocity multiplier
  let left: number, width: number;


  // const handleUserKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   const { key } = event
  //   // mapping
  //   // ArrowRight -> right, ArrowLeft -> left, ArrowDown -> middle
  //   // can't move when encounter collsion
  //   if (!collision) {
  //     if (key === 'ArrowRight' && planePos + speed <= 1080) {
  //       setPlaneState(1)
  //       setPlanePos(planePos + speed)
  //     } else if (key === 'ArrowLeft' && planePos - speed >= -1080) {
  //       setPlaneState(-1)
  //       setPlanePos(planePos - speed)
  //     } else if (key === 'ArrowDown' && planeState == 1) {
  //       setPlaneState(2)
  //     } else if (key === 'ArrowDown' && planeState == -1) {
  //       setPlaneState(-2)
  //     } else if (key === 'ArrowDown') {
  //       setPlaneState(0)
  //     }
  //   }
  // }

  const handleSTM = (velocity: number) => {
    if (!collision) {
      if (velocity > 0 && planePos + velocity/mul <= 1080) {
        setPlaneState(1)
        setPlanePos(planePos + velocity/mul)
      } else if (velocity < -0 && planePos + velocity/mul >= -1080) {
        setPlaneState(-1)
        setPlanePos(planePos + velocity/mul)
      } else if (Math.abs(velocity) == 0 && planeState == 1) {
        setPlaneState(2)
      } else if (Math.abs(velocity) == 0 && planeState == -1) {
        setPlaneState(-2)
      } else if (Math.abs(velocity) == 0) {
        setPlaneState(0)
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick+1)
      setScore(score+1)
      // console.log(tick)
      // setSpeed(velocity * 5)
      handleSTM(velocity)
    }, 10)

    return () => {
      clearInterval(interval)
    }
  })

  useEffect(() => {
    // console.log(collision)
    if (collision) {
      setPlaneState(0)
      // TODO: write to stm32
      write()
      
    } else if (life <= 0) setLife(life - 1)

  }, [collision])

  useEffect(() => {
    if (command > 16) {
      setPlaneState(0)
      setCollision(false)
    }
  }, [command])

  // TODO: change keypress to gather data from stm32
  useEffect(() => {
    // window.addEventListener('keydown', handleUserKeyPress)
    left = playerRef.current!.offsetLeft
    width = playerRef.current!.offsetWidth
    
    if (left !== planeBorder[0] && left + width !== planeBorder[1]) {
      setplaneBorder([left, left + width])
      // console.log(left, left + width)
    }
    // return () => {
    //   window.removeEventListener('keydown', handleUserKeyPress)
    // }
  })
  
  return (
    <>{life <= 0? <div className="Player-B" ref={playerRef} style={{marginLeft: planePos}}></div>:
      collision? <div className="Player-C" ref={playerRef} style={{marginLeft: planePos}}></div>:
      planeState === 0? <div className="Player" ref={playerRef} style={{marginLeft: planePos}}></div>:
      planeState === 1? <div className="Player-R" ref={playerRef} style={{marginLeft: planePos, rotate: '45deg'}}></div>:
      planeState === -1? <div className="Player-L" ref={playerRef} style={{marginLeft: planePos, rotate: '-45deg'}}></div>:
      planeState === 2? <div className="Player-RB" ref={playerRef} style={{marginLeft: planePos}}></div>:
      planeState === -2? <div className="Player-LB" ref={playerRef} style={{marginLeft: planePos}}></div>:
      <div></div>
    }</>
    
  );
}

export {Player}