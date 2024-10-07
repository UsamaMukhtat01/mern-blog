import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Table, Modal, Button, Alert} from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { AiOutlineUserDelete } from 'react-icons/ai';

export default function DashPosts() {

  const {currentUser} = useSelector(state =>state.user);
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState(null)
  const [userDeleteMsg, setUserDeleteMsg] = useState('');

  useEffect(()=>{
    const fetchUsers = async ()=>{
      try{
        const res = await fetch(`/api/user/getusers`)
        const data = await res.json()
        if(res.ok){
          setUsers(data.users)
          if(data.users.length<9){
            setShowMore(false)
          }
        }
      }catch(error){
      }
    }
    if(currentUser.isAdmin){
      fetchUsers();
    }
  }, [currentUser._id])

  const handleShowMore = async ()=>{
    const startIndex = users.length;
    try{
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
      const data = await res.json();
      if(res.ok){
        setUsers((prev)=>[...prev, ...data.users])
        if(data.users.length<9){
          setShowMore(false)
        }
      }
    }catch(error){
      console.log(error)
    }
  }
    const handleDeleteUser= async ()=>{
    setShowModal(true)
      try{
        const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if(res.ok){
            setUsers((prev)=>prev.filter((user)=>user._id !== userIdToDelete))
            setShowModal(false)
          setUserDeleteMsg("User has been deleted")
        }else{
        //   dispatch(deleteUserFailure(data.message))
        //   setUserDeleteMsg("You are not authenticated to delete this user")
        console.log(data.message)
        }
      }catch(error){
        console.log(error.message)
      }
    }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto scrollbar-thin scrollbar-track-cyan-300 scrollbar-thumb-gray-400 dark:scrollbar-thumb-slate-500 dark:scrollbar-track-slate-600'>
      {currentUser.isAdmin && users.length > 0? (
        <>
        {userDeleteMsg && (
          <Alert color='success' className=''>
            {userDeleteMsg}
          </Alert>
        )}
        <Table hoverable className='rounded-2xl'>
          <Table.Head>
            <Table.HeadCell>Date Created</Table.HeadCell>
            <Table.HeadCell>User Image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Rank</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {users.map((user)=>(
            <Table.Body className='divide-y' key={user._id}>
              <Table.Row className='dark:bg-gray-800 text-black dark:text-gray-300'>
                <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <img src={user.profilePicture} alt={user.username} className='h-12 w-12 object-cover rounded-lg' />
                </Table.Cell>
                <Table.Cell>
                    {user.username}
                </Table.Cell>
                <Table.Cell>
                    {user.email}
                </Table.Cell>
                <Table.Cell>{user.isAdmin? 'Admin': 'User'}</Table.Cell>
                <Table.Cell>
                    <span onClick={()=>{
                      setShowModal(true);
                      setUserIdToDelete(user._id)
                    }} className='text-2xl text-red-300 hover:cursor-pointer hover:underline '>
                      <AiOutlineUserDelete/>
                    </span>
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
        <p>You havn't any User to see</p>
      )}
      <Modal show={showModal}
      onClose={()=>setShowModal(false)}
      popup
      size='md'>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mx-auto mb-4"/>
            <h3 className="mb-3 text-lg text-gray-500 dark:text-gray-300">Are you sure you want to delete this user?</h3>
            <div className="flex justify-center gap-4">
            <Button color="failure" 
            onClick={handleDeleteUser}
            >
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
