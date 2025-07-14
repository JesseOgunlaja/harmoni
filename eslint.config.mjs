import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

const unusedVarRule = [
  "warn",
  {
    argsIgnorePattern: "^_",
    varsIgnorePattern: "^_",
    ignoreRestSiblings: true,
  },
];

eslintConfig[eslintConfig.length - 1].rules["no-unused-vars"] = unusedVarRule;
eslintConfig[eslintConfig.length - 1].rules[
  "@typescript-eslint/no-unused-vars"
] = unusedVarRule;

export default eslintConfig;
