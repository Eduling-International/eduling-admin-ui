import { useAPILoadingStore, usePopupStore } from '@/core/store';
import { Logger } from '@/logger/Logger';
import { ExchangeResponse } from '@/models';
import APIBaseResponse from '@/models/APIBaseResponse';
import APIErrorResponse from '@/models/APIErrorResponse';
import { useAuthStore } from '@/store';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
} from 'axios';
import { getSession, signOut } from 'next-auth/react';

class APIBaseService {
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;
  private readonly requestTimeout = 20000; // 20 seconds
  private readonly APPLICATION_JSON = 'application/json';
  protected readonly log: Logger;

  constructor() {
    this.baseUrl = String(process.env.NEXT_PUBLIC_BACK_OFFICE_URL);
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.requestTimeout,
      timeoutErrorMessage: 'Request timeout. Please refresh and try again.',
      responseType: 'json',
      headers: {
        'Content-Type': this.APPLICATION_JSON,
      },
    });
    this.log = new Logger();
  }

  protected async post<R, D = any>(
    url: string,
    data: D,
    config?: AxiosRequestConfig<D>,
  ) {
    return this.exchange<R, D>({
      ...config,
      method: 'POST',
      url: url,
      data: data,
    });
  }

  protected async put<R, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ) {
    return this.exchange<R, D>({
      ...config,
      method: 'PUT',
      url: url,
      data: data,
    });
  }

  protected async patch<R, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ) {
    return this.exchange<R, D>({
      ...config,
      method: 'PATCH',
      url: url,
      data: data,
    });
  }

  protected async get<R, P = Record<string, string>>(url: string, params?: P) {
    return this.exchange<R, null>({
      params: params,
      method: 'GET',
      url: url,
    });
  }

  protected async delete<R, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ) {
    return this.exchange<R, D>({
      ...config,
      method: 'DELETE',
      url: url,
      data: data,
    });
  }

  private async getAccessToken() {
    const { user } = useAuthStore.getState();
    if (user?.accessToken) {
      return user.accessToken;
    }
    const session = await getSession();
    if (session?.user) {
      return session.user.accessToken;
    }
    return undefined;
  }

  private async exchange<R, D = any>(
    config: AxiosRequestConfig,
  ): Promise<ExchangeResponse<R>> {
    const { show: showLoadingBar, hidden: hiddenLoadingBar } =
      useAPILoadingStore.getState();
    showLoadingBar();
    try {
      const accessToken = await this.getAccessToken();
      if (accessToken) {
        config.headers = { ...config.headers, Authorization: accessToken };
      }
      const response = await this.client.request<
        R,
        AxiosResponse<APIBaseResponse<R>>,
        D
      >(config);
      const responseData = response.data;
      this.log.info(
        `✅ ${response.status}`,
        config.method,
        config.url,
        config.params,
        config.data,
      );
      return {
        requestId: responseData.requestId,
        status: response.status,
        data: responseData.data,
        isError: false,
        message: null,
      };
    } catch (error) {
      const { toast } = usePopupStore.getState();
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as APIErrorResponse;
        const status = error.response?.status;
        if (status === HttpStatusCode.Unauthorized) {
          await signOut({ redirect: false, callbackUrl: '/auth/sign-in' });
          return {} as ExchangeResponse<R>;
        }
        const message = errorData?.message
          ? errorData.message
          : 'An unexpected server error was occurred. Refresh and try again.';
        toast(message, 'error');
        return {
          requestId: errorData?.requestId ?? error.code,
          status: error.status
            ? error.status
            : HttpStatusCode.InternalServerError,
          data: null,
          isError: true,
          message: message,
        };
      } else {
        this.log.error(error);
      }
      toast('Unexpected error was occurred. Refresh and try again.', 'error');
      return {
        requestId: 'UNKNOWN',
        status: -1,
        data: null,
        isError: true,
        message: 'Unexpected error was occurred. Refresh and try again.',
      };
    } finally {
      hiddenLoadingBar();
    }
  }
}

export default APIBaseService;
