import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import Anime from "@interfaces/Anime";

const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

interface BackendApiRequestOptions {
  auth?: boolean;
}

class BackendApi {
  private readonly instance: AxiosInstance;

  public constructor() {
    this.instance = axios.create({
      baseURL: backendBaseUrl + "/api",
      timeout: 15000,
    });
  }

  private protectedAxiosRequestConfig(): AxiosRequestConfig {
    const jwt = localStorage.getItem("token");

    if (jwt) {
      return {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
    }

    return {};
  }

  private axiosConfig(
    config: AxiosRequestConfig | undefined = undefined,
    options: BackendApiRequestOptions,
  ) {
    let _config = config ?? {};

    // Don't specify jwt token if auth is disabled.
    if (!options?.auth) {
      _config = {
        ..._config,
        ...this.protectedAxiosRequestConfig(),
      };
    }

    return _config;
  }

  private async get(
    endpoint: string,
    config: AxiosRequestConfig | undefined = undefined,
    options: BackendApiRequestOptions = {},
  ): Promise<AxiosResponse> {
    const _config: AxiosRequestConfig = this.axiosConfig(config, options);

    return this.instance.get(endpoint, _config);
  }

  private async post(
    endpoint: string,
    data = {},
    config: AxiosRequestConfig | undefined = undefined,
    options: BackendApiRequestOptions = {},
  ): Promise<AxiosResponse> {
    const _config: AxiosRequestConfig = this.axiosConfig(config, options);

    return this.instance.post(endpoint, data, _config);
  }

  private async patch(
    endpoint: string,
    data = {},
    config: AxiosRequestConfig | undefined = undefined,
    options: BackendApiRequestOptions = {},
  ): Promise<AxiosResponse> {
    const _config: AxiosRequestConfig = this.axiosConfig(config, options);

    return this.instance.patch(endpoint, data, _config);
  }

  private async delete(
    endpoint: string,
    config: AxiosRequestConfig | undefined = undefined,
    options: BackendApiRequestOptions = {},
  ): Promise<AxiosResponse> {
    const _config: AxiosRequestConfig = this.axiosConfig(config, options);

    return this.instance.delete(endpoint, _config);
  }

  public async getAnime(): Promise<AxiosResponse> {
    return this.get("/anime");
  }

  public async getAnimeById(id: number | string): Promise<AxiosResponse> {
    return this.get(`/anime/${id}`);
  }

  public async createAnime(): Promise<AxiosResponse> {
    return this.post("/anime");
  }

  public async createAnimeFromMyAnimeList(
    id: Anime["myAnimeListId"],
    watchingStatus: Anime["watchingStatus"],
  ): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      params: {
        id: id,
        status: watchingStatus,
      },
    };

    return this.post("/anime/from-myanimelist", {}, config);
  }

  public async patchAnime(item: Anime): Promise<AxiosResponse> {
    return this.patch("/anime", item);
  }

  public async deleteAnime(id: number | string): Promise<AxiosResponse> {
    return this.delete(`/anime/${id}`);
  }

  public async searchOnMyAnimeList(text: string): Promise<AxiosResponse> {
    return this.get(`/myanimelist/search/${text}`);
  }

  public async getCurrentUser(): Promise<AxiosResponse> {
    return this.get("/user");
  }

  public async getUserById(id: number | string): Promise<AxiosResponse> {
    return this.get(`/user/${id}`);
  }

  public async userGoogleLogin(accessToken: string): Promise<AxiosResponse> {
    const data = {
      accessToken: accessToken,
    };

    return this.post(`/user/auth/google`, data, {}, { auth: false });
  }
}

export default BackendApi;
