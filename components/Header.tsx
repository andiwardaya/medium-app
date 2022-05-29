import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between max-w-7xl mx-auto p-5">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-44 object-contain cursor-pointer"
            src="https://links.papareact.com/yvf"
            alt="homePage"
          />
        </Link>
        <div className="hidden md:inline-flex flex space-x-5 items-center">
          <h3 className="cursor-pointer">About</h3>
          <h3 className="cursor-pointer">Contact</h3>
          <h3 className="bg-green-400 py-1 px-4 text-white rounded-full cursor-pointer">
            Follow
          </h3>
        </div>
      </div>

      <div className="text-green-500 flex space-x-5 items-center">
        <h3 className="cursor-pointer">Sign In</h3>
        <h3 className="border py-1 px-4 rounded-full border-green-500 cursor-pointer">
          Get Started
        </h3>
      </div>
    </header>
  );
};

export default Header;
