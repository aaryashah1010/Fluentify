const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://fluentify-rho.vercel.app",
    chromeWebSecurity: false,
  },
});
