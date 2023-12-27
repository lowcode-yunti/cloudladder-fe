import React, { useState, useEffect } from 'react';
import { FormInput } from 'lowcoder-design';
import { trans } from 'i18n';
import { checkEmailValid, checkPhoneValid } from "util/stringUtils";
import UserApi from 'api/userApi';
import styled from "styled-components";
import { AUTH_LOGIN_URL } from "constants/routesURL";
import { useLocation } from "react-router-dom";
import { AuthContext, useAuthSubmit } from "pages/userAuth/authUtils";
import defaultImage from 'assets/images/errorImg(2).png'
import { MailOutlined,EditOutlined } from '@ant-design/icons'
import {
  AUTH_RESETPASSWORD_URL
} from "constants/routesURL";
import {
  ConfirmButton,
  FormWrapperMobile,
  LoginCardTitle,
  StyledRouteLinkLogin,
  AuthContainer,
} from "pages/userAuth/authComponents";
import { messageInstance } from "lowcoder-design";
const H2Style = styled.div`
   font-weight: 600;
  font-size: 28px;
  color: #222222;
  line-height: 28px;
  margin-top: 13vh;
  @media screen and (min-height: 700px) {
    margin-top: 107px;
  }
  @media screen and (max-height: 700px) {
    margin-top: 47px;
  }
  line-height: 28px;
`;

const StyledContentContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 28px 36px;
  border-radius: 20px;
  height: 521px;
  width: 480px;
  max-width: 600px;
  background-color: #fff;
  box-shadow: rgba(246, 248, 250, 0.85) 0px 0px 20px 20px;
`;

const CenteredAuthSection = styled.div`
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
`;

const CenteredButtonContainer = styled.div`
  display: flex;
  justify-content: left;
  margin-top: 80px;
`;

const AccountLoginWrapper = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;

  margin-bottom: 106px;
`;

// const StyledImageContainer = styled.div`
//   display: flex;
//   justify-content: left;
//   align-items: center;
//   width: 100%; 
//   max-width: 100px; /* 设置最大宽度 */
//   margin-bottom: 20px; 
//   margin-bottom: 60px; 
// `;

const StyledFormInput = styled(FormInput)`
  width: 200%; 
  max-width: 400px;
`;

const NewButton = styled(ConfirmButton)`
  margin: 0px !important;
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -80px; 
`;
const RegisterContent = styled(FormWrapperMobile)`
  display: flex;
  flex-direction: column;
  button {
    margin: 20px 0 16px 0;
  }
`;
const StyledImageContainer = styled.img`
/* border: 1px solid #d9d6d6; */
width: 130px;
height: 40px;

`

