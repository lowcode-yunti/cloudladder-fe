import React, { FC } from "react";
import { Empty } from "antd";
import { OpenAIExtensionProps } from "@lowcoder-ee/base/codeEditor/extensions/OpenAIExtension/types";
import { OpenAIExtensionSQL } from "@lowcoder-ee/base/codeEditor/extensions/OpenAIExtension/OpenAIExtensionSQL";
import { OpenAIExtensionJS } from "@lowcoder-ee/base/codeEditor/extensions/OpenAIExtension/OpenAIExtensionJS";

const OpenAIExtensionMain: FC<OpenAIExtensionProps> = (props) => {
  const { language } = props;
  if (language === "sql") {
    return <OpenAIExtensionSQL {...props} />;
  }
  if (language === "javascript") {
    return <OpenAIExtensionJS {...props} />;
  }

  return <Empty description={`暂不支持 ${language} 语言`} />;
};

export const OpenAIExtension: FC<OpenAIExtensionProps> = (props) => {
  const { styleName } = props;
  if (styleName !== "medium") {
    return null;
  }
  return <OpenAIExtensionMain {...props} />;
};
