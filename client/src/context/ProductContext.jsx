import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const refreshProducts = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-list/1");

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const value = useMemo(
    () => ({
      products,
      setProducts,
      refreshProducts,
    }),
    [products, refreshProducts],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
