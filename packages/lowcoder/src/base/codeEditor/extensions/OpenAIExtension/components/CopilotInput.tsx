import React, { FC } from "react";
import { css } from "@emotion/css";
import { Button, Input } from "antd";

const styles = {
  wrapper: css`
    margin-top: 16px;
    display: flex;
  `,
  submit: css`
    margin-left: 16px;
  `,
};

export const CopilotInput: FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  loading: boolean;
}> = ({ value, onChange, onSubmit, loading }) => {
  return (
    <div className={styles.wrapper}>
      <Input
        placeholder="请输入提示语"
        allowClear
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button
        loading={loading}
        type="primary"
        className={styles.submit}
        onClick={() => {
          void onSubmit(value);
        }}
      >
        Copilot
      </Button>
    </div>
  );
};
