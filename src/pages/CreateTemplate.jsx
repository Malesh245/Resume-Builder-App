import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { FaTrash, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../config/firebase.config";
import { adminId, initialTags } from "../utils/helper";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import useTemplates from "../hooks/useTemplates";
import useUser from "../hooks/useUser";

function CreateTemplate() {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    url: null,
    progress: 0,
  });
  const [selectedTags, setSelectedTags] = useState([]);

  const {
    data: templates,
    isLoading: templatesIsLoading,
    refetch: templatesRefetch,
  } = useTemplates();

  const { data: user } = useUser();

  const navigate = useNavigate();

  //handling the input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }));
  };
  //handling the image file change
  const handleFileSelect = async (e) => {
    setImageAsset((preAsset) => ({ ...preAsset, isImageLoading: true }));
    const file = e.target.files[0];
    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAsset((preAsset) => ({
            ...preAsset,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error(`Error : ${error.message}`);
          } else {
            toast.error(`Error : Authorization Revoked`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAsset((preAsset) => ({ ...preAsset, url: downloadURL }));
          });
          toast.success("Image uploaded");
          setInterval(() => {
            setImageAsset((preAsset) => ({
              ...preAsset,
              isImageLoading: false,
            }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invalid File Format");
    }
  };
  //action to delete an image  from the cloud
  const deleteAnImageObject = async () => {
    setInterval(() => {
      setImageAsset((preAsset) => ({
        ...preAsset,
        progress: 0,
        url: null,
        isImageLoading: false,
      }));
    }, 2000);
    setImageAsset((preAsset) => ({ ...preAsset, isImageLoading: true }));
    const deleteRef = ref(storage, imageAsset.url);
    await deleteObject(deleteRef).then(() => {
      toast.success("Image removed");
    });
  };
  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  // hamdle to the Tags
  const handleSelectedTags = (tag) => {
    //check if the tag is selected or not
    if (selectedTags.includes(tag)) {
      //if selected then remove
      setSelectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  // sending tags  to the cloud
  const pushToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.url,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Template${templates.length + 1}`
          : "Template1",
      timestamp: timestamp,
    };
    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prevData) => ({
          ...prevData,
          title: "",
          imageURL: "",
        }));
        setImageAsset((prevAsset) => ({ ...prevAsset, url: null }));
        setSelectedTags([]);
        templatesRefetch();
        toast.success("Template added successfully");
      })
      .catch((error) => {
        toast.error(`Error : ${error.message}`);
      });
  };

  //function to remove data from the cloud
  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template?.imageURL);
    await deleteObject(deleteRef).then(async () => {
      await deleteDoc(doc(db, "templates", template?._id))
        .then(() => {
          toast.success("Templates removed");
          templatesRefetch();
        })
        .catch((err) => {
          toast.err(`Error : ${err.message}`);
        });
    });
  };

  useEffect(() => {
    if (!adminId.includes(user?.uid)) {
      navigate("/", { replace: true });
    }
  }, [user]);

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/**left container */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3  w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>
        {/**template ID section */}
        <div className="w-full flex items-center justify-end">
          <p className="text-base text-txtLight uppercase font-semibold">
            TempID:{" "}
          </p>
          <p className="text-base text-txtDark capitalize font-bold">
            {templates && templates.length > 0
              ? `Template${templates.length + 1}`
              : "Template1"}
          </p>
        </div>
        {/**template title section */}
        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"
          type="text"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
        />
        {/**file uploader section */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center ">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div>
                <PuffLoader color="#498FCD" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.url ? (
                <React.Fragment>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-txtLight">Click to upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset?.url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/**delete action  */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      onClick={deleteAnImageObject}
                    >
                      <FaTrash
                        className="text-m
                      sm text-white"
                      />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
        {/**tags */}
        <div className="w-full flex items-center flex-wrap gap-2 ">
          {initialTags.map((tag, i) => (
            <div
              key={i}
              className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleSelectedTags(tag)}
            >
              <p className="text-xs">{tag}</p>
            </div>
          ))}
        </div>
        {/**button action */}
        <button
          className="w-full bg-blue-700 text-white rounded-md py-3"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>
      {/**right container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4">
        {templatesIsLoading ? (
          <React.Fragment>
            <div className="w-full h-full flex items-center justify-center">
              <PuffLoader color="#498FCD" size={40} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                  {templates?.map((template) => (
                    <div
                      key={template._id}
                      className="w-full h-[500px] rounded-md overflow-hidden relative "
                    >
                      <img
                        src={template?.imageURL}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {/**delete action  */}
                      <div
                        className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={() => removeTemplate(template)}
                      >
                        <FaTrash
                          className="text-m
                      sm text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
                  <PuffLoader color="#498FCD" size={40} />
                  <p className=" text-xl tracking-wider capitalize text-txtPrimary">
                    No Data
                  </p>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default CreateTemplate;