export default function CaptchaComponent() {
  const [name, setAccount] = useState('');
  const [inputCode, setVerificationCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ isactivity,setActivity]=useState(false)
  const location = useLocation();
  // const redirectUrl = AUTH_RESETPASSWORD_URL;
  const redirectUrl = '';

  const { onSubmit, loading } = useAuthSubmit(
    () =>
      UserApi.sendResetPasswordEmail({
        name: name,
        inputCode: inputCode,
      }),
    false,
    redirectUrl,
  );

  useEffect(() => {
    fetchCaptchaImage();
    const timer = setInterval(() => {
      fetchCaptchaImage();
      console.log('Hello World!');
    },300000);
    return ()=>{
      clearInterval(timer)
    }
  },[]);

  const fetchCaptchaImage = async () => {
    try {
      const response = await UserApi.getCaptchaRandom();


  
      const imageUrlResponse = await UserApi.getCaptchaImage(response.data);

     
      if (imageUrlResponse.status === 200) {
        setImageUrl(imageUrlResponse.data);
       
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

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const response = await UserApi.sendResetPasswordEmail({ name: name,  inputCode: inputCode });
  //       console.log(response,"dassadasdsdad");
  //     if (response.data === 'Verification successful') {
  //       alert('Verification successful! You can now proceed with registration.');
  //       // Enable registration button here
  //     } else {
  //       alert('Verification failed!');
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 500) {
  //       alert('Verification failed!');
  //     } else {
  //       console.error('Verification failed!', error);
  //     }
  //   }
  // };
  const submitEmial = async () => {
    setActivity(false)
    try {
      const response = await UserApi.sendResetPasswordEmail({ name: name, inputCode: inputCode });
      if (response.status === 200) {
        localStorage.setItem('emailName',name)
        messageInstance.success('发送邮件成功，请注意查收')
        setActivity(true)
        
        // Enable registration button here
      } else {
        messageInstance.error('验证码输入错误')
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        messageInstance.error('验证失败!')
      } else {
        console.error('验证失败!', error);
      }
    }



  }
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    // target.src='https://img0.baidu.com/it/u=2570981049,4015989895&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=400'
    target.src = defaultImage
  }
  return (
    <>

      <AuthContainer title={trans('userAuth.forgetPassword')} type="large">
      <LoginCardTitle>{trans("userAuth.resetPassword")}</LoginCardTitle>
        <RegisterContent>
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
          
          <StyledFormInput
            prefix={<EditOutlined />}
            className="form-input"
            label={trans('userAuth.imageCaptcha')}
            onChange={(value, valid) =>setVerificationCode(valid ? value : "") }
            placeholder={trans('userAuth.retrievePasswordCode')}
          />
          <div style={{display:'flex'}}>
          <StyledImageContainer onError={handleImageError} src={imageUrl} alt={trans('userAuth.captchaImage')} />
          <StyledRouteLinkLogin to={{ pathname: AUTH_LOGIN_URL, state: location.state }}>{trans("userAuth.userLogin")}</StyledRouteLinkLogin>
          </div>
          
          <NewButton
            loading={loading} 
            // disabled={!name || !inputCode || inputCode.length !== 6}
            disabled={inputCode.length!==6 || isactivity}
            onClick={submitEmial}
          >
            {trans("userAuth.sendEmail")}
          </NewButton>
          
        </RegisterContent>
      </AuthContainer>
    </>
  )

  // return (
  //   <>
  //     {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
  //     {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

  //     <CenteredAuthSection>
  //       <H2Style>{trans('userAuth.forgetPassword')}</H2Style>
  //       <StyledContentContainer>

  //         {/* <LoginCardTitle>{trans("userAuth.forgetPassword")}</LoginCardTitle> */}
  //         <AccountLoginWrapper>
  //           <form>
  //             <StyledFormInput
  //               className="form-input"
  //               label={trans('userAuth.email')}
  //               onChange={(value, valid) => setAccount(valid ? value : '')}
  //               placeholder={trans('userAuth.inputEmail')}
  //               checkRule={{
  //                 check: (value) => checkPhoneValid(value) || checkEmailValid(value),
  //                 errorMsg: trans('userAuth.inputValidEmail'),
  //               }}
  //             />
  //             <StyledImageContainer>
  //               <img src={imageUrl} alt={trans('userAuth.captchaImage')} />
  //             </StyledImageContainer>
  //             <StyledFormInput
  //               className="form-input"
  //               label={trans('userAuth.imageCaptcha')}
  //               onChange={handleVerificationCodeChange}
  //               placeholder={trans('userAuth.incorrectCaptchaEntered')}
  //             />
  //             <CenteredButtonContainer>
  //               <NewButton loading={loading} disabled={!name || !inputCode || inputCode.length !== 6}
  //                 onClick={submitEmial}>
  //                 {trans("userAuth.sendEmail")}
  //               </NewButton>
  //             </CenteredButtonContainer>
  //           </form>
  //           <StyledRouteLinkLogin to={{ pathname: AUTH_LOGIN_URL, state: location.state }}>{trans("userAuth.userLogin")}</StyledRouteLinkLogin>
  //         </AccountLoginWrapper>

  //       </StyledContentContainer>

  //     </CenteredAuthSection>
  //   </>
  // );
};
