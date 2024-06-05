import { useData } from "../hooks/useData.js"
import './startPage.css'

function StartPage() {
  const { start, setStart } = useData();

  return (
    <div className="StartWrapper">
        <div className="container">
            <div className="title">Welcome to Space Conqueror</div>
            <button className="startButton" onClick={() => {
                setStart(true)
              }}
            >
              Hit the button to start
            </button>
        </div>
    </div>
  )
}

export { StartPage }