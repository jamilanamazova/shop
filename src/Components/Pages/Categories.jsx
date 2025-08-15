import React from "react";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      icon: "fa-solid fa-laptop",
    },
    {
      id: 2,
      name: "Fashion",
      icon: "fa-solid fa-shirt",
    },
    {
      id: 3,
      name: "Home &",
      icon: "fa-solid fa-house",
    },
    {
      id: 4,
      name: "Beauty",
      icon: "fa-solid fa-heart",
    },
    {
      id: 5,
      name: "Sports",
      icon: "fa-solid fa-dumbbell",
    },
    {
      id: 6,
      name: "Toys",
      icon: "fa-solid fa-gamepad",
    },
  ];

  return (
    <section className="categories-section py-12 px-4">
      <div className="max-w-[90%] lg:max-w-[80%] m-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card bg-gray-200 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center hover:bg-gray-300 transition-all duration-300 cursor-pointer transform hover:scale-105 min-h-[140px] md:min-h-[180px]"
            >
              <div className="icon-container mb-3 md:mb-4">
                <i
                  className={`${category.icon} text-2xl md:text-3xl lg:text-4xl text-gray-700`}
                ></i>
              </div>

              <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-800 text-center leading-tight">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
