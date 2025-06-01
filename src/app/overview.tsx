"use client"

import {
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc 
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";

// Define the type for a goal entry
type GoalEntry = {
  id: string;
  prompt: string;
  response: string;
};

/**
 * @returns A Component showing previews of Prompt-Response entries, 
 *    including date created and the first part of the prompt.
 */
export default async function Overview() {
  const user = useAuth();

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
  
  /**
   * Fetches all goal entry documents from a particular user,
   * pairs the fields with the document's id, and stores
   * them in the state of the component.
  async function fetchEntries() {
    try {
      const querySnapshot = await getDocs(prCollection);
      const fetchedEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GoalEntry[];
      
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries: ", error);
    }
  };
  
  // Load all entries + document ids into app's state in the first render
  useEffect(() => {
    if (prCollection) {
      fetchEntries();
    }
  }, []); 
  */
  
  let entries = (await getDocs(prCollection)).docs;
  return (
    <div>
      {entries.map((entry) => {
        return (
          <div className={`bg-green-300 opacity-50`}>
            {entry.data().prompt}
          </div>
        );
      })};
    </div>
  );
}