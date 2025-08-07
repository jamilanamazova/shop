import React, { useState, useEffect } from "react";
import "../CSS/ProductShowcase.css";
import catWithToys from "../Images/catwithtoys.jpg";
import { Link } from "react-router-dom";

const ProductShowCase = ({ products }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 1,
    minutes: 5,
    seconds: 7,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="product-showcase py-8 px-4">
      <div className="max-w-[95%] lg:max-w-[90%] m-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fa-solid fa-gift"></i>
                Special Deals
              </h3>
            </div>

            <div className="bg-gray-200 rounded-lg p-6 text-center">
              <h4 className="text-xl font-bold mb-2">Featured</h4>
              <p className="text-sm text-gray-600 mb-4">Introducing Fresh</p>
              <div className="flex justify-center items-center mb-4">
                <div className="relative">
                  <img
                    src={catWithToys}
                    alt="Featured"
                    className="w-32 h-25 rounded-lg object-cover"
                  />
                  <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                    20% OFF
                  </span>
                </div>
              </div>
              <button className="bg-white text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full">
                Explore Now
              </button>
            </div>

            <div className="bg-black rounded-lg p-6 text-center text-white">
              <h4 className="text-lg font-bold mb-2">LIMITED TIME</h4>
              <p className="text-sm mb-4">Hurry, ends soon!</p>
              <div className="flex justify-center gap-2 text-2xl font-bold">
                <div className="bg-white text-black px-3 py-2 rounded">
                  {timeLeft.days.toString().padStart(2, "0")}
                </div>
                <div className="bg-white text-black px-3 py-2 rounded">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <span className="text-white">:</span>
                <div className="bg-white text-black px-3 py-2 rounded">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="bg-white text-black px-3 py-2 rounded">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-gray-200 rounded-lg p-4 mb-6 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fa-solid fa-star"></i>
                Top Picks
              </h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-300 rounded-full transition-colors">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className="p-2 hover:bg-gray-300 rounded-full transition-colors">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {products.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <div
                    key={product.id}
                    className="bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="relative group">
                      <div className="h-40 bg-gray-300 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors cursor-pointer">
                          Add to cart
                        </button>
                      </div>
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                        <i className="fa-solid fa-heart text-gray-600"></i>
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="bg-gray-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i className="fa-solid fa-paw"></i>
                Popular Categories
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-300 rounded-lg p-18 relative overflow-hidden cat-background">
                <div className="relative z-99 flex flex-col items-center">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Gourmet Cat Treats
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Tasty options for your feline
                  </p>
                  <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Shop Now
                  </button>
                </div>
                <div className="absolute right-4 top-4 opacity-20">
                  <i className="fa-solid fa-cat text-6xl text-gray-600"></i>
                </div>
              </div>

              <div className="bg-gray-300 rounded-lg p-6 relative overflow-hidden dog-background flex justify-center items-center">
                <div className="relative z-99 flex flex-col items-center">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    Pet Accessories
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Collars, Leashes, and more
                  </p>
                  <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Browse
                  </button>
                </div>
                <div className="absolute right-4 top-4 opacity-20">
                  <i className="fa-solid fa-dog text-6xl text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowCase;
