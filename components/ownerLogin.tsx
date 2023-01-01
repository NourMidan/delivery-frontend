import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

interface Error {
  message: string;
}

const OwnerLogin = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt", "type"]);

  const dispatch = useDispatch();
  const [error, setError] = useState<Error>();
  const router = useRouter();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let res = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_HOST}/owners/signin`,

      data: {
        name: e.currentTarget.username.value,
        password: e.currentTarget.password.value,
      },
    })
      .then((res) => {
        setCookie("jwt", res.data.token);
        setCookie("type", "owner");

        dispatch(authActions.login(res.data));
        router.push("/owner-menu");
      })
      .catch(function (error) {
        if (error.response) {
          setError(error.response.data);
        }
      });
  };
  return (
    <div>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Sign in as owner</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in as owner
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={login}>
            <input type="hidden" name="remember" value="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  username
                </label>
                <input
                  id="email-address"
                  name="username"
                  type="username"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="username"
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
            href="/login?type=user"
          >
            login as user
          </Link>
        </div>
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

export default OwnerLogin;
