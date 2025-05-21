import React, { useEffect, useState } from "react";
import Header from "./Header";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <div className="pt-0 pb-4 w-full">
        <button
          onClick={toggleTheme}
          className="m-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Trocar Tema
        </button>
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
