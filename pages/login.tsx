import { useSelector } from "react-redux";
import UserLogin from "../components/userLogin";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Auth } from "../store/auth";
import OwnerLogin from "../components/ownerLogin";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

const Login = () => {
  const auth = useSelector((state: { auth: Auth }) => state.auth);
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
      {router.query.type !== "user" ? (
        <div>
          <OwnerLogin />
        </div>
      ) : (
        <div>
          <UserLogin />
        </div>
      )}
    </div>
  );
};

export default Login;
