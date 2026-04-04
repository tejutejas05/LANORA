import {FaHome,FaUser,FaCog} from  "react-icons/fa"
import { Link } from "react-router-dom";

function Sidebar(){
    return(
        <div className="w-64 bg-gray-400 p-4 text-black">
            <h1 className="text-xl font-bold mb-6 min-h-screen">Menu</h1>

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
            </ul>
        </div>
    );
}

export default Sidebar;