import { Toaster } from "@/components/ui/sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { set } from "date-fns";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [Authloading, setAuthLoading] = useState(true);
  const [signUpdata, setSignupData] = useState({});
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  const disconnectsocket = () => {
    if (socket && socket.connected) {
      socket.disconnect();
      console.log("Socket disconnected");
      setSocket(null);
    }
  };

  const login = async (formdata) => {
    await axiosInstance
      .post("auth/login", formdata)
      .then((res) => {
        console.log(res, "res");
        setUser(res.data.user);
        toast.success(res.data.message);
        setAuthLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAuthLoading(false);
        toast.error(err.response.data.message);
      });
  };

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("auth/checkAuth", {
        withCredentials: true,
      });
      setUser(res.data.user);
      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
      console.log(error);
      // toast.error(error.response?.data?.message);
    }
  };
  const logout = async () => {
    setAuthLoading(true);
    await axiosInstance
      .post("auth/logout")
      .then((res) => {
        console.log(res);
        checkAuth();
        setAuthLoading(false);
        disconnectsocket();
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setAuthLoading(false);
        toast.error(err.response.data.message);
      });
  };

  return (
    <GlobalContext.Provider
      value={{
        signUpdata,
        setSignupData,
        checkAuth,
        login,
        logout,
        user,
        Authloading,
        setAuthLoading,
        socket,
        setSocket,
        setOnlineUser,
        currentConversation,
        setCurrentConversation,
        selectedSubcategoryId,
        setSelectedSubcategoryId,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
