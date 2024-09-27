import React, { useEffect } from "react";
import Layout from "../components/Layout/Layout.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Layout>
      <h1 style={{ textAlign: "center", color: "black", fontSize: "80px" }}>
        Home Page
      </h1>
    </Layout>
  );
};

export default Home;
