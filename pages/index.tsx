import Router from "next/router";
import { useCookies } from "react-cookie";

export default function Home() {
  const [cookies, setCookie, removeCookie] = useCookies(["type"]);

  if (cookies.type === "guest" || cookies.type === "user") {
    Router.push("/menus");
  } else if (cookies.type === "owner") {
    Router.push("/owner-menu");
  } else {
    return null;
  }
}
