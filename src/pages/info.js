import React from "react";
import { useRouter } from "next/router";

const Info = () => {
  const pages = [
    { name: "index", path: "/" },
    { name: "Chatbot", path: "/chatbot" },
    { name: "info", path: "/info" },
    { name: "login", path: "/login" },
    { name: "ocr", path: "/ocr" },
    { name: "signup", path: "/signup" },
    { name: "dashboard", path: "/dashboard" },
    { name: "activecomplaint", path: "/medicaldata/activecomplaint" },
    { name: "history", path: "/medicaldata/history" },
    { name: "reports", path: "/medicaldata/reports" },
    { name: "userinfo", path: "/userinfo" },
    { name: "modelgarden", path: "/modelgarden" },
    // Add more pages here, excluding those in the api folder
  ];

  const navigateTo = (path) => {
    window.open(path, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Navigate to Different Pages</h1>
      <div className="space-y-4">
        {pages.map((page) => (
          <button
            key={page.path}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            onClick={() => navigateTo(page.path)}
          >
            {page.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Info;
