import React from "react";
import Routing from "./Routing/Routing";
import "./utils/axiosInterceptors";
import ShopsProvider from "./Context/ShopsProvider";
import BlogsProvider from "./Context/BlogsProvider";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import CartSuccessToast from "./Components/Cart/CartSuccessToast";
import CartSidebar from "./Components/Cart/CartSidebar";


const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BlogsProvider>
          <ShopsProvider>
            <Routing />
            <CartSidebar />
            <CartSuccessToast />
          </ShopsProvider>
        </BlogsProvider>
      </PersistGate>
    </Provider>
  );
};


export default App;
