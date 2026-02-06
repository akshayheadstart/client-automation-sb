import React, { useState, createContext } from "react";

export const TopContext = createContext();

export const TopProvider = (props) => {
  const [showLogin, setShowLogin] = useState("login");

  const [loadingALlContent, setLoadingAllContent] = useState(true);

  const [counsellorProductivityDateRange, setCounsellorProductivityDateRange] =
    useState([]);

  const allContext = {
    showLogin,
    setShowLogin,
    loadingALlContent,
    setLoadingAllContent,
    counsellorProductivityDateRange,
    setCounsellorProductivityDateRange,
  };

  return (
    <TopContext.Provider value={allContext}>
      {props.children}
    </TopContext.Provider>
  );
};
