import { useRouter } from "next/navigation";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const user = useAuth();
  const router = useRouter();
  
  /**
   * Handling when the user clicks "Log in" on the Navbar
   */
  function handleLogin() {
    // Redirect to login page if not signed in
    if (!user) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }

  /**
   * Handling when the user clicks "Sign out" on the Navbar
   */
  async function handleSignOut() {
    await signOut(auth);
    router.push("/");
    console.log("User signed out successfully");
  }

  return (
    <div className="fixed top-0 w-full">
      <div className="flex items-center justify-between mx-10 py-5">
        <a 
          className="text-4xl mr-0 cursor-pointer"
        >
          The Goal Time Capsule
        </a>
        <ul className="hidden md:flex justify-evenly space-x-20">
          <li>
            <button 
              className="hover:italic cursor-pointer"
              onClick={ handleLogin }
            >
              Login
            </button>
          </li>
          <li>
            <button 
              className="hover:italic cursor-pointer"
              onClick={ handleSignOut }
            >
              Sign Out
            </button>
          </li>
          <li>
            <button 
              className="hover:italic cursor-pointer"
            >
              Menu
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}