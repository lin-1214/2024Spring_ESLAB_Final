import { useData } from "../hooks/useData.js"
import './gameOverPage.css'

function GameOverPage() {
  const { setStart, score } = useData();

  return (
    <div className="GameOverWrapper">
        <div className="GameOverContainer">
            <div className="GameOverTitle">Game Over... Your score is "{score}"</div>
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