//Components
import FormVidaBanner from "./components/FormVidaBanner";
import SessaoInformativaProdutosLp from "../globalsubcomponentes/SessaoInformativaProdutosLp";
import InformacoesProdutos from "../modules/ModuleInformacoesProdutos";

function IndexVida() {
  return (
    <div className="IndexVida">
      <FormVidaBanner />
      <SessaoInformativaProdutosLp
        InformacoesProdutos={InformacoesProdutos}
        productId="4"
      />
    </div>
  );
}

export default IndexVida;
