import React from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/SADA-LOGO.png";
import anthos from '../assets/anthos.png'

import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = async (response) => {
    console.log(response, "hey");

    if (response.profileObj) {
      // Set user to local storage
      localStorage.setItem("user", JSON.stringify(response.profileObj));

      // Destructure properties from Google Response
      const { name, email, googleId, imageUrl } = response.profileObj;

      // Define User Document
      const doc = {
        _id: googleId,
        _type: "user",
        email: email,
        userName: name,
        image: imageUrl,
      };

      // Create user in DB if not exists
      const result = await client.createIfNotExists(doc);
      if (result) navigate("/", { replace: true });
    }

  };
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-3 bg-mainColor mb-2 rounded-lg ">
            <img src={anthos} width="400px" alt="logo" />
          </div>
          {/* <div className="p-3 bg-mainColor mb-2 ">
            <img src={logo} width="130px" alt="logo" />
          </div> */}
          <p className="text-white font-bold mb-2">Powered by Anthos and SADA</p>
          <div className="shadow-2xl">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
