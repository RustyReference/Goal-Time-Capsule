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

// Component for the chat area
export default function Chat() {
  // Router and authentication
  const router = useRouter();
  const user = useAuth();

  // State
  const [formData, setFormData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
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
    function getMonthWord(mthNum: number): string {
      switch (mthNum) {
        case 0: 
          return "January";
        case 1:
          return "February";
        case 2:
          return "March";
        case 3:
          return "April";
        case 4:
          return "May";
        case 5:
          return "June";
        case 6:
          return "July";
        case 7:
          return "August";
        case 8:
          return "September";
        case 9:
          return "October";
        case 10:
          return "November";
        case 11: 
          return "December";
        default:
          return "MONTH_ERROR"
      }
    }

    // Get day, month, and year from current date and time
    const fullCurrDate = new Date();
    const dd = fullCurrDate.getDate();
    const mm = getMonthWord(fullCurrDate.getMonth());
    const yyyy = String(fullCurrDate.getFullYear());
    const formattedDate = `${dd} ${mm} ${yyyy}`;

    const newRef = await addDoc(prCollection, { prompt, response, formattedDate });
  }

  // Updates the state containing the user-entered prompt
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormData(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      <section className="flex h-screen w-screen gap-10 p-10 items-center justify-center">
        <Navbar />
        <form 
          className="flex flex-col grow h-1/5 1/2 my-auto bg-gray-500/50 rounded-md" 
          onSubmit={ handleSubmit }
        >
          <textarea
            id="prompt"
            name="message"
            placeholder="Enter prompt here"
            className="h-full w-full bg-gray-500/50 rounded-md overflow-auto p-2"
            onChange={ handleChange }
            value={ formData }
            disabled={ isLoading }
          />
          <button type="submit" className="border border-transparent rounded-md hover:border-white hover:border-1">Submit</button>
        </form>
      </section> 
    </div>
  );
}