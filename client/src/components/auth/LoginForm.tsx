import { useState } from "react";
import useLogin from "../../hooks/auth/useLogin";
import Button from "../../common/components/Button";

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
        [e.target.name]: e.target.value
      }
    })
  }

  return (
    <form className="grid place-items-center gap-4 w-[400px] self-center" onSubmit={handleSubmit}>
      <label className="text-sm w-full" >Email : <input className="w-full" type="email" name='email' placeholder="Email" value={formData.email} onChange={handleChange} /></label>
      <label className="text-sm  w-full" >Password : <input className="w-full" type="password" name='password' placeholder="Password" value={formData.password} onChange={handleChange} /></label>
      <Button type="submit">Login</Button>
    </form>
  );
}

export default LoginForm