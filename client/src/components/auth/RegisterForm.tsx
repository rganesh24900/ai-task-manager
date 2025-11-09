import { useState } from "react";
import Button from "../../common/components/Button";
import { useRegister } from "../../hooks/auth/useRegister";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import type { RegisterData } from "../../types";

const RegisterForm = () => {


    const register = useRegister();
    const [apiError, setApiError] = useState<string | null>(null);

    const RegisterSchema = Yup.object({
        name: Yup.string()
            .required("Name is required"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Minimum 6 characters")
            .required("Password is required"),
    });

    const handleSubmit = (formData: RegisterData) => {
        register.mutate(formData, {
            onError: (error: any) => {
                // Handles both network and API errors
                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Registration failed. Please try again.";
                setApiError(message);
            },
        });
    };

    return (
        <Formik initialValues={{
            name: "",
            email: "",
            password: ""
        }} validationSchema={RegisterSchema} onSubmit={handleSubmit} >
            {
                () => (
                    <Form className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col text-left">
                            <label className="text-sm font-medium text-gray-600 mb-1">Full Name</label>
                            <Field
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                                required
                            />
                            <ErrorMessage
                                name="name"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>
                        <div className="flex flex-col text-left">
                            <label className="text-sm font-medium text-gray-600 mb-1">Email</label>
                            <Field
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                                required
                            />
                            <ErrorMessage
                                name="email"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>
                        <div className="flex flex-col text-left">
                            <label className="text-sm font-medium text-gray-600 mb-1">Password</label>
                            <Field
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                                required
                            />
                            <ErrorMessage
                                name="password"
                                component="p"
                                className="text-red-500 text-xs mt-1"
                            />
                        </div>
                        {apiError && (
                            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {apiError}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 transition-all"
                        >
                            {register.isPending ? "Registering..." : "Register"}
                        </Button>
                    </Form>
                )
            }
        </Formik>
    );
};

export default RegisterForm;
