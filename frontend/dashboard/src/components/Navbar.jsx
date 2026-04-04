function Navbar({children}){
    return(
        <div className="w-full h-16 bg-white shadow flex items-center justify-between px-7">
            <h1 className="text-xl font-bold">LANORA</h1>


            <div className="flex items-center gap-4">
                <div>{children}</div>
                <input type="text" placeholder="search..."
                className="border px-3 py-1 rounded"/>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
        </div>
    )
}
export default Navbar;