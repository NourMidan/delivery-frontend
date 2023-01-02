// owner orders
// only if type owner  not guest or user
// owner menu
// only if type owner  not guest or user

import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { basicMenu, Item } from "../models/menuModel";
import { Order } from "../models/userModel";
import { Auth } from "../store/auth";
import UnAuthorized from "../components/unauthorized";

const MenuOrders = () => {
  const [cookies] = useCookies(["jwt"]);
  const { user, type } = useSelector((state: { auth: Auth }) => state.auth);
  const [error, setError] = useState([]);

  const [menu, setMenu] = useState<basicMenu>();
  const [orders, setOrders] = useState<Order[]>();
  const fetchMenu = async () => {
    let res = await axios
      .get(`${process.env.NEXT_PUBLIC_HOST}/menu/${user.menu?.id}`, {
        headers: { Authorization: "bearer " + cookies.jwt },
      })
      .then((res) => {
        let { name, categories } = res.data;
        setMenu({ name, ...categories });
        setOrders(res.data.orders);
      });
  };

  useEffect(() => {
    user.menu && fetchMenu();
  }, [user]);

  const handleStatus = async (
    e: ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_HOST}/order/${id}`,
      headers: { Authorization: "bearer " + cookies.jwt },
      data: {
        status: e.target.value,
      },
    }).catch((err) => {
      setError(err.response.data.message);
    });
  };

  if (type !== "owner" && type !== null) {
    return <UnAuthorized />;
  }
  return (
    <div className="container mx-auto mt-10 flex flex-col  ">
      <h1 className="self-center text-2xl sm:truncate sm:text-3xl sm:tracking-tight font-bold leading-7">
        {menu?.name}
      </h1>{" "}
      <div className="w-3/5  flex  flex-col  gap-4 mt-10 items-center justify-between mb-1 mx-auto">
        {orders?.map((order: Order) => {
          return (
            <div
              key={order.id}
              className="w-full bg-gray-200 p-4 rounded flex items-center justify-between mb-1 mx-auto"
            >
              <div>
                <h1>Order id: {order.id}</h1>
                <div className="flex gap-4 flex-wrap">
                  {order.items.map((item) => {
                    return (
                      <div
                        className="bg-neutral-500 rounded text-white p-1"
                        key={item.id}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </div>
              <select
                name="cars"
                id="cars"
                defaultValue={order.status}
                className="text-gray-700 block px-4 py-2  mt-5 text-sm cursor-pointer border rounded border-gray-300 self-end"
                onChange={(e) => handleStatus(e, order.id)}
              >
                <option value="prepairng">prepairng</option>
                <option value="delivering">delivering</option>
                <option value="delivered">delivered</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuOrders;
