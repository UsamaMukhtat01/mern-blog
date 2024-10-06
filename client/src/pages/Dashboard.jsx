import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
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
      <div className="w-full">
      {/* profile */}
      {tab==='profile' && <DashProfile/>}

      {/* posts */}
      {tab==='posts' && <DashPosts/>}
      </div>
    </div>
  )
}
