import React from "react";
import Sidebar from "./Sidebar";
import Header from "./New_header";
import { Outlet } from "react-router-dom";

// Remove the SCSS imports (as Tailwind will handle styling now)

const FullLayout = () => {
  return (
    <main>
      {/* Applying the container styles and general layout styles using Tailwind */}
      <div className="flex lg:flex-row flex-col min-h-screen">
        {/********Sidebar**********/}
        <aside className="lg:w-64 w-full shadow-lg" id="sidebarArea">
          <Sidebar />
        </aside>

        {/********Content Area**********/}
        <div className="flex-1 bg-gray-50">
          {/********Header**********/}
          {/* <Header /> */}

          {/********Middle Content**********/}
          <div className="p-4">
            <Outlet /> {/* This renders child routes like /starter */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
