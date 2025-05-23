import { useContext } from "react";

export default function Login() {
  return (
    <div className="h-screen w-screen flex">
      <div className="flex flex-col gap-10 items-center justify-center bg-gray-800 h-1/2 w-1/3 m-auto rounded-md">
        <label className="text-4xl">Login</label>
        <div className="loginFields flex flex-col gap-5">
          <div className="usernameField">
            <label htmlFor="username">Username</label>
            <input 
              className="flex flex-col bg-gray-500/50 mx-1 rounded-md" 
              id="username" 
              name="username" 
              type="text" 
            />
          </div>
          <div className="passwordField">
            <label htmlFor="password">Password</label>
            <input 
              className="flex flex-col bg-gray-500/50 mx-1 rounded-md" 
              id="password" 
              name="password" 
              type="text" 
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-700 p-2 rounded-md text-center">Submit</button>
      </div>
    </div>
  );
}