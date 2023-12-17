import { Organization } from "./organization";
import PermissionSetting from "./permission";
import { ThemeHome } from "./theme";
import { AdvancedSetting } from "./advanced/AdvancedSetting";
import { currentOrgAdmin } from "util/permissionUtils";
import { trans } from "i18n";
import AuditSetting from "@lowcoder-ee/pages/setting/audit";
import {
  isEE,
  isEnterpriseMode,
  isSelfDomain,
  showAuditLog,
} from "util/envUtils";
import { TwoColumnSettingPageContent } from "./styled";
import SubSideBar from "components/layout/SubSideBar";
import { Menu } from "lowcoder-design";
import { useSelector } from "react-redux";
import { getUser } from "redux/selectors/usersSelectors";
import history from "util/history";
import { useParams } from "react-router-dom";
import { BrandingSetting } from "@lowcoder-ee/pages/setting/branding/BrandingSetting";
import { IdSourceHome } from "@lowcoder-ee/pages/setting/idSource";
import { selectSystemConfig } from "redux/selectors/configSelectors";
import { enableCustomBrand } from "util/featureFlagUtils";
import FreeLimitTag from "pages/common/freeLimitTag";
import { SettingSetting } from "./setting";

enum SettingPageEnum {
  UserGroups = "permission",
  Organization = "organization",
  Audit = "audit",
  Theme = "theme",
  Branding = "branding",
  Advanced = "advanced",
  OAuthProvider = "oauth-provider",
  AppUsage = "app-usage",
  Environments = "environments",
  Setting = "Setting",
}

export function SettingHome() {
  const user = useSelector(getUser);
  const config = useSelector(selectSystemConfig);
  const selectKey =
    useParams<{ setting: string }>().setting || SettingPageEnum.UserGroups;

  const items = [
    {
      key: SettingPageEnum.UserGroups,
      label: trans("settings.userGroups"),
    },
    {
      key: SettingPageEnum.Organization,
      label: trans("settings.organization"),
    },
    {
      key: SettingPageEnum.Theme,
      label: trans("settings.theme"),
    },
    {
      key: SettingPageEnum.OAuthProvider,
      label: <span className="text">{trans("settings.oauthProviders")}</span>,
      disabled: !currentOrgAdmin(user),
    },
    // {
    //   key: SettingPageEnum.Environments,
    //   label: (
    //     <span>
    //       <span className="text">{trans("settings.environments")}</span>
    //       <FreeLimitTag text={trans("settings.premium")} />
    //     </span>
    //   ),
    //   disabled: true,
    // },
    // {
    //   key: SettingPageEnum.AppUsage,
    //   label: (
    //     <span>
    //       <span className="text">{trans("settings.appUsage")}</span>
    //       <FreeLimitTag text={trans("settings.premium")} />
    //     </span>
    //   ),
    //   disabled: true,
    // },
    // {
    //   key: SettingPageEnum.Audit,
    //   label: (
    //     <span>
    //       <span className="text">{trans("settings.audit")}</span>
    //       {(!showAuditLog(config) || !currentOrgAdmin(user)) && (
    //         <FreeLimitTag text={trans("settings.premium")} />
    //       )}
    //     </span>
    //   ),
    //   disabled: !showAuditLog(config) || !currentOrgAdmin(user),
    // },
    // {
    //   key: SettingPageEnum.Branding,
    //   label: (
    //     <span>
    //       <span className="text">{trans("settings.branding")}</span>
    //       {(!isEE() ||
    //         !currentOrgAdmin(user) ||
    //         !enableCustomBrand(config) ||
    //         (!isSelfDomain(config) && !isEnterpriseMode(config))) && (
    //         <FreeLimitTag text={trans("settings.premium")} />
    //       )}
    //     </span>
    //   ),
    //   disabled:
    //     !isEE() ||
    //     !currentOrgAdmin(user) ||
    //     !enableCustomBrand(config) ||
    //     (!isSelfDomain(config) && !isEnterpriseMode(config)),
    // },
    {
      key: SettingPageEnum.Advanced,
      label: trans("settings.advanced"),
    },
    {
      key: SettingPageEnum.Setting,
      label: "全局配置",
    },
  ];

  return (
    <TwoColumnSettingPageContent>
      <SubSideBar title={trans("settings.title")}>
        <Menu
          mode="inline"
          selectedKeys={[selectKey]}
          onClick={(value) => {
            history.push("/setting/" + value.key);
          }}
          items={items}
        />
      </SubSideBar>
      {selectKey === SettingPageEnum.UserGroups && <PermissionSetting />}
      {selectKey === SettingPageEnum.Organization && <Organization />}
      {selectKey === SettingPageEnum.Theme && <ThemeHome />}
      {selectKey === SettingPageEnum.OAuthProvider && <IdSourceHome />}
      {selectKey === SettingPageEnum.Audit && <AuditSetting />}
      {selectKey === SettingPageEnum.Branding && <BrandingSetting />}
      {selectKey === SettingPageEnum.Advanced && <AdvancedSetting />}
      {selectKey === SettingPageEnum.Setting && <SettingSetting />}
    </TwoColumnSettingPageContent>
  );
}

export default SettingHome;
