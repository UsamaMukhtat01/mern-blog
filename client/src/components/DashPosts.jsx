import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Table, Modal, Button, Alert} from 'flowbite-react'
import {Link} from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashPosts() {

  const {currentUser} = useSelector(state =>state.user);
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState(null)
  const [postDeleteMsg, setPostDeleteMsg] = useState('');
  // console.log(userPosts)

  useEffect(()=>{
    const fetchPosts = async ()=>{
      try{
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok){
          setUserPosts(data.posts)
          if(data.posts.length<9){
            setShowMore(false)
          }
        }
      }catch(error){
      }
    }
    if(currentUser.isAdmin){
      fetchPosts();
    }
  }, [currentUser._id])

  const handleShowMore = async ()=>{
    const startIndex = userPosts.length;
    try{
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json();
      if(res.ok){
        setUserPosts((prev)=>[...prev, ...data.posts])
        if(data.posts.length<9){
          setShowMore(false)
        }
      }
    }catch(error){
      console.log(error)
    }
  }

  const handleDeletePost = async ()=>{
    setShowModal(false);
    try{
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = await res.json();
      if(!res.ok){
        console.log(data.message)
      }else{
        setPostDeleteMsg("Post has been deleted")
        setUserPosts((prev)=> prev.filter((post)=>post._id !== postIdToDelete)
      )  
      }
    }catch(error){
      console.log(error);

    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto scrollbar-thin scrollbar-track-cyan-300 scrollbar-thumb-gray-400 dark:scrollbar-thumb-slate-500 dark:scrollbar-track-slate-600'>
      {currentUser.isAdmin && userPosts.length > 0? (
        <>
        {postDeleteMsg && (
          <Alert color='success' className='m-2'>
            {postDeleteMsg}
          </Alert>
        )}
        <Table hoverable className='rounded-2xl'>
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell><span>Edit</span></Table.HeadCell>
          </Table.Head>
          {userPosts.map((post)=>(
            <Table.Body key={post._id}>
              <Table.Row className='dark:bg-gray-800'>
                <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`}>
                  <img src={post.image} alt={post.title} className='h-12 w-12 object-cover' />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`} className=' dark:text-white'>
                    {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                    <span onClick={()=>{
                      setShowModal(true);
                      setPostIdToDelete(post._id)
                    }} className='text-red-500 hover:cursor-pointer hover:underline '>
                      Delete
                    </span>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/update-post/${post._id}`}>
                    <span className='text-green-400'>
                      Edit
                    </span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {showMore && (
          <button onClick={handleShowMore} className='text-green-500 w-full self-center p-2'>Show more</button>
        )}
        </>
      ):(
        <p>You hav'nt any post to see</p>
      )}
      <Modal show={showModal}
      onClose={()=>setShowModal(false)}
      popup
      size='md'>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-4"/>
            <h3 className="mb-3 text-lg text-gray-500 dark:text-gray-300">Are you sure you want to delete this post?</h3>
            <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeletePost}>
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
  )
}
