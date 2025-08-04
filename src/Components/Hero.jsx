import React from "react";
import "../CSS/hero.module.css";

const Hero = () => {
  return (
    <main className="hero-section min-h-[85vh] flex flex-col lg:flex-row items-center max-w-[90%] lg:max-w-[85%] m-auto py-8 lg:py-0 gap-8 lg:gap-0">
      <div className="left-hero-section flex flex-col items-start justify-center gap-4 lg:grow text-center lg:text-left">
        <div className="title-part mb-3">
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-wrap mb-3">
            Discover a fresh shopping <br className="hidden lg:block" />
            experience
          </h4>
          <p className="text-gray-400 text-sm md:text-lg">
            Browse effortlessly through our collections!
          </p>
        </div>
        <div className="search-part flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
          <div className="search-input relative w-full sm:w-auto">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="What do you want to find?"
              className="p-3 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black bg-gray-200 outline-none w-full sm:w-[300px] lg:w-[350px]"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          </div>
          <div className="search-button w-full sm:w-auto">
            <button className="bg-black p-3 text-white font-bold w-full sm:w-[130px] rounded-md hover:bg-gray-800 transition-colors cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="right-hero-section flex-shrink-0 w-[50%] lg:w-auto max-w-[400px] lg:max-w-none">
        <img
          src="../Images/hero.png"
          alt="hero-png"
          className="w-full object-cover"
        />
      </div>
    </main>
  );
};

export default Hero;
