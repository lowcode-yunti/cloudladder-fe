import { Layout, SiderProps, Menu } from "antd";
import { TopHeaderHeight } from "constants/style";
import styled from "styled-components";
import { HomeOutlined, PartitionOutlined, AliyunOutlined, BranchesOutlined, PicLeftOutlined, CodeSandboxOutlined, RestOutlined, SettingOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom';
import InviteDialog from '../../pages/common/inviteLanding'
import { InviteUserIcon } from "lowcoder-design";
import { trans } from "../../i18n";
import { useEffect } from 'react'
import { getUser } from "../../redux/selectors/usersSelectors";
import { User } from "../../constants/userConstants";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import { ApplicationMeta } from "../../constants/applicationConstants";
import { normalAppListSelector } from "../../redux/selectors/applicationSelector";

const Sider = styled(Layout.Sider)`
  /* height: calc(100vh - ${TopHeaderHeight}); */

  /* background: #f9f9fa;
  padding: 0 24px 0 24px;
border-right: 1px solid #000; */

  /* .ant-menu {
    background: transparent;
    .ant-menu-item-selected {
      background-color: #eef0f3 !important;
    }

    .ant-menu-item {
      border-radius: 8px;
      color: #000;
      &:hover {
        background: #eef0f3;
        color: #000;
        background-color: #eef0f3 !important;
      }
    }
  } */
`;
const InviteUser = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  left: 10px;
  top: calc(100vh - 60px);
  padding: 12px 26px;
  font-size: 14px;
  cursor: pointer;
  width: 219px;

  :hover {
    color: #315efb;

    svg g g {
      stroke: #315efb;
    }
  }
`;

export default function SideBar(props:any) {
  const { children, ...otherProps } = props;
  const user = useSelector<AppState, User>(getUser);
  const applications = useSelector<AppState, ApplicationMeta[]>(normalAppListSelector);
  const newIcon = [
    <HomeOutlined />, <PartitionOutlined />,
    <AliyunOutlined />, <BranchesOutlined />,
    <PicLeftOutlined />, <CodeSandboxOutlined />,
    <RestOutlined />, <SettingOutlined />,
    <InviteUserIcon />
  ]
  //菜单栏权限筛选
  let propsData = props.children[0].props.items.filter((item) => item.visible ? item.visible({ user: user, applications: applications }) : true)
  const data = propsData.map((item, index) => {
    return {
      label: item.text.props.children,
      key: item.routePath,
      icon: newIcon[index],
      routepath: item.routePath
    }
  })
  let history = useHistory() //获取路由信息

  const newpathname = history.location.pathname
  const clickItme = (event) => {
    history.push(event.item.props.routepath)
  }
  return (
    <Sider collapsedWidth='48' width='150' collapsible >
      {/* <InviteDialog trigger={<InviteUser><InviteUserIcon style={{ marginRight: "8px" }} />{trans("home.inviteUser")}</InviteUser>} style={{ marginLeft: "auto" }}/> */}
      <Menu theme="dark" selectedKeys={[newpathname]} onSelect={clickItme} defaultSelectedKeys={['/apps']} items={data}>
      </Menu>
    </Sider>
  )

  // return (
  //   <Sider theme="light" width={244} {...otherProps}>
  //     {props.children}
  //   </Sider>
  // );
}
