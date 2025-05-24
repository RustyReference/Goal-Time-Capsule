"use client"

import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { useAuth, AuthProvider } from "./AuthContext";

function DefaultPage() {
  const user = useAuth();
  const router = useRouter();
  
  /** If the user is signed in, then bring the user to the chat page.
   *  Otherwise, redirec to the login page
   */
  function reroute() {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/chat");
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <button 
          className="bg-gray-500/50 w-1/3 text-center rounded-md"
          onClick={ reroute }
        >
          Take Your Next Step
        </button>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <DefaultPage />
    </AuthProvider>
  );
}