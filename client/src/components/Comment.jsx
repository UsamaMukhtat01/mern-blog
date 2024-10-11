import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {FaThumbsDown, FaThumbsUp} from 'react-icons/fa'
import { useSelector } from 'react-redux'

export default function Comment({comment, onLike}) {

    const [user, setUser] = useState({})
    const {currentUser} = useSelector((state)=>state.user)

    useEffect(()=>{
        const getUser = async()=>{
            try{
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok){
                    setUser(data);
                }
            }catch(error){
                console.log(error)
            }
        }
        getUser()
    }, [comment])
  return (
    <div className='flex gap-4 border-b border-teal-400 rounded-lg p-2 my-5'>
        <img src={user.profilePicture} alt={user.username} className='h-12 w-12 object-cover rounded-full'/>
        
        <div className='flex-1'>
            <span>
                <Link to={'/dashboard?tab=profile'} className='hover:underline text-blue-500'>
                    {user? `@${user.username}`:'anonymouse user'}
                </Link>
            </span>
            <span className='text-gray-400 text-sm ml-3'>{moment(comment.createdAt).fromNow()}</span>
        <p className='mt-2'>{comment.content}</p>
        <div className=''>
            <button onClick={()=>onLike(comment._id)} className={`text-sm text-gray-500 mt-2${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-600'}`}><FaThumbsUp/></button>
        </div>
        </div>
    </div>
  )
}
