import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  memo,
  Suspense,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../../Backend/Api/api";


const Header = lazy(() => import("../Header"));
const Footer = lazy(() => import("../Footer"));


const LoadingSpinner = memo(() => (
  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-emerald-500 mx-auto" />
));


const SearchLoadingSpinner = memo(() => (
  <i className="fa-solid fa-spinner animate-spin text-xl"></i>
));


const FilterSidebar = memo(
  ({ sortBy, sortDirection, onSortChange, blogs, totalElements, lastSearchTerm }) => {
    const handleSortChange = useCallback(
      (e) => {
        const [field, direction] = e.target.value.split(",");
        onSortChange(field, direction);
      },
      [onSortChange]
    );

    return (
      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:sticky lg:top-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <i className="fa-solid fa-filter mr-2 text-emerald-600"></i>
            Filters
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <i className="fa-solid fa-sort mr-2 text-emerald-600"></i>
                Sort By
              </label>
              <select
                value={`${sortBy},${sortDirection}`}
                onChange={handleSortChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-emerald-500 transition-all"
              >
                <option value="createdAt,desc">🆕 Newest First</option>
                <option value="createdAt,asc">⏰ Oldest First</option>
                <option value="title,asc">🔤 Title A-Z</option>
                <option value="title,desc">🔤 Title Z-A</option>
              </select>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-600">
              <i className="fa-solid fa-newspaper mr-2 text-emerald-600"></i>
              Showing {blogs.length} of {totalElements} blogs
              {lastSearchTerm && (
                <div className="mt-2 text-emerald-600 truncate">
                  for &quot;{lastSearchTerm}&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FilterSidebar.displayName = "FilterSidebar";


const Blogs = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const res = await axios.get(`${apiURL}/api/v1/users/me/blogs`);
      setBlogs(res.data || []);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  const handleSortChange = useCallback((field, direction) => {
    setSortBy(field);
    setSortDirection(direction);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setLastSearchTerm("");
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setTimeout(() => {
      setLastSearchTerm(searchTerm);
      setSearchLoading(false);
    }, 500);
  };

  const filteredBlogs = useMemo(() => {
    let data = [...blogs];

    if (lastSearchTerm) {
      data = data.filter((b) =>
        b.title?.toLowerCase().includes(lastSearchTerm.toLowerCase())
      );
    }

    data.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (!aVal || !bVal) return 0;
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return data;
  }, [blogs, lastSearchTerm, sortBy, sortDirection]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Header />
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-30 relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Our Blog...
          </h1>
          <p className="text-xl text-gray-300">
            Insights, tips and articles for modern creators...
          </p>
        </div>
      </div>
      <div className="relative -mt-8 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 transform transition-all duration-300">
            <form
              onSubmit={handleManualSearch}
              className="flex flex-col lg:flex-row gap-6"
            >
              <div className="flex-1">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search for blogs by title..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-gray-50 focus:bg-white"
                  />

                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">

                    {searchLoading ? (
                      <SearchLoadingSpinner />
                    ) : (
                      <i className="fa-solid fa-search text-xl"></i>
                    )}
                  </div>

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={searchLoading}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70"
              >
                {searchLoading ? (
                  <>
                    <SearchLoadingSpinner />
                    <span className="ml-2">Searching...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-search mr-2"></i>
                    Search
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-24">

            <FilterSidebar
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              blogs={filteredBlogs}
              totalElements={blogs.length}
              lastSearchTerm={lastSearchTerm}
            />

            <div className="flex-1">
              {loading ? (
                <LoadingSpinner />
              ) : filteredBlogs.length === 0 ? (
                <div className="bg-white p-16 rounded-2xl text-center">
                  No blogs found
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredBlogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      onRead={() => navigate(`/blogs/${blog.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </Suspense>
  );
};

export default Blogs;
