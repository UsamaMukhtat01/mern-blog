import React, { useEffect } from 'react'
import {TextInput, Select, Button, FileInput, Alert} from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import {getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase.js'
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate, useParams } from 'react-router-dom'
import {useSelector} from 'react-redux';

export default function UpdatePost() {
    const {currentUser} = useSelector((state)=>state.user)
    const [file, setFile] = useState();
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({})
    const [postError, setPostError] = useState(null)
    const navigate = useNavigate()
    const { postId } = useParams();
    console.log(formData)

    useEffect(()=>{
        try{
            const fetchData = async ()=>{
                const res = await fetch(`/api/post/getposts?postId=${postId}`)
                const data = await res.json();
                if(!res.ok){
                    console.log(data.message)
                    return;
                }if(res.ok){
                    setPostError(null);
                    setFormData(data.posts[0]);
                }
            }
            fetchData();
        }catch(error){
            console.log(error)
        }
    },[postId])

    const handleUploadImage = async ()=>{
        try{
            if(!file){
                setImageUploadError('Please Select an Image')
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                }, (error)=>{
                    setImageUploadError("Image upload failed")
                    setImageUploadProgress(null);
                }, ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                        setImageUploadError(null);
                        setImageUploadProgress(null);
                        setFormData({...formData, image: downloadUrl})
                    })
                }
            )
        }catch(error){
            setImageUploadError('Image Upload failed');
            setImageUploadProgress(null);
            console.log(error)
        }
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            if(!res.ok){
                setPostError(data.message)
                return;
            }
            if(res.ok){
                setPostError(null)
                navigate(`/post/${data.slug}`)
            }
        }catch(error){
            setPostError("Something went wrong")
        }
    }

  return (
    <div className='max-w-3xl mx-auto p-3 min-h-screen'>
        <h1 className='text-center text-3xl my-2 font-semibold'>Update Post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1'
                onChange={(e)=>setFormData({...formData, title: e.target.value})}
                value={formData.title}/>
                <Select onChange={(e)=>setFormData({...formData, category: e.target.value})}
                    value={formData.category}>
                    <option value="uncategorized">Select a Category</option>
                    <option value="javascript">JavaScript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-300 border-dotted p-3'>
                <FileInput type='file' accept='image/*' onChange={(e)=>setFile(e.target.files[0])}/>
                <Button type='button' outline size='sm' className='bg-cyan-400' onClick={handleUploadImage}
                disabled={imageUploadProgress}>
                {imageUploadProgress ? (
                    <div className='w-16 h-16'>
                        <CircularProgressbar
                        value={imageUploadProgress}
                        text={`${imageUploadProgress || 0}%`}
                        />
                    </div>
                    ):(
                    'Upload Image'
                )}
                </Button>
            </div>
            {imageUploadError && (
                <Alert color='failure'>
                    {imageUploadError}
                </Alert>
            )}
            {formData.image &&(
                <img src={formData.image} alt="upload" className='w-full h-72 object-cover'
                value={formData.image}/>
            )}
            <ReactQuill theme='snow' placeholder='Write Something' className='h-72 mb-12' onChange={(value)=>{setFormData({...formData, content: value})}}
                value={formData.content}/>
            <Button type='submit' className='bg-gradient-to-r border-none from-slate-900 via-cyan-600 to-slate-950 hover:via-cyan-400'>Update</Button>
            {postError &&(
                <Alert color='failure' className='mt-5'>
                    {postError}
                </Alert>
            )}
        </form>
    </div>
  )
}
