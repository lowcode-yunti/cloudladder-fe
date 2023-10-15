import React, { FC, useContext, useState } from "react";
import { QueryContext } from "@lowcoder-ee/util/context/QueryContext";
import { useSelector } from "react-redux";
import { getDataSourceStructures } from "@lowcoder-ee/redux/selectors/datasourceSelectors";
import { OpenAiApi } from "@lowcoder-ee/api/openAiApi";
import { EditorState } from "@lowcoder-ee/base/codeEditor/codeMirror";
import { OpenAIExtensionProps } from "@lowcoder-ee/base/codeEditor/extensions/OpenAIExtension/types";
import { CopilotInput } from "@lowcoder-ee/base/codeEditor/extensions/OpenAIExtension/components/CopilotInput";

export const OpenAIExtensionSQL: FC<OpenAIExtensionProps> = ({ onChange }) => {
  const [prompt, setPrompt] = useState("");
  const [copilotIng, setCopilotIng] = useState(false);
  const context = useContext(QueryContext); // FIXME: temporarily handle, expect to delete after the backend supports eval
  const datasourceStructure = useSelector(getDataSourceStructures);
  // console.log("datasourceStructure", context, datasourceStructure);
  // const dataS = useMms;
  const generateAISQL = async (query: string) => {
    try {
      setCopilotIng(true);
      const res = await OpenAiApi.generateSQL({
        query,
        metadata: datasourceStructure[context?.datasourceId as string],
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
      onSubmit={generateAISQL}
      loading={copilotIng}
    />
  );
};
