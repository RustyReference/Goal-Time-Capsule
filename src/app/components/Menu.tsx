import React from "react";
import { useRouter } from "next/navigation";
import "./Menu.css";

export default function Menu() {
  const router = useRouter();

  return (
    <div className="menu">
      <label>Menu</label>
      <div className="menu_items">
        <button 
          className="menu_item"
          onClick={ () => router.push("/") }
        >
          Home
        </button>
        <button 
          className="menu_item"
          onClick={ () => router.push("/display") }
        >
          View Goals
        </button>
      </div>
    </div>
  );
} 