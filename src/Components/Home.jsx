import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Categories from "./Categories";
import ProductShowCase from "./ProductShowCase";
import "../CSS/Home.css";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <ProductShowCase />
      <section className="our-blog pt-16">
        <div className="blog-wrapper bg-gray-300 min-h-[90vh]">
          <div className="title flex max-w-[50%] m-auto min-h-[230px] items-center justify-center">
            <h3 className="font-[700] text-2xl">Visit Our Blog</h3>
          </div>
          <div className="blogs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[80%] m-auto pt-4">
            <div className="first-blog bg-white rounded-lg shadow-lg">
              <div className="blog-img"></div>
              <div className="blog-content p-5">
                <h4>5 Ways to Keep Your Dog Healthy</h4>
                <br />
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
              <div className="blog-author p-5 flex gap-3 items-center">
                <div className="author-img">
                  <img src="../src/Images/smith.webp" alt="smith" />
                </div>
                <div className="author-name">
                  <p>Dr.Smith</p>
                </div>
              </div>
            </div>
            <div className="first-blog bg-white rounded-lg shadow-lg">
              <div className="blog-img"></div>
              <div className="blog-content p-5">
                <h4>5 Ways to Keep Your Dog Healthy</h4>
                <br />
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
              <div className="blog-author p-5 flex gap-3 items-center">
                <div className="author-img">
                  <img src="../src/Images/smith.webp" alt="smith" />
                </div>
                <div className="author-name">
                  <p>Dr.Smith</p>
                </div>
              </div>
            </div>
            <div className="first-blog bg-white rounded-lg shadow-lg">
              <div className="blog-img"></div>
              <div className="blog-content p-5">
                <h4>5 Ways to Keep Your Dog Healthy</h4>
                <br />
                <p>Lorem ipsum dolor sit amet consectetur.</p>
              </div>
              <div className="blog-author p-5 flex gap-3 items-center">
                <div className="author-img">
                  <img src="../src/Images/smith.webp" alt="smith" />
                </div>
                <div className="author-name">
                  <p>Dr.Smith</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
