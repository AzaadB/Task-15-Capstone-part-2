//This layout component is going to be the parent component//
import { Outlet } from "react-router-dom";

import React from "react";

const Layout = () => {
  return <Outlet />;
};

export default Layout;
