import { FormInput, PasswordInput } from "lowcoder-design";
import {
  AuthBottomView,
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  StyledRouteLink,
} from "pages/userAuth/authComponents";
import React, { useContext, useState,useEffect } from "react";
import styled from "styled-components";
import UserApi from "api/userApi";
import { useRedirectUrl } from "util/hooks";
import { checkEmailValid, checkPhoneValid } from "util/stringUtils";
import { UserConnectionSource } from "@lowcoder-ee/constants/userConstants";
import { trans } from "i18n";
import { AuthContext, useAuthSubmit } from "pages/userAuth/authUtils";
import { ThirdPartyAuth } from "pages/userAuth/thirdParty/thirdPartyAuth";
import { AUTH_REGISTER_URL,AUTH_CAPTCHA_URL } from "constants/routesURL";
import { useLocation } from "react-router-dom";

const AccountLoginWrapper = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;
  margin-bottom: 106px;
`;

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
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
         {trans('userAuth.rememberPassword')}
        </label>
        <StyledRouteLink to={{ pathname: AUTH_CAPTCHA_URL, state: location.state }}>
            {trans("userAuth.forgetPassword")}
        </StyledRouteLink>
        </div>
        <ConfirmButton loading={loading} disabled={!account || !password} onClick={onSubmit}>
          {trans("userAuth.login")}
        </ConfirmButton>
      </AccountLoginWrapper>
      <AuthBottomView>
        <ThirdPartyAuth invitationId={invitationId} authGoal="login" />
        {systemConfig.form.enableRegister && (
          <StyledRouteLink to={{ pathname: AUTH_REGISTER_URL, state: location.state }}>
            {trans("userAuth.register")}
          </StyledRouteLink>
        )}
      </AuthBottomView>
    </>
  );
}
