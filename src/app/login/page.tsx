"use client"

import { useState } from "react";
import { getDoc, getDocs, setDoc, addDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";

type LogData = {
  email: string,
  username: string,
  password: string
}

type UserCredentials = {
  email: string, 
  username: string, 
  password: string
}

export default function Login() {
  const [login, setLogin] = useState(false);
  const [logForm, setLogForm] = useState<LogData>({
    email: "",
    username: "",
    password: ""
  });

  /** Continue
   * Add a docuement to the database of users
   * @param userCreds the user's credentials
   */
  async function signUp(userCreds: UserCredentials) {
    const { email, username, password } = userCreds;

    try {
      // Add a user document
      const userCreds = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCreds.user;
      
      // Add document with user information
      await setDoc(doc(db, "users", user.uid), {
        email,
        username,
        password
      });
      
      console.log("User created!");
    } catch (error) {
      console.error("Failed to sign up user: " + error);
    }
  }
  
  /**
   * Allows the user to sign in
   * @param userCreds 
   */
  async function signIn(userCreds: UserCredentials) {
    const { email, username, password } = userCreds;
    try {
      const signInCreds = await signInWithEmailAndPassword(auth, email, password)
      const user = signInCreds.user;
      
      console.log("Signed in as: " + user.email);
    } catch (error) {
      console.error("Failed to sign in: " + error);
    }
  }

  /**
   * Updates the state storing the form entries
   * @param e Event from the form containing the change
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLogForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));    
  }

  // Continue
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (login) {
      // login()
    } else {
      // signUp();
    }
  }

  return (
    <div className="h-screen w-screen flex">
      <form 
        className="flex flex-col gap-10 items-center justify-center bg-gray-800 h-1/2 w-1/3 m-auto rounded-md"
        onSubmit={ handleSubmit }
      >
        <label className="text-4xl">{login ? "Log In" : "Sign up"}</label>
        <div className="loginFields flex flex-col gap-5">
          <div className="emailField">
            <label htmlFor="email">Email</label>
            <input 
              className="flex flex-col bg-gray-500/50 mx-1 rounded-md" 
              id="email" 
              name="email" 
              type="text" 
              onChange={ handleChange }
            />
          </div>
          <div className="usernameField">
            <label htmlFor="username">Username</label>
            <input 
              className="flex flex-col bg-gray-500/50 mx-1 rounded-md" 
              id="username" 
              name="username" 
              type="text" 
              onChange={ handleChange }
            />
          </div>
          <div className="passwordField">
            <label htmlFor="password">Password</label>
            <input 
              className="flex flex-col bg-gray-500/50 mx-1 rounded-md" 
              id="password" 
              name="password" 
              type="password" 
              onChange={ handleChange }
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="bg-blue-700 p-2 rounded-md text-center hover:italic cursor-pointer"
        >
          Submit
        </button>
        <button className="hover:underline" onClick={ () => setLogin(!login) }>
          {!login ? "Log in instead" : "Sign up instead"}
        </button>
      </form>
    </div>
  );
}