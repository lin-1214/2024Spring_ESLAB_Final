import React from "react";
import { useData } from "../hooks/useData";
import '../styles/lifeBar.css'
import { grey } from "@mui/material/colors";

function LifeBar() {
  const { life } = useData();

  return (
    
    <>
        <div className="LifeBarWrapper">
            <div className="LifeBarImg"></div>
            {
                life >= 3? 
                <>
                    <div className="LifeBar1"></div>
                    <div className="LifeBar2"></div>
                    <div className="LifeBar3"></div>
                </>
                :
                life >= 2? 
                <>
                    <div className="LifeBar1"></div>
                    <div className="LifeBar2"></div>
                    <div className="LifeBar3" style={{backgroundColor: "grey"}}></div>
                </>
                :
                life >= 1? 
                <>
                    <div className="LifeBar1"></div>
                    <div className="LifeBar2" style={{backgroundColor: "grey"}}></div>
                    <div className="LifeBar3" style={{backgroundColor: "grey"}}></div>
                </>
                :
                <>
                    <div className="LifeBar1" style={{backgroundColor: "grey"}}></div>
                    <div className="LifeBar2" style={{backgroundColor: "grey"}}></div>
                    <div className="LifeBar3" style={{backgroundColor: "grey"}}></div>
                </>
            }
        </div>
    </>
    
  )
}

export {LifeBar}