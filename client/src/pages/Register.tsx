import RegisterForm from "../components/auth/RegisterForm"

const Register = () => {
    return (
        <div className="flex flex-col gap-2"><h1 className="text-2xl font-bold">Register here</h1>
            <RegisterForm />
        </div>
    )
}

export default Register