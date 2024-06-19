import React from "react";
import { Logo } from "../assets";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import useUser from "../hooks/useUser";
import MainSpinner from "../components/MainSpinner";
import Footer from "../components/Footer";
import AuthButtonWithProvider from "../components/AuthButtonWithProvider";

const Auth = () => {
  const { data, isLoading, isError } = useUser();
  if (isLoading) {
    return <MainSpinner />;
  }
  return (
    <div>
      <div className="auth-section">
        {/**Top Section */}
        <img src={Logo} alt="" className="w-12 h-auto object-contain" />
        {/**Main Section */}
        <div className="w-full flex flex-1 flex-col items-center justify-center gap-6">
          <h1 className="text-3xl text-blue-700 font-bold lg:text-4xl">
            Welcome ! To Awesome Resume
          </h1>
          <p className="text-base text-gray-600">Create Awesome Resume </p>
          <h2 className="text-2xl text-green-600">Authentication</h2>
          <div className="w-full lg:w-96 rounded-md p-2 flex justify-center items-center gap-6">
            <AuthButtonWithProvider
              Icon={FaGoogle}
              provider={"googleAuthProvider"}
            />
            <AuthButtonWithProvider
              Icon={FaGithub}
              provider={"GithubAuthProvider"}
            />
          </div>
        </div>

        {/**Footer Section */}
        <Footer />
      </div>
    </div>
  );
};

export default Auth;
