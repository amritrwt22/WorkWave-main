import React, { useState } from "react";
import { Card, CardBody, CardTitle, Alert } from "reactstrap";
import { RiCloseCircleLine } from 'react-icons/ri'; // Importing close icon from react-icons

const Feeds = () => {
  // State to handle visibility of each alert
  const [visibleAlerts, setVisibleAlerts] = useState([
    { id: 1, color: "yellow", text: "I am an alert with a light yellow background!" },
    { id: 2, color: "green", text: "I am an alert with a light green background!" },
    { id: 3, color: "blue", text: "I am an alert with a light blue background!" },
    { id: 4, color: "gray", text: "I am an alert with a gray background!" }
  ]);

  // Function to remove an alert
  const dismissAlert = (id) => {
    setVisibleAlerts(visibleAlerts.filter(alert => alert.id !== id));
  };

  return (
    <Card className="shadow-md mt-5">
      <CardBody className="px-10 py-10 flex flex-col h-[500px] w-[480px]">
        <CardTitle tag="h5" className="text-xl font-bold text-black">
          Notifications
        </CardTitle>
        <div className="flex-grow">
          {visibleAlerts.map(alert => (
            <Alert
              key={alert.id}
              color="light"
              className={`mb-2 text-black bg-${alert.color}-100 mt-3 position-relative`} // Add position-relative
              isOpen={true}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>{alert.text}</span>
                {/* Close button using react-icons */}
                <button
                  className="btn-close text-gray-500 position-absolute top-0 end-0 m-2" // Positioning the button
                  onClick={() => dismissAlert(alert.id)} // Remove the alert on click
                  aria-label="Close"
                >
                  <RiCloseCircleLine size={24} /> {/* Cross icon */}
                </button>
              </div>
            </Alert>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default Feeds;
