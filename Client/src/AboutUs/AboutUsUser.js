// import Heading from "../AdminLandingPage/Heading";
import Section from "../AdminLandingPage/Section";
import Header from "../UserLandingPage/components/Header"
import Footer from "../AdminLandingPage/Footer";

import { curve, heroBackground, dashboard } from "../assets";
const aboutDetails = [
  {
    id: 1,
    title: "Empowering Small Businesses",
    text: "Our platform enables parlors, clinics, restaurants, and other small businesses to bring their services online. Expand your reach and grow effortlessly. We provide a suite of tools to help you manage bookings, track customer preferences, and analyze growth trends. Empowering businesses to transition into the digital space has never been easier.",
  },
  {
    id: 2,
    title: "Seamless Slot Booking",
    text: "Customers can easily book slots for your services, providing a hassle-free experience for both businesses and users. Our streamlined system allows for real-time updates, automated reminders, and flexible scheduling options. Say goodbye to missed appointments and hello to efficient booking processes.",
  },
  {
    id: 3,
    title: "Bridging Connections",
    text: "We help bridge the gap between service providers and customers, making your services accessible to a wider audience. Our platform ensures transparent communication, builds trust, and improves customer retention. Expand your business’s network and unlock new growth opportunities.",
  },
];

const AboutUsUser = () => {
  return (
    <>
      <Header/>
      <Section id="about-us" className="bg-white">
        <div className="container relative z-2 text-center bg-white">
          {/* Updated heading styling */}
          <h1 className="h1 mb-6 text-black">
            About Us: Revolutionizing Small{" "}
            <span className="inline-block relative">
              Businesses{" "}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          {/* <Heading
            className="text-4xl font-extrabold text-white mb-10 md:max-w-2xl mx-auto"
            title=""
          /> */}

          <div className="flex flex-wrap justify-center gap-10 text-black bg-white">
            {aboutDetails.map((item) => (
              <div
                className="bg-white rounded-xl shadow-lg p-8 max-w-md transition-transform transform hover:scale-105"
                key={item.id}
              >
                {/* Updated card heading */}
                <h5 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h5>
                {/* Centered text */}
                <p className="text-gray-700 leading-relaxed text-base">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default AboutUsUser;
