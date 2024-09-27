// EditEmployee.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBInput,
  MDBRadio,
  MDBCheckbox,
  MDBFile,
} from "mdb-react-ui-kit"; // Import MDBCheckbox
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Select from "react-select";

const EditEmployee = () => {
  const { id } = useParams(); // Get employee ID from URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [gender, setGender] = useState("");
  const [courses, setCourses] = useState({
    MCA: false,
    BCA: false,
    BSC: false,
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/employee/get-employee/${id}`,
          {
            headers: {
              Authorization: auth?.authToken,
            },
          }
        );
        if (response.data.success) {
          const emp = response.data.employee;
          setEmployee(emp);
          setName(emp.name);
          setEmail(emp.email);
          setPhone(emp.phone);
          setGender(emp.gender);
          setSelectedDepartment({ label: emp.designation, value: emp.designation });
          setCourses({
            MCA: emp.courses.includes("MCA"),
            BCA: emp.courses.includes("BCA"),
            BSC: emp.courses.includes("BSC"),
          });
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, auth?.authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCourses = Object.entries(courses)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("designation", selectedDepartment.label);
    formData.append("gender", gender);
    formData.append("courses", JSON.stringify(selectedCourses));
    if (file) {
      formData.append("employeeeImage", file);
    }

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/v1/employee/update-employee/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth?.authToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/dashboard/employees");
      } else {
        console.log(data);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error updating employee");
    }
  };

  const options = [
    { value: "hr", label: "HR" },
    { value: "manager", label: "Manager" },
    { value: "sales", label: "Sales" },
  ];

  const handleSelectChange = (selected) => {
    setSelectedDepartment(selected);
  };

  const handleCourseChange = (course) => {
    setCourses({
      ...courses,
      [course]: !courses[course],
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="register-page container-fluid">
        <div className="register-right col-md-4 col-sm-10">
          <div className="register-card shadow-lg">
            <div className="register-card-header my-3">
              <div className="card-head">
                <h2 className="text-black">Edit Employee</h2>
              </div>
            </div>

            <div className="register-card-input">
              <div className="register-name mb-3">
                <MDBInput
                  label="Employee Name"
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
              <div className="register-phone mb-3">
                <MDBInput
                  label="Phone Number"
                  type="text"
                  size="lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="register-gender mb-3 d-flex gap-4">
                <label className="form-label">Gender:</label>
                <div>
                  <MDBRadio
                    name="gender"
                    id="male"
                    label="Male"
                    value="male"
                    onChange={(e) => setGender(e.target.value)}
                    checked={gender === "male"}
                    inline
                  />
                  <MDBRadio
                    name="gender"
                    id="female"
                    label="Female"
                    value="female"
                    onChange={(e) => setGender(e.target.value)}
                    checked={gender === "female"}
                    inline
                  />
                </div>
              </div>

              <div className="register-course mb-3 d-flex gap-4">
                <label className="form-label">Course:</label>
                <div>
                  <MDBCheckbox
                    name="MCA"
                    id="MCA"
                    label="MCA"
                    checked={courses.MCA}
                    onChange={() => handleCourseChange("MCA")}
                    inline
                  />
                  <MDBCheckbox
                    name="BCA"
                    id="BCA"
                    label="BCA"
                    checked={courses.BCA}
                    onChange={() => handleCourseChange("BCA")}
                    inline
                  />
                  <MDBCheckbox
                    name="BSC"
                    id="BSC"
                    label="BSC"
                    checked={courses.BSC}
                    onChange={() => handleCourseChange("BSC")}
                    inline
                  />
                </div>
              </div>

              <div className="register-role mb-3">
                <Select
                  defaultValue={selectedDepartment}
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
                  placeholder={"Select Designation"}
                  value={selectedDepartment}
                />
              </div>

              <div className="mb-3">
                <MDBFile
                  label="Upload Employee Image"
                  id="customFile"
                  accept="image/jpg, image/png, image/jpeg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>

            <div className="register-card-btn mb-2">
              <MDBBtn
                className={`w-100 card-btn`}
                onClick={handleSubmit}
                disabled={name === "" || email === ""}
              >
                Update Employee
              </MDBBtn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEmployee;
