import axios from "axios";
import { useSelector } from "react-redux";
import { Type } from "../../store/auth";
import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { basicMenu } from "../../models/menuModel";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Image from "next/image";
import UnAuthorized from "../../components/unauthorized";
import { Images } from "../../utils/images";

interface Meta {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

const Menus = () => {
  const [menus, setMenus] = useState([]);
  const [meta, setMeta] = useState<Meta>({
    currentPage: 0,
    itemCount: 0,
    itemsPerPage: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<number[]>([]);
  const [error, setError] = useState();
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [category, setCategory] = useQueryParam(
    "category",
    withDefault(StringParam, "")
  );
  const [search, setSearh] = useQueryParam(
    "search",
    withDefault(StringParam, "")
  );

  const type = useSelector(
    (state: { auth: { type: Type } }) => state.auth.type
  );
  const router = useRouter();
  const fetchMenus = async () => {
    let res = await axios
      .get(
        `${process.env.NEXT_PUBLIC_HOST}/menu/list?search=${
          search ? search : ""
        }&category=${category ? category : ""}&limit=2&page=${currentPage}`
      )
      .then((res) => {
        setMenus(res.data.items);
        setMeta(res.data.meta);
        const pages: number[] = [];
        for (let i = 1; i < res.data.meta.totalPages + 1; i++) {
          pages.push(i);
        }
        setPages((prev) => pages);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchMenus();
    if (router.query.page) {
      setCurrentPage(Number(router.query.page));
    }
  }, [router, currentPage]);
  useEffect(() => {
    const applySearch = setTimeout(() => {
      setSearh(searchText);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(applySearch);
  }, [searchText]);

  const hanldeFilter = async (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  if (type === "owner") {
    return <UnAuthorized />;
  }

  return (
    <div className="container center mx-auto flex-col flex  items-center ">
      <label htmlFor="serach" className="sr-only">
        serach
      </label>
      <input
        id="serach"
        name="serach"
        type="text"
        required
        className="relative mt-10 w-3/5 block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        placeholder="Search"
        onChange={(e) => setSearchText(e.target.value)}
      />

      <select
        name="categories"
        id="categories"
        defaultValue="category"
        onChange={(e) => hanldeFilter(e)}
        className="text-gray-700 block px-4 py-2  mt-5 text-sm cursor-pointer border rounded border-gray-300 self-end"
      >
        <option value="">category</option>
        <option value="pizza">pizza</option>
        <option value="burger">burger</option>
        <option value="pasta">pasta</option>
        <option value="dessert">dessert</option>
        <option value="drinks">drinks</option>
      </select>
      <div className="w-full">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Restaurants
        </h2>

        <div className=" mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {menus.map((menu: basicMenu) => {
            return (
              <div
                className="cursor-pointer  "
                onClick={() => router.push(`menus/${menu.id}`)}
                key={menu.id}
              >
                <div className="group     ">
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
                      src={Images[menu.category[0]]}
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-700">
                        {menu.name}
                      </h3>
                      <div className="flex flex-wrap gap-3	">
                        {menu.category.map((cat) => {
                          return (
                            <p
                              key={cat}
                              className="mt-1 text-sm bg-neutral-300 text-gray-600 rounded p-1"
                            >
                              {cat}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex mt-20  w-full items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            disabled={currentPage === 1}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 "
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <button
            disabled={currentPage === meta?.totalPages}
            style={{
              cursor:
                currentPage === meta?.totalPages ? "not-allowed" : "pointer",
            }}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
        <div className="hidden  flex  flex-col  gap-4 sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                disabled={currentPage === 1}
                style={{
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 "
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {pages.map((page) => {
                return (
                  <button
                    key={page}
                    disabled={currentPage === page}
                    style={{
                      backgroundColor:
                        currentPage === page ? "rgb(229 231 235)" : "white",
                    }}
                    onClick={() => setCurrentPage(page)}
                    className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === meta?.totalPages}
                style={{
                  cursor:
                    currentPage === meta?.totalPages
                      ? "not-allowed"
                      : "pointer",
                }}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
          <div>
            <p className="text-sm text-gray-700 flex  gap-1">
              Showing
              <span className="font-medium">1</span>
              to
              <span className="font-medium">
                {meta?.totalPages > 10 ? 10 : meta?.totalPages}
              </span>
              of
              <span className="font-medium">{meta?.totalPages}</span>
              results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menus;
