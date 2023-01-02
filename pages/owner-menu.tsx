import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

import { basicMenu, Item } from "../models/menuModel";
import { Auth } from "../store/auth";
import UnAuthorized from "../components/unauthorized";
import OwnerItem from "../components/ownerItem";

const OwnerMenu = () => {
  const [cookies] = useCookies(["jwt", "type"]);
  const { user } = useSelector((state: { auth: Auth }) => state.auth);
  const [error, setError] = useState<string[]>([]);
  const [add, setAdd] = useState<boolean>(false);
  const [menu, setMenu] = useState<basicMenu>();
  const [items, setItems] = useState<Item[]>();
  const [feedback, setFeedback] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>();
  const fetchMenu = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_HOST}/menu/${user.menu?.id}`, {
        headers: { Authorization: "bearer " + cookies.jwt },
      })
      .then((res) => {
        let { id, name, category } = res.data;
        setMenu({ id, name, category });
        setItems(res.data.items);
      });
  };

  const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);
    await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_HOST}/item/create`,
      headers: { Authorization: "bearer " + cookies.jwt },
      data: {
        name: e.currentTarget.itemName.value,
        description: e.currentTarget.description.value,
      },
    })
      .then((res) => {
        mutate();
        setFeedback(true);
        setAdd(false);
      })
      .catch((err) => {
        setError((prev) => [...prev, err.response.data.message]);
      });
  };
  const mutate = () => {
    fetchMenu();
  };
  useEffect(() => {
    user.menu && fetchMenu();
  }, [user]);
  useEffect(() => {
    cookies.type && setUserType(cookies.type);
  }, [cookies]);
  useEffect(() => {
    if (feedback) {
      setTimeout(() => {
        setFeedback(false);
      }, 1500);
    }
  }, [feedback]);
  if (userType !== "owner") {
    return <UnAuthorized />;
  }
  return (
    <div>
      <div className="container mx-auto mt-10 flex flex-col  ">
        <h1 className="self-center text-2xl sm:truncate sm:text-3xl sm:tracking-tight font-bold leading-7">
          {menu?.name}
        </h1>
        <button
          type="button"
          onClick={() => setAdd(true)}
          className="mt-3 inline-flex w-full self-end rounded-md mr-10 border border-gray-300  text-base font-medium  shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Add item
        </button>

        {add && (
          <div
            className="relative z-10 "
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="fixed inset-0 bg-gray-500  bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 flex flex-col w-full justify-center items-center text-center sm:mt-0 sm:m``l-4 sm:text-left">
                        <h3
                          className="text-lg font-medium leading-6 text-gray-900 mb-4"
                          id="modal-title"
                        >
                          Add Item
                        </h3>
                        <form className="w-4/5" onSubmit={addItem}>
                          <input
                            type="text"
                            placeholder="item name"
                            name="itemName"
                            className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                          <textarea
                            name="description"
                            placeholder="item description"
                            className="relative resize-none block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          ></textarea>
                          {error &&
                            error.map((err) => {
                              return (
                                <p
                                  key={err}
                                  style={{
                                    marginBottom: "60px",
                                    color: "#D8000C",
                                  }}
                                >
                                  {err}
                                </p>
                              );
                            })}
                          <div className=" px-4 py-3 sm:flex flex justify-center sm:flex-row-reverse sm:px-6">
                            <button
                              type="submit"
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setAdd(false)}
                              className="text-gray bg-white-700 border border-gray-400 hover:bg-white-800 focus:ring-4 focus:ring-white-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-white-600 dark:hover:bg-white-700 focus:outline-none dark:focus:ring-white-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          style={{ minHeight: "50vh" }}
          className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 "
        >
          {items?.map((item: Item) => {
            return (
              <div key={item.id}>
                <OwnerItem
                  item={item}
                  user={user}
                  type={menu!.category[0]}
                  mutate={() => mutate()}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end"></div>
      </div>
      {feedback && <span className="feedback">item added succesfully</span>}
    </div>
  );
};

export default OwnerMenu;
