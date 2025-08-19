import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = defineConfig([
  ...compat.config({
    extends: ["next", "next/core-web-vitals", "next/typescript", "prettier"],
    settings: {
      next: {
        rootDir: "src/",
      },
    },
  }),
  globalIgnores([
    "**/node_modules",
    "dist",
    "build",
    "coverage",
    "out",
    ".next",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-deprecated": "warn",
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
]);

export default eslintConfig;
