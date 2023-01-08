import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect, Fragment } from "react";
import { Item } from "../models/menuModel";
import { useRouter } from "next/router";
import { Cart } from "../models/userModel";
import { useCookies } from "react-cookie";
import { Auth, authActions, Type } from "../store/auth";
import UnAuthorized from "../components/unauthorized";
import Image from "next/image";
import { Images } from "../utils/images";
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}
export default function Example(props: Props) {
  const { open, setOpen } = props;
  const [error, setError] = useState([]);
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [itemsDetails, setItemsDetails] = useState<any | null>([]);
  const [cookies] = useCookies(["jwt"]);
  const [cart, setCart] = useState<Cart>();
  const dispatch = useDispatch();
  const auth = useSelector((state: { auth: Auth }) => state.auth);

  const getCart = async () => {
    let res = await axios
      .get(`${process.env.NEXT_PUBLIC_HOST}/cart`, {
        headers: { Authorization: "bearer " + cookies.jwt },
      })
      .then((res) => {
        setCart(res.data);
        setItemsDetails(res.data.items);
        const itemsArray = res.data.items.reduce(
          (accumulator: number[], currentValue: { id: number }) =>
            accumulator.concat(currentValue.id),
          []
        );

        setItems(itemsArray);
      });
  };

  useEffect(() => {
    if (auth.type === "user" && cookies.jwt) {
      getCart();
    }
  }, [auth]);

  const checkout = async () => {
    let res = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_HOST}/order/create`,
      headers: { Authorization: "bearer " + cookies.jwt },

      data: {
        items,
        menu: cart?.menuId,
      },
    })
      .then((res) => {
        setOpen(false);
        router.push("/user-orders");
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  };
  const removeFromCart = async (id: string) => {
    await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_HOST}/cart/remove`,
      headers: { Authorization: "bearer " + cookies.jwt },

      data: {
        item: id,
      },
    })
      .then((res) => {
        setItemsDetails(res.data.items);
        dispatch(authActions.updateCart(res.data));
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  };
  if (auth.type !== Type.user) {
    setTimeout(() => {
      return <UnAuthorized />;
    }, 200);
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {itemsDetails.map((product: Item) => (
                              <li key={product.id} className="flex py-6">
                                <div className="h-24 w-24 relative flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  {cart?.category && (
                                    <Image
                                      alt="item"
                                      fill
                                      src={Images[cart!.category[0]]}
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                      }}
                                    />
                                  )}
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <p>{product.name}</p>
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() =>
                                          removeFromCart(product.id.toString())
                                        }
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="mt-6">
                        <button
                          onClick={checkout}
                          className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
