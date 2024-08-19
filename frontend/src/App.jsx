import { Navigate, Routes, Route } from 'react-router-dom';

import FloatingShape from './components/FloatingShape';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900  to-emerald-900 flex items-center justify-center relative overflow-hidden">
            <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
            <FloatingShape color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
            <FloatingShape color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
