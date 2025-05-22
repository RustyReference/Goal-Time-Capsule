"use client"

import { useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { useAuth } from "./AuthContext";

export default function Home() {
  const router = useRouter();
  const user = useAuth();

  function reroute() {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/chat");
    }
  }

  return (
    <div className="">
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <button 
          className="bg-gray-500/50 w-1/3 text-center rounded-md"
          onClick={ reroute }
        >
          Take Your Next Step
        </button>
      </div>
    </div>
  );
}