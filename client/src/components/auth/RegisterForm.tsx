import { useState } from 'react';
import { useRegister } from '../../hooks/auth/useRegister';

export default function RegisterForm() {



    const [formData, setformData] = useState({
        name:"",
        email:"",
        password:""
    })
    const register = useRegister();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register.mutate({ ...formData });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setformData((prev)=>{
            return {
                ...prev,
                [e.target.name] : [e.target.value]
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name='name' placeholder="Name" value={formData.name} onChange={handleChange} />
            <input type="email" name='email' placeholder="Email" value={formData.email} onChange={handleChange} />
            <input type="password" name='password' placeholder="Password" value={formData.password} onChange={handleChange} />
            <button type="submit">Register</button>
        </form>
    );
}
