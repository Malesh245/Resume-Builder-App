import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { AnimatePresence } from "framer-motion";
import useTemplates from "../hooks/useTemplates";
import TemplateDesignPin from "../components/TemplateDesignPin";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";
import MainSpinner from "../components/MainSpinner";

function UserProfile() {
  const { data: user } = useUser();

  const [activeTab, setActiveTab] = useState("collections");

  const { data: templates, isLoading: temp_isLoading } = useTemplates();

  const { data: savedResumes } = useQuery(["savedResumes"], () =>
    getSavedResumes(user?.uid)
  );

  if (temp_isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full flex flex-col justify-start items-center py-12">
      <div className="w-full h-72 bg-blue-50">
        <img
          src="https://images.pexels.com/photos/919734/pexels-photo-919734.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="flex flex-col items-center justify-center gap-4">
          {user?.photoURLs ? (
            <React.Fragment>
              <img
                src={user?.photoURL}
                className="w-24 h-24 object-cover rounded-full border-2 border-white -mt-12 shadow-md"
                referrerPolicy="no-referrer"
                alt=""
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <img
                src="https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg?auto=compress&cs=tinysrgb&w=600"
                className="w-24 h-24 object-cover rounded-full border-2 border-white -mt-12 shadow-md"
                referrerPolicy="no-referrer"
                alt=""
              />
            </React.Fragment>
          )}
          <p className="text-2xl text-txtDark">{user?.displayName}</p>
        </div>
        {/**tabs */}
        <div className="flex items-center justify-center mt-12">
          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setActiveTab("collections")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white shadow-md text-blue-600"
              }`}
            >
              Collections
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setActiveTab("resumes")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "resumes" && "bg-white shadow-md text-blue-600"
              }`}
            >
              My Resumes
            </p>
          </div>
        </div>
        {/**tab content */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <React.Fragment>
                {user?.collections?.length > 0 && user?.collections ? (
                  <RenderATemplate
                    templates={templates?.filter((temp) =>
                      user?.collections?.includes(temp?._id)
                    )}
                  />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      alt=""
                      className="w-32 h-auto object-contain"
                    />
                    <p>No data</p>
                  </div>
                )}
              </React.Fragment>
            )}
            {activeTab === "resumes" && (
              <React.Fragment>
                {savedResumes?.length > 0 && savedResumes ? (
                  <RenderATemplate templates={savedResumes} />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      alt=""
                      className="w-32 h-auto object-contain"
                    />
                    <p>No data</p>
                  </div>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
const RenderATemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesignPin
                  key={template?._id}
                  data={template}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default UserProfile;
