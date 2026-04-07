import { FaBell, FaUserCircle } from "react-icons/fa";
function Navbar(){
    return(
        <div className="w-full h-16 bg-white shadow flex items-center justify-between px-7">
            <h1 className="text-xl font-bold">Logo</h1>

            <div className="flex items-center gap-4">
                
                <input type="text" placeholder="search..." className="border px-3 py-1 rounded"/>
                <FaBell className="text-gray-600 text-lg cursor-pointer" />
                <FaUserCircle className="text-gray-600 text-2xl cursor-pointer" />
            </div>
        </div>
    )
}
export default Navbar;