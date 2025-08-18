import React from "react";
import Routing from "./Routing/Routing";
import "./utils/axiosInterceptors";
import ShopsProvider from "./Context/ShopsProvider";

const App = () => {
  return (
    <ShopsProvider>
      <Routing />
    </ShopsProvider>
  );
};

export default App;
