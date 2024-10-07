import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Table} from 'flowbite-react'
import {Link} from 'react-router-dom'

export default function DashPosts() {

  const {currentUser} = useSelector(state =>state.user);
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  console.log(userPosts)

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

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-200 scrollbar-thumb-slate-500 dark:scrollbar-thumb-slate-500 dark:scrollbar-track-slae-800'>
      {currentUser.isAdmin && userPosts.length > 0? (
        <>
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
            <Table.Body>
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
                    <span className='text-red-500 hover:cursor-pointer hover:underline '>
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
    </div>
  )
}
