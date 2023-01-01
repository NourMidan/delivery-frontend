import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Type } from "../store/auth";
import OwnerRegister from "../components/ownerRegister";
import UserRegister from "../components/userRegister";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

const Register = () => {
  const auth = useSelector(
    (state: { auth: { isAuthenticated: boolean; type: Type } }) => state.auth
  );

  const [calledPush, setCalledPush] = useState(false);
  const router = useRouter();
  const [type, setType] = useQueryParam("type", withDefault(StringParam, ""));

  useEffect(() => {
    if (!router.query.type) {
      setType("user");
    }
  }, [router]);

  useEffect(() => {
    if (calledPush) {
      return;
    }
    if (auth.type === "user") {
      router.push("/menus");
      setCalledPush(true);
    } else if (auth.type === "owner") {
      router.push("/owner-menu");
      setCalledPush(true);
    }
  }, [auth]);

  if (!router.query.type) {
    return null;
  }
  return (
    <div>
      {router.query.type === "user" ? (
        <div>
          <UserRegister />
        </div>
      ) : (
        <div>
          <OwnerRegister />
        </div>
      )}
    </div>
  );
};

export default Register;
