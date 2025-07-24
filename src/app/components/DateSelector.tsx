import React, { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

type Props = {
  selected: Date | undefined,
  setSelected: React.Dispatch<React.SetStateAction<Date | undefined>>
};

export default function DateSelector(props: Props) {
  const defaultClassNames = getDefaultClassNames();
  return ( 
    <div className="flex justify-center">
      <DayPicker 
        animate
        mode="single"
        selected={props.selected}
        onSelect={props.setSelected}
        classNames={{
          today: `text-green-500`, // Add a border to today's date
          day: `border border-solid p-3`,
          weekday: `border border-solid p-0`, // Add some padding to each day
          selected: `bg-amber-500 border-blue-500 text-white`, // Highlight the selected day
          root: `${defaultClassNames.root} shadow-lg p-5`, // Add a shadow to the root element
          chevron: `${defaultClassNames.chevron} fill-blue-400` // Change the color of the chevron
        }}
        footer={
          props.selected ? `Selected: ${props.selected.toLocaleDateString()}` : "Pick a day."
        }
      />
    </div>
  );
}