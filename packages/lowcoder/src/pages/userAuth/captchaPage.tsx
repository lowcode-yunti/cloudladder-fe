import React, { useState, useEffect } from 'react';
import { FormInput } from 'lowcoder-design';
import { trans } from 'i18n';
import { checkEmailValid, checkPhoneValid } from "util/stringUtils";
import UserApi from 'api/userApi';
import styled from "styled-components";
import { AuthContext, useAuthSubmit } from "pages/userAuth/authUtils";
import {
  AUTH_RESETPASSWORD_URL
} from "constants/routesURL";
import {
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle
} from "pages/userAuth/authComponents";

const StyledContentContainer = styled.div`
  border-radius: 20px;
  padding:100px;
  width: 100%;
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
  justify-content: left;
  margin-top: 80px;
`;

const AccountLoginWrapper =styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 106px;
`;

const StyledImageContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  width: 200%; 
  margin-bottom: 60px; 
`;

const StyledFormInput = styled(FormInput)`
  width: 200%; 
  max-width: 400px;
`;

const NewButton = styled(ConfirmButton)`
  width: 200%;
`;

export default function CaptchaComponent() {
  const [name, setAccount] = useState('');
  const [rediskey, setRedisKey] = useState('');
  const [inputCode, setVerificationCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const redirectUrl = AUTH_RESETPASSWORD_URL;
  // const redirectUrl = '';

  const { onSubmit, loading } = useAuthSubmit(
    () =>
      UserApi.sendResetPasswordEmail({
        name: name,
        rediskey: rediskey,
        inputCode: inputCode,
      }),
    false,
    redirectUrl,
  );

  useEffect(() => {
    fetchCaptchaImage();
  }, []);


  const fetchCaptchaImage = async () => {
    try {
      const response = await UserApi.getCaptchaRandom(); 
      setRedisKey(response.data);
      const imageUrlResponse = await UserApi.getCaptchaImage(rediskey); 

      if (imageUrlResponse && imageUrlResponse.data) {
        const imageData = new Blob([imageUrlResponse.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(imageData);
        setImageUrl(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching captcha image:', error);
      setErrorMessage('Failed to fetch captcha image');
    }
  };


  const handleVerificationCodeChange = (value: string) => {
    if (value.length === 6) {
      setVerificationCode(value);
    } else {
      setVerificationCode('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await UserApi.sendResetPasswordEmail({ name: name, rediskey: rediskey, inputCode: inputCode });
      console.log('Verification result:', response);
      setSuccessMessage('Email sent successfully!'); 
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessage('Failed to send email'); 
    }
  };

  return (
    <>
    
    {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <CenteredAuthSection>
        <StyledContentContainer>
        <LoginCardTitle>{trans("userAuth.forgetPassword")}</LoginCardTitle>
          <AccountLoginWrapper>
            <form onSubmit={handleSubmit}>
              <StyledFormInput
                className="form-input"
                label={trans('userAuth.email')}
                onChange={(value, valid) => setAccount(valid ? value : '')}
                placeholder={trans('userAuth.inputEmail')}
                checkRule={{
                  check: (value) => checkPhoneValid(value) || checkEmailValid(value),
                  errorMsg: trans('userAuth.inputValidEmail'),
                }}
              />
              <StyledImageContainer>
                <img src={imageUrl} alt={trans('userAuth.captchaImage')} />
              </StyledImageContainer>
              <StyledFormInput
                className="form-input"
                label={trans('userAuth.imageCaptcha')}
                onChange={handleVerificationCodeChange}
                placeholder={trans('userAuth.incorrectCaptchaEntered')}
              />
              <CenteredButtonContainer>
                <NewButton loading={loading} disabled={!name || !inputCode || inputCode.length !== 6}
                  onClick={onSubmit}>
                  {trans("userAuth.sendEmail")}
                </NewButton>
              </CenteredButtonContainer>
            </form>
          </AccountLoginWrapper>
        </StyledContentContainer>
      </CenteredAuthSection>
    </>
  );
};
