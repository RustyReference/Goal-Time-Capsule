"use client"

import {
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc, 
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the type for a goal entry
type GoalEntry = {
  id: string;
  prompt: string;
  response: string;
  formattedDate: string;
};

/**
 * @returns A Component showing previews of Prompt-Response entries, 
 *    including date created and the first part of the prompt.
 */
export default function Overview() {
  const user = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<GoalEntry[]>([]);

  // Check if user is checked, but is not logged in
  if (user === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-gray-500/50 w-1/3 text-center rounded-md p-4">
          Redirecting to Login Page...
        </div>
      </div>
    );
  }
  
  // Check if the user is logged in
  if (user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-gray-500/50 w-1/3 text-center rounded-md p-4">
          Loading...
        </div>
      </div>
    );
  }
  
  // Create collection for the database (Prompt-Response Collection)
  const prCollection = collection(db, "users", user!.uid, "goals");

  // Fetch entries from database
  async function fetchEntries() {
    const data = await getDocs(prCollection);
    const newData =  data.docs.map((entry) => ({
      ...entry.data(),
      id: entry.id
    } as GoalEntry));

    setEntries(newData);
  }

  // If the user is not signed in, redirect them 
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }

    fetchEntries(); // Update the entries if user was previously signed out
  }, [user]);
  
  return (
    <div className="mt-[calc(100vh/6)] flex flex-col items-center gap-1">
      {entries.length > 0 
        ? entries.map((entry) => {
          return (
            <div 
              className={`w-4/5 rounded-md bg-green-300/50 px-2`} 
              key={`${entry.id}`}
            >
              <span className="text-white text-left">
                {entry.formattedDate}
              </span>
              <span className="text-white text-right">
                {entry.prompt}
              </span>
            </div>
            );
          }) 
        : <div>No entries found </div>
      }
    </div>
  );
}