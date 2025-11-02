import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
                <h1 className="font-bold text-3xl text-gray-800 mb-4">Create an Account 🚀</h1>
                <p className="text-gray-500 mb-8 text-sm">
                    Register to start organizing your tasks effectively
                </p>

                <RegisterForm />

                <p className="mt-8 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-green-600 font-medium hover:underline transition-colors"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
