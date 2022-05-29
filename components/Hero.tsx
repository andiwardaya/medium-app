import React from "react";

const Hero = () => {
  return (
    <div className="bg-yellow-400 p-5 flex justify-between items-center border-y border-black py-10 lg:py-0 ">
      <div className="px-10 space-y-5">
        <h1 className="text-6xl font-serif max-w-6xl">
          <span className="underline decoration-black decoration-4">
            Medium
          </span>{" "}
          is a place to write, read, and connect
        </h1>
        <h2>
          it's easy and free to post your thinking on any topic and connect
          withe millions of readers.
        </h2>
      </div>
      <div>
        <img
          className="hidden md:inline-flex md:w-full"
          src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          alt="medium logo"
        />
      </div>
    </div>
  );
};

export default Hero;
