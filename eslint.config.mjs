import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. 繼承 ESLint 官方與 TypeScript 官方的推薦規格
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  
  // 2. 設定要檢查與忽略的檔案範圍
  {
    files: ['src/**/*.ts'],      // 只檢查 src 資料夾下的 TypeScript 檔案
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    // 3. 在這裡可以客製化你個人的程式碼偏好規則
    rules: {
      'no-console': 'off',       // 允許使用 console.log (因為我們是排程腳本，很需要印 log)
      '@typescript-eslint/no-explicit-any': 'warn', // 當使用 any 門神時給予警告
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 未使用的變數報錯（但參數開頭為_除外）
    },
  },
  
  // 4. 全域忽略的資料夾 (相當於舊版的 .eslintignore)
  {
    ignores: ['node_modules/', 'dist/'],
  }
);