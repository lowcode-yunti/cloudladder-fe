import { FC, useState } from "react";
import { css } from "@emotion/css";
import { Spin } from "antd";

const classes = {
  wrapper: css`
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  `,
  loadingWrapper: css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    inset: 0;
  `,
  iframe: css`
    height: 100%;
    width: 100%;
    border: none;
  `,
};
export const PhantomManager: FC = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div className={classes.wrapper}>
      <iframe
        className={classes.iframe}
       // src="https://phantom-agent-dev.cloudladder.net.cn/"
       src="http://localhost:3002/"
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <div className={classes.loadingWrapper}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};
