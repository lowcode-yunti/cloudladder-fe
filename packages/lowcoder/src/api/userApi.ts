import Api from "api/api";
import { AxiosPromise } from "axios";
import { OrgAndRole } from "constants/orgConstants";
import { BaseUserInfo, CurrentUser } from "constants/userConstants";
import { MarkUserStatusPayload, UpdateUserPayload } from "redux/reduxActions/userActions";
import { ApiResponse, GenericApiResponse } from "./apiResponses";

export interface CommonLoginParam {
  invitationId?: string;
  authId?: string;
  source?: string;
  orgId?: string;
}

export interface CommonBindParam {
  reLoginOnBindFail?: boolean;
  authId?: string;
  source?: string;
}

export interface ThirdPartyAuthRequest {
  state?: string;
  code: string;
  redirectUrl: string;
}

interface FormLoginRequest extends CommonLoginParam {
  loginId: string;
  password: string;
  register: boolean;
  authId?: string;
  orgId?: string;
}

export interface GetUserResponse extends ApiResponse {
  data: {
    orgAndRoles: OrgAndRole[];
  } & BaseUserInfo;
}

export interface SendResetRequest{
  name:string;
  inputCode:string;
}

export interface VerifyResetRequest{
  name:string;
  inputCode:string;
}

export interface ResetPasswordRequest{
  name:string;
  newPassword:string;
  inputCode:string;
}

export type GetCurrentUserResponse = GenericApiResponse<CurrentUser>;

class UserApi extends Api {
  static thirdPartyLoginURL = "/auth/tp/login";
  static thirdPartyBindURL = "/auth/tp/bind";
  static usersURL = "/v1/users";
  static sendVerifyCodeURL = "/auth/otp/send";
  static logoutURL = "/auth/logout";
  static userURL = "/v1/users/me";
  static currentUserURL = "/users/currentUser";
  static rawCurrentUserURL = "/users/rawCurrentUser";
  static emailBindURL = "/auth/email/bind";
  static passwordURL = "/v1/users/password";
  static formLoginURL = "/auth/form/login";
  static markUserStatusURL = "/users/mark-status";
  static userDetailURL = (id: string) => `/users/userDetail/${id}`;
  static resetPasswordURL = `/users/reset-password`;
  static sendRegisterMailURL =`/users/sendRegisterMail`;
  static verifyRegisterURL =`/users/verifyRegisterCode`;
  static getCaptchaRandomURL =`/users/captcha`;
  static getCaptchaImageURL = (redisKey: string) => `/users/captcha/${redisKey}`;
  static resetPasswordEmailURL = `/users/sendResetPasswordEmail`;
  static verifyResetCodeURL =`/users/verifyResetCode`;
  static trustPasswordURL =`/users/resetPassword`;

  static thirdPartyLogin(
    request: ThirdPartyAuthRequest & CommonLoginParam
  ): AxiosPromise<ApiResponse> {
    return Api.post(UserApi.thirdPartyLoginURL, undefined, request);
  }

  static bindThirdParty(
    request: ThirdPartyAuthRequest & CommonBindParam
  ): AxiosPromise<ApiResponse> {
    return Api.post(UserApi.thirdPartyBindURL, undefined, request);
  }

  static formLogin(request: FormLoginRequest): AxiosPromise<ApiResponse> {
    const { invitationId, ...reqBody } = request;
    const queryParam = invitationId ? { invitationId: invitationId } : undefined;
    return Api.post(UserApi.formLoginURL, reqBody, queryParam);
  }

  static bindEmail(request: { email: string; authId?: string }): AxiosPromise<ApiResponse> {
    return Api.post(UserApi.emailBindURL, undefined, request);
  }

  static setPassword(request: { password: string }): AxiosPromise<ApiResponse> {
    return Api.post(UserApi.passwordURL, undefined, request);
  }

  static updatePassword(request: {
    oldPassword: string;
    newPassword: string;
  }): AxiosPromise<ApiResponse> {
    return Api.put(UserApi.passwordURL, request);
  }

  static getUser(): AxiosPromise<GetUserResponse> {
    return Api.get(UserApi.userURL);
  }

  static getCurrentUser(): AxiosPromise<GetCurrentUserResponse> {
    return Api.get(UserApi.currentUserURL);
  }

  static getRawCurrentUser(): AxiosPromise<GetCurrentUserResponse> {
    return Api.get(UserApi.rawCurrentUserURL);
  }

  static userLogout(): AxiosPromise<ApiResponse> {
    return Api.post(UserApi.logoutURL);
  }

  static updateUser(request: UpdateUserPayload): AxiosPromise<ApiResponse> {
    return Api.put(UserApi.usersURL, request);
  }

  static markUserStatus(request: MarkUserStatusPayload): AxiosPromise<ApiResponse> {
    return Api.put(UserApi.markUserStatusURL, request);
  }

  static getUserDetail(userId: string): AxiosPromise<ApiResponse> {
    return Api.get(UserApi.userDetailURL(userId));
  }

  static resetPassword(userId: string): AxiosPromise<ApiResponse> {
    return Api.post(UserApi.resetPasswordURL, { userId: userId });
  }
  
  static sendRegisterMail(request: {
    name: string;
  }):AxiosPromise<any>{
     return Api.post(UserApi.sendRegisterMailURL,request);
  }

  static verifyRegisterCode(request: {
    name: string;
    inputCode: string;
  }):AxiosPromise<any>{
     return Api.post(UserApi.verifyRegisterURL,request)
  }

  //resetPassword

  static getCaptchaRandom(): AxiosPromise<any>{
    return Api.get(UserApi.getCaptchaRandomURL);
  }

  static getCaptchaImage(redisKey: string): AxiosPromise<any>{
    return Api.get(UserApi.getCaptchaImageURL(redisKey));
  }

  static sendResetPasswordEmail(request:SendResetRequest):AxiosPromise<any>{
     return Api.post(UserApi.resetPasswordEmailURL,request)
  }

  static verifyResetCode(request:VerifyResetRequest):AxiosPromise<any>{
    return Api.post(UserApi.verifyResetCodeURL,request)
  }

  static resetPasswords(request:ResetPasswordRequest):AxiosPromise<any>{
    return Api.post(UserApi.trustPasswordURL,request);
  }
}

export default UserApi;
