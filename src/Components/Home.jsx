import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Hero from "./Hero";
import Categories from "./Categories";
import ProductShowCase from "./ProductShowCase";
import Footer from "./Footer";
import "../CSS/Home.css";
import noise from "../Images/noise.jpg";
import { checkTokens, isAuthenticated, getCurrentUser } from "../utils/auth";

const Home = () => {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  useEffect(() => {
    checkTokens();

    if (authenticated) {
      console.log("✅ User is authenticated and ready!");
      console.log("User info:", user);
    } else {
      console.log("❌ User is not authenticated");
    }
  }, [authenticated, user]);

  const topPicksProducts = [
    {
      id: 1,
      name: "Noise-cancelling",
      price: "9.99",
      originalPrice: "12.99",
      image: noise,
      category: "electronics",
    },
    {
      id: 2,
      name: "Stylish Jacket",
      price: "45.99",
      originalPrice: "65.99",
      image:
        "https://cdn.shopify.com/s/files/1/0867/4417/0787/files/winter-jacket-for-men.jpg?v=1725260898",
      category: "fashion",
    },
    {
      id: 3,
      name: "Comfortable Sofa",
      price: "299.99",
      originalPrice: "399.99",
      image:
        "https://cdn.thewirecutter.com/wp-content/media/2024/12/BEST-ONLINE-SOFAS-SUB-2048px-sixpenny-aria-grande.jpg?auto=webp&quality=75&width=1024",
      category: "furniture",
    },
    {
      id: 4,
      name: "Gourmet dog cookies",
      price: "9.99",
      originalPrice: "14.99",
      image:
        "https://i.etsystatic.com/13595738/r/il/2f46cf/3711835356/il_570xN.3711835356_e5c9.jpg",
      category: "pets",
    },
    {
      id: 5,
      name: "Natural bird feed",
      price: "7.99",
      originalPrice: "11.99",
      image:
        "https://peckishbirdfood.com/cdn/shop/products/60051338_1_v2.jpg?v=1675160670",
      category: "pets",
    },
    {
      id: 6,
      name: "Durable chew toy",
      price: "12.99",
      originalPrice: "18.99",
      image:
        "https://m.media-amazon.com/images/I/71KHlJw+8TL._UF1000,1000_QL80_.jpg",
      category: "pets",
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const blogPosts = [
    {
      id: 1,
      title: "5 Ways to Keep Your Dog Healthy",
      description: "Expert tips for a happy, healthy dog.",
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=300&fit=crop",
      author: {
        name: "Dr. Smith",
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face",
      },
      date: "March 15, 2024",
    },
    {
      id: 2,
      title: "5 Ways to Keep Your Dog Healthy",
      description: "Essential advice from veterinarians.",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=300&fit=crop",
      author: {
        name: "Dr. Smith",
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face",
      },
      date: "March 12, 2024",
    },
    {
      id: 3,
      title: "5 Ways to Keep Your Dog Healthy",
      description: "Practical suggestions for dog care.",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=300&fit=crop",
      author: {
        name: "Dr. Smith",
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face",
      },
      date: "March 10, 2024",
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Header />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Hero />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Categories />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ProductShowCase products={topPicksProducts} />
      </motion.div>

      <motion.section className="our-blog py-16" variants={itemVariants}>
        <div className="blog-wrapper bg-gray-300 min-h-[70vh] py-16">
          <motion.div
            className="title flex justify-center items-center mb-12"
            variants={itemVariants}
          >
            <h3 className="font-bold text-3xl md:text-4xl text-gray-800 text-center">
              Visit Our Blog
            </h3>
          </motion.div>

          <motion.div
            className="blogs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[90%] lg:max-w-[85%] m-auto px-4"
            variants={containerVariants}
          >
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className="blog-card bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      delay: index * 0.2,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                <div className="blog-img h-48 md:h-52 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="blog-content p-6">
                  <h4 className="font-bold text-lg md:text-xl text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="blog-author flex items-center gap-3">
                    <div className="author-img w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="author-info">
                      <p className="font-medium text-gray-800 text-sm md:text-base">
                        {post.author.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {post.date}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="text-center mt-12" variants={itemVariants}>
            <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300">
              View All Posts
            </button>
          </motion.div>
        </div>
      </motion.section>

      <motion.div variants={itemVariants}>
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default Home;
