import React, { useState } from 'react';
import { FormInput } from 'lowcoder-design';
import { trans } from 'i18n';
import { checkEmailValid, checkPhoneValid } from "util/stringUtils"; //
import UserApi from 'api/userApi';
import styled from "styled-components";
import { AUTH_RESETPASSWORD_URL } from "constants/routesURL";
import {
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  StyledRouteLinkLogin,
  AuthContainer,
} from "pages/userAuth/authComponents";
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
const EmailReset = styled.div`
  
`

export default function VerifyComponent() {
  const [name, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [inputCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailValid(checkEmailValid(value));
  };

  const handleVerifyEmail = async () => {
    if (isEmailValid) {
      try {
        setIsSubmitting(true);
        const response = await UserApi.verifyResetCode({ name: name, inputCode: inputCode });
        console.log(response, "sdasdad")
        if (response.status === 200) {
          // window.location.href = response.headers.location;
          window.location.href = AUTH_RESETPASSWORD_URL + "?" + inputCode;
        } else {
          // setErrorMessage('Reset code verification failed');
          alert('Verification failed!');
        }
      } catch (error) {
        console.error('Reset code verification error:', error);
        // setErrorMessage('Verification failed!');
        alert('Verification failed!');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrorMessage('Invalid email format');
    }
  };

  const handleVerificationCodeChange = (value: string) => {
    if (value.length === 8) {
      setVerificationCode(value);
    } else {
      setVerificationCode('');
    }
  };
  return (
    <>
      <AuthContainer>
        <LoginCardTitle>重置密码</LoginCardTitle>
        <EmailReset>
          <FormInput
            className="form-input"
            label={trans('userAuth.email')}
            onChange={(value, valid) => handleEmailChange(valid ? value : '')}
            placeholder={trans('userAuth.inputEmail')}
            checkRule={{
              check: (value) => checkPhoneValid(value) || checkEmailValid(value),
              errorMsg: trans('userAuth.inputValidEmail'),
            }}
          />
          <FormInput
            className="form-input"
            label={trans('userAuth.verificationCode')}
            onChange={(value) => handleVerificationCodeChange(value)}
            placeholder={trans('userAuth.enterVerificationCode')}
          />
          <ConfirmButton disabled={!isEmailValid || isSubmitting} onClick={handleVerifyEmail}>
            {isSubmitting ? trans('userAuth.submitting') : trans('userAuth.verifyEmail')}
          </ConfirmButton>
        </EmailReset>
      </AuthContainer>
    </>
  )

  // return (
  //     <>
  //     <CenteredAuthSection>
  //         <StyledContentContainer>
  //             <AccountLoginWrapper>
  //                 <FormInput
  //                     className="form-input"
  //                     label={trans('userAuth.email')}
  //                     onChange={(value, valid) => handleEmailChange(valid ? value : '')}
  //                     placeholder={trans('userAuth.inputEmail')}
  //                     checkRule={{
  //                         check: (value) => checkPhoneValid(value) || checkEmailValid(value),
  //                         errorMsg: trans('userAuth.inputValidEmail'),
  //                     }}
  //                 />
  //                 <FormInput
  //                     className="form-input"
  //                     label={trans('userAuth.verificationCode')}
  //                     onChange={(value) => handleVerificationCodeChange(value)}
  //                     placeholder={trans('userAuth.enterVerificationCode')}
  //                 />
  //                 <CenteredButtonContainer>
  //                     <button disabled={!isEmailValid || isSubmitting} onClick={handleVerifyEmail}>
  //                         {isSubmitting ? trans('userAuth.submitting') : trans('userAuth.verifyEmail')}
  //                     </button>
  //                 </CenteredButtonContainer>
  //             </AccountLoginWrapper>
  //         </StyledContentContainer>
  //     </CenteredAuthSection>
  //     </>
  // );
};

