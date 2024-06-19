import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import MainSpinner from "../components/MainSpinner";
import CreateTemplate from "./CreateTemplate";
import HomeContainer from "../container/HomeContainer";
import UserProfile from "./UserProfile";
import CreateResume from "./CreateResume";
import TemplateDesignPinDetail from "./TemplateDesignPinDetail";

function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/*header */}
      <Header />
      <main className="w-full">
        {/*custom routes */}
        <Suspense fallback={<MainSpinner />}>
          <Routes>
            <Route path="/" element={<HomeContainer />} />
            <Route path="/template/create" element={<CreateTemplate />}></Route>
            <Route path="/profile/:uid" element={<UserProfile />}></Route>
            <Route path="/resume/*" element={<CreateResume />}></Route>
            <Route
              path="/resumeDetail/:templateID"
              element={<TemplateDesignPinDetail />}
            ></Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default Home;
