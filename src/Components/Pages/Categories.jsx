import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = memo(({ category, icon, index }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${categorySlug}`);
  };

  return (
    <div
      onClick={handleCategoryClick}
      className="group relative overflow-hidden rounded-2xl bg-white p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100 hover:border-emerald-200"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 text-center">
        <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">
          {icon}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors capitalize">
          {category.toLowerCase()}
        </h3>

        <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors">
          Explore {category.toLowerCase()} products
        </p>

        <div className="flex items-center justify-center text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span>Browse Collection</span>
          <i className="fa-solid fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

      <div className="absolute -top-4 -right-4 h-16 w-16 bg-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
});
CategoryCard.displayName = "CategoryCard";

const Categories = memo(() => {
  const categories = [
    {
      name: "ELECTRONICS",
      icon: "📱",
    },
    {
      name: "HOME",
      icon: "🏡", // Icon düzəldildi
    },
    {
      name: "BEAUTY",
      icon: "💄", // Icon düzəldildi
    },
    {
      name: "FASHION",
      icon: "👗", // Icon düzəldildi
    },
    {
      name: "SPORTS",
      icon: "⚽",
    },
    {
      name: "TOYS",
      icon: "🧸", // Icon düzəldildi
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover products across our carefully curated categories. Find
            exactly what you're looking for with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              category={category.name}
              icon={category.icon}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for?
          </p>
          <button
            onClick={() => (window.location.href = "/products")}
            className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <i className="fa-solid fa-grid mr-2"></i>
            Browse All Products
          </button>
        </div>
      </div>
    </section>
  );
});

Categories.displayName = "Categories";
export default Categories;
