import React from "react";
import { Link } from "react-router-dom";
import "../../components/Layout/styles/Header.css";
import { useAuth } from "../../context/Auth";
import toast from "react-hot-toast";

const Header = () => {
  const [auth, setAuth] = useAuth();

  const handleLogout = async () => {
    setAuth({
      ...auth,
      user: null,
      authToken: "",
    });

    localStorage.removeItem("auth");
    toast.success("Logged Out Successfully");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundImage:
            "linear-gradient(to right,#9d50bb 0%,#6e48aa 51%,#9d50bb 100%)",
        }}
      >
        <div className="container-fluid m-1">
          <Link
            className="navbar-brand fs-2 fw-bold text-white"
            to={"/"}
            style={{ gap: "6px" }}
          >
            {window.innerWidth <= "400" ? "" : <span>Project</span>}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ background: "none" }}
          >
            <span
              className="navbar-toggler-icon"
              style={{ borderRadius: "8px" }}
            />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item mx-1">
                <Link to={"/"} className="nav-link active" aria-current="page">
                  Home
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link to={"/dashboard/employees"} className="nav-link active" aria-current="page">
                  Employee List
                </Link>
              </li>
            </ul>

            <div className="d-flex gap-3 align-items-center">
              <h4 className="m-0">{auth?.user?.name?.split(" ")[0]}</h4>
              {auth?.user ? (
                <button className={`btn register-btn text-white fs-6`}>
                  <Link
                    to={"/login"}
                    className="text-white"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Logout
                  </Link>
                </button>
              ) : (
                <button className={`btn register-btn text-white fs-6`}>
                  <Link to={"/register"} className="text-white">
                    Register
                  </Link>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
