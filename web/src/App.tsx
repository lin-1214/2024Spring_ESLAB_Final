import React, {useEffect} from "react";
import { useData } from "./hooks/useData.tsx";
import { StartPage } from "./component/startPage.tsx";
import { Player } from "./component/player.tsx";
import { Obstacle } from "./component/obstacle.tsx";
import './style/App.css'

function App() {
  const { start } = useData();

  useEffect(() => {
    console.log(start)
  }, [])

  return (
    <>
      {start? 
      <div className="BackgroundImage">
        <div className="GameWrapper">
          <div className="MeteorContainer">
            <Obstacle />
          </div>
          <div className="BlankContainer">Blank</div>
          <div className="PlayerContainer">
            <Player />
          </div>
        </div>
      </div> : 
      <div className="BackgroundImageTransparent">
        <StartPage />
      </div>}
    </>
  )
}

export default App
