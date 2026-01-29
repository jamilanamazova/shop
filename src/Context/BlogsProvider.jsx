import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { apiURL } from "../Backend/Api/api";

const BlogsContext = createContext();

const BlogsProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${apiURL}/api/v1/users/me/blogs`,
        {
          params: { page: 0, size: 1000 },
        }
      );

      if (response.data?.data) {
        setBlogs(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlogById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${apiURL}/api/v1/users/me/blogs/${id}`
        );

        if (response.data?.data) {
          setSelectedBlog(response.data.data);
          return response.data.data;
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    },
    []
  );


  const likeBlog = async (id) => {
    try {
      await axios.post(
        `${apiURL}/api/v1/users/me/blogs/${id}/like`
      );

      setSelectedBlog((prev) =>
        prev ? { ...prev, likes: prev.likes + 1 } : prev
      );
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const createBlog = async (data) =>
    axios.post(`${apiURL}/api/v1/users/me/blogs`, data);

  const updateBlog = async (id, data) =>
    axios.put(`${apiURL}/api/v1/users/me/blogs/${id}`, data);


  const uploadBlogImage = async (id, file) => {
    const formData = new FormData();
    formData.append("image", file);

    return axios.post(
      `${apiURL}/api/v1/users/me/blogs/${id}/image`,
      formData
    );
  };

  const deleteBlogImage = async (id) =>
    axios.delete(
      `${apiURL}/api/v1/users/me/blogs/${id}/image`
    );


  const refreshBlogs = useCallback(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  const value = {
    blogs,
    selectedBlog,
    loading,
    error,
    fetchAllBlogs,
    getBlogById,
    refreshBlogs,
    likeBlog,
    createBlog,
    updateBlog,
    uploadBlogImage,
    deleteBlogImage,
  };

  return (
    <BlogsContext.Provider value={value}>
      {children}
    </BlogsContext.Provider>
  );
};

BlogsProvider.displayName = "BlogsProvider";

export default BlogsProvider;
export { BlogsContext };
