import { Navigate } from "react-router-dom"; // Use Navigate for redirection
import FullLayout from '../layouts/FullLayout'; // Layout for the dashboard
import Starter from '../views/Starter'; // Admin starter page
import Alerts from '../views/ui/Alerts';
import Buttons from '../views/ui/Buttons';
import Cards from '../views/ui/Cards';
import Grid from '../views/ui/Grid';
import Tables from '../views/ui/Tables';
// import '../assets/scss/style.scss'; 

const AdmindashRoutes = [
  {
    path: "dashboard",  // Ensure path starts without the leading '/'
    element: <FullLayout />, // Layout for the dashboard
    children: [
      { path: "", element: <Navigate to="starter" /> },  // Redirect to /dashboard/starter by default (relative path)
      { path: "starter", element: <Starter /> },  // Starter page (main dashboard page)
      { path: "alerts", element: <Alerts /> },
      { path: "buttons", element: <Buttons /> },
      { path: "cards", element: <Cards /> },
      { path: "grid", element: <Grid /> },
      { path: "table", element: <Tables /> },
    ],
  },
];

export default AdmindashRoutes; // Export the routes for the Admin Dashboard
