// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaCar } from "react-icons/fa";

const Header = () => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between px-6 py-4 shadow-md bg-white"
        >
            <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-3 rounded-full">
                    <FaCar className="text-white text-2xl" />
                </div>
                <div>
                    <h1 className="text-gray-900 text-lg font-bold">Grupo Ômega</h1>
                    <p className="text-gray-600 text-sm">Controle de Quilometragem</p>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;