import React, { FC } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { foldersSelector } from "../../redux/selectors/folderSelector";
import { List, Typography } from "antd";
import { css } from "@emotion/css";
import { FolderMeta } from "../../constants/applicationConstants";
import { RootFolderListView } from "../ApplicationV2/RootFolderListView";

const classes = {
  wrapper: css`
    padding: 24px;
    cursor: default;
  `,
};

export const AppManager: FC = () => {
  const allFolders = useSelector(foldersSelector);
  const history = useHistory();
  const goApp = (folder: FolderMeta) => {
    history.push(`/folder/${folder.folderId}`);
  };
  return <RootFolderListView />;
};
