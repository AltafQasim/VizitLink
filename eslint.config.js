import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: [".next", "dist", "node_modules"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: "readonly",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": "off",
      "no-undef": "warn",
      "no-empty": "off",
      "no-case-declarations": "off",
      "no-useless-escape": "off",
      "no-constant-binary-expression": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  }
];
