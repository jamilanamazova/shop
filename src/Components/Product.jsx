import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Product = ({ products }) => {
  const { id } = useParams();

  const product = products.find((product) => Number(product.id) === Number(id));

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <i className="fa-solid fa-exclamation-triangle text-red-600 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-gray-800 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-gray-800 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </li>
              <li className="text-gray-800 font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex space-x-3">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-black transition-colors cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt={`${product.name} view ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h1>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className="fa-solid fa-star text-yellow-400 text-sm"
                        ></i>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-2">
                      (4.8) 156 reviews
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl font-bold text-gray-800">
                      ${product.price}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      $89.99
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      20% OFF
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Size
                    </h3>
                    <div className="flex space-x-2">
                      {["XS", "S", "M", "L", "XL"].map((size) => (
                        <button
                          key={size}
                          className="w-12 h-12 border border-gray-300 rounded-lg font-medium hover:border-black transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Color
                    </h3>
                    <div className="flex space-x-2">
                      {[
                        "bg-black",
                        "bg-gray-400",
                        "bg-blue-500",
                        "bg-red-500",
                      ].map((color, index) => (
                        <button
                          key={index}
                          className={`w-8 h-8 rounded-full ${color} border-2 border-gray-300 hover:border-black transition-colors focus:outline-none focus:ring-2 focus:ring-black`}
                        ></button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Quantity
                    </h3>
                    <div className="flex items-center space-x-3">
                      <button className="w-10 h-10 border border-gray-300 rounded-lg font-medium hover:border-black transition-colors">
                        <i className="fa-solid fa-minus text-sm"></i>
                      </button>
                      <span className="text-lg font-medium w-12 text-center">
                        1
                      </span>
                      <button className="w-10 h-10 border border-gray-300 rounded-lg font-medium hover:border-black transition-colors">
                        <i className="fa-solid fa-plus text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300">
                    <i className="fa-solid fa-shopping-cart mr-2"></i>
                    Add to Cart
                  </button>

                  <button className="w-full bg-gray-100 text-gray-800 py-4 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-300">
                    <i className="fa-solid fa-heart mr-2"></i>
                    Add to Wishlist
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <i className="fa-solid fa-truck mr-2"></i>
                      Free shipping
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fa-solid fa-shield-check mr-2"></i>2 year
                      warranty
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fa-solid fa-undo mr-2"></i>
                      30 day returns
                    </div>
                    <div className="flex items-center text-gray-600">
                      <i className="fa-solid fa-headset mr-2"></i>
                      24/7 support
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-8">
                <button className="py-4 px-2 border-b-2 border-black text-black font-medium">
                  Description
                </button>
                <button className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-800 transition-colors">
                  Reviews (156)
                </button>
                <button className="py-4 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-800 transition-colors">
                  Shipping Info
                </button>
              </nav>
            </div>

            <div className="p-8">
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-square bg-gray-50">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600 font-bold">
                      ${relatedProduct.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
