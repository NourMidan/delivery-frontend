import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Categories, Item } from "../models/menuModel";
import { User } from "../models/userModel";
import burger from "../assets/burger.jpg";
import pizza from "../assets/pizza.jpg";
import pasta from "../assets/pasta.jpg";
import drinks from "../assets/drinks.jpg";
import dessert from "../assets/dessert.jpg";
import Image from "next/image";

interface Props {
  user: User;
  item: Item;
  type: Categories;
  mutate: () => void;
}

const OwnerItem = (props: Props) => {
  const { user, type, item, mutate } = props;
  const [error, setError] = useState<string[]>([]);
  const [update, setUpdate] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  let image = {
    burger,
    pizza,
    pasta,
    drinks,
    dessert,
  };
  const updateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { id, ...rest } = item;
    let updatedData = {
      name: e.currentTarget.itemName.value,
      description: e.currentTarget.description.value,
    };
    if (JSON.stringify(rest) === JSON.stringify(updatedData)) {
      return null;
    }

    await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_HOST}/item/${item.id}`,
      headers: { Authorization: "bearer " + cookies.jwt },
      data: {
        name: e.currentTarget.itemName.value,
        description: e.currentTarget.description.value,
      },
    })
      .then((res) => {
        mutate();
        setUpdate(false);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };
  const deleteItem = async () => {
    await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_HOST}/item/${item.id}`,
      headers: { Authorization: "bearer " + cookies.jwt },
    })
      .then((res) => mutate())
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <div style={{ margin: "20px" }}>
      <div
        style={{ maxWidth: "300px" }}
        className="cursor-pointer"
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
              src={image[type]}
              style={{ objectFit: "cover", borderRadius: "6px" }}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div className="w-full flex flex-col items-center">
              <h3 className="text-lg font-bold text-gray-700 mb-3">
                {item.name}
              </h3>
              <h5
                className="text-md text-center font-sans
 text-gray-700 mb-3"
              >
                {item.description}
              </h5>
              <div className="flex justify-center flex-wrap gap-3	">
                <button
                  onClick={() => deleteItem()}
                  className=" flex justify-center relative inline-flex items-center rounded-md border  bg-red-700 px-4 py-2 text-sm text-white font-medium hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() => setUpdate(true)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {update && (
        <div
          className="relative z-10 bg-black"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto mt-10">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 flex flex-col w-full justify-center items-center text-center sm:mt-0 sm:m``l-4 sm:text-left">
                      <h3
                        className="text-lg font-medium leading-6 text-gray-900 mb-4"
                        id="modal-title"
                      >
                        Update Item
                      </h3>
                      <form className="w-4/5" onSubmit={updateItem}>
                        <input
                          type="text"
                          name="itemName"
                          defaultValue={item.name}
                          className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                        <textarea
                          name="description"
                          defaultValue={item.description}
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
                            onClick={() => setUpdate(false)}
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
    </div>
  );
};

export default OwnerItem;
