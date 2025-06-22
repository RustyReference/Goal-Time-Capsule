"use client"

import {
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc, 
  QuerySnapshot,
  DocumentData,
  DocumentReference
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebaseConfig";
import { useAuth } from "../AuthContext";
import DisplayItem from "./DisplayItem";

// Define the type for a goal entry
export type GoalEntry = {
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
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({x: 0, y: 0});
  const [selectedEntry, setSelectedEntry] = useState<GoalEntry | null>(null);
  const [entries, setEntries] = useState<GoalEntry[]>([]);
  const user = useAuth();
  const router = useRouter();

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

  /**
   * Function to help pull up the context menu when DisplayItem 
   * is right-clicked
   * @param e The mouse event
   * @param entry the entry that was right-clicked
   */
  function handleRightClick(
    e: React.MouseEvent<HTMLDivElement>, 
    entry: GoalEntry) {
    e.preventDefault();
    setClicked(true);
    setPoints({ x: e.pageX, y: e.pageY });
    setSelectedEntry(entry);
  }

  /**
   * Shows the goal entry
   */
  function handleView() {
    if (selectedEntry) {
      router.push(`/display/${selectedEntry.id}`); // Continue
    }
    setClicked(false);
  }

  /**
   * Deletes an entry
   */
  async function handleDelete() {
    if (selectedEntry && user) {
      try {
        await deleteDoc(doc(db, "users", user.uid, "goals", selectedEntry.id));
        setEntries(entries.filter((entry) => entry.id !== selectedEntry.id));
      } catch (error) {
        console.error("Error deleting entry.");
      }
    }
  }

  // Handle clicking outside the context menu
  useEffect(() => {
    const handleClick = () => setClicked(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

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
        ? entries.map((entry) => (
            <DisplayItem 
              key={ entry.id }
              id={ entry.id }
              formattedDate={ entry.formattedDate }
              prompt={ entry.prompt }
              onContextMenu={ handleRightClick }
            />
          )) 
        : <div>No entries found </div>
      }
      {clicked && (
        <div 
          className="fixed bg-slate-600 border border-solid"
          style={{top: points.y, left: points.x}}
        >
          <button 
            className="w-full rounded-md hover:bg-gray-600"
            onClick={ handleView }
          >
            View
          </button>
          <button 
            className="w-full rounded-md hover:bg-gray-600"
            onClick={ handleDelete }
          >
            Delete
          </button>
        </div>
      )} 
    </div>
  );
}