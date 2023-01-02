import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Auth, authActions } from "../../store/auth";
import React, { useState, useEffect } from "react";
import { Categories, Item } from "../../models/menuModel";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import UnAuthorized from "../../components/unauthorized";

import Image from "next/image";
import { Images } from "../../utils/images";
const Menu = () => {
  const [items, setItems] = useState([]);
  const [type, setType] = useState<Categories>(Categories.burger);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState<{ state: boolean; id: string }>();
  const [cookies] = useCookies(["jwt"]);

  const dispatch = useDispatch();
  const auth = useSelector((state: { auth: Auth }) => state.auth);
  const router = useRouter();

  const fetchMenu = async () => {
    let res = await axios
      .get(`${process.env.NEXT_PUBLIC_HOST}/menu/${router.query.id}`)
      .then((res) => {
        setItems(res.data.items);
        setType(res.data.category[0]);
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  };
  const addToCart = async (id: string) => {
    if (auth.type === "guest") {
      router.push("/register");
    }
    let res = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_HOST}/cart/add`,
      headers: { Authorization: "bearer " + cookies.jwt },

      data: {
        item: id,
      },
    })
      .then((res) => {
        setWarning(undefined);
        dispatch(authActions.updateCart(res.data));
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  };
  const handleAddToCart = (id: string) => {
    if (auth.type === "user") {
      if (
        auth.user.cart?.items.length === 0 ||
        (auth.user.cart!.items.length > 0 &&
          router.query.id === auth.user.cart?.menuId)
      ) {
        addToCart(id);
      } else if (auth.user.cart!.items.length > 0 && router.query.id !== id) {
        setWarning({ state: true, id: id });
      }
    } else if (auth.type === "guest") {
    }
  };

  useEffect(() => {
    if (router.query.id) {
      fetchMenu();
    }
  }, [router]);

  if (auth.type === "owner") {
    return <UnAuthorized />;
  }
  if (error !== "") {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto ">
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ">
        {items.map((item: Item) => {
          return (
            <div
              style={{ maxWidth: "300px" }}
              className="cursor-pointer mt-10"
              key={item.id}
            >
              <div className="group flex flex-col h-full justify-between items-center relative">
                <div
                  style={{
                    width: "250px",
                    height: "300px",
                    position: "relative",
                  }}
                >
                  <Image
                    alt="item"
                    fill
                    src={Images[type]}
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="w-full">
                    <h3 className="text-lg font-bold text-center text-gray-700 mb-3">
                      {item.name}
                    </h3>
                    <h3 className="text-sm text-center  text-gray-700 mb-3">
                      {item.description}
                    </h3>
                    <div className="flex justify-center flex-wrap gap-3	">
                      {auth.type === "user" && (
                        <button
                          onClick={() => handleAddToCart(item.id.toString())}
                          className="w-full flex justify-center relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Add to cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {warning?.state && warning.id === item.id.toString() && (
                <div
                  className="relative z-10"
                  aria-labelledby="modal-title"
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                  <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                      <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                          <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                              <svg
                                className="h-6 w-6 text-red-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 10.5v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 4.88c-.866-1.501-3.032-1.501-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z"
                                />
                              </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:m``l-4 sm:text-left">
                              <h3
                                className="text-lg font-medium leading-6 text-gray-900"
                                id="modal-title"
                              >
                                Current cart will be cleared
                              </h3>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  Are you sure you want to clear cart
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => addToCart(item.id.toString())}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => setWarning(undefined)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
