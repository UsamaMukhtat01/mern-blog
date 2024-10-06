import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { TextInput, Button, Alert, Modal } from "flowbite-react";
import { useRef } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { updateFailure, updateStart, updateSuccess, deleteUserFailure, signOutSuccess, deleteUserSuccess } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {Link} from 'react-router-dom'

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Initialize formData with currentUser values
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
      });
      setImageFileUrl(currentUser.profilePicture); // Set initial profile picture
    }
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read;
    //         allow write: if
    //         request.resource.size < 2 * 1024 *1024 &&
    //         request.resource.contentType.matches('image/.*')
    //       }
    //     }
    //   }
    setImageFileUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadError(null);
        setImageFile(null);
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData, profilePicture: downloadURL})
          setImageFileUploading(false)
        });
      }
    );
  };

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }
  // console.log(formData)
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (Object.keys(formData).length === 0) {
    return;
  }
  if (imageFileUploading) {
    return;
  }
  try {
    dispatch(updateStart());  // Set loading state
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    
    const data = await res.json();  // Parse the response
    if (!res.ok) {
      return dispatch(updateFailure(data.message));  // Handle failure case
      
    } else {
      dispatch(updateSuccess(data));
      setUpdateUserSuccess("User updated successfully");
    }
  } catch (error) {
    dispatch(updateFailure(error.message));  
  }
};
  
// console.log(currentUser._id)
const handleDeleteUser= async ()=>{
setShowModal(false)
  try{
    // dispatch(deleteUserStart())
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if(res.ok){
      dispatch(deleteUserSuccess(data))
    }else{
      dispatch(deleteUserFailure(data.message))
      // setDeleteUser("You are not authenticated to delete this user")
    }
  }catch(error){
    dispatch(deleteUserFailure(error.message))
  }
}

const handlSignOut = async ()=>{
  try{
    const res = await fetch('/api/user/signout',{
      method: "POST",
    })
    const data = res.json();
    if(res.ok){
      dispatch(signOutSuccess(data))
    }
  }catch(error){
    next(error)
  }
}
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: 'absolute',
                  top: 0,
                  left:0,
                },
                path:{
                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress/80})`
                }
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-4 border-[green]"
            onClick={() => filePickerRef.current.click()}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <TextInput type="password" id="password" placeholder="Password"
        autoComplete="current-password" 
        onChange={handleChange}/>
        <Button
          type="submit"
          className="dark:bg-gradient-to-t uppercase border-none font-bold dark:from-slate-900 dark:via-cyan-600 dark:to-slate-950 dark:hover:via-cyan-400 bg-cyan-600 hover:bg-cyan-300"
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={()=>setShowModal(true)}>Delete Account</span>
        <span className="cursor-pointer" onClick={handlSignOut}>Sign Out</span>
      </div>
      {currentUser.isAdmin && (
        <Link to={'/create-post'}>
          <Button type="button" className="dark:bg-gradient-to-r dark:from-slate-900 dark:via-cyan-600 dark:to-slate-950 bg-cyan-600 hover:bg-cyan-300 w-full uppercase border-none dark:hover:via-cyan-400 mt-2">
            Create a Post
          </Button>
        </Link>
      )}
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal show={showModal}
      onClose={()=>setShowModal(false)}
      popup
      size='md'>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-4"/>
            <h3 className="mb-3 text-lg text-gray-500 dark:text-gray-300">Are you sure you want to delete your account</h3>
            <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser}>
              Yes I'm sure
            </Button>
            <Button color="gray" onClick={()=>setShowModal(false)}>
              No I'm not sure
            </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
