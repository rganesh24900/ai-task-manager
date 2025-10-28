import { useState } from 'react';
import { useRegister } from '../../hooks/auth/useRegister';
import Button from '../../common/components/Button';

export default function RegisterForm() {



    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const register = useRegister();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register.mutate({ ...formData });
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
            <label className="text-sm w-full">Name : <input className='w-full border border-amber-700' type="text" name='name' placeholder="Name" value={formData.name} onChange={handleChange} /></label>
            <label className="text-sm w-full">Email : <input className='w-full border border-amber-700' type="email" name='email' placeholder="Email" value={formData.email} onChange={handleChange} /></label>
            <label className="text-sm w-full">Password : <input className='w-full border border-amber-700' type="password" name='password' placeholder="Password" value={formData.password} onChange={handleChange} /></label>

            <Button type="submit">Register</Button>
        </form>
    );
}
