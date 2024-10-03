import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
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
  return <div>
    <div className="min-h-screen flex flex-row md:flex-row">
      
      <div className="md:w-56">
      {/* sidebar */}
      <DashSidebar/>
      </div>

      {/* <div> */}
      {/* profile */}
      {tab==='profile' && <DashProfile/>}
      {/* </div> */}

    </div>
  </div>;
}
