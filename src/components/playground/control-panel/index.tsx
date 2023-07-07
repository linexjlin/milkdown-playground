import { useLinkClass } from "@/hooks";
//import { useDarkMode } from "@/providers";

//import * as Accordion from "@radix-ui/react-accordion";
import clsx from "clsx";
import type { FC, RefObject } from "react";
//import { JSONTree } from "react-json-tree";
import pkgJson from "../../../../package.json";
import type { CodemirrorProps, CodemirrorRef } from "../../codemirror";
import { Codemirror } from "../../codemirror";
//import { useProseState } from "../../playground-editor/ProseStateProvider";
//import { PluginToggle } from "../plugin-toggle";
import { useShare } from "../../playground-editor/ShareProvider";
//import { AccordionItem } from "./AccordionItem";

interface ControlPanelProps extends CodemirrorProps {
  codemirrorRef: RefObject<CodemirrorRef>;
}

export const ControlPanel: FC<ControlPanelProps> = ({
  content,
  onChange,
  lock,
  codemirrorRef,
}) => {
  const linkClass = useLinkClass();
  //const proseState = useProseState();
  //const darkMode = useDarkMode();
  const share = useShare();

  return (
    <div className="h-full">
      <div className="flex h-10 items-center justify-between border-b border-nord4 bg-gray-200 px-4 py-2 font-light dark:border-gray-600 dark:bg-gray-700">
        <div>
          <span>Milkdown Playground</span>
          <span className="ml-2 font-mono text-xs text-gray-600 dark:text-gray-300">
            v{pkgJson.dependencies["@milkdown/core"]}
          </span>
        </div>
        <div>
          <button
            onClick={() => share()}
            className={clsx(
              linkClass(false),
              "flex h-8 w-8 items-center justify-center rounded-full"
            )}
          >
            <span className="material-symbols-outlined !text-base">share</span>
          </button>
        </div>
      </div>

          <Codemirror
            ref={codemirrorRef}
            content={content}
            onChange={onChange}
            lock={lock}
          />

    </div>
  );
};
