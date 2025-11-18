import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskList from "./components/tasks/TaskList";
import Layout from "./components/auth/Layout";
import TaskBoard from "./components/tasks/TaskBoard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected or normal layout */}
      <Route path="/" element={<Layout />}>
        <Route path="board" element={<TaskBoard />} />
        <Route path="list" element={<TaskList />} />
      </Route>
    </Routes>
  );
}

export default App;
