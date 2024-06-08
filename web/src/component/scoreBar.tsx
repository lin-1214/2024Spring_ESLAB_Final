import React, {useEffect} from "react";
import { useData } from "../hooks/useData";
import '../styles/scoreBar.css'

function ScoreBar() {
  const { score, setScore } = useData();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setScore(score+1)
//     }, 50)

//     return () => {
//       clearInterval(interval)
//     }
//   })

  return (
    <div className="scoreBarWrapper">
      <div className="scoreBarTitle">Score: {score}</div>
    </div>
  )
}

export {ScoreBar}