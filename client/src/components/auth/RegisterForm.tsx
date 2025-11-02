import { useState } from "react";
import Button from "../../common/components/Button";
import { useRegister } from "../../hooks/auth/useRegister";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const register = useRegister();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col text-left">
                <label className="text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    required
                />
            </div>

            <div className="flex flex-col text-left">
                <label className="text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    required
                />
            </div>

            <div className="flex flex-col text-left">
                <label className="text-sm font-medium text-gray-600 mb-1">Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 transition-all"
            >
                {register.isPending ? "Registering..." : "Register"}
            </Button>
        </form>
    );
};

export default RegisterForm;
