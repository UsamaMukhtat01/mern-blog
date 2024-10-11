import { Sidebar } from 'flowbite-react';
import { HiUser, HiChartPie, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const {currentUser} = useSelector(state => state.user)
  const dispatch = useDispatch();
    const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl){
      setTab(tabFromUrl)
    }
  }, [location.search]);
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
      // next(error)
      console.log(error)
    }
  }
return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-2'>
            {currentUser && currentUser.isAdmin && (
              <Link to='/dashboard?tab=dash'>
                <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'>
                Dashboard
                </Sidebar.Item>
              </Link>
            )}
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin? 'Admin':'User'} labelColor='dark' as='div'>
                Profile
                </Sidebar.Item>
                </Link>
                {currentUser.isAdmin && (
                <Link to='/dashboard?tab=posts'>
                <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} labelColor='dark' as='div'>
                Posts
                </Sidebar.Item>
                </Link>
                )}
                {currentUser.isAdmin && (
                <Link to='/dashboard?tab=users'>
                <Sidebar.Item active={tab==='users'} icon={HiOutlineUserGroup} labelColor='dark' as='div'>
                Users
                </Sidebar.Item>
                </Link>
                )}
                {currentUser.isAdmin && (
                <Link to='/dashboard?tab=comments'>
                <Sidebar.Item active={tab==='comments'} icon={HiAnnotation} labelColor='dark' as='div'>
                Comments
                </Sidebar.Item>
                </Link>
                )}
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'>
                <div onClick={handlSignOut}>
                Sign Out
                </div>
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
)
}