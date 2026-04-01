export const Navbar = () => {
    return(
        <header>
            <div className="container">
                <div className="grid navbar-grid">
                    <div className="logo">
                        <h1>LANORA</h1>
                    </div>
                    <nav>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">how it works</a></li>
                            <li><a href="#">blog</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}