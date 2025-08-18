import { useContext } from "react";
import { ShopsContext } from "../Context/ShopsProvider";

export const useShops = () => {
  const context = useContext(ShopsContext);
  if (!context) {
    throw new Error("useShops must be used within a ShopsProvider");
  }
  return context;
};
