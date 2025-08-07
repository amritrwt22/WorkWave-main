import ButtonGradient from "../assets/svg/ButtonGradient";
import Header from "./Header";
import Hero from "./Hero";
import Benefits from "./Benefits";
import Collaboration from "./Collaboration";
import Footer from "./Footer";

const LandingPage=()=>{
  return(
    <>
      <div className="overflow-hidden">
        <Header/>
        <Hero/>
        <Benefits/>
        <Collaboration/>
        <Footer/>
      </div> 
      <ButtonGradient/>
    </>
  )
}

export default LandingPage;