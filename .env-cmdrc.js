
const devConfig = {
  PORT: 3000, // Start the port
  HOST: "0.0.0.0", // Listening address
  NODE_ENV: "development", // Developer mode
  REACT_APP_ROUTERBASE: "/react-ant-admin", // React routing base path
  REACT_APP_API_BASEURL: "http://127.0.0.1:8081/api/react-ant-admin", //The address of the request
  PUBLIC_URL: "/react-ant-admin",// Static file paths
}
const productionCfg = {
  REACT_APP_ROUTERBASE: "/react-ant-admin", // React routing base path
  REACT_APP_API_BASEURL: "/api/react-ant-admin", //The address of the request
  PUBLIC_URL: "/react-ant-admin",// Static file paths
  NODE_ENV: "production", // Packaging mode Production mode
  BUILD_PATH: "react-ant-admin", // Package folder name
}
module.exports = Promise.resolve({

  // The local interface works fine No mock No accent color
  development: devConfig,

  // Local interface Enable the theme color to run
  development_color: {
    ...devConfig,
    COLOR: "true", // "true" is the start
  },

  // Local mock run
  development_mock: {
    ...devConfig,
    REACT_APP_MOCK: "1", // 1 is to enable mocking
  },

  // Accent color and local mock run
  development_color_mock: {
    ...devConfig,
    COLOR: "true",
    REACT_APP_MOCK: "1",
  },

  // Packaging: No theme, no mock
  production: productionCfg,

  // Packaging: There is a theme, no mock
  production_color: {
    ...productionCfg,
    COLOR: "true", // "true" is the start
  },

  // Packaging: There are themes and mocks to be packaged in pure local mode
  production_color_mock: {
    ...productionCfg,
    COLOR: "true",
    REACT_APP_MOCK: "1",
  },

  // Gitub Pagis packs bloggers to use
  production_github: {
    ...productionCfg,
    COLOR: "true",
    REACT_APP_API_BASEURL: "",
    REACT_APP_ROUTER_ISHASH: "1", // Enable hash mode
    REACT_APP_ROUTERBASE: "/"
  }
})