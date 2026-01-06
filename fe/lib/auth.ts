export const setAccessToken = (accessToken: string) => {
  localStorage.setItem("access_token", accessToken);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
};
