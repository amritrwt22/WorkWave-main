import { Button, Nav, NavItem } from "reactstrap";  // Corrected import
import Logo from "../assets/logosaas.png";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard/starter",
    icon: "bi bi-speedometer2",
  },
  // {
  //   title: "Alert",
  //   href: "/dashboard/alerts",
  //   icon: "bi bi-bell",
  // },
  {
    title: "Bookings",
    href: "/dashboard/table",
    icon: "bi bi-patch-check",
  },
  {
    title: "Chat",
    href: "/dashboard/buttons",
    icon: "bi bi-hdd-stack",
  },
  {
    title: "Add Services",
    href: "/dashboard/cards",
    icon: "bi bi-card-text",
  },
  // {
  //   title: "Sales Tracker",
  //   href: "/dashboard/grid",
  //   icon: "bi bi-columns",
  // },
  {
    title:  "Back to Home",
    href: "/",
    icon: "bi bi-house-door",
  }
];

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  let location = useLocation();

  return (
    <div className="fixed top-0 left-0 h-full bg-gray-900 p-4 w-64">
      <div className="flex items-center text-white">
        <img src={Logo} alt="saaslogo" className="h-10 w-10" />
        <h3 className="ml-2 text-xl font-bold">WorkWave</h3>
        <span className="ms-auto block lg:hidden">
          <Button
            close
            size="sm"
            onClick={showMobilemenu}
            className="lg:hidden"
          />
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="space-y-2">
          {navigation.map((navi, index) => (
            <NavItem key={index}>
              <Link
                to={navi.href}
                className={`${
                  location.pathname === navi.href
                    ? "text-blue-500"
                    : "text-white"
                } flex items-center py-3 hover:text-blue-500 transition-colors duration-200`}
              >
                <i className={`${navi.icon} text-xl mr-3`}></i>
                <span>{navi.title}</span>
              </Link>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
