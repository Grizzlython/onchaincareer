import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { toast } from "react-toastify";

const checkLogin = ({ children }) => {
  const gContext = useContext(GlobalContext);

  useEffect(() => {
    if (!gContext.user) {
      toast.error("⚠️ Please sign in to proceed");
      gContext.toggleSignInModal();
    }
  });
  return { children };
};

export default checkLogin;
