import "./App.css";
import Home from "./pages/home/Home";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import emailjs from "emailjs-com";

function App() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const getUserIPAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        if (response.ok) {
          const data = await response.json();
          return data.ip;
        } else {
          throw new Error("Failed to fetch user IP address");
        }
      } catch (error) {
        console.error("Error fetching user IP address:", error);
        return null;
      }
    };

    const getIpInfo = async (ipAddress) => {
      try {
        const accessKey = "94de412f-1efb-4de1-9f58-b54e793f85e3";
        const url = `https://apiip.net/api/check?ip=${ipAddress}&accessKey=${accessKey}`;
        const response = await fetch(url);
        const result = await response.json();
        setResult(result);

        if (result) {
          console.log(result);
          sendEmail(result);
        } else {
          console.error("Location information not available in the response.");
        }
      } catch (error) {
        console.error("Error fetching IP information:", error);
      }
    };

    const sendEmail = async (result) => {
      try {
        const { countryName, city, latitude, longitude } = result;

        const templateParams = {
          countryName,
          city,
          latitude,
          longitude,
        };

        const response = await emailjs.send(
          "service_y5mt0xe",
          "template_ad8omla",
          templateParams,
          "_rDAsS0VvrZK8pJj8"
        );

        console.log("Email sent successfully!", response.status, response.text);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    };

    const fetchData = async () => {
      const ipAddress = await getUserIPAddress();
      if (ipAddress) {
        console.log("User IP Address:", ipAddress);
        await getIpInfo(ipAddress);
      } else {
        console.error("Failed to get user IP address.");
      }
    };

    fetchData();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
