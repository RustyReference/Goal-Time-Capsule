"use client"

import React, { useState } from "react";
import Navbar from "./Navbar";
import db from "./firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";

export default function Home() {
  const [formData, setFormData] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setResponse(data.message);
    } catch (err) {
      console.error("Error during fetch:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <section className="flex h-screen w-screen items-center justify-center">
        <form 
          className="flex flex-col h-1/5 w-full mx-10 my-auto bg-gray-500/50 rounded-md" 
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
      </section> 
    </div>
  );
}