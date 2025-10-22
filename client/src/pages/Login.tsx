import LoginForm from "../components/auth/LoginForm"

const Login = () => {
    return (
        <div className="flex flex-col gap-6 p-2"><h1 className="font-bold text-2xl">Login here</h1>
            <LoginForm />
        </div>
    )
}

export default Login