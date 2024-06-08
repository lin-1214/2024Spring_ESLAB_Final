import React, { useEffect } from "react"
import { useData } from "../hooks/useData.js"
import { useBLE } from "../hooks/useBLE.js"
import '../styles/gameOverPage.css'

function GameOverPage() {
  const { setStart, score } = useData();
  const { command } = useBLE();

  useEffect(() => {
    if (command > 16) {
      setStart(true)
    }
    
  }, [command])

  return (
    <div className="GameOverWrapper">
        <div className="GameOverContainer">
            <div className="GameOverTitle">Game Over... Your score is {score}</div>
            <button className="GameOverButton" onClick={() => {
                setStart(true)
              }}
            >
              Hit the button to Try again
            </button>
        </div>
    </div>
  )
}

export { GameOverPage }