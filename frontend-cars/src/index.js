import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
//importing Provider from react-redux (line 7)
import { store } from "./app/store";
//Importing the store component(line 9)
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
//importing disableReactDevTools from the @fvilers/disable-react-devtools(line 11)

if (process.env.NODE_ENV === "production") disableReactDevTools();
/*So if we are in production mode which we should be, we call the disableReactDevTools() function(line 15) 
and when the app is deployed the react-dev-tools will be disabled*/
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/*Bringing the app component back within the element property(line 12)*/}
          <Route path="/*" element={<App />} />
          {/*Inside the path of the route(line 12) the astrisk allows us to have nested routes*/}
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
