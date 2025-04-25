import React, { useEffect } from 'react'
import FloatingShap from './components/FloatingShap'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './Pages/AuthPage'
import EmailVerificationPage from './Pages/EmailVerificationPage.JSX'
import { useAuthStore } from './store/authStore'
import LoadingSpinner from './components/LoadingSpinner'
import DashboardPage from './Pages/DashboardPage'
import ForgotPasswordPage from './Pages/ForgotPasswordPage '
import ResetPasswordPage from './Pages/ResetPasswordPage'
import { Toaster } from 'react-hot-toast'
import { Redo } from 'lucide-react'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user?.isVerified) {
    return <Navigate to='/auth' replace />;
  }
  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const App = () => {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShap
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShap
        color="bg-green-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShap
        color="bg-green-500"
        size="w-32 h-32"
        top="40%%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path='/auth' element={
          <RedirectAuthenticatedUser>
            <AuthPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/verify-email' element={
          <RedirectAuthenticatedUser>
            <EmailVerificationPage />
          </RedirectAuthenticatedUser>
        } />
        <Route path='/forgot-password' element={
          <RedirectAuthenticatedUser>
            <ForgotPasswordPage />
          </RedirectAuthenticatedUser>
        }
        />
        <Route path='/reset-password/:token' element={
          <RedirectAuthenticatedUser>
            <ResetPasswordPage />
          </RedirectAuthenticatedUser>
        }
        />
        {/* catch all routes */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App