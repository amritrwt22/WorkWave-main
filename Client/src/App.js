import React from "react";
import LandingPage from "./AdminLandingPage/LandingPage";
import RegisterForm from "./LoginSignup/signupAdmin";
import LoginForm from "./LoginSignup/loginAdmin";
import BusinessForm from "./BusinessForm/AddBusinessDetails";
import LoginFormUser from "./LoginSignup/LoginUser";
import RegisterFormUser from "./LoginSignup/signupUser";
import UserLandingPage from "./UserLandingPage/UserLandingPage";
import BusinessList from "./Services/BusinessList";
import BusinessDetails from "./Services/BusinessDetails";
import BookingForm from "./Services/BookingForm";
import { ToastContainerWrapper } from "./LoginSignup/Helper/ToastNotify";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ForgotAdmin from './ForgotPassword/ForgotAdmin';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Cookies from "js-cookie";
import AdmindashRoutes from "./AdminDashboard/routes/Router";
import UpdateForm from "./BusinessForm/UpdateForm";
import UserUpdateForm from "./BusinessForm/UserUpdateForm";
import UserDashBoard from "./UserLandingPage/components/Dashboard";
import FinalBusinessDetails from "./Services/BookingDetailsFinal";
import AboutUs from "./AboutUs/AboutUs";
import AboutUsUser from "./AboutUs/AboutUsUser";


const ProtectedRoute = ({ allowedRoles }) => {
  const userRole = Cookies.get("role");
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/user-login" replace />;
  }
  return <Outlet />;
};

const AdminProtectedRoute = () => {
  const userRole = Cookies.get("role");
  if (userRole !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            theme: {
              primary: "#4aed88",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-landingpage" element={<UserLandingPage />} />
          <Route path="/admin-login" element={<LoginForm />} />
          <Route path="/admin-signup" element={<RegisterForm />} />
          <Route path="/user-login" element={<LoginFormUser />} />
          <Route path="/user-signup" element={<RegisterFormUser />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/AboutUs/user" element={<AboutUsUser />} />
          <Route path="/user-forgot-password" element={<ForgotPassword />} />
          <Route path="/admin-forgot-password" element={<ForgotAdmin/>} />

          <Route element={<AdminProtectedRoute />}>
            {AdmindashRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element}>
                {route.children &&
                  route.children.map((child) => (
                    <Route
                      key={child.path}
                      path={child.path}
                      element={child.element}
                    />
                  ))}
              </Route>
            ))}
          </Route>

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route
              path="/businesses/allbusinesses"
              element={<BusinessList />}
            />
            <Route
              path="/business/getBusiness/:id"
              element={<FinalBusinessDetails />}
            />
            <Route
              path="/business/service/bookingform/:id/:serviceId"
              element={<BookingForm />}
            />
            <Route path="/user-update-form" element={<UserUpdateForm />} />
            <Route path="/user-dashboard" element={<UserDashBoard />} />
          </Route>
          {/* Admin Protected Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/business-add-business" element={<BusinessForm />} />
            <Route path="/update-form" element={<UpdateForm />} />
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
        <ToastContainerWrapper />
      </BrowserRouter>
    </>
  );
}

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
        <p className="mt-4">You do not have permission to access this page.</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default App;
