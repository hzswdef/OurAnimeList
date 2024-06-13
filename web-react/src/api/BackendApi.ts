import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import Anime from "@interfaces/Anime";

interface BackendApiRequestOptions {
  auth?: boolean;
}

class BackendApi {
  private readonly instance: AxiosInstance;

  public constructor() {
    const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
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
  ): AxiosRequestConfig {
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

  private get(
    endpoint: string,
    config: AxiosRequestConfig | undefined = undefined,
    options: BackendApiRequestOptions = {},
  ): Promise<AxiosResponse> {
    const _config: AxiosRequestConfig = this.axiosConfig(config, options);

    return this.instance.get(endpoint, _config);
  }

  private post(
    endpoint: string,
    data = {},
    config: AxiosRequestConfig | undefined = undefined,
    options: BackendApiRequestOptions = {},
  ): Promise<AxiosResponse> {
    const _config: AxiosRequestConfig = this.axiosConfig(config, options);

    return this.instance.post(endpoint, data, _config);
  }

  private patch(
    endpoint: string,
    data = {},
    config: AxiosRequestConfig | undefined = undefined,
    options: BackendApiRequestOptions = {},
  ): Promise<AxiosResponse> {
    const _config: AxiosRequestConfig = this.axiosConfig(config, options);

    return this.instance.patch(endpoint, data, _config);
  }

  private delete(
    endpoint: string,
    config: AxiosRequestConfig | undefined = undefined,
    options: BackendApiRequestOptions = {},
  ): Promise<AxiosResponse> {
    const _config: AxiosRequestConfig = this.axiosConfig(config, options);

    return this.instance.delete(endpoint, _config);
  }

  public getAnime(): Promise<AxiosResponse> {
    return this.get("/anime");
  }

  public getAnimeById(id: number | string): Promise<AxiosResponse> {
    return this.get(`/anime/${id}`);
  }

  public createAnime(): Promise<AxiosResponse> {
    return this.post("/anime");
  }

  public createAnimeFromMyAnimeList(
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

  public patchAnime(item: Anime): Promise<AxiosResponse> {
    return this.patch("/anime", item);
  }

  public deleteAnime(id: number | string): Promise<AxiosResponse> {
    return this.delete(`/anime/${id}`);
  }

  public searchOnMyAnimeList(text: string): Promise<AxiosResponse> {
    return this.get(`/myanimelist/search/${text}`);
  }

  public getCurrentUser(): Promise<AxiosResponse> {
    return this.get("/user");
  }

  public getUserById(id: number | string): Promise<AxiosResponse> {
    return this.get(`/user/${id}`);
  }

  public userGoogleLogin(accessToken: string): Promise<AxiosResponse> {
    const data = {
      accessToken: accessToken,
    };

    return this.post("/user/auth/google", data, {}, { auth: false });
  }
}

export default BackendApi;
