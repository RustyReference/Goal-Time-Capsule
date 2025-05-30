"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import {
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  getDoc 
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../AuthContext";

// Define the type for a goal entry
type GoalEntry = {
  id: string;
  prompt: string;
  response: string;
};

// Component for the chat area
export default function Chat() {
  // Router and authentication
  const router = useRouter();
  const user = useAuth();

  // State
  const [formData, setFormData] = useState("");
  const [response, setResponse] = useState("");
  const [entries, setEntries] = useState<GoalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Anticipate to redirect if not authenticated
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  // Load all entries + document ids into app's state in the first render
  useEffect(() => {
    if (prCollection) {
      fetchEntries();
    }
  }, []); 
  
  // Show loading state while checking auth; this will rerender
  if (user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-gray-500/50 w-1/3 text-center rounded-md p-4">
          Loading...
        </div>
      </div>
    );
  }
  
  // Check if the user has been checked already and is still not logged in
  if (user === null) {
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
   */
  const fetchEntries = async () => {
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
  
  // Creates a goal entry and adds it to the database and app's state
  async function createGoal(response: string, prompt: string) {
    const newRef = await addDoc(prCollection, { prompt: formData, response });

    // Add entry to state
    setEntries([...entries, { id: newRef.id, prompt, response } as GoalEntry]);
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