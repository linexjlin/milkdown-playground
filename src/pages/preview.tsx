import { CodemirrorRef } from "@/components/codemirror";
import Loading from "@/components/loading";
import type { MilkdownRef } from "@/components/playground-editor";
import { FeatureToggleProvider } from "@/components/playground-editor/FeatureToggleProvider";
import { InspectorProvider } from "@/components/playground-editor/InspectorProvider";
import { ProseStateProvider } from "@/components/playground-editor/ProseStateProvider";
import { ShareProvider } from "@/components/playground-editor/ShareProvider";
import { getPlaygroundTemplate } from "@/pages/api/playground";
import { getContentFromIPFS } from "@/pages/api/ipfs";
import { compose } from "@/utils/compose";
import { decode } from "@/utils/share";
import { MilkdownProvider } from "@milkdown/react";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

const PlaygroundMilkdown = dynamic(
  () =>
    import("@/components/playground-editor").then((module) => ({
      default: module.PlaygroundMilkdown,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const Provider = compose(
  FeatureToggleProvider,
  MilkdownProvider,
  ProsemirrorAdapterProvider,
  ProseStateProvider,
  ShareProvider,
  InspectorProvider
);

export async function getStaticProps() {
  const ipfsGet = process.env.IPFS_GET;
  const ipfsUpload = process.env.IPFS_UPLOAD;
  const template = await getPlaygroundTemplate();
  return {
    props: {
      template,
      ipfsGet,
      ipfsUpload,
    },
  };
}

export default function Playground({ template,ipfsGet,ipfsUpload }: { template: string,ipfsGet: string,ipfsUpload: string }) {
  const [content, setContent] = useState(template);
  const router = useRouter();
  const path = router.asPath;

  useEffect(() => {
    const [_, search = ""] = path.split("?");
    const searchParams = new URLSearchParams(search);
    const hash = searchParams.get("id");

    localStorage.setItem('IPFS_GET', ipfsGet);
    localStorage.setItem('IPFS_UPLOAD', ipfsUpload);

    if (hash) {
      getContentFromIPFS(hash).then((result: string) => {
         setContent(result);
      }).catch((error: Error) => {
         console.error(error);
      });
    }
    const text = searchParams.get("text");
    if (text) {
      setContent(decode(text));
    }
  }, [path]);

  const lockCodemirror = useRef(false);
  const milkdownRef = useRef<MilkdownRef>(null);
  const codemirrorRef = useRef<CodemirrorRef>(null);
  let changeCount = 0;
  const onMilkdownChange = useCallback((markdown: string) => {
    console.log(changeCount);
    changeCount = changeCount +1;

  // 添加判断逻辑
  if (changeCount > 8) {
    const newUrl = window.location.href.replace('preview', '');
    window.location.href = newUrl;
    return;
  }
    const lock = lockCodemirror.current;
    if (lock) return;

    const codemirror = codemirrorRef.current;
    if (!codemirror) return;
    codemirror.update(markdown);
  }, []);

  return (
    <>
      <Head>
        <title>Preview | Milkdown</title>
      </Head>
      <div className="m-0 mt-16 grid border-b border-gray-300 dark:border-gray-600 md:ml-20 md:mt-0 md:grid-cols-1" style={{ marginLeft: "0rem" }}>
        <Provider>
            <PlaygroundMilkdown
              milkdownRef={milkdownRef}
              content={content}
              onChange={onMilkdownChange}
            />
        </Provider>
      </div>
    </>
  );
}
