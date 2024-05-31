import React, { useEffect, useRef } from "react";
import { useData } from "./hooks/useData.tsx";
import { StartPage } from "./component/startPage.tsx";
import { Player } from "./component/player.tsx";
import { Obstacle } from "./component/obstacle.tsx";
import { LifeBar } from "./component/lifeBar.tsx";
import { GameOverPage } from "./component/gameOverPage.tsx";
import { ScoreBar } from "./component/scoreBar.tsx";
import './style/App.css'

function App() {
  const { start, gameover, life, setStart, setLife, setTick, setSpeed, setObstaclePos, setPlanePos, setGameOver, setPlaneState, setScore} = useData();
  const colRef = useRef<HTMLDivElement | null>(null);

  const init = () => {
    setLife(3)
    setTick(0)
    setSpeed(40)
    setObstaclePos(0)
    setPlanePos(0)
    setGameOver(false)
    setPlaneState(0)
    setScore(0)
  }

  useEffect(() => {
    if (start) {
      init()
    }
  }, [start])

  useEffect(() => {
    console.log(life)
    if (life <= 0) {
      setGameOver(true)
      setStart(false)
    }
  }, [life])

  return (
    <>
      {start? 
      <div className="BackgroundImage">
        <div className="BarContainer">
          <LifeBar />
          <ScoreBar />
        </div>
        <div className="GameWrapper">
          <div className="MeteorContainer">
            <Obstacle />
          </div>
          {/* <div className="BlankContainer"></div> */}
          <div className="PlayerContainer" ref={colRef}>
            <Player />
          </div>
        </div>
      </div> : gameover?
      <div className="BackgroundImageTransparent">
        <GameOverPage />
      </div> : 
      <div className="BackgroundImageTransparent">
        <StartPage />
      </div>
      }
    </>
  )
}

export default App
