import { FormInput, PasswordInput } from "lowcoder-design";
import {
  AuthBottomView,
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  StyledRouteLink,
} from "pages/userAuth/authComponents";
import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import UserApi from "api/userApi";
import { useRedirectUrl } from "util/hooks";
import { checkEmailValid, checkPhoneValid } from "util/stringUtils";
import { UserConnectionSource } from "@lowcoder-ee/constants/userConstants";
import { trans } from "i18n";
import { AuthContext, useAuthSubmit } from "pages/userAuth/authUtils";
import { ThirdPartyAuth } from "pages/userAuth/thirdParty/thirdPartyAuth";
import { AUTH_REGISTER_URL, AUTH_CAPTCHA_URL } from "constants/routesURL";
import { useLocation,Link} from "react-router-dom";
import {LockOutlined,UserOutlined } from '@ant-design/icons'
const AccountLoginWrapper = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;
  /* margin-bottom: 106px; */
`;
const RegisterButton=styled.button`
  width: 320px;
  height: 32px;
  margin-top: 10px;
  background-color: #ffffff;
  color: #c7c5c5;
  border:none;
  :hover{
    background-color: #f2f2f2;
  }
`
export default function FormLogin() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const redirectUrl = useRedirectUrl();
  const { systemConfig, inviteInfo } = useContext(AuthContext);
  const invitationId = inviteInfo?.invitationId;
  const authId = systemConfig?.form.id;
  const location = useLocation();

  const { onSubmit, loading } = useAuthSubmit(
    () =>
      UserApi.formLogin({
        register: false,
        loginId: account,
        password: password,
        invitationId: invitationId,
        source: UserConnectionSource.email,
        authId,
      }),
    false,
    redirectUrl
  );

  useEffect(() => {
    const rememberMeValue = localStorage.getItem('rememberMe');
    if (rememberMeValue !== null) {
      setRememberMe(JSON.parse(rememberMeValue));
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem('rememberMe', JSON.stringify(rememberMe));
    } else {
      localStorage.removeItem('rememberMe');
    }
  }, [rememberMe]);

  return (
    <>
      <LoginCardTitle>{trans("userAuth.login")}</LoginCardTitle>
      <AccountLoginWrapper>
        <FormInput
          prefix={<UserOutlined/>}
          className="form-input"
          label={trans("userAuth.email")}
          onChange={(value, valid) => setAccount(valid ? value : "")}
          placeholder={trans("userAuth.inputEmail")}
          checkRule={{
            check: (value) => checkPhoneValid(value) || checkEmailValid(value),
            errorMsg: trans("userAuth.inputValidEmail"),
          }}
        />
        <PasswordInput
          className="form-input"
          onChange={(value) => setPassword(value)}
          valueCheck={() => [true, ""]}
          prefix={<LockOutlined />}
        />
        <div style={{ display: 'flex',marginTop:'-12px'}}>
            <StyledRouteLink to={{ pathname: AUTH_CAPTCHA_URL, state: location.state }}>
              {trans("userAuth.forgetPassword")}
            </StyledRouteLink>
          </div>
        <ConfirmButton loading={loading} disabled={!account || !password} onClick={onSubmit}>
          {trans("userAuth.login")}
        </ConfirmButton>
        <Link to={{ pathname: AUTH_REGISTER_URL, state: location.state }}>
        <RegisterButton>注册</RegisterButton>
        </Link>
       
        {/* <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            {trans('userAuth.rememberPassword')}
          </label> */}
      </AccountLoginWrapper>
      
      {/* <AuthBottomView>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <StyledRouteLink to={{ pathname: AUTH_CAPTCHA_URL, state: location.state }}>
              {trans("userAuth.forgetPassword")}
            </StyledRouteLink>
          </div>
          <ThirdPartyAuth invitationId={invitationId} authGoal="login" />
          {systemConfig.form.enableRegister && (
            <StyledRouteLink to={{ pathname: AUTH_REGISTER_URL, state: location.state }}>
              {trans("userAuth.register")}
            </StyledRouteLink>
          )}
      </AuthBottomView> */}
     
    </>
  );
}
