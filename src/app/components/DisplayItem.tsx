import React from "react";
import { GoalEntry } from "./overview";

type DisplayItemProps = {
  id: string, 
  formattedDate: string, 
  prompt: string
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void
}

export default function DisplayItem({
  id,
  formattedDate,
  prompt,
  onContextMenu
}: DisplayItemProps) {
  return (
    <div 
      className={`flex w-4/5 rounded-md bg-green-300/50 px-2`} 
      key={`${ id }`}
      onContextMenu={ onContextMenu }
    >
      <input type="checkbox" id={`item-${id}`} className="mr-2 cursor-pointer"/>
      <label 
        className="w-1/6 text-white text-left cursor-pointer"
        htmlFor={`item-${id}`}
      >
        { formattedDate }
      </label>
      <label 
        className="w-5/6 text-white text-left cursor-pointer" 
        htmlFor={`item-${id}`}
      >
        { prompt }
      </label>
    </div>
  );
}