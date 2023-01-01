import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Item } from "../models/menuModel";
import { useRouter } from "next/router";
import { Cart } from "../models/userModel";
import { useCookies } from "react-cookie";
import { Auth, authActions, Type } from "../store/auth";
import UnAuthorized from "../components/unauthorized";
import Image from "next/image";
import { Images } from "../utils/images";

const Cart = () => {
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
    if (auth.type === "user") {
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
      .then((res) => router.push("/user-orders"))
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
    <div className="container mx-auto  ">
      <div
        style={{ minHeight: "50vh" }}
        className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 "
      >
        {itemsDetails.map((item: Item) => {
          return (
            <div
              style={{ maxWidth: "300px" }}
              className="cursor-pointer"
              key={item.id}
            >
              <div className="group relative">
                {cart?.category && (
                  <Image
                    alt="item"
                    src={Images[cart!.category[0]]}
                    style={{ objectFit: "contain", borderRadius: "6px" }}
                  />
                )}
                <div className="mt-4 flex justify-between">
                  <div className="w-full">
                    <h3 className="text-lg text-gray-700 mb-3">{item.name}</h3>
                    <div className="flex justify-center flex-wrap gap-3	">
                      <button
                        onClick={() => removeFromCart(item.id.toString())}
                        className="w-full flex justify-center relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end">
        <button
          className=" flex justify-center relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={checkout}
          disabled={cart?.items.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
