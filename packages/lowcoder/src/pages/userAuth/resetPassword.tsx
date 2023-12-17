import React, { useState } from 'react';
import { trans } from 'i18n';
import UserApi from 'api/userApi';
import { FormInput, PasswordInput } from 'lowcoder-design';
import { checkEmailValid, checkPhoneValid } from "util/stringUtils";
import styled from "styled-components";
import {
    AUTH_LOGIN_URL
} from "constants/routesURL";
import { AuthContext, checkPassWithMsg, useAuthSubmit } from "pages/userAuth/authUtils";
import {
    ConfirmButton,
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


const StyledPasswordInput = styled(PasswordInput)`
  margin-bottom: 16px;
  width: 200%;
`;

const StyledFormInput = styled(FormInput)`
  width: 200%;
`;


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
    const [verificationCode, setVerificationCode] = useState('');
    const redirectUrl = AUTH_LOGIN_URL;

    const handleResetPassword = async () => {
        
        if (verificationCode.length !== 6) {
            setErrorMessage('Verification code should be 6 characters long');
            return Promise.reject('Verification code should be 6 characters long');
        }

        try {
            const response = await UserApi.resetPasswords({
                name: name,
                newPassword: newPassword,
                inputCode: verificationCode,
            });

            console.log('Password reset result:', response);
            setSuccessMessage('Password reset successful!'); 
            setErrorMessage(''); 
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

    const { onSubmit, loading } = useAuthSubmit(handleResetPassword, false, redirectUrl);

    return (
        <CenteredAuthSection>
            <StyledContentContainer>
                <AccountLoginWrapper>
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
                    <StyledPasswordInput
                        className="form-input"
                        valueCheck={checkPassWithMsg}
                        onChange={(value, valid) => setNewPassword(valid ? value : "")}
                        doubleCheck
                    />
                    <StyledFormInput
                        className="form-input"
                        label={trans('userAuth.verificationCode')}
                        onChange={(value, valid) => setVerificationCode(valid ? value : '')}
                        placeholder={trans('userAuth.verificationCode')}
                        checkRule={{
                            check: (value) => value.length === 6,
                            errorMsg: trans('userAuth.verificationCodeError'), 
                        }}
                    />
                    <CenteredButtonContainer>
                        <ConfirmButton loading={loading} disabled={!name || !newPassword || !verificationCode} onClick={onSubmit}>
                            {trans('userAuth.resetPassword')}
                        </ConfirmButton>
                    </CenteredButtonContainer>
                    {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}        
                </AccountLoginWrapper>
            </StyledContentContainer>
        </CenteredAuthSection>
    );
};
