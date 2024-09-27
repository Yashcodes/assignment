import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/Auth";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const itemsPerPage = 4;

  const deleteEmployee = useCallback(
    async (id) => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/employee/delete-employee",
          {
            method: "DELETE",
            headers: {
              Authorization: auth?.authToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              _id: id,
            }),
          }
        );

        const data = await response.json();

        if (data?.success) {
          toast.success(data?.message);
          await getAllEmployees();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error while deleting employee");
      } finally {
        setLoading(false);
      }
    },
    [auth?.authToken]
  );

  const getAllEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/employee/get-all-employee",
        {
          headers: {
            Authorization: auth?.authToken,
          },
        }
      );

      if (data?.success) {
        toast.success(data?.message);
        setEmployees(data?.employees);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error while getting details");
    } finally {
      setLoading(false);
    }
  }, [auth?.authToken]);

  useEffect(() => {
    getAllEmployees();
  }, [getAllEmployees]);

  // Sorting functionality
  const sortEmployees = (employees, key, direction) => {
    if (!key || !direction) return employees;

    return [...employees].sort((a, b) => {
      const valueA = a[key]?.toLowerCase?.() || a[key];
      const valueB = b[key]?.toLowerCase?.() || b[key];

      if (valueA < valueB) {
        return direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = sortEmployees(
    employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    sortConfig.key,
    sortConfig.direction
  );

  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = sortedEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to render the arrow for sorting
  const renderSortArrow = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "ascending" ? (
        <span
          style={{
            marginLeft: "5px",
            color: "black", // Darker color for the sorted column
          }}
        >
          ▲
        </span>
      ) : (
        <span
          style={{
            marginLeft: "5px",
            color: "black", // Darker color for the sorted column
          }}
        >
          ▼
        </span>
      );
    }
    return (
      <span
        style={{
          marginLeft: "5px",
          color: "#aaa", // Lighter color for unsorted columns
        }}
      >
        ▲
      </span>
    );
  };

  return (
    <Layout>
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="text-center p-4 text-black">Employee List</h1>
        <div className="d-flex align-items-center">
          <Link to={"/dashboard/create-employee"}>
            <button className="btn btn-primary">Create Employee</button>
          </Link>
          <span className="ms-3">Total Employees: {employees.length}</span>
        </div>
      </div>

      <div className="mb-4 px-4" style={{ width: "22rem" }}>
        <MDBInput
          label="Search by Name or Email"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <MDBTable>
            <MDBTableHead>
              <tr>
                <th
                  onClick={() => requestSort("_id")}
                  style={{ cursor: "pointer" }}
                >
                  ID {renderSortArrow("_id")}
                </th>
                <th>Image</th>
                <th
                  onClick={() => requestSort("name")}
                  style={{ cursor: "pointer" }}
                >
                  Name {renderSortArrow("name")}
                </th>
                <th
                  onClick={() => requestSort("email")}
                  style={{ cursor: "pointer" }}
                >
                  Email {renderSortArrow("email")}
                </th>
                <th>Mobile</th>
                <th>Designation</th>
                <th>Gender</th>
                <th>Course</th>
                <th
                  onClick={() => requestSort("createdAt")}
                  style={{ cursor: "pointer" }}
                >
                  Create Date {renderSortArrow("createdAt")}
                </th>
                <th>Action</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {Array.isArray(currentEmployees) &&
              currentEmployees.length > 0 ? (
                currentEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee._id}</td>
                    <td>
                      <img
                        src={employee.image}
                        alt={employee.name}
                        width="50"
                        height="50"
                      />
                    </td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.gender}</td>
                    <td>{employee.courses.replace(/[\[\]\"]/g, "")}</td>
                    <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/dashboard/edit-employee/${employee._id}`}>
                        <MDBBtn size="sm" color="warning" className="me-2">
                          Edit
                        </MDBBtn>
                      </Link>

                      <MDBBtn
                        size="sm"
                        color="danger"
                        onClick={() => deleteEmployee(employee._id)}
                      >
                        Delete
                      </MDBBtn>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No Employees Found
                  </td>
                </tr>
              )}
            </MDBTableBody>
          </MDBTable>

          {/* Pagination controls */}
          <div className="d-flex justify-content-center my-4">
            <nav>
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}
    </Layout>
  );
};

export default EmployeeList;
