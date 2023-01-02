import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Auth, authActions, Type } from "../store/auth";
import SideCart from "./sideCart";

let menus = (
  <Link
    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    href={"/menus"}
  >
    Menus
  </Link>
);
let register = (
  <Link
    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    href={"/register"}
  >
    Register
  </Link>
);
let login = (
  <Link
    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    href={"/login"}
  >
    Login
  </Link>
);
let ownerMenu = (
  <Link
    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    href={"/owner-menu"}
  >
    menu
  </Link>
);
let menuOrders = (
  <Link
    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    href={"/menu-orders"}
  >
    orders
  </Link>
);
let userorders = (
  <Link
    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    href={"/user-orders"}
  >
    orders
  </Link>
);

const Nav = (props: { auth: Auth }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt", "type"]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const cart = (
    <button
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      onClick={() => setOpen(true)}
    >
      <svg
        className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    </button>
  );
  const handleLogut = () => {
    removeCookie("jwt");
    removeCookie("type");
    dispatch(authActions.logout());
    Router.push("/login");
  };
  let logut = (
    <button
      onClick={() => handleLogut()}
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      logut
    </button>
  );

  const { type } = props.auth;
  if (!type) {
    return null;
  }
  return (
    <nav className="bg-gray-800 fixed top-0	 z-10 w-full">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1  justify-start ">
            <div className=" sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <div className="flex items-center">
                  {(type === "guest" || null) && <div>{menus}</div>}
                  {type === "user" && <div>{menus}</div>}
                  {type === "owner" && (
                    <div>
                      {ownerMenu}
                      {menuOrders}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {type === "guest" && (
              <div>
                {register}
                {login}
              </div>
            )}
            {type === "user" && (
              <div className="flex items-center">
                {userorders}
                {cart}
                {logut}
              </div>
            )}
            {type === "owner" && <div>{logut}</div>}
          </div>
        </div>
        <SideCart open={open} setOpen={(value: boolean) => setOpen(value)} />
      </div>
    </nav>
  );
};

export default Nav;
