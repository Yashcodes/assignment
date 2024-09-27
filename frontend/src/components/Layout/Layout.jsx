import React from "react";
import Header from "./Header";

const Layout = (props) => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "80vh" }}> {props.children}</main>
    </div>
  );
};

export default Layout;
