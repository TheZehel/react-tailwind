import React, { useEffect } from "react";

export default function Form() {
  useEffect(() => {
    const scriptId = "rdstation-script";
    let script = document.getElementById(scriptId);

    if (!script) {
      // Carregar o script do RDStation de forma dinâmica
      script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js";
      document.body.appendChild(script);
    }

    script.onload = () => {
      // Criar o formulário somente depois que o script do RDStation for carregado
      new window.RDStationForms(
        "leads-lp-vida-portateis-8ec21464a9c77a428090",
        "UA-172743567-1"
      ).createForm();
    };
  }, []);

  return (
    <div className="animate__animated animate__zoomIn rounded-lg bg-white p-5 sm:px-10 sm:mx-20 xl:mx-32">
      <div role="main" id="leads-lp-vida-portateis-8ec21464a9c77a428090"></div>
    </div>
  );
}
