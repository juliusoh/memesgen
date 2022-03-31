import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
// import FilerobotImageEditor from "filerobot-image-editor";
import { client } from "../client";
import Spinner from "./Spinner";
// import list of categories [{ name: 'sports', image }]
import FilerobotImageEditor, { TABS, TOOLS } from "react-filerobot-image-editor";
import { categories } from "../utils/data";
import { canvasToBlob } from "blob-util";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [show, toggle] = useState(false);
  const [showCurrentImg, setShowCurrentImg] = useState(false);
  const [currentImg, setCurrentImg] = useState(null);
  const [noEditImage, setNoEditImage] = useState(null);
  const [editBtn, setEditBtn] = useState(false);
  const [dontShow, setDontShow] = useState(true);

  // const [tameem, setTameem] = useState({
  //   abc: "",
  //   def: "",
  // })
  // const {abc, def} = tameem;
  // setTameem({...tameem, title: 'hello'})

  const navigate = useNavigate();

  const [isImgEditorShown, setIsImgEditorShown] = useState(false);

  const closeImgEditor = () => {
    toggle(false);
  };

  const handleOnSave = async (imageObj) => {
    console.log(imageObj, "imageObj");
    setDontShow(false);
    toggle(false);
    setShowCurrentImg(true);
    setImageAsset(null);
    setLoading(true);
    const { mimeType, fullName, imageCanvas } = imageObj;
    const blob = await canvasToBlob(imageCanvas, mimeType);
    console.log(blob, "blob");
    try {
      const result = await client.assets.upload("image", blob, { contentType: mimeType, filename: fullName });
      setCurrentImg(result.url);
      setImageAsset(result);
      setLoading(false);
      console.log("sucess upload", result);
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
    closeImgEditor();
  };

  const uploadImage = async (e) => {
    console.log(e.target.files, "HEHEH");
    const { type, name } = e.target.files[0];
    setEditBtn(true);
    setShowCurrentImg(true);
    if (type === "image/png" || type === "image/svg" || type === "image/jpeg" || type === "image/gif" || type === "image/tiff") {
      setNoEditImage(e.target.files[0]);
      setWrongImageType(false);
      setLoading(true);
      try {
        const tempImage = URL.createObjectURL(e.target.files[0]);
        console.log(tempImage, "hahaha");
        setCurrentImg(tempImage);
        setImageAsset(tempImage);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setWrongImageType(true);
    }
  };

  const noEditUpload = async () => {
    console.log("imageAsset", imageAsset);
    await client.assets
      .upload("image", noEditImage, { contentType: noEditImage.type, fileName: noEditImage.name })
      .then((document) => {
        setNoEditImage(document);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const saveMeme = async () => {
    console.log(imageAsset?._id, "imageAsset");
    if (title && about && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        // destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      try {
        await client.create(doc);
        await navigate("/");
      } catch (error) {
        console.log("error");
      }
    } else {
      setFields(true);
      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">Please fill in all the fields.</p>}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white xl:p-5 p-3 xl:w-4/5 w-full">
        <div className="p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col  p-3 w-full h-420">
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
                  <p className="mt-32 text-gray-400">Use High-Quality JPG, SVG, PNG, GIF less than 20 MB</p>
                </div>
                <input type="file" name="upload-image" onChange={(e) => uploadImage(e)} className="w-0 h-0" />
              </label>
            ) : (
              imageAsset &&
              showCurrentImg && (
                <div className="relative h-full">
                  <img src={currentImg} alt="uploaded-pic" className="w-full h-full" />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
        {/* <FilerobotImageEditor
          show={show}
          onSave={(editedImageObject, designState) => console.log('saved', editedImageObject, designState)}
          src={imageAsset}
          onClose={() => {
            toggle(false);
          }}
          config={config}
          onComplete={(props) => { setImageAsset(props) }}
          onBeforeComplete={(props) => { console.log(props); return false; }}
        /> */}
        <div>
          {/* <button onClick={openImgEditor}>Open Filerobot image editor</button> */}
          {show && (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <FilerobotImageEditor
                source={imageAsset}
                onSave={(editedImageObject, designState) => {
                  handleOnSave(editedImageObject);
                }}
                onClose={closeImgEditor}
                closeAfterSave={true}
                annotationsCommon={{
                  fill: "#ff0000",
                }}
                Text={{ text: "Filerobot..." }}
                Crop={{
                  presetsItems: [],
                  presetsFolders: [],
                }}
                tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]} // or {['Adjust', 'Annotate', 'Watermark']}
                defaultTabId={TABS.ANNOTATE} // or 'Annotate'
                defaultToolId={TOOLS.TEXT} // or 'Text'
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center mt-5">
        {editBtn &&
          !show && dontShow &&(
            <>
              <button
                onClick={() => {
                  toggle(true);
                  setShowCurrentImg(false);
                }}
                className="bg-blue-500 text-white font-bold p-2 rounded-full w-28 outline-none mr-5"
              >
                Edit Image
              </button>
              <button onClick={noEditUpload} className="bg-green-500 text-white font-bold p-2 rounded-full w-28 outline-none">
                Save Image
              </button>
            </>
          )}
      </div>
      <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add your title"
          className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
        />
        {user && (
          <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
            <img src={user.image} className="w-10 h-10 rounded-full" alt="user-profile" />
            <p className="font-bold">{user.userName}</p>
          </div>
        )}
        <input
          type="text"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="What is your meme about?"
          className="outline-none text-base sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
        />
        <div className="flex flex-col">
          <div>
            <p className="mb-2 font-semibold text-lg sm:text-xl">Choose Meme Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
            >
              <option value="other" className="bg-white">
                Select Category
              </option>
              {categories.map((category) => (
                <option className="text-base border-0 outline-none capitalize bg-white text-black" value={category.name} key={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end items-end mt-5">
            <button onClick={saveMeme} className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none">
              Save Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
