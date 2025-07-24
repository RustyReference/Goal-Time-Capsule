import React from "react";
import { GoalEntry } from "./overview";
import { Timestamp } from "firebase/firestore";

type DisplayItemProps = {
  id: string, 
  formattedDate: Timestamp, 
  schDate: Date,
  prompt: string
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void
}

export default function DisplayItem({
  id,
  formattedDate,
  schDate,
  prompt,
  onContextMenu
}: DisplayItemProps) {
  function getMonthWord(mthNum: number): string {
    switch (mthNum) {
      case 0: 
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11: 
        return "December";
      default:
        return "MONTH_ERROR"
    }
  }

  function getDateString(date: Timestamp | undefined): string {
    if (date == undefined) {
      return "N/A";
    }

    console.log(date, typeof date);
    
    const dd = date.toDate().getDate();
    const mm = getMonthWord(date.toDate().getMonth());
    const yyyy = String(date.toDate().getFullYear());
    const formattedDate = `${dd} ${mm} ${yyyy}`;
    
    return formattedDate;
  }
  // TODO: Line 74: label the dates, scheduled or date submitted?
  return (
    <div 
      className={`flex w-4/5 rounded-md bg-green-300/50 px-2`} 
      key={`${ id }`}
      onContextMenu={onContextMenu}
    >
      <input type="checkbox" id={`item-${id}`} className="mr-2 cursor-pointer"/>
      <label 
        className="w-1/6 text-white text-left cursor-pointer"
        htmlFor={`item-${id}`}
      >
        {getDateString(formattedDate)} 
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