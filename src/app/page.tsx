"use client"

import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";

export default function Home() {
  const user = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else if (user) {
      router.push("/chat");
    }
  }, [user, router]);

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <div className="bg-gray-500/50 w-1/3 text-center rounded-md p-4">
          Loading...
        </div>
      </div>
    </>
  );
}