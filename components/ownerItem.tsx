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
                  className=" flex justify-center relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  delete
                </button>
                <button
                  onClick={() => setUpdate(true)}
                  className=" flex justify-center relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  update
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
                        <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setUpdate(false)}
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
