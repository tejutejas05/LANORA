import {FaHome,FaBox,FaCog,FaChartLine,FaHistory,FaBell,FaUserCircle} from  "react-icons/fa"
import { Link,NavLink } from "react-router-dom";

function Sidebar(){
    return(
       <>
        <div className="w-65 bg-gray-400 p-4 text-black min-h-screen flex flex-col ">
            <h1 className="text-xl font-bold mb-6 ">(logo)LANORA</h1>

            <ul className="space-y-4">
                <li> 
                < Link to= "/Dashboard" className="flex items-center hover:text-blue-500 gap-2 cursor-pointer">
                    <FaHome/>Dashboard
                   </Link>
                 </li>
                <li > 
                    < Link to= "/Sandboxes" className="flex items-center hover:text-blue-500 gap-2 cursor-pointer">
                    <FaBox/>Sandboxes
                    </Link>
                </li>
                <li>
                    <Link to="/Settings" className="flex items-center hover:text-blue-500 gap-2 cursor-pointer">
                    <FaCog/>Settings
                    </Link>
                </li>
                <li>
                    <Link to="/Resource Usage" className="flex items-center hover:text-blue-500 gap-2 cursor-pointer " >
                    <FaChartLine/>Resource Usage
                    </Link>
                </li>
                <li>
                    <Link to="/Test History" className="flex items-center hover:text-blue-500 gap-2 cursor-pointer">
                    <FaHistory />Test History
                    </Link>
                </li>
            </ul>
        </div>
    </>
    );
}

export default Sidebar;