// components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ReminderBar from "../../common/components/ReminderBar";

export default function Layout() {
    return (
        <>
            <Navbar />
            <ReminderBar />
            <Outlet />
        </>
    );
}
