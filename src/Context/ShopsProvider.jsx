import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { apiURL } from "../Backend/Api/api";

const ShopsContext = createContext();

const ShopsProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllShops = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${apiURL}/shops`, {
        params: { page: 0, size: 1000 },
      });

      if (response.data.status === "OK" && response.data.data) {
        setShops(response.data.data.content || []);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      setError("Failed to load shops");
    } finally {
      setLoading(false);
    }
  }, []);

  const getShopById = useCallback(
    (id) => {
      return shops.find((shop) => shop.id === id);
    },
    [shops]
  );

  const refreshShops = useCallback(() => {
    fetchAllShops();
  }, [fetchAllShops]);

  useEffect(() => {
    fetchAllShops();
  }, [fetchAllShops]);

  const value = {
    shops,
    loading,
    error,
    getShopById,
    refreshShops,
    fetchAllShops,
  };

  return (
    <ShopsContext.Provider value={value}>{children}</ShopsContext.Provider>
  );
};

ShopsProvider.displayName = "ShopsProvider";

export default ShopsProvider;
export { ShopsContext };
