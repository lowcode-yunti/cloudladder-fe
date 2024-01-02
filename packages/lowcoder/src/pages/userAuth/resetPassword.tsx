import React, { useEffect, useState } from 'react';
import { trans } from 'i18n';
import UserApi from 'api/userApi';
import { FormInput, PasswordInput } from 'lowcoder-design';
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { checkEmailValid, checkPhoneValid } from "util/stringUtils";
import styled from "styled-components";
import {
  AUTH_LOGIN_URL

} from "constants/routesURL";
import { useLocation } from "react-router-dom";
import { AuthContext, checkPassWithMsg, useAuthSubmit } from "pages/userAuth/authUtils";
import {
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  StyledRouteLinkLogin,
  AuthContainer,
} from "pages/userAuth/authComponents";
import { messageInstance } from "lowcoder-design";
const StyledContentContainer = styled.div`
 border-radius: 12px;
  padding: 200px;
  width: 80%;
  max-width: 600px;
  background-color: #fff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
`;

const CenteredAuthSection = styled.div`
  height: 100vh;
 
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenteredButtonContainer = styled.div`

  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const AccountLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const StyledPasswordInput = styled(PasswordInput)`
  margin-bottom: 16px;
  width: 200%;
`;

const StyledFormInput = styled(FormInput)`
  width: 200%;
`;
const EmailReset = styled.div`
  
`
const StyledLinkLogin=styled(StyledRouteLinkLogin)`
  display: block;
  width: 60px;
`

const errorMessages: Record<number, string> = {
  6451: 'Verification failed. Please check your verification code.',
  6452: 'Password reset failed. Please try again later.',
  6453: 'Failed to send email. Please try again later.',
  6454: 'Invalid cookie format.',
};

export default function ResetPasswordComponent() {
  const [name, setAccount] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // const [verificationCode, setVerificationCode] = useState('');
  const redirectUrl = AUTH_LOGIN_URL;
  const location = useLocation();
  const handleResetPassword = async () => {

    // if (verificationCode.length !== 8) {
    //   setErrorMessage('Verification code should be 6 characters long');
    //   return Promise.reject('Verification code should be 6 characters long');
    // }

    try {
      const response = await UserApi.resetPasswords({
        name: name,
        newPassword: newPassword,
        // inputCode: verificationCode,
      });
      if (response.status == 200) {
        await messageInstance.success(trans('userAuth.resetPasswordProsperity '))
      } 
      return Promise.resolve(response);

    } catch (error: any) {
      const errorCode = (error.response?.data?.code as number) || 0;
      if (errorCode && errorMessages[errorCode]) {
        setErrorMessage(errorMessages[errorCode]);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
      setSuccessMessage('');
      return Promise.reject(error);
    }
  };
useEffect(()=>{
  const emailName = localStorage.getItem('emailName')
  setAccount(emailName) 
},[])

  const { onSubmit, loading } = useAuthSubmit(handleResetPassword, false, redirectUrl);
//重置密码页面
  return (
    <>
      <AuthContainer>
        <LoginCardTitle>{trans('userAuth.resetPassword ')}</LoginCardTitle>
        <EmailReset>
          <FormInput
            Value={name}
            disabled={true}
            prefix={<UserOutlined />}
            className="form-input"
            label={trans('userAuth.email')}
            // onChange={(value, valid) => handleEmailChange(valid ? value : '')}
            placeholder={trans('userAuth.inputEmail')}
            // onChange={(value, valid) => setAccount(valid ? value : "")}
            checkRule={{
              check: (value) => checkPhoneValid(value) || checkEmailValid(value),
              errorMsg: trans('userAuth.inputValidEmail'),
            }}
          />
          <StyledPasswordInput
            prefix={<LockOutlined />}
            className="form-input"
            valueCheck={checkPassWithMsg}
            onChange={(value, valid) => setNewPassword(valid ? value : "")}
            doubleCheck
          />
          <StyledLinkLogin to={{ pathname: AUTH_LOGIN_URL, state: location.state }}>
            {trans("userAuth.userLogin")}
          </StyledLinkLogin>
          <ConfirmButton
            loading={loading}
            // disabled={!name || !newPassword || !verificationCode}
            disabled={!newPassword}
            onClick={onSubmit}
          >
            {trans('userAuth.resetPassword')}
          </ConfirmButton>
        </EmailReset>
      </AuthContainer>
    </>
  )
};
