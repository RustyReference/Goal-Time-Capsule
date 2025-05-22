import db from "../firebaseConfig";
import { collection } from "firebase/firestore";

/**
 * Displays a particular entry from the database, if the entry is selected.
 * @returns A component that displays a prompt and its corresponding response
 */
function Display() {
  // Get collection from database
  const prCollection = collection(db, "goals");

  return (
    <div>
      
    </div>
  );
}