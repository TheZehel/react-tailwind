import imageManagerSeguroBike from "../banco-de-imagens/BancoDeImagensSeguroBike";

export default function NoBureaucracy() {
  return (
    <section
      className=" items-center justify-center my-10 sm:my-20"
      style={{
        backgroundImage: `url(${imageManagerSeguroBike.NoBureaucracy.bgImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="py-32">
        <h2 className="text-white text-xl sm:text-4xl font-bold">
          Sem burocracias e sem carência
        </h2>
      </div>
    </section>
  );
}
