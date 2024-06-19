// src/containers/App.js
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Auth from "./pages/Auth";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading</div>}>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" theme="dark" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
