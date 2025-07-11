"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ReactMarkdown from "react-markdown";

export default function ShowEntry() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useAuth();
  const params = useParams<{id: string}>();

  useEffect(() => {
    if (user && params.id) {
      fetchEntry();
    }
  }, [user, params.id]);
  
  /**
   * Fetch the entry by id, show the prompt, and show the response
   * 
   * Precondition: The user is signed in.
   */ 
  async function fetchEntry() {
    setLoading(true);
    const docSnap = await getDoc(
      doc(db, "users", user!.uid, "goals", params.id));
    
    if (docSnap === undefined) {
      console.error("Entry is undefined.");
    }
    
    const entry = docSnap.data();
      
    // Set the response
    if (entry === undefined) {
      setPrompt("Prompt for this entry is undefined.");
      setResponse("Response for this entry is undefined.");
      setFormattedDate("Entry is undefined.");
    } else {
      setPrompt(entry.prompt);
      setResponse(entry.response);    
      setFormattedDate(entry.formattedDate);
    }
    setLoading(false);
  }

  return (
    <div>
      {!loading ? (
        <div className="flex flex-col gap-1">
          <section className="Date border border-solid rounded-md p-4">
            {`Date: ${formattedDate}`}
          </section>
          <section className="Prompt border border-solid rounded-md p-4">
            {`Prompt: ${prompt}`}
          </section>
          <section className="Response border border-solid rounded-md p-4">
            <h2 className="text-xl font-semibold text-center">Response</h2>
            <ReactMarkdown>{response}</ReactMarkdown>
          </section>
          <button 
            className="m-4 border border-solid bg-green-400/50 hover:bg-green-300/50 p-1"
            onClick={() => router.push("/display")}
          >
            Back to Overview
          </button>
        </div>
      ) : (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          Loading...
        </div>
      )}
    </div>  
  );
}