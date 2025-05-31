"use client"

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";

/**
 * @returns A Component showing previews of Prompt-Response entries, 
 *  including date created and the first part of the prompt.
 */
export default async function Overview() {
  const user = useAuth();

  // Check if the user is logged in
  if (user === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-gray-500/50 w-1/3 text-center rounded-md p-4">
          Loading...
        </div>
      </div>
    );
  }
  
  const prCollection = collection(db, "users", user!.uid, "goals");
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