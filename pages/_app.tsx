import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/Layout";
import { NotificationContextProvider } from "../contexts/notificationContext";

import { SessionProvider } from "next-auth/react";
import { UserContextProvider } from "../contexts/userContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <NotificationContextProvider>
        <SessionProvider session={pageProps.session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </NotificationContextProvider>
    </UserContextProvider>
  );
}
