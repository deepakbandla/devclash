# Frontend Setup & Configuration

## Overview
The frontend is a React application built with Vite and styled with Tailwind CSS. It provides a professional login/register interface connected to the backend API.

## Features Implemented

### 1. **Authentication Pages**
- **Login Page** (`/login`): Email/password login with validation, error handling, and show/hide password toggle
- **Register Page** (`/register`): User registration with password strength indicator and form validation
- **Protected Routes**: Automatic redirection to login for unauthenticated users

### 2. **API Integration**
- **Axios Configuration** (`src/api/axios.js`): 
  - Centralized API client with automatic token injection
  - Automatic 401 error handling with redirect to login
  - Configurable base URL via `VITE_API_BASE_URL`

- **Auth API** (`src/api/authAPI.js`):
  - `login()` - Authenticate user
  - `register()` - Create new account
  - `logout()` - Clear stored credentials

### 3. **Professional UI Components**
- **Login Component**: Gradient background, glassmorphism design, animated accent elements
- **Register Component**: Password strength validator, real-time feedback
- **Dashboard**: User welcome screen with quick action cards
- **Responsive Design**: Works on mobile, tablet, and desktop

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   The `.env.local` file is already configured with:
   ```
   VITE_API_BASE_URL=http://localhost:5001/api
   ```
   Adjust the API URL if your backend runs on a different port.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## File Structure

```
frontend/src/
├── api/
│   ├── axios.js           # Axios instance with interceptors
│   └── authAPI.js         # Authentication API calls
├── components/
│   ├── Login.jsx          # Login page component
│   ├── Register.jsx       # Registration page component
│   ├── Dashboard.jsx      # User dashboard (protected route)
│   └── ProtectedRoute.jsx # Route protection wrapper
├── App.jsx                # Main app router
├── main.jsx               # Entry point
└── index.css              # Global styles + Tailwind
```

## Key Features

### Login Page
- ✅ Email/password validation
- ✅ Real-time error messages
- ✅ Show/hide password toggle
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Link to registration page
- ✅ Loading state with spinner
- ✅ Token storage in localStorage

### Register Page
- ✅ Username, email, password validation
- ✅ Password strength requirements display
- ✅ Real-time password strength feedback
- ✅ Password confirmation match validation
- ✅ Terms of service agreement
- ✅ Loading state with spinner
- ✅ Link to login page
- ✅ Redirect to login after successful registration

### Authentication Flow
1. User navigates to `/login` or `/register`
2. Form submission sends request to backend API
3. On success, token and user data stored in localStorage
4. User redirected to `/dashboard`
5. Protected routes check token and redirect unauthorized users to login
6. Authentication header automatically added to all API requests

## API Endpoints Used

The frontend connects to these backend endpoints:

- **POST** `/api/auth/register` - Create new account
- **POST** `/api/auth/login` - Login user
- **Data Format**: Uses localStorage with keys `token` and `user`

## Customization

### Change API Base URL
Edit `.env.local`:
```
VITE_API_BASE_URL=https://your-api.com/api
```

### Modify Colors/Styling
- Primary color: Edit Tailwind gradient classes (purple-400, purple-600, etc.)
- Fonts: Customize in `tailwind.config.js`
- Custom CSS: Add to `index.css`

### Add Dark Mode
Tailwind dark mode is pre-configured. Add `dark:` prefix to classes for dark mode styles.

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### CORS errors
Ensure backend is running and API URL in `.env.local` is correct:
```bash
# Backend should be accessible at this URL
curl http://localhost:5001/api
```

### Token not persisting
Check that localStorage is enabled in browser. Token is stored with key `token`.

### Pages not loading
Check that React Router is properly configured in `App.jsx` and all components are imported.

## Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization
- Code splitting enabled by default with Vite
- Lazy loading for routes available (can be added)
- Minification and optimization in production build
- Image optimization recommended via img tags

## Next Steps
1. Ensure backend is running on port 5001
2. Run `npm run dev` to start frontend
3. Navigate to `http://localhost:5173`
4. Test registration and login flows
5. Check browser console for any errors
