import React, { useContext, useState } from "react";
import {
  AuthContainer,
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  StyledRouteLinkLogin,
  TermsAndPrivacyInfo,
} from "pages/userAuth/authComponents";
import { FormInput, PasswordInput } from "lowcoder-design";
import { AUTH_LOGIN_URL } from "constants/routesURL";
import UserApi from "api/userApi";
import { useRedirectUrl } from "util/hooks";
import { checkEmailValid } from "util/stringUtils";
import styled from "styled-components";
import { requiresUnAuth } from "./authHOC";
import { useLocation } from "react-router-dom";
import { UserConnectionSource } from "@lowcoder-ee/constants/userConstants";
import { trans } from "i18n";
import { AuthContext, checkPassWithMsg, useAuthSubmit } from "pages/userAuth/authUtils";

const StyledFormInput = styled(FormInput)`
  margin-bottom: 16px;
`;

const StyledButtonLeft = styled.div`
margin-bottom: 8px;
display: flex;
align-items: center;
margin-right: auto; 

font-size: 16px;
color: #4965f2;
line-height: 16px;
cursor: pointer; 

:hover {
  color: #315efb;
}

@media screen and (max-width: 640px) {
  margin-bottom: 0;
}
`;

const StyledPasswordInput = styled(PasswordInput)`
  margin-bottom: 16px;
`;

const RegisterContent = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;

  button {
    margin: 20px 0 16px 0;
  }
`;

const TermsAndPrivacyInfoWrapper = styled.div`
  margin-bottom: 80px;
  @media screen and (max-width: 640px) {
    margin: 10px 0 64px 0;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -80px; 
`;

function UserRegister() {
  const [submitBtnDisable, setSubmitBtnDisable] = useState(false);
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); //code
  const redirectUrl = useRedirectUrl();
  const location = useLocation();
  const { systemConfig, inviteInfo } = useContext(AuthContext);
  const authId = systemConfig.form.id;
  const { loading, onSubmit } = useAuthSubmit(
    () =>
      UserApi.formLogin({
        register: true,
        loginId: account,
        password: password,
        invitationId: inviteInfo?.invitationId,
        source: UserConnectionSource.email,
        authId,
      }),
    false,
    redirectUrl
  );

  const sendRegisterButton = async () => {
    if (!checkEmailValid(account)) {
      alert('Please enter a valid email address!');
      return;
    }


    try {
      
      const response = await UserApi.sendRegisterMail({ name: account });
      console.log(account);
      if (response.status === 200) {
      
        alert("邮件发送成功，请去邮件查看您的验证码五分钟过期！");

      } else {
        alert('Email sent failed!');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alert('Email sent failed!');
      } else {
        console.error('Email sent failed!', error);
      }
    }
  };
 

  const verifyCode = async (value:string) => {
    try {
      const response = await UserApi.verifyRegisterCode({ name: account, inputCode:value });

      console.log(value);
      if (response.status === 200) {
        alert('验证成功，你现在可以进行注册');
        // Enable registration button here
      } else {
        console.log(verificationCode);
        alert('Verification failed!');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alert('Verification failed!');
      } else {
        console.error('Verification failed!', error);
      }
    }
  };

  const handleVerificationCodeChange = (value: string) => {
    console.log(value);
    
    setVerificationCode(value);
    if (value.length == 8) {
      verifyCode(value);
    }
  };


  if (!systemConfig || !systemConfig.form.enableRegister) {
    return null;
  }

  return (
    <AuthContainer title={trans("userAuth.register")} type="large">
      <RegisterContent>
        <LoginCardTitle>{trans("userAuth.registerByEmail")}</LoginCardTitle>
        <StyledFormInput
          className="form-input"
          label={trans("userAuth.email")}
          onChange={(value, valid) => setAccount(valid ? value : "")}
          placeholder={trans("userAuth.inputEmail")}
          checkRule={{
            check: checkEmailValid,
            errorMsg: trans("userAuth.inputValidEmail"),
          }}
        />
        <StyledFormInput
          className="form-input"
          label={trans('userAuth.verificationCode')}
          onChange={handleVerificationCodeChange}
          placeholder={trans('userAuth.enterEmailVerificationCode')}
        />
        <StyledPasswordInput
          className="form-input"
          valueCheck={checkPassWithMsg}
          onChange={(value, valid) => setPassword(valid ? value : "")}
          doubleCheck
        />
        <ConfirmButton
          disabled={!account || !verificationCode || !password || submitBtnDisable}
          onClick={onSubmit}
          loading={loading}
        >
          {trans("userAuth.register")}
        </ConfirmButton>
        <TermsAndPrivacyInfoWrapper>
          <TermsAndPrivacyInfo onCheckChange={(e) => setSubmitBtnDisable(!e.target.checked)} />
        </TermsAndPrivacyInfoWrapper>
        <FlexContainer>
          <StyledButtonLeft onClick={sendRegisterButton}>{trans('userAuth.sendEmail')}</StyledButtonLeft>
          <StyledRouteLinkLogin to={{ pathname: AUTH_LOGIN_URL, state: location.state }}>
            {trans("userAuth.userLogin")}
          </StyledRouteLinkLogin>
        </FlexContainer>
      </RegisterContent>
    </AuthContainer>
  );
}

export default requiresUnAuth(UserRegister);
