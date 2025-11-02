import { useState } from "react";
import useLogin from "../../hooks/auth/useLogin";
import Button from "../../common/components/Button";

const LoginForm = () => {
  const [formData, setformData] = useState({
    email: "",
    password: ""
  });
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ ...formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form
      className="flex flex-col gap-5 w-full"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col text-left">
        <label className="text-sm font-medium text-gray-600 mb-1">Email</label>
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col text-left">
        <label className="text-sm font-medium text-gray-600 mb-1">Password</label>
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition-all"
      >
        {login.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default LoginForm;
