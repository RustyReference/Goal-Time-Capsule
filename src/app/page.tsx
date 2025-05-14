"use client"

import React, { useState } from "react";
import Navbar from "./Navbar";
import db from "./firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";

export default function Home() {
  const [formData, setFormData] = useState("");
  const [response, setResponse] = useState("");
//  const []
  const [isLoading, setIsLoading] = useState(false);

  // Create collection for the database (Prompt-Response Collection)
  const prCollection = collection(db, "goals");
  
  async function createGoal(response: string) {
    await addDoc(prCollection, { prompt: formData, response });
  }
  
  // Delete a goal 
  async function deleteGoal(id: any) {
    const goalRef = doc(db, "goals", id);
    await deleteDoc(goalRef); 

    // Continue?
  }
  
  // View a goal
  async function readGoal() {
    
  }

  // Updates the state containing the user-entered prompt
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormData(e.target.value);
    console.log(formData);
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
      
    } catch (err) {
      console.error("Error during fetch:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <section className="flex h-screen w-screen gap-10 p-10 items-center justify-center">
        <form 
          className="flex flex-col grow h-1/5 1/2 my-auto bg-gray-500/50 rounded-md" 
          onSubmit={handleSubmit}
        >
          <textarea
            name="message"
            placeholder="Enter prompt here"
            className="h-full w-full bg-gray-500/50 rounded-md overflow-auto p-2"
            onChange={handleChange}
            value={formData}
            disabled={isLoading}
          />
          <button type="submit" className="">Submit</button>
        </form>
        <div className="h-1/5 p-2 my-auto grow bg-gray-500/50 rounded-md">
          This is a test
        </div>
      </section> 
    </div>
  );
}