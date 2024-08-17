import { motion } from 'framer-motion';

const SignUpPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white w-full h-full"
        >
            SignUpPage
        </motion.div>
    );
};

export default SignUpPage;
