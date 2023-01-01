import { useCookies } from "react-cookie";
import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { Auth, authActions, Type } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";
import Nav from "./nav";

interface Props {
  children: React.ReactNode;
}

const Layout = (props: Props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt", "type"]);
  const dispatch = useDispatch();
  const auth = useSelector((state: { auth: Auth }) => state.auth);
  const validate = useCallback(
    async (jwt: string) => {
      let res = await axios
        .get(`${process.env.NEXT_PUBLIC_HOST}/users/validate`, {
          headers: { Authorization: "bearer " + jwt },
        })
        .then((res) => {
          dispatch(authActions.login({ ...res.data, token: jwt }));
        })
        .catch((err) => removeCookie("jwt"));
    },
    [dispatch]
  );
  useEffect(() => {
    if (cookies.jwt) {
      validate(cookies.jwt);
    } else {
      setCookie("type", "guest");
      dispatch(authActions.setGuest(Type.guest));
    }
  }, [validate, cookies.jwt]);

  return (
    <div>
      <Nav auth={auth} />
      <div className="pt-12">{props.children}</div>
    </div>
  );
};

export default Layout;
