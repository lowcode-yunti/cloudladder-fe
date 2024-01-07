import { FC, useEffect, useState } from "react";
import {
  Level1SettingPageContent,
  Level1SettingPageTitle,
} from "@lowcoder-ee/pages/setting/styled";
import { Form, Input } from "antd";
import { OPEN_AI_API_KEY_STORE_KEY } from "@lowcoder-ee/constants/openAIConstants";

export const SettingSetting: FC = () => {
  const [openAIKey, setOpenAIKey] = useState(
    localStorage.getItem(OPEN_AI_API_KEY_STORE_KEY) || ""
  );
  useEffect(() => {
    localStorage.setItem(OPEN_AI_API_KEY_STORE_KEY, openAIKey);
  }, [openAIKey]);
  return (
    <Level1SettingPageContent>
      <Level1SettingPageTitle>全局配置</Level1SettingPageTitle>
      <div>
        <Form>
          <Form.Item label="OPEN AI KEY">
            <Input.Password
              visibilityToggle={false}
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
            />
          </Form.Item>
        </Form>
      </div>
    </Level1SettingPageContent>
  );
};
