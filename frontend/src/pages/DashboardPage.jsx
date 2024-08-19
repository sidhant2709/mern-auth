import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

import { useAuthStore } from '../store/authStore';

const DashboardPage = () => {
    const navigate = useNavigate();

    const { signout, isLoading } = useAuthStore();

    const handleSignout = async () => {
        try {
            await signout();
            navigate('/signin');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
            <div className="p-8">
                <motion.button
                    className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    onClick={handleSignout}
                >
                    {isLoading ? <Loader className=" animate-spin mx-auto" size={24} /> : 'Logout'}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DashboardPage;
