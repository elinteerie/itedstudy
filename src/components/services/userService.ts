import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl } from "./api";

// interfaces for the endpoints
interface University {
  name: string;
  id: number;
}

export interface CreateUserRequestBody {
  full_name: string;
  email: string;
  university_id: number;
  level: string;
  department: string;
  password: string;
}

export interface CreateUserResponse {
  message: string;
  access_token: string;
  token_type: string;
  token_expires: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires: string;
}

interface ResendOtpRequestBody {
  email: string;
}

interface ResendOtpResponse {
  status: string;
  message: string;
}

interface ResetPasswordRequestBody {
  email: string;
  otp: string;
  password: string;
}

interface ResetPasswordResponse {
  status: string;
  message: string;
}

interface VerifyEmailRequestBody {
  email: string;
  otp: string;
}

interface VerifyEmailResponse {
  status: string;
  message: string;
}

export interface UpdateUserInfoRequestBody {
  full_name?: string;
  university_id?: number;
  level?: string;
  deparment?: string;
}

interface UpdateUserInfoResponse {
  message: string;
}

interface ActivateAccountResponse {
  detail?: string;
  message?: string;
}

interface UserInfoResponse {
  status: string;
  email: string;
  school: string;
  user_id: number;
  level: string;
  department: string;
  active: boolean;
  full_name: string;
}

interface Course {
  id: number;
  name: string;
  // Add other course fields
}

interface Topic {
  id: number;
  title: string;
}

interface Lesson {
  id: number;
  title: string;
  content: string;
}

interface SummarisePdfResponse {
  summary: string;
}

interface PastQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  // other fields
}

interface ListAiContentResponse {
  [key: string]: any;
}

interface ListAllAiResponse {
  [key: string]: any;
}

interface SummarisePdfRequestBody {
  file: FormData;
}

interface ListAiContentParams {
  ai_id: number;
}

interface AiContent {
  content: string;
  id: number;
  user_id: number;
}

interface AllAiItem {
  content: string;
  id: number;
  user_id: number;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://unistudy.com.ng/",
  }),
  endpoints: (builder) => ({
    // listUniversities: builder.query<University[], void>({
    //   query: () => ({
    //     url: "auth/list-uni",
    //     method: "POST",
    //   }),
    //   transformResponse: (response: ListUniResponse) =>
    //     response.universities || [],
    // }),

    listUniversities: builder.query<University[], void>({
      query: () => ({
        url: `auth/list-uni`,
        method: "POST",
      }),
    }),

    createUser: builder.mutation<CreateUserResponse, CreateUserRequestBody>({
      query: (body) => ({
        url: "auth/create-user",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequestBody>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(body as any).toString(),
      }),
    }),

    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpRequestBody>({
      query: (body) => ({
        url: "auth/otp-resend",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequestBody
    >({
      query: (body) => ({
        url: "auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequestBody>({
      query: (body) => ({
        url: "auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    getUserInfo: builder.query<UserInfoResponse, string>({
      query: (token) => ({
        url: "auth/user-info",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    updateUserInfo: builder.mutation<
      UpdateUserInfoResponse,
      { token: string; body: UpdateUserInfoRequestBody }
    >({
      query: ({ token, body }) => ({
        url: "auth/user-info-update",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      }),
    }),

    activateAccount: builder.mutation<
      ActivateAccountResponse,
      { token: string; activation_pin: string }
    >({
      query: ({ token, activation_pin }) => ({
        url: `auth/activate-account?activation_pin=${activation_pin}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    listCourses: builder.query<Course[], string>({
      query: (token) => ({
        url: "content/list-courses",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getCourseTopics: builder.query<
      Topic[],
      { token: string; course_id: number }
    >({
      query: ({ token, course_id }) => ({
        url: `content/courses/${course_id}/topics`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getTopicContent: builder.query<Lesson, { token: string; topic_id: number }>(
      {
        query: ({ token, topic_id }) => ({
          url: `content/topics/${topic_id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      },
    ),

    getPastQuestionsByCourse: builder.query<
      PastQuestion[],
      { token: string; course_id: number }
    >({
      query: ({ token, course_id }) => ({
        url: `content/courses/${course_id}/past-questions`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getPastQuestionsByTopic: builder.query<
      PastQuestion[],
      { token: string; topic_id: number }
    >({
      query: ({ token, topic_id }) => ({
        url: `content/topics/${topic_id}/past-questions`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getPastQuestion: builder.query<any, { token: string; pq_id: number }>({
      query: ({ token, pq_id }) => ({
        url: `content/past-questions/${pq_id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    summarisePdf: builder.mutation<
      SummarisePdfResponse,
      { token: string; file: File }
    >({
      query: ({ token, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "ai/summarise-pdf",
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        };
      },
    }),

    listAiContent: builder.query<AiContent, { token: string; ai_id: number }>({
      query: ({ token, ai_id }) => ({
        url: `ai/list-an-ai-content?ai_id=${ai_id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    listAllAi: builder.query<AllAiItem, string>({
      query: (token) => ({
        url: "ai/list-all-ai",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useListUniversitiesQuery,
  useCreateUserMutation,
  useLoginMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
  useActivateAccountMutation,
  useListCoursesQuery,
  useGetCourseTopicsQuery,
  useGetTopicContentQuery,
  useGetPastQuestionsByCourseQuery,
  useGetPastQuestionsByTopicQuery,
  useGetPastQuestionQuery,
  useSummarisePdfMutation,
  useListAiContentQuery,
  useListAllAiQuery,
} = userApi;
