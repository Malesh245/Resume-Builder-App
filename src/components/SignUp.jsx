import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthButtonWithProvider from "../components/AuthButtonWithProvider";

import { FaGoogle, FaGithub } from "react-icons/fa6";
import axios from "axios";
import { baseURL } from "../utils/constant";
import { toast } from "react-toastify";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      email,
      password,
    };

    axios
      .post(`${baseURL}/signup`, payload)
      .then((res) => {
        toast.success(
          <div>
            Account Created Successfully <br />
            Please Login
          </div>
        );
        navigate("/login");
      })
      .catch((err) => console.log(err));
    toast.error("Error creating account");
  };

  return (
    <div className="w-full grid grid-cols-[30%,1fr] gap-2">
      <div className="bg-slate-500 h-screen max-h-[76vh] grid place-items-center rounded-md">
        <div className="text-center w-full text-white space-y-8">
          <h1 className="text-3xl lg:text-4xl text-blue-700 ">Welcome Back!</h1>
          <div className="text-[#eeeeee] w-fit mx-auto">
            <p className="text-base text-gray-600 mb-3">
              To keep connected with us please
            </p>
            <p className="text-base text-gray-600 mb-5">
              please login with your personal info
            </p>
            <Link to="/login" className="flex items-center justify-center mt-7">
              <button className="uppercase px-4 py-2 mt8 rounded-full border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="h-screen max-h-[76vh] grid place-items-center rounded-md">
        <div className="text-center">
          <h1 className="txtPrimary font-bold text-4xl">Create Your Resume</h1>
          <div className="flex items-center gap-4 pt-8 w-fit mx-auto">
            <AuthButtonWithProvider
              Icon={FaGoogle}
              label={"Signin with Google"}
              provider={"GoogleAuthProvider"}
            />
            <AuthButtonWithProvider
              Icon={FaGithub}
              provider={"GoogleAuthProvider"}
            />
          </div>
          <p className="pt-8 text-[13px] text-gray-400 mb-4">
            Or use your email account for registration
          </p>
          <form
            className="flex w-[300px] mx-auto flex-col pt-2 gap-5"
            onSubmit={handleSubmit}
          >
            <input
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="input_style"
            />
            <input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input_style"
            />
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input_style"
            />
            <button className="px-1 py-1 rounded-full border-2 border-blue-700 flex items-center justify-center cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
