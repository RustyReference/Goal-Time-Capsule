"use client"

import React, { useState, useEffect, createContext, useContext } from "react";
import Navbar from "../Navbar";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  getDoc 
} from "firebase/firestore";
import db from "../firebaseConfig";
import auth from "../firebaseConfig";

// Define the type for a goal entry
type GoalEntry = {
  id: string;
  prompt: string;
  response: string;
};

// The component for the main page of the website
export default function Chat() {
  const [formData, setFormData] = useState("");
  const [response, setResponse] = useState("");
  const [entries, setEntries] = useState<GoalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create collection for the database (Prompt-Response Collection)
  const prCollection = collection(db, "goals");

  // Function to fetch all entries (documents) from database
  // and create objects including their fields AND ids
  const fetchEntries = async () => {
    try {
      const querySnapshot = await getDocs(prCollection);
      const fetchedEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GoalEntry[];
      
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };
  
  // Load all entries + document ids into app's state in the first render
  useEffect(() => {
    fetchEntries();
  }, []); 
  
  // Continue?
  // Creates a goal entry and adds it to the database and app's state
  async function createGoal(response: string, prompt: string) {
    const newRef = await addDoc(prCollection, { prompt: formData, response });

    // Add entry to state
    setEntries([...entries, { id: newRef.id, prompt, response } as GoalEntry]);
  }
  
  // Delete a goal 
  async function deleteGoal(id: string) {
    const goalRef = doc(db, "goals", id);
    await deleteDoc(goalRef); 
  }
  
  // Continue?
  // View a goal
  async function readGoal() {
    
  }

  // Updates the state containing the user-entered prompt
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormData(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setResponse(""); // Clear previous response
    
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: formData }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      console.log(data.message); // Print output for testing
      setResponse(data.message);
      
      // Add response to database
      await createGoal(data.message, formData);
    } catch (err) {
      console.error("Error during fetch:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <section className="flex h-screen w-screen gap-10 p-10 items-center justify-center">
        <Navbar />
        <form 
          className="flex flex-col grow h-1/5 1/2 my-auto bg-gray-500/50 rounded-md" 
          onSubmit={ handleSubmit }
        >
          <textarea
            name="message"
            placeholder="Enter prompt here"
            className="h-full w-full bg-gray-500/50 rounded-md overflow-auto p-2"
            onChange={ handleChange }
            value={ formData }
            disabled={ isLoading }
          />
          <button type="submit" className="">Submit</button>
        </form>
      </section> 
    </div>
  );
}