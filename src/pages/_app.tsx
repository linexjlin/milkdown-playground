//import Footer from "@/components/footer";
//import Nav from "@/components/nav";
import PwaUpdater from "@/components/pwa-updater";
import { DocSearchProvider, LayoutProvider } from "@/providers";
import { DocSearch } from "@/utils/types";

//import { Analytics } from "@vercel/analytics/react";
import NextApp, { AppContext, AppInitialProps } from "next/app";
import type { AppProps } from "next/app";
import Head from "next/head";

import "@/styles/globals.css";

import "@milkdown/theme-nord/style.css";
import "@/styles/docsearch.css";
import "@/styles/prosemirror.css";
import "@/styles/prose.css";
import "@/styles/playground.css";
import "@/styles/toast.css";

export default function App({
  Component,
  pageProps: { docSearch, ...componentProps },
}: AppPropsWithInitialProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <DocSearchProvider docSearch={docSearch}>
        <LayoutProvider>
          <main className="flex-grow">
            <Component {...componentProps} />
          </main>
          <PwaUpdater />
        </LayoutProvider>
      </DocSearchProvider>
    </>
  );
}
App.getInitialProps = async (
  appContext: AppContext
): Promise<AppInitialProps<{ docSearch: DocSearch }>> => {
  const props = await NextApp.getInitialProps(appContext);
  return {
    ...props,
    pageProps: {
      ...props.pageProps,
      docSearch: {
        appId: process.env.DOCSEARCH_APP_ID || "",
        apiKey: process.env.DOCSEARCH_API_KEY || "",
        indexName: process.env.DOCSEARCH_INDEX_NAME || "",
      },
    },
  };
};

type AppPropsWithInitialProps = AppProps<{ docSearch: DocSearch }>;
