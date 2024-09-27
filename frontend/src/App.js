import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import { Toaster } from "react-hot-toast";
import CreateEmployee from "./pages/CreateEmployee";
import EmployeeList from "./pages/EmployeeList";
import Private from "./components/Routes/Private";
import EditEmployee from "./pages/EditEmployee";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Private />}>
          <Route path="create-employee" element={<CreateEmployee />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="edit-employee/:id" element={<EditEmployee />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
