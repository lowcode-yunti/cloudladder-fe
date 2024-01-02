import React, { useContext, useState, useMemo,useEffect } from "react";
import {
  AuthContainer,
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  StyledRouteLinkLogin,
  TermsAndPrivacyInfo,
} from "pages/userAuth/authComponents";
import { FormInput, PasswordInput,messageInstance } from "lowcoder-design";
import { AUTH_LOGIN_URL, ORG_AUTH_LOGIN_URL } from "constants/routesURL";
import UserApi from "api/userApi";
import { useRedirectUrl } from "util/hooks";
import { checkEmailValid } from "util/stringUtils";
import styled from "styled-components";
import { requiresUnAuth } from "./authHOC";
import { useLocation} from "react-router-dom";
import { UserConnectionSource } from "@lowcoder-ee/constants/userConstants";
import { trans } from "i18n";
import { AuthContext, checkPassWithMsg, useAuthSubmit } from "pages/userAuth/authUtils";
import { MailOutlined,EditOutlined,LockOutlined } from '@ant-design/icons'
import { ThirdPartyAuth } from "pages/userAuth/thirdParty/thirdPartyAuth";
import { useParams } from "react-router-dom";
import { Input} from "antd";

const StyledFormInput = styled(FormInput)`
  margin-bottom: 16px;
`;

const StyledButtonLeft = styled(ConfirmButton)`
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

const TermsAndPrivacyInfoWrapper = styled.div`
  margin-bottom: 80px;
  @media screen and (max-width: 640px) {
    margin: 10px 0 64px 0;
  }
`;

const RegisterContent = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;
  /* margin-bottom: 106px; */
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
  const [isactivity,setaCtivity]=useState(false)
  const [verificationCode, setVerificationCode] = useState(""); //code
  const redirectUrl = useRedirectUrl();
  const location = useLocation();
  const { systemConfig, inviteInfo, fetchUserAfterAuthSuccess } = useContext(AuthContext);
  const invitationId = inviteInfo?.invitationId;
  const orgId = useParams<any>().orgId;
  const organizationId = useMemo(() => {
    if(inviteInfo?.invitedOrganizationId) {
      return inviteInfo?.invitedOrganizationId;
    }
    return orgId;
  }, [ inviteInfo, orgId ])

  const authId = systemConfig?.form.id;

  const { loading, onSubmit } = useAuthSubmit(
    () =>
      UserApi.formLogin({
        register: true,
        loginId: account,
        password: password,
        invitationId,
        source: UserConnectionSource.email,
        orgId: organizationId,
        authId,
      }),
    false,
    redirectUrl,
    fetchUserAfterAuthSuccess,
  );
  
  const sendRegisterButton = async () => {
    if (!checkEmailValid(account)) {
      messageInstance.error(trans("userAuth.inputValidEmail"))
      return;
    }
    try {

      const response = await UserApi.sendRegisterMail({ name: account });
     
      if (response.status === 200) {
        messageInstance.success(trans('userAuth.emailSucceeIndate'))
       let timer=setTimeout(()=>{
          setaCtivity(false)
          // console.log('注册里的定时器');
          
        },60000)
        setaCtivity(true)
        // alert("邮件发送成功，请去邮件查看您的验证码五分钟过期！");

      } else {
        messageInstance.error(trans('userAuth.emailSendFail'))
        // alert('Email sent failed!');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        messageInstance.error(trans('userAuth.emailSendFailBusy'))
        // alert('Email sent failed!');
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
        // alert('验证成功，你现在可以进行注册');
        messageInstance.success('验证成功')
        // Enable registration button here
      } else {
        console.log(verificationCode);
        messageInstance.error('邮件发送失败')
        // alert('Verification failed!');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        messageInstance.error('邮件发送失败，请检查网络')
        // alert('Verification failed!');
      } else {
        console.error('Verification failed!', error);
      }
    }
  };

  const handleVerificationCodeChange = (e: string) => {
    const value=e.target.value
    setVerificationCode(value);
    if (value.length == 8) {
      verifyCode(value);
    }
  };
  if (!systemConfig || !systemConfig.form.enableRegister) {
    return null;
  }

  const registerHeading = trans("userAuth.register") // REACT_APP_LOWCODER_CUSTOM_AUTH_WELCOME_TEXT !== "" ? REACT_APP_LOWCODER_CUSTOM_AUTH_WELCOME_TEXT : trans("userAuth.register")
  const registerSubHeading = '' // REACT_APP_LOWCODER_CUSTOM_AUTH_WELCOME_TEXT !== "" ? trans("userAuth.poweredByLowcoder") : ''
//注册页面
  return (
    <AuthContainer
      // heading={registerHeading}
      subHeading={registerSubHeading}
      type="large"
    >
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
               <StyledButtonLeft disabled={isactivity} onClick={sendRegisterButton}>{trans('userAuth.sendEmail')}</StyledButtonLeft>
        </div>
        
        <StyledPasswordInput
        prefix={<LockOutlined />}
          className="form-input"
          valueCheck={checkPassWithMsg}
          onChange={(value, valid) => setPassword(valid ? value : "")}
          doubleCheck
        />
       <StyledRouteLinkLogin to={{
        pathname: orgId
          ? ORG_AUTH_LOGIN_URL.replace(':orgId', orgId)
          : AUTH_LOGIN_URL,
        state: location.state
      }}>
        {trans("userAuth.userLogin")}
      </StyledRouteLinkLogin>
        <NewButton
          disabled={!account || !verificationCode || !password || submitBtnDisable}
          onClick={onSubmit}
          loading={loading}
        >
          {trans("userAuth.register")}
        </NewButton>
         {/* <TermsAndPrivacyInfo onCheckChange={(e) => setSubmitBtnDisable(!e.target.checked)} /> */}
        {/* <TermsAndPrivacyInfoWrapper>
          <TermsAndPrivacyInfo onCheckChange={(e) => setSubmitBtnDisable(!e.target.checked)} />
        </TermsAndPrivacyInfoWrapper> */}
        {/* <FlexContainer></FlexContainer> */}
        {organizationId && (
          <ThirdPartyAuth
            invitationId={invitationId}
            invitedOrganizationId={organizationId}
            authGoal="register"
          />
        )}
      </RegisterContent>
      
    </AuthContainer>
  );
}

export default requiresUnAuth(UserRegister);