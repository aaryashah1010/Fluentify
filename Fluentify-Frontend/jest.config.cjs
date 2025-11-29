module.exports = {
  testEnvironment: 'jsdom',
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./jest-html-report",
        filename: "frontend-test-report.html",
        expand: true,
        pageTitle: "Frontend Unit Test Report",
      }
    ]
  ],
  setupFiles: ['<rootDir>/src/test/setup.js'],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  testPathIgnorePatterns: [
    '<rootDir>/src/test/modules/auth/'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}',
    '!<rootDir>/src/**/index.{js,jsx}',
    '!<rootDir>/src/utils/**',
    '!<rootDir>/src/main.jsx',
    '!<rootDir>/src/components/VoiceAiModal.jsx',
    '!<rootDir>/src/modules/admin/user-management/**',
    '!<rootDir>/src/modules/auth/**',
    '!<rootDir>/src/test/modules/auth/**'
  ]
};
