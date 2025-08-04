import React, { useRef, useState } from "react";
import "../CSS/header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  const hamburgerMenuRef = useRef(null);
  const [openSideBar, setOpenSideBar] = useState(false);

  const toggleSideBar = () => {
    setOpenSideBar(!openSideBar);
    if (hamburgerMenuRef.current) {
      if (!openSideBar) {
        hamburgerMenuRef.current.style.transform = "translateX(0)";
        hamburgerMenuRef.current.style.backgroundColor = "black";
        hamburgerMenuRef.current.style.color = "white";
      } else {
        hamburgerMenuRef.current.style.transform = "translateX(-100%)";
      }
    }
    if (openSideBar) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    document.body.style.transition = "overflow 0.3s ease-in-out";
  };

  return (
    <>
      <header className={`p-7 flex justify-between max-w-[93%] m-auto`}>
        <div className="leftHeader flex gap-3 md:gap-12">
          <div className="bagIcon">
            <span>
              <i class="fa-solid fa-bag-shopping"></i>
            </span>
          </div>
          <div className="hamburger-menu sm:hidden" onClick={toggleSideBar}>
            <span>
              <i class="fa-solid fa-bars"></i>
            </span>
          </div>
          <div className="headerLinks hidden sm:block">
            <ul className="flex gap-3 items-center list-none">
              <Link className="font-bold" to={"/"}>
                HOME
              </Link>
              <Link className="font-bold" to={"/products"}>
                PRODUCTS
              </Link>
              <Link className="font-bold" to={"/blog"}>
                BLOG
              </Link>
              <Link className="font-bold" to={"/support"}>
                SUPPORT
              </Link>
            </ul>
          </div>
        </div>
        <div className="rightHeader">
          <div className="rightIcons flex gap-3">
            <div className="search-icon">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <div className="cart-icon">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <div className="user-icon">
              <i class="fa-solid fa-user"></i>
            </div>
          </div>
        </div>
      </header>
      <div
        className="hamburger-menu-content max-w-[200px] h-screen p-5 sm:hidden mt-14"
        ref={hamburgerMenuRef}
        style={{
          transform: "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <ul className="flex flex-col gap-3 items-start list-none">
          <li className="font-bold">HOME</li>
          <li className="font-bold">PRODUCTS</li>
          <li className="font-bold">BLOG</li>
          <li className="font-bold">SUPPORT</li>
        </ul>
      </div>
      <hr className="max-w-[95%] m-auto text-gray-500" />
    </>
  );
};

export default Header;
