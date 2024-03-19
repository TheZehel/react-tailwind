import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlanHeader from "./PlanHeader";
import HeaderCotacao from "./HeaderCotacao";
import "animate.css"; // Certifique-se de importar o animate.css

const LayoutCotacaoPlanos = ({ title, position, userData }) => {
  const location = useLocation();
  const [showPlanHeader, setShowPlanHeader] = useState(false);
  const [animateOnce, setAnimateOnce] = useState(false);

  useEffect(() => {
    // Verifica se a animação já foi realizada
    const animationDone = sessionStorage.getItem("animationDone");

    if (!animationDone) {
      sessionStorage.setItem("animationDone", true);
      setAnimateOnce(true);
    }

    const allowedRoutes = [
      "/seguro-bike/cotacao/dados-cadastrais/",
      "/seguro-bike/cotacao/dados-cadastrais",
      "/seguro-bike/cotacao/endereco/",
      "/seguro-bike/cotacao/endereco",
      "/seguro-bike/cotacao/cadastro-bike/",
      "/seguro-bike/cotacao/cadastro-bike",
      "/seguro-bike/cotacao/pagamento/",
      "/seguro-bike/cotacao/pagamento",
    ];

    const shouldShowPlanHeader = allowedRoutes.some((route) =>
      location.pathname.startsWith(route)
    );
    setShowPlanHeader(shouldShowPlanHeader);
  }, [location]);

  console.log("Antes de renderizar o componente PlanHeader");

  return (
    <div
      className={`relative text-md w-full h-full max-w-screen-lg mx-auto mt-5 ${
        animateOnce ? "animate__animated animate__fadeIn" : ""
      }`}
    >
      <HeaderCotacao title={title} position={position} userData={userData} />

      {showPlanHeader && <PlanHeader />}
    </div>
  );
};

export default LayoutCotacaoPlanos;
