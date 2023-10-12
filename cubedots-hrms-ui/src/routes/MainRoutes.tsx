import React from "react";
import AuthRequired from "../context/AuthRequired";
import Dashboards from "../pages/dashboard";
import { MainLayout } from "../layout/MainLayout";
import Profile from "../pages/profile";
import Attendence from "../pages/attendence";
import Leave from "../pages/leave";
import AdminPanel from "../pages/adminPanel";
import NotAuthorized from "../pages/extra/Unauthorized";
import NotFound from "../pages/extra/NotFound";
import EmployeeManagement from "../pages/adminPanel/employee-management";
import LeaveManagement from "../pages/adminPanel/leave-management";
import AttendanceManagement from "../pages/adminPanel/attendance-management";
import InsertAttendance from "../pages/attendence/InsertAttendance";

const MainRoutes = {
  path: "/",
  element: (
    <AuthRequired>
      <MainLayout />
    </AuthRequired>
  ),
  children: [
    {
      path: "",
      element: <Dashboards />,
    },
    {
      path: "home",
      element: <Dashboards />,
    },
    {
      path: "dashboard",
      element: <Dashboards />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "attendence",
      element: <Attendence />,
    },
    {
      path: "leave",
      element: <Leave />,
    },
    {
      path:'insert-attendance',
      element:<InsertAttendance/>
    },
    {
      path: "admin-panel",
      element: <AdminPanel />,
      children: [
    
        { 
          path: "user-management",
          element: <EmployeeManagement />,
        },
        {
          path: "leave-management",
          element: <LeaveManagement />,
        },
        {
          path: "attendance-management",
          element: <AttendanceManagement />,
        },
      ],
    },
    {
      path: "not-authorized",
      element: <NotAuthorized />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
};

export default MainRoutes;
