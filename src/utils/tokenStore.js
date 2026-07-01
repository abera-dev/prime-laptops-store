let accessToken = null;

const getToken = () => accessToken;

const setToken = (token) => {
  accessToken = token;
};

const clearToken = () => {
  accessToken = null;
};

export { getToken, setToken, clearToken };
