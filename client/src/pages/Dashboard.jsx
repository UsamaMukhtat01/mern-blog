import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl){
      setTab(tabFromUrl)
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div className="sm:w-56">
      {/* sidebar */}
      <DashSidebar/>
      </div>
      <div className="w-full p-2">
      {/* profile */}
      {tab==='profile' && <DashProfile/>}

      {/* posts */}
      {tab==='posts' && <DashPosts/>}

      {/* Users */}
      {tab==='users' && <DashUsers/>}
      </div>
    </div>
  )
}
