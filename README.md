# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
VITE_API_URL="http://localhost:9200/users/signUp"
VITE_ADDRESS_API_URL="http://localhost:9200/users/address"
VITE_LOGIN_API_URL="http://localhost:9200/users/login"
VITE_PROFILE_API_URL="http://localhost:9200/users/profile"
VITE_REFRESHTOKEN = "http://localhost:9200/refreshToken"
VITE_PPC_API_URL="http://localhost:9200/providers/profileCreation"
VITE_VERIFY_OTP_URL="http://localhost:9200/verifyOtp"
VITE_ADMIN_DASHBOARD_URL="http://localhost:9200/admin/pendingProviders"
VITE_ADMIN_DASHBOARD_AllUSERS_URL="http://localhost:9200/admin/users"
VITE_ADMIN_DASHBOARD_REVIEW_PROVIDER_URL="http://localhost:9200/admin/reviewProviderProfile"
VITE_PROVIDER_DASHBOARD_URL="http://localhost:9200/providers/providerDashBoard"
VITE_PROVIDER_REVIEW_URL="http://localhost:9200/providers/providerUnderReview"
VITE_CUSTOMER_REQUEST_URL="http://localhost:9200/customers/request"
VITE_FIND_PROVIDERS_URL="http://localhost:9200/customers/providers"
VITE_PROVIDERS_PROFILE_URL="http://localhost:9200/providers/profile"
VITE_PROVIDERS_PACKAGES_URL="http://localhost:9200/packages/addPackages"
VITE_PROVIDERS_MYPACKAGES_URL="http://localhost:9200/packages/providerPackages"
VITE_BUY_COINS_URL="http://localhost:9200/buyCoins"
VITE_COINS_URL="http://localhost:9200/coins"
VITE_PURCHASE_CONTACT_URL="http://localhost:9200/coins"
VITE_UNLOCKED_CONTACT_URL="http://localhost:9200/hasUnlocked"
VITE_CUSTOMER_PROFILE_URL="http://localhost:9200/customers/profile"
VITE_APPROVED_MAIL_URL="http://localhost:9200/admin/approveProvider"
VITE_REJECT_PROVIDER_URL="http://localhost:9200/admin/rejectProvider"
VITE_FETCH_REJECT_PROVIDER="http://localhost:9200/rejected"
VITE_BUY_CUSTOMER_CONTACT="http://localhost:9200/providers/customerContact"