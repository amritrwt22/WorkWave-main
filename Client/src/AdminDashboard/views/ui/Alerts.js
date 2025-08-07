import React, { useState } from "react";
import { Alert, Card, CardBody, CardTitle } from "reactstrap";
import { RiCloseCircleLine } from 'react-icons/ri'; // Importing close icon from react-icons

const Alerts = () => {
  const [visibleAlerts, setVisibleAlerts] = useState([
    { id: 1, color: "blue", text: "This is a primary alert— check it out!" },
    { id: 2, color: "gray", text: "This is a secondary alert— check it out!" },
    { id: 3, color: "green", text: "This is a success alert— check it out!" },
    { id: 4, color: "red", text: "This is a danger alert— check it out!" },
    { id: 5, color: "yellow", text: "This is a warning alert— check it out!" },
    { id: 6, color: "cyan", text: "This is a info alert— check it out!" },
    { id: 7, color: "light", text: "This is a light alert— check it out!" },
    { id: 8, color: "dark", text: "This is a dark alert— check it out!" },
  ]);

  // Function to remove an alert by its ID
  const dismissAlert = (id) => {
    setVisibleAlerts(visibleAlerts.filter(alert => alert.id !== id));
  };

  return (
    <div>
      {/* Card 1 */}
      <Card className="mb-6">
        <CardTitle tag="h6" className="border-b p-4 mb-0 text-lg font-semibold">
          <i className="bi bi-bell mr-2 text-black"></i> <span className="text-black">Alert</span>
        </CardTitle>
        <CardBody>
          <div className="space-y-3">
            {visibleAlerts.map(alert => (
              <Alert
                key={alert.id}
                color={alert.color}
                className={`text-black bg-${alert.color}-100 mb-2 position-relative`} // Added position-relative to Alert
                isOpen={true}
              >
                {/* Text on the left */}
                <span>{alert.text}</span>

                {/* Cross button positioned at the end */}
                <button
                  className="btn-close text-gray-500 position-absolute top-50 end-0 translate-middle-y m-2"
                  onClick={() => dismissAlert(alert.id)} // Remove the alert on click
                  aria-label="Close"
                >
                  <RiCloseCircleLine size={24} /> {/* Cross icon */}
                </button>
              </Alert>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Card 2 */}
      <Card className="mb-6">
        <CardTitle tag="h6" className="border-b p-4 mb-0 text-lg font-semibold">
          <i className="bi bi-bell mr-2 text-black" />
          <span className="text-black">Alert with Links</span>
        </CardTitle>
        <CardBody>
          <div className="space-y-3">
            <Alert
              color="blue"
              className="text-black position-relative"
            >
              This is a primary alert with{" "}
              <a href="/" className="underline text-blue-600">
                an example link
              </a>
              . Give it a click if you like.
              <button
                className="btn-close text-gray-500 position-absolute top-50 end-0 translate-middle-y m-2"
                onClick={() => dismissAlert(1)} // Remove the alert on click
                aria-label="Close"
              >
                <RiCloseCircleLine size={24} />
              </button>
            </Alert>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Alerts;
