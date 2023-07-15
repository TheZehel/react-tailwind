import BannerSection from "../../globalsubcomponentes/BannerSection";
//import SimpleFormSection from "../../globalsubcomponentes/SimpleFormSection";
import imageManagerSeguroCelular from "../bancodeimagens/BancoDeImagensSeguroCelular";
import Form from "./Form";

export default function FormSeguroCelularBanner() {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center p-2"
      style={{
        backgroundImage: `url(${imageManagerSeguroCelular.banners.BannerSeguroCelular})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <BannerSection
        chipText="Seu Aparelho Celular em Segurança Com"
        titleText="Seguro de Celular"
        descriptionText="Não importa como e para onde você viaja, nós te protegemos. Ainda Contamos Com + de 30 Coberturas."
      />
      <Form />
    </section>
  );
}
