import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FilerobotImageEditor from 'filerobot-image-editor';
import { client } from "../client";
import Spinner from "./Spinner";
// import list of categories [{ name: 'sports', image }]
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [show, toggle] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in"></p>}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p- lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong Image Type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to Upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Recommendation: Use High-Quality JPG, SVG, PNG, GIF or TIFF less than 20 MB
                  </p>
                </div>
              </label>
            ) : (
              <p>Something Else</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
