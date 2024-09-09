import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Logo from "../assets/images/newestlogo.png";
import UserProfileIcon from "../assets/images/usericon.png";  
import searchIcon from "../assets/images/searchicon.png"; 
import helpIcon from "../assets/images/helpicon.png"; 

export default function Header() {
  const [pageState, setPageState] = useState("Sign in");
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign in");
      }
    });
  }, [auth]);

  function pathMatchRoute(route) {
    return route === location.pathname;
  }

  return (
    <div className="navbar bg-yellow-200 border-b shadow-sm sticky top-0 z-40 h-16">
      <header className="flex flex-col md:flex-row items-center justify-between px-3 max-w-6xl mx-auto">
      <div className="flex items-center">
          <img
            src={Logo}
            alt="logo"
            className="h-14 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <span className="ml-3 text-xl text-black font-bold md:hidden">Tt365</span>
        </div>
        <div className="flex-grow flex justify-center">
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-black-200 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/") && "text-black border-b-black"
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
                 className={`cursor-pointer py-3 text-sm font-semibold text-black-200 border-b-[3px] border-b-transparent ${
                  pathMatchRoute("/newin") && "text-black border-b-black"
                }`}
              onClick={() => navigate("/newin")}
            >
              NewIn
            </li>
            <li
             className={`cursor-pointer py-3 text-sm font-semibold text-black-200 border-b-[3px] border-b-transparent ${
              pathMatchRoute("/menwear") && "text-black border-b-black"
            }`}
              onClick={() => navigate("/menwear")}
            >
              Men Wear
            </li>
            <li
                 className={`cursor-pointer py-3 text-sm font-semibold text-black-200 border-b-[3px] border-b-transparent ${
                  pathMatchRoute("/ladies") && "text-black border-b-black"
                }`}
              onClick={() => navigate("/ladies")}
            >
              Ladies
            </li>
            <li
               className={`cursor-pointer py-3 text-sm font-semibold text-black-200 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/kids") && "text-black border-b-black"
              }`}
              onClick={() => navigate("/kids")}
            >
              Kids
            </li>
            <li
               className={`cursor-pointer py-3 text-sm font-semibold text-black-200 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/brands") && "text-black border-b-black"
              }`}
              onClick={() => navigate("/brands")}
            >
              Brands
            </li>
            <li
               className={`cursor-pointer py-3 text-sm font-semibold text-black-200 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/about") && "text-black border-b-black"
              }`}
              onClick={() => navigate("/about")}
            >
              About
            </li>
          </ul>
        </div>
        <div className="flex space-x-6">
          <div>
            <img
              src={searchIcon}
              alt="search"
              className="h-8 w-8 cursor-pointer"
              onClick={() => navigate("/profile")}
            />
          </div>
          <div>
            <img
              src={UserProfileIcon}
              alt="user-profile"
              className="h-8 w-8 cursor-pointer"
              onClick={() => navigate("/profile")}
            />
          </div>
          <div>
            <img
              src={helpIcon}
              alt="help"
              className="h-8 w-8 cursor-pointer"
              onClick={() => navigate("/help")}
            />
          </div>
        </div>
      </header>
    </div>
  );
}
