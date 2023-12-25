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
import { MailOutlined,EditOutlined,LockOutlined } from '@ant-design/icons'
import { messageInstance } from "lowcoder-design";
import { Input} from "antd";
const StyledFormInput = styled(FormInput)`
  margin-bottom: 16px;
`;

const StyledButtonLeft = styled.div`
/* margin-bottom: 8px; */
/* display: flex; */
/* align-items: center; */
/* margin-right: auto;  */
width:100px;
background-color: rgb(73, 101, 242);
border-radius: 6px;
border:1px solid rgb(73, 101, 242);
text-align: center;

font-size: 14px;
color: rgb(255, 255, 255);
line-height: 30px;
cursor: pointer; 

:hover {
  /* color: #315efb; */
}

/* @media screen and (max-width: 640px) {
  margin-bottom: 0;
} */
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
const NewButton=styled(ConfirmButton)`
  margin: 0px !important;
`
const GetCodeInput=styled(Input)`
width: 200px;
margin-bottom: 16px;
`

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
      // alert('请输入有效的电子邮箱!');
      messageInstance.warning('请输入有效的电子邮箱!')
      return;
    }


    try {
      
      const response = await UserApi.sendRegisterMail({ name: account });
      console.log(account);
      if (response.status === 200) {
        messageInstance.success('邮件发送成功，验证码有效期五分钟')
        // alert("邮件发送成功，请去邮件查看您的验证码五分钟过期！");

      } else {
        messageInstance.error('邮件发送失败')
        // alert('Email sent failed!');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        messageInstance.error('邮件发送失败，请检查网络')
        alert('Email sent failed!');
      } 
    }
  };
 

  const verifyCode = async (value:string) => {
    try {
      const response = await UserApi.verifyRegisterCode({ name: account, inputCode:value });

      if (response.status === 200) {
        messageInstance.success('验证成功')
        // alert('验证成功，你现在可以进行注册');
        // Enable registration button here
      } else {
        messageInstance.error('验证失败')
        // alert('Verification failed!');
      }
    } catch (error:any) {
      if (error.response && error.response.status === 500) {
        messageInstance.error('验证失败，请检查网络')
        // alert('Verification failed!');
      } else {
        // console.error('Verification failed!', error);
      }
    }
  };
  const handleVerificationCodeChange = (e:any) => {
    const value=e.target.value
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
          prefix={<MailOutlined />}
          className="form-input"
          label={trans("userAuth.email")}
          onChange={(value, valid) => setAccount(valid ? value : "")}
          placeholder={trans("userAuth.inputEmail")}
          checkRule={{
            check: checkEmailValid,
            errorMsg: trans("userAuth.inputValidEmail"),
          }}
        />
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <GetCodeInput
        prefix={<EditOutlined />}
          className="form-input"
          label={trans('userAuth.verificationCode')}
          onChange={handleVerificationCodeChange}
          placeholder={trans('userAuth.enterEmailVerificationCode')}
        />
        <StyledButtonLeft onClick={sendRegisterButton}>{trans('userAuth.sendEmail')}</StyledButtonLeft>
        </div>
        
        <StyledPasswordInput
        prefix={<LockOutlined />}
          className="form-input"
          valueCheck={checkPassWithMsg}
          onChange={(value, valid) => setPassword(valid ? value : "")}
          doubleCheck
        />
        <div style={{display:'flex'}}>
        {/* <StyledButtonLeft onClick={sendRegisterButton}>{trans('userAuth.sendEmail')}</StyledButtonLeft> */}
         <StyledRouteLinkLogin to={{ pathname: AUTH_LOGIN_URL, state: location.state }}>
         {trans("userAuth.userLogin")}
          </StyledRouteLinkLogin>
        </div>
        
        
        <NewButton
          disabled={!account || !verificationCode || !password || submitBtnDisable}
          onClick={onSubmit}
          loading={loading}
        >
          {trans("userAuth.register")}
        </NewButton>
        {/* <TermsAndPrivacyInfoWrapper>
          <TermsAndPrivacyInfo onCheckChange={(e) => setSubmitBtnDisable(!e.target.checked)} />
        </TermsAndPrivacyInfoWrapper> */}
        {/* <FlexContainer></FlexContainer> */}
      </RegisterContent>
    </AuthContainer>
  );
}

export default requiresUnAuth(UserRegister);
