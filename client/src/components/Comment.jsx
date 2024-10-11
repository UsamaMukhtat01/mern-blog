import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Textarea, Button } from "flowbite-react";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };


  const handleSave = async ()=>{
    try{
        const res = await fetch(`/api/comment/editComment/${comment._id}`,{
            method: "PUT",
            headers: {"Content-Type": "Application/json"},
            body: JSON.stringify({
                content: editedContent
            })
        })
        if(res.ok){
            setIsEditing(false);
            onEdit(comment, editedContent)
        }

    }catch(error){
        console.log(error)
    }
  }

  return (
    <div className="flex gap-4 border-b border-teal-400 rounded-lg p-2 my-5">
      <img
        src={user.profilePicture}
        alt={user.username}
        className="h-12 w-12 object-cover rounded-full"
      />

      <div className="flex-1">
        <span>
          <Link
            to={"/dashboard?tab=profile"}
            className="hover:underline text-blue-500"
          >
            {user ? `@${user.username}` : "anonymouse user"}
          </Link>
        </span>
        <span className="text-gray-400 text-sm ml-3">
          {moment(comment.createdAt).fromNow()}
        </span>
        {isEditing ? (
          <div>
            <Textarea
              className="mb-2"
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            ></Textarea>
            <div className="flex w-full justify-end gap-4">
              <Button type="button" size="sm" gradientDuoTone="purpleToBlue" onClick={handleSave}>
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {/* {editedContent && comment._id? "edited":''} */}
            <p className="mt-2">{comment.content}</p>
            <div className=" flex gap-3">
              <button
                onClick={() => onLike(comment._id)}
                className={`text-sm text-gray-500 mt-2${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-600"
                }`}
              >
                <FaThumbsUp />
              </button>
              <p className="">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              <div className="justify-between w-full flex">
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                  type="button"
                  onClick={handleEdit}
                  className="text-gray-400 hover:text-blue-400"
                  >
                    Edit
                  </button>
                )}
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                  type="button"
                  onClick={()=>onDelete(comment._id)}
                  className="text-red-400 hover:underline justify-end"
                  >
                    Delete
                  </button>
                )}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
