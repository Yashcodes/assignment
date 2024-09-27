import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Spinner from "../../Utils/Spinner"

const Private = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/employee/user-auth",
        {
          headers: {
            Authorization: auth?.authToken,
          },
        }
      );

      if (data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };

    if (auth?.authToken) authCheck();
  }, [auth?.authToken]);

  return ok ? <Outlet /> : <Spinner />;
};

export default Private;
