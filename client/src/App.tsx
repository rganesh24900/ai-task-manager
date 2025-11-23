import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskList from "./components/tasks/TaskList";
import Layout from "./components/auth/Layout";
import TaskBoard from "./components/tasks/TaskBoard";
import Dashboard from "./components/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="board" element={<TaskBoard />} />
        <Route path="/list" element={<TaskList />} />
      </Route>
    </Routes>
  );
}

export default App;
