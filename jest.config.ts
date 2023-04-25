import type {Config} from 'jest';

const config :Config = {
  // Other configuration above...

  // Add the next three options if using TypeScript
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.[t|j]sx?$": "ts-jest",
    "^.+\\.svg?$": "<rootDir>/transform.js",
    "^.+\\.scss?$": "<rootDir>/transform.js"
  },
  "testEnvironment": "jsdom",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/scripts/testMock.js",
    "\\.(css|less)$": "<rootDir>/scripts/testMock.js"
  }
};

export default config;