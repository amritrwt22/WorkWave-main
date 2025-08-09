import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa"; // Added your icon

const Feeds = () => {
  const [visible, setVisible] = useState(true);
  const onDismiss = () => setVisible(false);
  const [names, setNames] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user
  const [messages, setMessages] = useState([]); // Store messages for the selected user
  const [messageText, setMessageText] = useState(""); // State for message input

  // Fetch all bookings (users)
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await axios.get(
          "https://workwave-backend.onrender.com/business/getBookings",
          {
            withCredentials: true,
          }
        );
        console.log("API Response:", response.data);
        const bookings = response.data.bookings;
        if (Array.isArray(bookings)) {
          const fetchedNames = bookings.map((booking) => ({
            name: booking.name,
            messageCount: booking.messageCount, // assuming this field exists
            id: booking.id, // Assuming each booking has a unique ID
          }));
          console.log("Fetched Names:", fetchedNames);
          setNames(fetchedNames);
        } else {
          console.log("No bookings found in the response.");
        }
      } catch (error) {
        console.log("Error fetching the names: " + error);
      }
    };

    fetchNames();
  }, []);

  // Fetch messages for the selected user
  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(
        `https://workwave-backend.onrender.com/business/getMessages/${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Messages for user:", response.data);
      setMessages(response.data.messages); // Assuming response contains messages
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  // Handle selecting a user
  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchMessages(user.id); // Fetch messages for the selected user
  };

  // Send message function
  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      alert("Message cannot be empty.");
      return;
    }

    // Assuming your user ID is available and your message needs to be sent to the backend
    const newMessage = {
      sender: "You", // This would be dynamically set based on the logged-in user
      content: messageText,
    };

    // Send message to the backend (assuming there's a POST endpoint to send messages)
    try {
      await axios.post(
        `https://workwave-backend.onrender.com/business/sendMessage/${selectedUser.id}`,
        { message: messageText },
        { withCredentials: true }
      );
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add to message state
      setMessageText(""); // Clear the input field
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div className="flex gap-10">
      {/* Left Section: Users List */}
      <div className="w-1/2 h-[600px] flex flex-col">
        <div className="bg-white rounded-lg shadow-md p-6 flex-grow">
          <h5 className="text-xl font-semibold text-black">Notifications</h5>
          <h6 className="text-gray-600 mb-4">Connect With the Users!</h6>
          <ul>
            {Array.isArray(names) && names.length > 0 ? (
              names.map((user, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-3 px-4 border-b last:border-b-0 cursor-pointer"
                  onClick={() => handleUserClick(user)} // On user click, load messages
                >
                  <button className={`rounded-full p-2 text-black mr-3`}>
                    <i className="icon-class-name text-2xl">
                      <FaRegUserCircle />
                    </i>
                  </button>
                  <div className="flex-grow text-black">{user.name}</div>
                  <small className="text-gray-500">
                    {user.messageCount} Messages
                  </small>
                </li>
              ))
            ) : (
              <li>No names available</li>
            )}
          </ul>
        </div>
      </div>

      {/* Right Section: Chat Window */}
      <div className="w-1/2 bg-white text-black rounded-lg shadow-md p-6 flex flex-col h-[600px]">
        {selectedUser ? (
          <div className="flex flex-col h-full">
            <h5 className="text-xl font-semibold">
              {selectedUser.name}'s Messages
            </h5>
            <div className="flex flex-col gap-4 mt-4 flex-grow overflow-y-auto border-t pt-4">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "You" ? "justify-end" : "justify-start"
                    } gap-2`}
                  >
                    {message.sender !== "You" && (
                      <FaRegUserCircle className="text-xl text-gray-500" />
                    )}
                    <div
                      className={`p-2 rounded-lg ${
                        message.sender === "You"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.sender === "You" && (
                      <FaUserCircle className="text-xl text-blue-500" />
                    )}
                  </div>
                ))
              ) : (
                <p>No messages found for this user.</p>
              )}
            </div>

            {/* Message Input at the Bottom */}
            <div className="flex items-center mt-4 border-t pt-4">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-grow p-2 border rounded-lg"
                placeholder="Type a message"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <p>Select a user to view their messages</p>
        )}
      </div>
    </div>
  );
};

export default Feeds;
