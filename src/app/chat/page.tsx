"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { 
  collection, 
  addDoc, 
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../AuthContext";
import DateSelector from "../components/DateSelector";

// Component for the chat area
export default function Chat() {
  // Router and authentication
  const router = useRouter();
  const user = useAuth();

  // State
  const [formData, setFormData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [schRelDate, setDate]     // Scheduled release date
    = useState<Date | undefined>();
  
  // Anticipate to redirect if not authenticated
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);
  
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
  
  // Creates a goal entry and adds it to the database and app's state
  async function createGoal(response: string, prompt: string) {
    const formattedDate = new Date();
    const releaseDate = schRelDate;

    // NOTE: the dates will be formatted when the goals are displayed in the 
    // overview.
    const newRef = await addDoc(prCollection, { 
      prompt, 
      response, 
      formattedDate, 
      releaseDate
    });
  }

  // Updates the state containing the user-entered prompt
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormData(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (schRelDate === undefined) {
      console.log("Must select date.");
      return;
    }

    if (schRelDate < new Date()) {
      console.log("Date must be after today.");
      return;
    }

    const currFormData = formData;
    setFormData("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currFormData }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      // Add response to database
      const data = await res.json();
      await createGoal(data.message, currFormData);
    } catch (err) {
      console.error("Error during fetch:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <section className="flex h-screen w-screen p-10 items-center justify-center">
        <Navbar />
        <form 
          className="flex flex-col gap-5 grow h-auto w-1/2 my-auto" 
          onSubmit={handleSubmit}
        >
          <DateSelector selected={schRelDate} setSelected={setDate} />
          <textarea
            id="prompt"
            name="message"
            placeholder="Enter prompt here"
            className="w-full bg-gray-500/50 rounded-md overflow-auto p-2"
            onChange={handleChange}
            value={formData}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={`
              border border-transparent rounded-md 
              bg-slate-500 hover:border-white hover:border-1
            `}
          >
            Submit
          </button>
        </form>
      </section> 
    </div>
  );
}