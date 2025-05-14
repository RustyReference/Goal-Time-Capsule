export default function Navbar() {
    return (
        <div className="fixed top-0 w-full">
            <div className="flex items-center justify-between mx-10 py-5">
                <a className="text-4xl mr-0 cursor-pointer">The Goal Time Capsule</a>
                <ul className="hidden md:flex justify-evenly space-x-20">
                    <li><a className="hover:italic cursor-pointer">Login</a></li>
                    <li><a className="hover:italic cursor-pointer">Sign up</a></li>
                    <li><a className="hover:italic cursor-pointer">Menu</a></li>
                </ul>
            </div>
        </div>
    );
}