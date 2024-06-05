import { useEffect } from "react";
import { useData } from "../hooks/useData.js"
import { useBLE } from "../hooks/useBLE.js"
import './startPage.css'

function StartPage() {
  const { setStart } = useData();
  const { connect, command, bleStatus } = useBLE();

  useEffect(() => {
    if (bleStatus) {
      alert("Successfully connected to BLE device!")
    }
  }, [bleStatus])

  useEffect(() => {
    if (command > 16) {
      setStart(true)
    }
    
  }, [command])

  return (
    <div className="StartWrapper">
        <div className="container">
            <div className="title">Welcome to Space Conqueror</div>
            {
              bleStatus ? 
              <button className="startButton" onClick={() => {
                setStart(true)
              }}
            >
              Hit the button to start
            </button> : 
            <button className="startButton" onClick={() => {
                connect();
              }}>
                Press to connect BLE
              </button>
            }
            
        </div>
    </div>
  )
}

export { StartPage }