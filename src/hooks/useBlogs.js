import { useContext } from "react";
import { BlogsContext } from "../Context/BlogsProvider";

export const useBlogs = () => {
  const context = useContext(BlogsContext);

  if (!context) {
    throw new Error("useBlogs must be used within a BlogsProvider");
  }

  return context;
};
