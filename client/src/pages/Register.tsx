import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
            <div className="bg-[#fafafa] border border-gray-200 shadow-sm rounded-2xl p-8 w-full max-w-md text-center">
                
                <h1 className="font-bold text-3xl text-gray-900 mb-4">
                    Create an Account 🚀
                </h1>

                <p className="text-gray-600 mb-8 text-sm">
                    Register to start organizing your tasks effectively.
                </p>

                <RegisterForm />

                <p className="mt-8 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-gray-900 font-medium underline-offset-2 hover:underline transition"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
