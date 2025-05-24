import { Outlet } from "react-router-dom";
import Header from "../components/header";
import "../style/dashboard.css";
import "../style/tailwind.css";
export default function Dashboard() {
  const username = localStorage.getItem("user");

  return (
    <>
    <Header />
    <div className="static_dash">
      <span id="Welcome">Welcome, to the control ,{username ? username : "user"}!</span>
    </div>
      
      <div className="screens">
        <Outlet />
      </div>
    </>
  );
}
