import { useEffect } from 'react';
import { Navigate, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Github } from 'lucide-react';

import LoadingSpinner from './components/LoadingSpinner';
import FloatingShape from './components/FloatingShape';

import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    if (!user.isVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user.isVerified) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900  to-emerald-900 flex items-center justify-center relative overflow-hidden">
            <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
            <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
            <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
            <Link
                to="https://github.com/sidhant2709/mern-auth"
                className="absolute bottom-0 right-0 p-4 bg-gray-800 bg-opacity-50 rounded-full border border-gray-700 text-green-500"
                title="Source Code on GitHub"
            >
                <Github className="size-6 inline-block" />
            </Link>

            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RedirectAuthenticatedUser>
                            <SignUpPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/signin"
                    element={
                        <RedirectAuthenticatedUser>
                            <SignInPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route
                    path="/forgot-password"
                    element={
                        <RedirectAuthenticatedUser>
                            <ForgotPasswordPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/reset-password/:token"
                    element={
                        <RedirectAuthenticatedUser>
                            <ResetPasswordPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Toaster position="top-right" />
        </div>
    );
}

export default App;
