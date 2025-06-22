import React from "react";
import { useParams } from "next/navigation";
import { db } from "../../firebaseConfig";
import { getDoc } from "firebase/firestore";

function ShowEntry() {
  const params = useParams<{entryId: string}>();
  
  // Fetch the entry by id
  function fetchEntries() {
    const docSnap = getDoc(doc(db, "users", "goals"))
  }

  return (
    <div>

    </div>  
  );
}