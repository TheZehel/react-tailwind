import GlobalFuntions from "../../globalsubcomponentes/globalFunctions";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

//Components
import Quotation from "./components/Quotation";
import { step } from "@material-tailwind/react";
import BuyerData from "./components/BuyerData";
import AddressData from "./components/AddressData";
import DataBike from "./components/DataPhone";
import DataPhone from "./components/DataPhone";
import PaymentPhone from "./PaymentPhone";

const globalFunctions = new GlobalFuntions();

export default function IndexCotacaoSeguroCelularkakau() {
  const pageSlug = globalFunctions.getPageSlug();

  const slugArray = globalFunctions.getPageSlugArray();

  const [currentStep, setCurrentStep] = useState(1);

  const [reloadComponent, updateComponent] = useState(false);

  const [formData, setFormData] = useState({
    userData: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const navigate = useNavigate();

  const nextStep = (step, data) => {
    if (step === 2) {
      if (!Array.isArray(data) || data.length < 1) {
        console.error("Dados de cotação não fornecidos");
        return;
      }

      sessionStorage.setItem("selectedPlan", JSON.stringify(data));
      navigate("/seguro-celular-kakau/cotacao/dados-cadastrais");
    } else if (step === 3) {
      // Supondo que não há dados adicionais específicos para verificar nesta etapa
      navigate("/seguro-celular-kakau/cotacao/endereco");
    } else if (step === 4) {
      // Supondo que não há dados adicionais específicos para verificar nesta etapa
      navigate("/seguro-celular-kakau/cotacao/cadastro-celular");
    } else if (step === 5) {
      // Supondo que nesta etapa você pode querer verificar/confirmar algum dado antes de prosseguir
      // Por exemplo, confirmação de dados de endereço ou algo similar
      navigate("/seguro-celular-kakau/cotacao/pagamento");
    }
    // Adicione mais condições aqui conforme necessário
  };

  const updateData = (index, key, value) => {
    // Garante uma atualização imutável do estado
    setFormData((prevFormData) => ({
      ...prevFormData,
      [index]: {
        ...prevFormData[index],
        [key]: value,
      },
    }));
  };

  useEffect(() => {
    const newStep = slugArray.includes("pagamento")
      ? 5
      : slugArray.includes("cadastro-celular")
      ? 4
      : slugArray.includes("endereco")
      ? 3
      : slugArray.includes("dados-cadastrais")
      ? 2
      : 1;

    console.log("New Step:", newStep);
    console.log("Step:", currentStep);

    if (currentStep !== newStep) {
      //setCurrentStep(newStep);
    }

    console.log(
      "Current Step:",
      currentStep,
      "Slug Array:",
      slugArray,
      "Page Slug:",
      pageSlug
    );
  }, [slugArray, pageSlug]);

  //Conforme criar outros endpoints adicionar a excessão aqui "|| !slugArray.includes("slug-da-pagina")" no if do primeiro if
  if (
    !slugArray.includes("dados-cadastrais") &&
    !slugArray.includes("endereco") &&
    !slugArray.includes("cadastro-celular") &&
    !slugArray.includes("pagamento") &&
    currentStep !== 1
  ) {
    setCurrentStep(1);
  }

  //Criar um novo if para adicionar os próximos steps relacionados com o slug
  if (slugArray.includes("dados-cadastrais") && currentStep !== 2) {
    setCurrentStep(2);
  }

  if (slugArray.includes("endereco") && currentStep !== 3) {
    setCurrentStep(3);
  }

  if (slugArray.includes("cadastro-celular") && currentStep !== 4) {
    setCurrentStep(4);
  }

  if (slugArray.includes("pagamento") && currentStep !== 5) {
    setCurrentStep(5);
  }

  console.log(
    "Current Step:",
    currentStep,
    "Slug Array:",
    slugArray,
    "Page Slug:",
    pageSlug
  );

  useEffect(() => {
    // Identifica o step atual baseado no slugArray
    let step = 1; // Default step inicial

    // Expande a lógica para incluir os novos slugs
    if (slugArray.includes("dados-cadastrais")) {
      step = 2;
    } else if (slugArray.includes("endereco")) {
      step = 3;
    } else if (slugArray.includes("cadastro-celular")) {
      step = 4; // Adiciona o step para "cadastro-bike"
    } else if (slugArray.includes("pagamento")) {
      step = 5; // Adiciona o step para "pagamento"
    }

    // Atualiza o currentStep apenas se for diferente do valor atual
    if (currentStep !== step) {
      setCurrentStep(step);
    }
  }, [slugArray]); // Inclui currentStep nas dependências para reavaliar quando mudar

  return (
    <div>
      {currentStep < 2 && (
        <Quotation currentStep={currentStep} nextStep={nextStep} />
      )}
      {currentStep === 2 && (
        <BuyerData
          formData={formData}
          submitForm={nextStep}
          updateForm={updateData}
          reload={reloadComponent}
        />
      )}
      {currentStep === 3 && (
        <AddressData
          formData={formData}
          submitForm={nextStep}
          updateFormData={(data) => {
            setFormData({ ...formData, ...data });
          }}
          reload={reloadComponent}
        />
      )}
      {currentStep === 4 && <DataPhone />}
      {currentStep === 5 && <PaymentPhone />}
    </div>
  );
}
