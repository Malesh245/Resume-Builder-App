import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthButtonWithProvider from "../components/AuthButtonWithProvider";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { baseURL } from "../utils/constant";
import { toast } from "react-toastify";
import axios from "axios";
import { setAuthentication } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    axios
      .post(`${baseURL}/login`, payload)
      .then((res) => {
        setAuthentication(res.data.token);
        toast.success("Login Successfully");
        navigate("/");
      })
      .catch((err) => console.log(err));
    toast.error("Error login to account");
  };

  return (
    <div className="w-full grid grid-cols-[1fr_30%] gap-2">
      <div className="h-screen max-h-[76vh] grid place-items-center rounded-md">
        <div className="text-center">
          <h1 className="text-blue-400 font-bold text-4xl">
            Welcome Back! To your Account
          </h1>

          <div className="flex items-center gap-4 pt-8 w-fit mx-auto">
            <AuthButtonWithProvider
              Icon={FaGoogle}
              provider={"GoogleAuthProvider"}
            />
            <AuthButtonWithProvider
              Icon={FaGithub}
              provider={"GithubAuthProvider"}
            />
          </div>
          <p className="pt-8 text-[13px] text-gray-400 mb-4">
            Or use your email account for login
          </p>
          <form
            className="flex w-[300px] mx-auto flex-col pt-2 gap-5"
            onSubmit={handleSubmit}
          >
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
            <p>Forgot your password?</p>
            <button className="px-1 py-1 rounded-full border-2 border-blue-700 flex items-center justify-center cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md">
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="bg-slate-500 h-screen max-h-[76vh] grid place-items-center rounded-md">
        <div className="text-center w-full text-white space-y-8">
          <h1 className="text-3xl lg:text-4xl text-blue-700">
            Create Your Resume
          </h1>
          <div className="text-[#eeeeee] w-fit mx-auto">
            <p className="text-base text-gray-600 mb-3">
              To keep connected with us
            </p>
            <p className="text-base text-gray-600 mb-5">
              please sign up with your personal info
            </p>
            <Link
              to="/signup"
              className="flex items-center justify-center mt-7"
            >
              <button className="uppercase px-4 py-2 mt-8 rounded-full border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 duration-150 hover:shadow-md">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
