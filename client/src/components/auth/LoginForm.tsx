import { useState } from "react";
import useLogin from "../../hooks/auth/useLogin";

const LoginForm = () => {
  const [formData, setformData] = useState({
    email: "",
    password: ""
  })
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ ...formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData((prev) => {
      return {
        ...prev,
        [e.target.name]: [e.target.value]
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name='email' placeholder="Email" value={formData.email} onChange={handleChange} />
      <input type="password" name='password' placeholder="Password" value={formData.password} onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm