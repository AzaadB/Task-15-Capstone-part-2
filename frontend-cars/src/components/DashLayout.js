import React from "react";
import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

const DashLayout = () => {
  return (
    <>
      <DashHeader />
      {/*The DashHeader component(line 9) will be above every page of the protected parts of the site*/}
      <div className="dash-container">
        <Outlet />
      </div>
      <DashFooter />
      {/*The dash footer component(line 14) won't be seen on the public page, but once we are on the dash part of the pagw which represents the protected part of our site,
    we'll be able to see both the header and footer once it has been created*/}
    </>
  );
};

export default DashLayout;
