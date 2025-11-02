import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
                <h1 className="font-bold text-3xl text-gray-800 mb-4">Welcome Back 👋</h1>
                <p className="text-gray-500 mb-8 text-sm">
                    Login to continue managing your tasks efficiently
                </p>

                <LoginForm />

                <p className="mt-8 text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-medium hover:underline transition-colors"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;