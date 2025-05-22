"use client"

import { collection, getDocs } from "firebase/firestore";
import db from "./firebaseConfig";

/**
 * @returns A Component showing previews of Prompt-Response entries, 
 *  including date created and the first part of the prompt.
 */
export default async function Overview() {
  const prCollection = collection(db, "goals");
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