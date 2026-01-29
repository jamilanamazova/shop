import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-red-100 mb-6">
              <span className="text-4xl font-bold text-red-600">404</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Page Not Found
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Oops! The page you're looking for doesn't exist. It might have
                  been moved, deleted, or you entered the wrong URL.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-3">
                  What you can do:
                </h3>
                <ul className="text-xs text-blue-700 space-y-2 text-left">
                  <li className="flex items-start">
                    <i className="fa-solid fa-circle-check text-blue-600 mr-2 mt-0.5 text-xs"></i>
                    Check the URL for typos
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-circle-check text-blue-600 mr-2 mt-0.5 text-xs"></i>
                    Go back to the previous page
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-circle-check text-blue-600 mr-2 mt-0.5 text-xs"></i>
                    Visit our homepage to start fresh
                  </li>
                  <li className="flex items-start">
                    <i className="fa-solid fa-circle-check text-blue-600 mr-2 mt-0.5 text-xs"></i>
                    Use the search feature to find what you need
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link
                  to="/"
                  className="block w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 text-center"
                >
                  <i className="fa-solid fa-home mr-2"></i>
                  Back to Home
                </Link>

                <button
                  onClick={() => window.history.back()}
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300"
                >
                  <i className="fa-solid fa-arrow-left mr-2"></i>
                  Go Back
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Error Code: 404 | Page Not Found
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <i className="fa-solid fa-question-circle text-yellow-600 mr-2"></i>
                <p className="text-sm text-yellow-800">
                  Still need help? Contact our{" "}
                  <Link
                    to="/customer/support"
                    className="font-medium text-yellow-900 hover:text-yellow-700"
                  >
                    support team
                  </Link>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link
                to="/customer/products"
                className="flex items-center justify-center py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <i className="fa-solid fa-shopping-bag mr-1"></i>
                Shop Now
              </Link>
              <Link
                to="/customer/blog"
                className="flex items-center justify-center py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <i className="fa-solid fa-newspaper mr-1"></i>
                Read Blog
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              If you believe this is an error, please{" "}
              <Link
                to="/customer/support"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                report it
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
