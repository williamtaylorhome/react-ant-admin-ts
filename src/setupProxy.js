const { createProxyMiddleware } = require("http-proxy-middleware");

const matchUrl = "/api"; // The request is a matching address
const target = "https://azhengpersonalblog.top/"; // Destination URL
const prevUrl = "^/api"; // Intercept as /api path
const writeUlr = "/api/react-ant-admin"; // Rewrite the request path
/**
 * When using Local Proxy Forwarding please set src/common/ajax.js axios' config baseURL to "/"
 * Assuming a local ajax request starts with /api, it will go to the destination URL target
 * ajax.post("/api/getlist") rewrites /api to /api/react-ant-admin
 * Then splice the https://azhengpersonalblog.top/
 * For example, ajax.post("/api/getlist") = > https://azhengpersonalblog.top/api/react-ant-admin/getlist
 */

module.exports = function (app) {
  app.use(
    createProxyMiddleware(matchUrl, {
      target,
      changeOrigin: true, 
      secure: true,// Https
      pathRewrite: { [prevUrl]: writeUlr },
    })
  );
};
