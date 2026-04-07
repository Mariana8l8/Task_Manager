# Task Manager - Frontend

React + Vite + TypeScript frontend for the Task Manager application.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm v8+
- Backend running on `http://localhost:5000`

### Installation

1. Navigate to the client directory:
```bash
cd client/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173`

## 📁 Directory Structure

```
src/
├── pages/
│   ├── Login.tsx          - Login page
│   ├── Register.tsx       - Registration page
│   └── Tasks.tsx          - Tasks management page
├── services/
│   └── api.ts             - Axios API client
├── styles/
│   ├── Auth.css           - Auth pages styling
│   └── Tasks.css          - Tasks page styling
├── types/
│   └── index.ts           - TypeScript interfaces
├── App.tsx                - Main app with routing
├── main.tsx               - Entry point
├── index.css              - Global styles
└── App.css                - App component styles
```

## 🎨 Pages

### Login Page (`/login`)
- Email and password input fields
- Link to register
- Error message display
- Automatic redirect to tasks on login

### Register Page (`/register`)
- Username, email, password, confirm password inputs
- Form validation
- Error handling
- Link to login
- Auto-login after registration

### Tasks Page (`/tasks`)
- Protected route (requires authentication)
- Display all user tasks
- Add new task form
- Delete task functionality
- Logout button
- Date display for each task

## 🔌 API Integration

The frontend communicates with the backend via Axios with automatic JWT token handling.

### Features
- ✅ Automatic Authorization header with Bearer token
- ✅ Automatic login redirect on 401 errors
- ✅ Error interceptors
- ✅ Request interceptors for auth

### API Client Location
`src/services/api.ts`

## 🔐 Authentication

1. **Token Storage**
   - JWT token stored in localStorage
   - Retrieved automatically for API requests
   - Cleared on logout or token expiration

2. **Protected Routes**
   - Tasks page checks for token on load
   - Redirects to login if no token found
   - Automatic logout on 401 response

## 📝 Features

- ✅ User registration
- ✅ User login
- ✅ Task creation with title and description
- ✅ Task display with date
- ✅ Task deletion
- ✅ Logout functionality
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ TypeScript type safety

## 🎯 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Output: `dist/` folder

### Preview Production Build
```bash
npm run preview
```

## 🧹 Linting

```bash
npm run lint
```

## 🎨 Styling

- **Technology**: CSS3
- **Auth Styles**: `src/styles/Auth.css`
- **Tasks Styles**: `src/styles/Tasks.css`
- **Global Styles**: `src/index.css`

### Color Scheme
- Primary: Purple (`#667eea` to `#764ba2`)
- Error: Red (`#e74c3c`, `#c0392b`)
- Text: Dark gray (`#333`, `#666`, `#999`)
- Background: Light gray (`#f5f5f5`)

## 📦 Dependencies

### Production
- **react** - UI library
- **react-dom** - React rendering
- **react-router-dom** - Client routing
- **axios** - HTTP client

### Development
- **vite** - Build tool
- **typescript** - Type safety
- **@vitejs/plugin-react** - React plugin for Vite

## 🌍 Environment Configuration

API endpoint: `http://localhost:5000`

Configured in `src/services/api.ts`

For production, update:
```typescript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

## 🚢 Deployment

### Vercel
1. Build: `npm run build`
2. Push to GitHub
3. Import in Vercel
4. Set environment variable for API URL

### Netlify
1. Build: `npm run build`
2. Build directory: `dist`
3. Set environment variable for API URL

### Direct Hosting
1. Build: `npm run build`
2. Upload `dist/` folder contents
3. Configure web server for SPA routing
4. Update API URL in environment

## 🔒 Security Notes

- ✅ Tokens stored in localStorage (consider using httpOnly cookies for production)
- ✅ Automatic CSRF prevention via same-origin requests
- ✅ Secure password validation
- ✅ Input validation on forms
- ✅ Error messages don't expose sensitive data

## 🛠 Troubleshooting

### Backend Connection Error
- Ensure backend is running on `http://localhost:5000`
- Check CORS configuration in backend
- Verify API_BASE_URL in `src/services/api.ts`

### Token Not Persisting
- Check localStorage in browser DevTools
- Verify localStorage is enabled
- Check token expiration (7 days)

### Port Already in Use
- Vite will automatically try next available port
- Or specify port: `npm run dev -- --port 5174`

---

For more information, see the main [README.md](../../README.md)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

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

export default defineConfig([
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
