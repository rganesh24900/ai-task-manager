import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskList from "./components/tasks/TaskList";
import Layout from "./components/auth/Layout";
import TaskBoard from "./components/tasks/TaskBoard";
import ReminderBar from "./common/components/ReminderBar";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Layout />}>
        <Route path="board" element={<TaskBoard />} />
        <Route index element={<TaskList />} />
      </Route>
    </Routes>
  );
}

export default App;
