import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import useLogin from "../../hooks/auth/useLogin";
import Button from "../../common/components/Button";
import { useState } from "react";

const LoginForm = () => {
  const login = useLogin();
  const [apiError, setApiError] = useState<string | null>(null);

  const LoginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (formData: { email: string; password: string }) => {
    setApiError(null); // clear previous errors
    login.mutate(formData, {
      onError: (error: any) => {
        // Handles both network and API errors
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please try again.";
        setApiError(message);
      },
    });
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="flex flex-col gap-5 w-full">
          {/* Email */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <Field
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              type="email"
              name="email"
              placeholder="Enter your email"
            />
            <ErrorMessage
              name="email"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col text-left">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <Field
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              type="password"
              name="password"
              placeholder="Enter your password"
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

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition-all disabled:opacity-70"
            disabled={login.isPending}
          >
            {login.isPending ? "Logging in..." : "Login"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
