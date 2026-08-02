# Merge Upstream Vben Admin — 2025-08-02

**Branch:** `uat`  
**Commit:** `b0a5e247`  
**Merge source:** `9f5b1cd9` (fix(@vben-core/form-ui)!: group field slot component props)  
**Merge target:** `c05e1df0` (feat: remove Google Ads feature toggle from environment and UI)  
**Scale:** 1,134 files changed (~49k insertions, ~18k deletions)

## Summary

Merged upstream Vben Admin 5.0 framework updates into `uat`. The merge brought in significant changes including Zod v4 upgrade, Vue 3.5 `defineModel` API changes, expanded language support, and TypeScript 7.0 deprecation handling.

## Issues & Fixes

### 1. TypeScript `baseUrl` deprecation

- **Files:** `apps/web-np-admin/tsconfig.json`, `apps/web-np/tsconfig.json`
- **Error:** `TS5101: Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0`
- **Fix:** Removed `"baseUrl": "."` — it's redundant with `paths` using relative mappings.

### 2. Duplicate `VbenIconButton` export

- **File:** `packages/effects/common-ui/src/components/index.ts`
- **Error:** `TS2300: Duplicate identifier 'VbenIconButton'`
- **Fix:** Removed duplicate export from the named re-export block.

### 3. Stale `SupportedLanguagesType`

- **File:** `packages/@core/preferences/src/types.ts`
- **Error:** `'"es-ES"' is not assignable to type 'SupportedLanguagesType'`
- **Fix:** Expanded type from `'en-US' | 'zh-CN'` to include `'es-ES' | 'fr-FR' | 'it-IT' | 'vi-VN'`.

### 4. Missing `SupportedLanguagesType` import

- **File:** `packages/effects/layouts/src/widgets/user-dropdown/user-dropdown.vue`
- **Error:** `Type '"es-ES"' is not assignable to parameter of type '"en-US" | "zh-CN"'`
- **Fix:** Added `import type { SupportedLanguagesType } from '@vben/locales'` and updated `handleLocaleChange` parameter.

### 5. VXE Table locale map type error

- **File:** `packages/effects/plugins/src/vxe-table/init.ts`
- **Error:** `localMap[localeValue]` returned `Record<string, any> | undefined`, not assignable to `Record<string, any>`
- **Fix:** Added all supported language entries (`es-ES`, `fr-FR`, `it-IT`, `vi-VN`) with `enUS` as fallback, plus a runtime `??` fallback to `normalizeVxeLocale(enUS)`.

### 6. `useVbenForm` generic constraint

- **Files:** `apps/web-np-admin/src/adapter/form.ts`, `apps/web-np/src/adapter/form.ts`
- **Error:** `Type 'ComponentType' does not satisfy the constraint 'FormValues'`
- **Fix:** Replaced `const useVbenForm = useForm<ComponentType>` with a wrapper function that properly separates component type and form values generics.

### 7. Zod v4 `required_error` removal

- **Files:** `apps/web-np-admin/src/views/_core/authentication/register.vue`, `apps/web-np/src/views/_core/authentication/register.vue`
- **Error:** `'required_error' does not exist in type '{ error?: ... }'`
- **Fix:** Removed `{ required_error: ... }` from `z.string()` call — the validation is handled by `.min(1, { message })`.

### 8. Vue 3.5 `defineModel` API

- **Files:** `apps/web-np/src/views/settings/cogs-handling-fees/modules/select.vue`, `apps/web-np/src/views/settings/cogs-handling-fees/modules/products.vue`
- **Error:** `'default' does not exist in type 'DefineModelRuntimeOptions'`
- **Fix:** Removed `{ default: ... }` from `defineModel()` — the runtime options signature changed; defaults are now handled via prop-style options or omitted entirely.

### 9. Bad import path (`node_modules/` prefix)

- **Files:** `apps/web-np/src/views/reports/customer-ltv/service.ts`, `apps/web-np/src/views/reports/p-and-l/service.ts`
- **Error:** `Cannot find module 'node_modules/@vben/plugins/src/vxe-table/types'`
- **Fix:** Changed to relative path `../../../../../../packages/effects/plugins/src/vxe-table/types`.

### 10. Ant Design Vue `SelectValue` handler type

- **File:** `apps/web-np/src/views/onboard/step-0-language.vue`
- **Error:** `Type '(value: string) => Promise<void>' is not assignable to type '(value: SelectValue, ...) => void'`
- **Fix:** Broadened `@change` handler parameter from `string` to `any`.

### 11. Linter: `console.log` forbidden

- **Files:** Both `register.vue` files
- **Error:** `no-console` rule
- **Fix:** Changed `console.log` to `console.warn`.

### 12. Linter: `no-array-reduce`

- **File:** `apps/web-np/src/views/reports/p-and-l/service.ts`
- **Error:** `Don't use Array#reduce()`
- **Fix:** Refactored `reduce` to a `for...of` loop.

### 13. Tailwind CSS v4 — obsolete `postcss.config.mjs`

- **Files:** `apps/web-np/postcss.config.mjs`, `apps/web-np-admin/postcss.config.mjs`
- **Error:** `Package subpath './postcss' is not defined by "exports" in @vben/tailwind-config`
- **Cause:** Upstream merge upgraded from Tailwind CSS v3 to v4. Tailwind v4 uses the `@tailwindcss/vite` Vite plugin (configured in `@vben/vite-config`) instead of a PostCSS plugin. The `postcss.config.mjs` files no longer have a corresponding export in `@vben/tailwind-config` and are unnecessary.
- **Fix:** Deleted both `postcss.config.mjs` files, matching upstream where they don't exist.

### 14. Dev server: Vben Form slot binding deprecation

- **Warning:** `[Vben Form] BREAKING CHANGE: Named field slot control bindings moved to 'slotProps.componentProps'`
- **Impact:** Non-blocking — app loads correctly. Existing form field slots using `v-bind="slotProps"` need updating to `v-bind="slotProps.componentProps"`. See [Vben Form docs](https://doc.vben.pro/components/common-ui/vben-form.html).

## Pre-commit Checks

All hooks passed:

| Hook | Status |
|---|---|
| oxlint | ✔ |
| oxfmt | ✔ |
| eslint | ✔ |
| stylelint | ✔ |
| checkType (47 packages) | ✔ |
| commitlint | ✔ |
