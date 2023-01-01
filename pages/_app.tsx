import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { Provider } from "react-redux";
import store from "../store";
import { CookiesProvider } from "react-cookie";
import { NextAdapter } from "next-query-params";
import { QueryParamProvider } from "use-query-params";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <QueryParamProvider adapter={NextAdapter}>
        <CookiesProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CookiesProvider>{" "}
      </QueryParamProvider>
    </Provider>
  );
}
