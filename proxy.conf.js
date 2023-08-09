const PROXY_CONFIG = {
  "/api/v1/*": {
    target: "https://jsonplaceholder.typicode.com/",
    pathRewrite: { "^/api/v1": "" },
    secure: false,
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
