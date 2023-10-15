import axios, { AxiosResponse } from "axios";
import { OPEN_AI_API_KEY_STORE_KEY } from "@lowcoder-ee/constants/openAIConstants";
import { DatasourceStructure } from "@lowcoder-ee/api/datasourceApi";
import * as process from "process";
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3008"
    : "https://dev-ai.cloudladder.net.cn";
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 60 * 1000,
});

export class OpenAiApi {
  static generateSQL({
    query,
    metadata,
  }: {
    metadata: DatasourceStructure[];
    query: string;
  }): Promise<AxiosResponse<{ text: string }>> {
    return instance.post("/low-code/generate-sql", {
      query,
      metadata,
      openAIApiKey: localStorage.getItem(OPEN_AI_API_KEY_STORE_KEY) ?? "",
    });
  }

  static generateJS({
    query,
    metadata,
  }: {
    query: string;
    metadata: Record<string, any>;
  }): Promise<AxiosResponse<{ text: string }>> {
    return instance.post("/low-code/generate-js", {
      query,
      metadata,
      openAIApiKey: localStorage.getItem(OPEN_AI_API_KEY_STORE_KEY) ?? "",
    });
  }
}
