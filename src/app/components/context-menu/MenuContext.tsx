import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { ContextItems } from "./MenuItem";

// Options in the right-click menu
const data = [
  {
    id: 1,
    title: "Delete"
  },
  {
    id: 2,
    title: "View"
  }
];

function MenuContext({ data }) {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({x: 0, y: 0});
  
  useEffect(() => {
    const handleClick = () => setClicked(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  });

  return (
    <div>
      {data.map((item) => {
        <div 
          onContextMenu={(e) => {
            e.preventDefault();
            setClicked(true);
            setPoints({ x: e.pageX, y: e.pageY });
            console.log("right click", e.pageX, e.pageY);
          }}
          >
          <MenuItem key={ item.id } title={ item.title }/>
        </div>
      })}
      {clicked && (
        
      )}
    </div>
  );
}