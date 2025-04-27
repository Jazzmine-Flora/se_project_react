import React from "react";
import { useState, useEffect } from "react";

const CurrentUserContext = React.createContext();

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      fetch("http://localhost:3001/users/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setCurrentUser(data))
        .catch((error) => console.error("Error fetching current user:", error));
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export { CurrentUserContext, CurrentUserProvider };
