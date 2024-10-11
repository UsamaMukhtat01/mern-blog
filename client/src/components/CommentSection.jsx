import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Textarea, Alert, Modal } from "flowbite-react";
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import { useState } from "react";
import { useEffect } from "react";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentMsg, setCommentMsg] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCommentError(data.message);
      }
      if (res.ok) {
        setComment("");
        setCommentMsg("Comment Sent.");
        // setComment([...comments])
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  // Call to get comments************************************************
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data);
        } else {
          console.log("Failed to fetch comments");
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (postId) {
      getComments();
    }
  }, [postId]);

  // useEffect just for timout the error handlings******************************
  useEffect(() => {
    if (commentError || commentMsg) {
      const timer = setTimeout(() => {
        setCommentError(null); // Clear error
        setCommentMsg(null); // Clear message
      }, 1500); // Timeout set to 3 seconds

      // Cleanup the timeout if component unmounts
      return () => clearTimeout(timer);
    }
  }, [commentError, commentMsg]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false)
    try{
        if(!currentUser){
            navigate('/sign-in');
            return;
        }
        const res = await fetch(`/api/comment/deleteComment/${commentId}`,{
            method: "Delete",
        })
        if(res.ok){
            const data = await res.json();
            setComments(comments.filter((comment)=>comment._id !== commentId))
        }
    }catch(error){
        console.log(error.message)
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex flex-rox items-center gap-1 my-5    dark:text-gray-500 text-sm">
          <p className="dark:text-white font-semibold">Signed in as:</p>
          <img
            src={currentUser.profilePicture}
            alt=""
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="hover:underline text-blue-500"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-2 text-sm text-teal-400 my-5">
          You must be signed in to comment.
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure" className="p-2 mt-2">
              {commentError}
            </Alert>
          )}
          {commentMsg && (
            <Alert color="success" className="p-2 mt-2">
              {commentMsg}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <div className="flex items-center mt-2 gap-2">
          <p>{comments.length > 1 ? "Comments" : "Comment"}</p>
          <div className="w-fit py-1 px-2 rounded-lg border border-gray-500 text-xs">
            <p>{comments.length}</p>
          </div>
        </div>
      )}
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onLike={handleLike}
          onEdit={handleEdit}
          onDelete={(commentId)=>{
            setShowModal(true)
            setCommentToDelete(commentId)
          }}
        />
      ))}
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
            <Button color="failure" onClick={()=>handleDelete(commentToDelete)}>
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
