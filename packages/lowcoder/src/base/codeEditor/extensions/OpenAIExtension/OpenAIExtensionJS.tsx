import React, { FC, useState } from "react";
import { OpenAIExtensionProps } from "@lowcoder-ee/base/codeEditor/extensions/OpenAIExtension/types";
import { OpenAiApi } from "@lowcoder-ee/api/openAiApi";
import { EditorState } from "@lowcoder-ee/base/codeEditor/codeMirror";
import { generateTernDefs } from "@lowcoder-ee/base/codeEditor/extensions/OpenAIExtension/utils";
import { omit } from "lodash";
import { CopilotInput } from "@lowcoder-ee/base/codeEditor/extensions/OpenAIExtension/components/CopilotInput";

const JSLibraries = ["_", "dayjs"];
export const OpenAIExtensionJS: FC<OpenAIExtensionProps> = ({
  exposingData = {},
  onChange,
}) => {
  const metadataTernDefs = generateTernDefs(omit(exposingData, JSLibraries));
  const [prompt, setPrompt] = useState("");
  const [copilotIng, setCopilotIng] = useState(false);
  const generateAIJS = async (query: string) => {
    try {
      setCopilotIng(true);
      const res = await OpenAiApi.generateJS({
        query,
        metadata: metadataTernDefs,
      });
      onChange?.(EditorState.create({ doc: res.data.text }));
    } finally {
      setCopilotIng(false);
    }
  };
  return (
    <CopilotInput
      value={prompt}
      onChange={setPrompt}
      onSubmit={generateAIJS}
      loading={copilotIng}
    />
  );
};
