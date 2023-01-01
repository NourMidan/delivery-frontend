import Image from "next/image";
import { useEffect, useState } from "react";
import unauthorized from "../assets/unauthorized.jpg";

const UnAuthorized = () => {
  return (
    <div
      style={{ minHeight: "79vh" }}
      className="w-full flex-col flex justify-center items-center"
    >
      <Image alt="unauthorized" width={500} height={500} src={unauthorized} />
      <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 text-red-600">
        Unauthorized
      </h1>
    </div>
  );
};

export default UnAuthorized;
