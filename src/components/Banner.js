import { useState, useEffect } from "react";
import "animate.css";
import { Transition } from "@headlessui/react";
import TrackVisibility from "react-on-screen";
import headerImg from "../assets/img/cel-prime.webp";
import { Bars3Icon } from "@heroicons/react/24/outline";

const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = ["Seguros", "Planos de Saúde"];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [text]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1)
      : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <section className="banner" id="home">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="animate__animated animate__fadeIn">
            <span className="text-xl text-gray-500">Bem Vindos</span>
            <h1 className="text-4xl font-bold mb-4">
              Prime Secure{" "}
              <span
                className="txt-rotate inline-block"
                data-period="1000"
                data-rotate='["Seguros", "Planos de Saúde"]'
              >
                <span className="wrap">{text}</span>
              </span>
            </h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 flex items-center"
              onClick={() => console.log("connect")}
            >
              Ver Seguros <Bars3Icon className="w-4 h-4 ml-2" />
            </button>
          </div>
          <div className="animate__animated animate__zoomIn">
            <img src={headerImg} alt="Header Img" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;