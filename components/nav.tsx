import Link from "next/link";
import Router from "next/router";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Auth, authActions, Type } from "../store/auth";

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
let cart = (
  <Link
    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    href={"/cart"}
  >
    cart
  </Link>
);

const Nav = (props: { auth: Auth }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt", "type"]);
  const dispatch = useDispatch();
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
    <div>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1  justify-start ">
              <div className=" sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <div>
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
                <div>
                  {userorders}
                  {cart}
                  {logut}
                </div>
              )}
              {type === "owner" && <div>{logut}</div>}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
