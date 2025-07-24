"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { db } from "../../firebaseConfig";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { fdatasync } from "fs";

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
      
    // Set the information
    if (entry === undefined) {
      setPrompt("Prompt for this entry is undefined.");
      setResponse("Response for this entry is undefined.");
      setFormattedDate("Entry is undefined.");
    } else {
      setPrompt(entry.prompt);
      setResponse(entry.response);    
      let timeStampString = getDateString(entry.formattedDate as Timestamp);
      setFormattedDate(timeStampString);
    }
    setLoading(false);
  }

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

  function getDateString(date: Timestamp | undefined): string {
    if (date == undefined) {
      return "N/A";
    }

    console.log(date, typeof date);
    
    const dd = date.toDate().getDate();
    const mm = getMonthWord(date.toDate().getMonth());
    const yyyy = String(date.toDate().getFullYear());
    const formattedDate = `${dd} ${mm} ${yyyy}`;
    
    return formattedDate;
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