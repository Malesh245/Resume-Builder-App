import React from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../config/firebase.config";

function AuthButtonWithProvider({ Icon, provider }) {
  const googleAuthProvider = new GoogleAuthProvider();
  const gitAuthProvider = new GithubAuthProvider();

  const handleClick = async () => {
    switch (provider) {
      case "GoogleAuthProvider":
        await signInWithRedirect(auth, googleAuthProvider)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(`Error : ${err.message}`);
          });
        break;

      case "GithubAuthProvider":
        await signInWithRedirect(auth, gitAuthProvider)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(`Error : ${err.message}`);
          });
        break;

      default:
        await signInWithRedirect(auth, googleAuthProvider)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(`Error : ${err.message}`);
          });
        break;
    }
  };
  return (
    <div
      onClick={handleClick}
      className="px-4 py-4 rounded-full border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md"
    >
      <Icon className="text-txtPrimary text-xl group-hover:text-white" />
    </div>
  );
}

export default AuthButtonWithProvider;
