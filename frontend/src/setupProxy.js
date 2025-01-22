const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://dev.abdm.gov.in",
      changeOrigin: true,
      secure: false,
    })
  );
};
