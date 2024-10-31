export const getTokenFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const userInfoString = localStorage.getItem("userInfo");
    const userInfoData = userInfoString ? JSON.parse(userInfoString) : null;
    const token = userInfoData?.access_token;
    return token ? token : null;
  }
};
