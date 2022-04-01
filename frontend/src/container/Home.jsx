import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Sidebar from "../components/SideBar";
import UserProfile from "../components/UserProfile";
import { client } from "../client";
// import logo from "../assets/SADA-LOGO.png";
import logo from "../assets/anthos.png";
import Pins from "./Pins";
import { userQuery } from "../utils/data";
import { fetchUser } from "../utils/fetchUser";

const Home = () => {
  const [toggleSideBar, setToggleSideBar] = useState(true);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const userInfo = fetchUser()
  useEffect(() => {
    async function fetchData() {
      try {
        if (!userInfo) navigate("/login", {replace: true})
        console.log(user, "user");
        const query = userQuery(userInfo.googleId);
        const result = await client.fetch(query);
        setUser(result[0])

      } catch (error) {
        console.log("error", error)
      }
    }
    fetchData();
  }, []);





  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    // md: for medium devices
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => {
              setToggleSideBar(true);
            }}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image || ""} alt="" className="w-14 rounded-md" />
          </Link>
        </div>
        {toggleSideBar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSideBar(false)}
              />
            </div>
            <Sidebar user={user} closeToggle={setToggleSideBar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
