import { Order } from "../models/userModel";
import axios from "axios";
import { useCookies } from "react-cookie";
import React, { useState, useEffect } from "react";
import UnAuthorized from "../components/unauthorized";
import { useSelector } from "react-redux";
import { Auth, Type } from "../store/auth";

interface Props {
  jwt: string;
  type: string;
  orders: Order[];
}
export default function UserOrders(props: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cookies] = useCookies(["jwt"]);
  const [error, setError] = useState();
  const { user, type } = useSelector((state: { auth: Auth }) => state.auth);

  // const fetchOrders = async () => {
  //   let res = await axios
  //     .get(`${process.env.NEXT_PUBLIC_HOST}/order/list`, {
  //       headers: { Authorization: "bearer " + cookies.jwt },
  //     })
  //     .then((res) => {
  //       setOrders(res.data);
  //     })
  //     .catch((err) => {
  //       setError(err.response.data);
  //     });
  // };

  useEffect(() => {
    setOrders(props.orders);
  }, [props]);

  if (error || props.type !== Type.user) {
    return <UnAuthorized />;
  }

  return (
    <div className="w-3/5  flex  flex-col  gap-4 mt-10 items-center justify-between mb-1 mx-auto">
      {orders?.map((order: Order) => {
        return (
          <div
            key={order.id}
            className="w-full bg-gray-200 p-4 rounded flex items-center justify-between mb-1 mx-auto"
          >
            <div>
              <h1>order id: {order.id}</h1>
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
            <h1 className="font-bold">{order.status}</h1>
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps(context: {
  req: { cookies: { jwt?: string; type?: string } };
}) {
  const { jwt, type } = context.req.cookies;

  if (jwt && type === "user") {
    let orders = await axios
      .get(`${process.env.NEXT_PUBLIC_HOST}/order/list`, {
        headers: { Authorization: "bearer " + jwt },
      })
      .then((res) => {
        return res.data;
      });

    return {
      props: {
        jwt,
        type,
        orders,
      },
    };
  } else {
    return {
      props: {
        orders: [],
      },
    };
  }
}
