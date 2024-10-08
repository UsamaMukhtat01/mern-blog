import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import {Button, Textarea, Alert} from 'flowbite-react'
import { useState } from 'react';
import { useEffect } from 'react';

export default function CommentSection({postId}) {

    const {currentUser} = useSelector((state)=>state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null);
    const [commentMsg, setCommentMsg] = useState(null);
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(comment.length > 200){
            return;
        }
        try{

            const res = await fetch('/api/comment/create',{
                method: "POST",
                headers:{'Content-Type': "application/json"},
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                }),
            })

            const data = await res.json();
            if(!res.ok){
                setCommentError(data.message)
            }
            if(res.ok){
                setComment('')
                setCommentMsg("Comment Sent")
            }
        }catch(error){
            setCommentError(error.message)   
        }
    }
// useEffect just for timout the error handlings******************************
    useEffect(() => {
        if (commentError || commentMsg) {
          const timer = setTimeout(() => {
            setCommentError(null);  // Clear error
            setCommentMsg(null);    // Clear message
          }, 1500);  // Timeout set to 3 seconds
    
          // Cleanup the timeout if component unmounts
          return () => clearTimeout(timer);
        }
      }, [commentError, commentMsg]);
    
    return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser? (
        <div className='flex flex-rox items-center gap-1 my-5    dark:text-gray-500 text-sm'>
            <p className='dark:text-white font-semibold'>Signed in as:</p>
            <img src={currentUser.profilePicture} alt="" className='h-5 w-5 object-cover rounded-full'/>
            <Link to={'/dashboard?tab=profile'} className='hover:underline text-blue-500'>
                @{currentUser.username}
            </Link>
        </div>
      ):(
        <div className='flex gap-2 text-sm text-teal-400 my-5'>
            You must be signed in to comment.
            <Link to={'/sign-in'} className='text-blue-500 hover:underline'>
                Sign In
            </Link>
        </div>
      )}
      {currentUser && (

        <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
            <Textarea
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            onChange={(e)=> setComment(e.target.value)}
            value={comment}
            />
            <div className="flex justify-between items-center mt-5">
                <p className='text-gray-500 text-sm'>{200 - comment.length} characters remaining</p>
                <Button outline
                gradientDuoTone='purpleToBlue'
                type='submit'>
                    Submit
                </Button>
            </div>
                    {commentError && (
                        <Alert color='failure' className='p-2 mt-2'>{commentError}</Alert>
                    )}
                    {commentMsg && (
                        <Alert color='success' className='p-2 mt-2'>{commentMsg}</Alert>
                    )}
        </form>
      )}
    </div>
  )
}
