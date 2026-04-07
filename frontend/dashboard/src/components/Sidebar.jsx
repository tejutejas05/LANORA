import {FaHome,FaUser,FaCog,FaChartLine} from  "react-icons/fa"
import { Link,NavLink } from "react-router-dom";

function Sidebar(){
    return(
        <div className="w-65 bg-gray-400 p-4 text-black min-h-screen flex flex-col ">
            <h1 className="text-xl font-bold mb-6 ">LANORA</h1>

            <ul className="space-y-4">
                <li> 
                < Link to= "/" className="flex items-center hover:text-blue-500 gap-2 cursor-pointer">
                    <FaHome/>Home
                   </Link>
                 </li>
                <li > 
                    < Link to= "/Users" className="flex items-center hover:text-blue-500 gap-2 cursor-pointer">
                    <FaUser/>Users
                    </Link>
                </li>
                <li>
                    <Link to="/Settings" className="flex items-center hover:text-blue-500 gap-2 cursor-pointer">
                    <FaCog/>Settings
                    </Link>
                </li>
                <li>
                    <Link to="/Resource Usage" className="flex-items-center hover:text-blue-500 gap-2 cursor-pointer " >
                    <FaChartLine/>Resource Usage
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;