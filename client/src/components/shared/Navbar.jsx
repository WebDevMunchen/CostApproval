import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <NavLink to={"/"} className="font-bold flex items-center lg:ml-2.5">
              <img
                src="https://res.cloudinary.com/dtrymbvrp/image/upload/v1720596411/favicon_eighgd.png"
                className="h-14 mr-2"
                alt="Rent Group Logo"
              />
              <div className="flex flex-col">
                <span className="font-anek text-xl self-center whitespace-nowrap ">
                  Rent.Group
                </span>
                <span className="font-anek self-center whitespace-nowrap">
                  München
                </span>
              </div>
            </NavLink>
            <form action="#" method="GET" className="hidden lg:block lg:pl-20">
              <label htmlFor="topbar-search" className="sr-only">
                Search
              </label>
              <div className="mt-1 relative lg:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  name="email"
                  id="topbar-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5"
                  placeholder="Search"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center">
            {!user ? <p className="hidden">Loading</p> : <p className="text-2xl font-bold font-anek text-gray-800">
  <span className="text-blue-600">Hallo,</span> {user.firstName}!
</p>
}
            {/* <p>Notification Bell</p> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
