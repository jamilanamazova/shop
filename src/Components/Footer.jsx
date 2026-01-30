import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4">
      <div className="max-w-[90%] lg:max-w-[85%] m-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          <div className="left-footer flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="shopery">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                Shopery
              </h2>
            </div>
          </div>

          <div className="right-footer">
            <p className="text-gray-600 text-sm md:text-base">© Shopery 2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
