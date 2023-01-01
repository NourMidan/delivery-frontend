import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
interface Error {
  message: string;
}

const OwnerRegister = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<Error>();
  const [category, setCategories] = useState<string[]>([]);
  const router = useRouter();
  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (category.length === 0) {
      setError({ message: "you must at least pick one category" });
      return null;
    }

    let res = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_HOST}/owners/signup`,

      data: {
        name: e.currentTarget.username.value,
        email: e.currentTarget.email.value,
        menuName: e.currentTarget.menuName.value,
        password: e.currentTarget.password.value,
        category,
      },
    })
      .then((res) => {
        router.push("/login?type=owner");
      })
      .catch(function (error) {
        if (error.response) {
          setError(error.response.data);
        }
      });
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCategories((prev) => [...prev, e.target.value]);
    } else {
      setCategories((prev) => [...prev.filter((i) => i !== e.target.value)]);
    }
  };

  let categoriesForm = (
    <div className="flex items-center justify-around">
      <div className="flex flex-col	 items-center bg-neutral-100 rounded px-5 py-1 pb-2	">
        <label htmlFor="pizza">pizza</label>
        <input
          id="pizza"
          onChange={(e) => handleCheck(e)}
          name={`categories`}
          type="checkbox"
          value="pizza"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>
      <div className="flex flex-col	 items-center bg-neutral-100 rounded px-5 py-1	pb-2">
        <label htmlFor="burger">burger</label>
        <input
          id="burger"
          onChange={(e) => handleCheck(e)}
          name={`categories`}
          type="checkbox"
          value="burger"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>
      <div className="flex flex-col	 items-center bg-neutral-100 rounded px-5 py-1	pb-2">
        <label htmlFor="pasta">pasta</label>
        <input
          id="pasta"
          onChange={(e) => handleCheck(e)}
          name={`categories`}
          type="checkbox"
          value="pasta"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>
      <div className="flex flex-col	 items-center bg-neutral-100 rounded px-5 py-1	pb-2">
        <label htmlFor="drinks">drinks</label>
        <input
          id="drinks"
          onChange={(e) => handleCheck(e)}
          name={`categories`}
          type="checkbox"
          value="drinks"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>
      <div className="flex flex-col	 items-center bg-neutral-100 rounded px-5 py-1	pb-2">
        <label htmlFor="dessert">dessert</label>
        <input
          id="dessert"
          onChange={(e) => handleCheck(e)}
          name={`categories`}
          type="checkbox"
          value="dessert"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Register as owner</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register as owner
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={register}>
            <input type="hidden" name="remember" value="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  username
                </label>
                <input
                  id="username"
                  name="username"
                  type="username"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="username"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="restaurant-name" className="sr-only">
                  Restaurant name
                </label>
                <input
                  id="restaurant-name"
                  name="menuName"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Restaurant name"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <h3 className="sr-only">Categories</h3>
            {categoriesForm}
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Sign in
              </button>
            </div>
          </form>
          <Link
            className="font-medium text-indigo-600 hover:text-indigo-500"
            href="/register?type=user"
          >
            register as owner
          </Link>
        </div>
        <br />
      </div>
      {error && (
        <div>
          <p className="mt-6 text-center text-xl  tracking-tight text-red-600">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default OwnerRegister;
