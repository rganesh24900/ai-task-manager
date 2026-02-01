import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))
const TaskList = lazy(() => import("./components/tasks/TaskList"))
const Layout = lazy(() => import("./components/auth/Layout"))
const TaskBoard = lazy(() => import("./components/tasks/TaskBoard"))
const Dashboard = lazy(() => import("./components/dashboard"))
function App() {
  return (
    <Suspense fallback={<p>
      Loading...
    </p>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="board" element={<TaskBoard />} />
          <Route path="/list" element={<TaskList />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
