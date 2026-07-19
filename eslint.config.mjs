import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Module names matching ARCHITECTURE.md §5 / FOLDER_STRUCTURE.md §5
const MODULES = [
  "auth",
  "store",
  "subscription",
  "products",
  "inventory",
  "orders",
  "integration",
  "audit-log",
  "admin",
];

// Build per-module overrides that ALLOW same-module data/ imports.
// FOLDER_STRUCTURE.md §5.1: "modules/*/services/ may import its own module's data/"
const sameModuleDataOverrides = MODULES.map((mod) => ({
  files: [`src/modules/${mod}/**/*.ts`, `src/modules/${mod}/**/*.tsx`],
  rules: {
    "no-restricted-imports": "off",
  },
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  // Global rule: block cross-module data/ imports
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*/data/*"],
              message:
                "Do not import another module's data/ layer directly. Import from that module's services/ instead.",
            },
          ],
        },
      ],
    },
  },
  // Per-module override: allow same-module data/ imports
  // FOLDER_STRUCTURE.md §5.1: a module's services/ may import its own data/
  ...sameModuleDataOverrides,
]);

export default eslintConfig;
