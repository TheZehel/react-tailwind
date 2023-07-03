import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Components
import FormTravelBanner from "./components/FormTravelBanner";
import SliderPlanos from "./components/SliderPlanos";

function IndexTravel() {
  return (
    <div className="IndexTravel">
      <FormTravelBanner />
      <SliderPlanos />
    </div>
  );
}

export default IndexTravel;
