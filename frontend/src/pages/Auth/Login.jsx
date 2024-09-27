import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/AuthStyles/Register.css";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/Auth";
import SignIn from "../../assets/images/Register/signIn.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [auth, setAuth] = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          email,
          password,
        }
      );

      if (data.success) {
        setAuth({
          ...auth,
          user: data.user,
          authToken: data.authToken,
        });

        toast.success(data.message);

        localStorage.setItem("auth", JSON.stringify(data));
        navigate(location.state || "/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error while logging in");
    }
  };

  return (
    <>
      <div className="register-page container-fluid bg-gray-gradient">
        <div className="register-left col-md-4 col-sm-9">
          <h1
            className="text-gray fs-2"
            color="darkgray"
            style={{ fontWeight: "600" }}
          >
            Login
          </h1>
          <p className="fs-5">
            Already a member! Stay connected with us for future updates and get
            benefited with our products and services.
          </p>

          <img
            src={SignIn}
            alt="Login CodeNesters"
            className="img-fluid"
            height={"auto"}
            width={"auto"}
          />
        </div>

        <div className="register-right col-md-4 col-sm-10">
          <div className="register-card shadow-lg">
            <div className="register-card-header my-3">
              <div className="card-head">
                <h2>Login</h2>
              </div>
            </div>

            <div className="register-card-input">
              <div className="register-email mb-3">
                <MDBInput
                  label="Email Address"
                  type="email"
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="register-password mb-3">
                <MDBInput
                  label="Enter Password"
                  type="password"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="register-card-btn mb-2">
              <MDBBtn
                className="w-100 card-btn"
                onClick={handleSubmit}
                disabled={email === "" || password === ""}
              >
                Login
              </MDBBtn>
            </div>

            <div className="login-option mb-1">
              <p className="text-center mb-0">
                Don't have an account?
                <Link to={"/register"}> Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
