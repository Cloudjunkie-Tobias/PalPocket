// Flat ESLint config. Three environments:
//   • src/*.js          — browser renderer (window, document, DOM). Globals PAL_DATA/PP_NOTES come
//                          from data.js/notes.js, which load before app.js.
//   • main.js/preload.js — Electron main process, CommonJS (require/module.exports).
//   • scripts/*.mjs      — Node ES modules (release/validate tooling).
// Style is owned by Prettier (see .prettierrc.json); eslint-config-prettier turns off conflicting rules.
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

const timers = {
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  queueMicrotask: "readonly",
};

const browserGlobals = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  localStorage: "readonly",
  console: "readonly",
  PAL_DATA: "readonly",
  PP_NOTES: "readonly",
  ...timers,
};

const nodeGlobals = {
  process: "readonly",
  console: "readonly",
  __dirname: "readonly",
  require: "readonly",
  module: "writable",
  Buffer: "readonly",
  URL: "readonly",
  ...timers,
};

// Shared rules. no-useless-assignment (new in ESLint 10) is off: it false-positives on this
// codebase's intentional defensive defaults (`let x = false` before a try, `let key = null`
// before a conditional assign), where rewriting would reduce clarity, not improve it.
const commonRules = {
  "no-unused-vars": ["warn", { args: "none", caughtErrors: "none" }],
  "no-empty": ["error", { allowEmptyCatch: true }],
  "no-useless-assignment": "off",
  eqeqeq: ["warn", "smart"],
  "no-console": "off",
};

export default [
  { ignores: ["dist/**", "node_modules/**", "**/*.min.js"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: browserGlobals },
    rules: { ...commonRules, "no-var": "warn" },
  },
  {
    files: ["main.js", "preload.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "commonjs", globals: nodeGlobals },
    rules: commonRules,
  },
  {
    files: ["scripts/**/*.{js,mjs}"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: nodeGlobals },
    rules: commonRules,
  },
  prettier,
];
