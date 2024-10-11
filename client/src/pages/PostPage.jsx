import {useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Spinner, Button} from 'flowbite-react'
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {

    const {postSlug} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, SetError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);
    

    useEffect(()=>{
        const fetchPost = async () =>{
            try{
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if(!res.ok){
                    SetError(true);
                    setLoading(false);
                    return;
                }
                if(res.ok){
                    setPost(data.posts[0]);
                    setLoading(false);
                    SetError(false)
                }
            }catch(error){
                setLoading(false);
                SetError(true);
            }
        }
        fetchPost();
    }, [postSlug])
    
    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`/api/post/getposts?limit=3`);
                const data = await res.json();
                if (res.ok){
                    setRecentPosts(data.posts);
                };
            }
            fetchRecentPosts();
        } catch (error) {
            console.log(error.message);
        }
    }, [])
    
    if(loading){
        return (
            <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl'/>
            </div>
        )
    }
    
  return (
    <main className='p-3 flex flex-col min-h-screen items-center max-w-6xl mx-auto'>
        <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
        <Link to={`/search?category=${post && post.category}`} className=' mt-5'>
            <Button color='gray' pill size='xs' className='dark:text-black'>{post && post.category}</Button>
        </Link>
        <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
        <div className='flex justify-between w-full p-3 border-b border-slate-500 text-sm'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span>Just read in ({post && (post.content.length /1000).toFixed(2)}) mins.</span>
        </div>
        <div className='p-3 max-w-2xl mx-auto w-full post_content' dangerouslySetInnerHTML={{__html: post && post.content}}>
        </div>
        <div className='max-w-2xl mx-auto w-full'>
            <CallToAction/>
        </div>
        <CommentSection postId={post._id}/>
        <div className="flex flex-col justify-center items-center mb-5">
            <h1 className='text-xl mt-5'>Recent articles</h1>
            <div className="flex flex-wrap gap-2 mt-5 justify-center">
                {recentPosts && recentPosts.map((post)=>(
                    <PostCard key={post._id} post={post}></PostCard>
                ))}
            </div>
        </div>
    </main>
  )
}
