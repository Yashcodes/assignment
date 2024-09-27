import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/AuthStyles/Register.css";
import { MDBBtn, MDBInput } from "mdb-react-ui-kit";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/Auth";
import SignIn from "../../assets/images/Register/signIn.svg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [selectedUser, setSelectedUser] = useState([]);

  const [auth, setAuth] = useAuth();

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
        "http://localhost:5000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          name,
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
        navigate("/");
      } else {
        console.log(data);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error in creating account");
    }
  };

  // const options = [
  //   { value: "institute", label: "Institute" },
  //   { value: "teacher", label: "Teacher" },
  //   { value: "student", label: "Student" },
  // ];

  // const handleSelectChange = (selected) => {
  //   setSelectedUser(selected);
  // };

  return (
    <>
      <div className="register-page container-fluid bg-gray-gradient">
        <div className="register-left col-md-4 col-sm-9">
          <h1 className="fs-2" color="darkgray" style={{ fontWeight: "600" }}>
            Register
          </h1>
          <p className="fs-5">
            Join our digital journey with high quality software services and
            interactive learning guidance!
          </p>

          <img
            src={SignIn}
            alt="Register CodeNesters"
            className="img-fluid"
            width={"auto"}
            height={"auto"}
          />
        </div>

        <div className="register-right col-md-4 col-sm-10">
          <div className="register-card shadow-lg">
            <div className="register-card-header my-3">
              <div className="card-head">
                <h2>Register</h2>
              </div>
            </div>

            <div className="register-card-input">
              <div className="register-name mb-3">
                <MDBInput
                  label="Your Name"
                  type="text"
                  size="lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
              {/* <div className="register-phone mb-3">
                <MDBInput
                  label="Phone Number"
                  type="text"
                  size="lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div> */}

              {/* <div className="register-role mb-3">
                <Select
                  defaultValue={selectedUser}
                  onChange={handleSelectChange}
                  options={options}
                  isSearchable
                  className="services-select"
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      background: "none",
                    }),
                  }}
                  placeholder={"Select role"}
                  value={selectedUser}
                />
              </div> */}

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
              {/* <div className="register-password mb-3">
                <MDBInput
                  label="Confirm Password"
                  type="password"
                  size="lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div> */}
            </div>

            <div className="register-card-btn mb-2">
              <MDBBtn
                className={`w-100 card-btn`}
                onClick={handleSubmit}
                disabled={name === "" || email === "" || password === ""}
              >
                Create Account
              </MDBBtn>
            </div>

            <div className="login-option mb-3">
              <p className="text-center">
                Do you already have an account?
                <Link to={"/login"}> Login Here </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
