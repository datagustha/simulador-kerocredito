document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const loginScreen = document.getElementById("login-screen");
  const simuladorContent = document.getElementById("simulador-content");
  const loginBtn = document.getElementById("login-btn");
  const senhaInput = document.getElementById("senha_input");
  const loginError = document.getElementById("login-error");
  const calcularBtn = document.getElementById("calcular-btn");
  const producaoInput = document.getElementById("producao_por_loja");
  const comissaoInput = document.getElementById("comissao");

  // Configura animação de scroll
  setupScrollAnimation();

  // Evento de login
  loginBtn.addEventListener("click", function () {
    if (senhaInput.value === "519901") {
      loginScreen.style.display = "none";
      simuladorContent.style.display = "block";
      animateElements();
    } else {
      loginError.textContent = "Senha incorreta. Tente novamente.";
    }
  });

  // Também permite login com Enter
  senhaInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      loginBtn.click();
    }
  });

  // Formatação automática do campo de produção
  producaoInput.addEventListener("input", formatCurrencyInputHandler);
  comissaoInput.addEventListener("input", formatPercentInputHandler);

  // Evento de cálculo
  calcularBtn.addEventListener("click", calcularSimulacao);

  // Funções auxiliares
  function setupScrollAnimation() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });
  }

  function animateElements() {
    document.querySelectorAll(".simulador-content > *").forEach((el, index) => {
      el.classList.add("animate-on-scroll");
      el.style.transitionDelay = `${index * 0.1}s`;
    });

    setTimeout(() => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        el.classList.add("animate");
      });
    }, 100);
  }

  function formatCurrencyInputHandler(e) {
    // Obtém a posição do cursor
    const cursorPosition = e.target.selectionStart;
    const originalLength = e.target.value.length;

    // Formata o valor
    e.target.value = formatCurrencyInput(e.target.value);

    // Ajusta a posição do cursor
    const newLength = e.target.value.length;
    const lengthDiff = newLength - originalLength;
    e.target.setSelectionRange(
      cursorPosition + lengthDiff,
      cursorPosition + lengthDiff
    );

    // Adiciona classe para alinhar à direita
    e.target.classList.add("formatted");
  }

  function formatPercentInputHandler(e) {
    // Obtém a posição do cursor
    const cursorPosition = e.target.selectionStart;
    const originalLength = e.target.value.length;

    // Formata o valor
    e.target.value = formatPercentInput(e.target.value);

    // Ajusta a posição do cursor
    const newLength = e.target.value.length;
    const lengthDiff = newLength - originalLength;
    e.target.setSelectionRange(
      cursorPosition + lengthDiff,
      cursorPosition + lengthDiff
    );

    // Adiciona classe para alinhar à direita
    e.target.classList.add("formatted");
  }

  function formatCurrencyInput(value) {
    // Remove tudo que não é número ou vírgula
    let onlyNumbers = value.replace(/[^\d,]/g, "");

    // Remove zeros à esquerda
    onlyNumbers = onlyNumbers.replace(/^0+/, "") || "0";

    // Garante que há no máximo uma vírgula
    const hasComma = onlyNumbers.includes(",");
    if (hasComma) {
      const parts = onlyNumbers.split(",");
      onlyNumbers =
        parts[0] + "," + (parts[1] || "").replace(/\D/g, "").substring(0, 2);
    }

    // Adiciona separadores de milhar
    const parts = onlyNumbers.split(",");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return parts.join(",");
  }

  function formatPercentInput(value) {
    // Remove tudo que não é número ou vírgula
    let onlyNumbers = value.replace(/[^\d,]/g, "");

    // Remove zeros à esquerda
    onlyNumbers = onlyNumbers.replace(/^0+/, "") || "0";

    // Garante que há no máximo uma vírgula
    const hasComma = onlyNumbers.includes(",");
    if (hasComma) {
      const parts = onlyNumbers.split(",");
      onlyNumbers =
        parts[0] + "," + (parts[1] || "").replace(/\D/g, "").substring(0, 2);
    }

    return onlyNumbers;
  }

  function parseCurrencyInput(value) {
    // Converte o valor formatado para número
    return parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
  }

  function parsePercentInput(value) {
    // Converte o valor formatado para número
    return parseFloat(value.replace(",", ".")) || 0;
  }

  // Função principal de cálculo
  function calcularSimulacao() {
    const qtdLojas = parseInt(document.getElementById("qtd_lojas").value) || 0;
    const producaoPorLoja = parseCurrencyInput(
      document.getElementById("producao_por_loja").value
    );
    let comissao = parsePercentInput(document.getElementById("comissao").value);

    // Validações
    if (qtdLojas > 5) {
      showError("❌ A quantidade de lojas não pode ser maior que 5.");
      return;
    }

    if (isNaN(comissao) || comissao < 0 || comissao > 1) {
      showError("❌ Comissão deve estar entre 0% e 1%.");
      return;
    }

    // Cálculos
    const producaoTotal = qtdLojas * producaoPorLoja;
    let mensalidade = 0;

    if (qtdLojas === 1) {
      mensalidade = 359;
    } else if (qtdLojas === 2) {
      mensalidade = 259 * 2;
    } else if (qtdLojas === 3) {
      mensalidade = 199 * 3;
    } else if (qtdLojas <= 5) {
      mensalidade = 189 * qtdLojas;
    }

    const paga = producaoTotal * (comissao / 100);
    const novaMensalidade = mensalidade - paga;

    // Mostra resultados
    showResults({
      novaMensalidade,
      comissao,
      producaoTotal,
      mensalidade,
      paga,
    });
  }

  // Mostra mensagem de erro
  function showError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;

    // Remove erros anteriores
    const existingError = document.querySelector(
      ".simulador-content .error-message"
    );
    if (existingError) {
      existingError.remove();
    }

    calcularBtn.insertAdjacentElement("afterend", errorElement);
  }

  // Exibe os resultados na tela
  function showResults(data) {
    const resultContainer = document.getElementById("result-container");
    const detailsContainer = document.getElementById("details-container");

    // Formata valores
    document.getElementById("nova_mensalidade").textContent = formatCurrency(
      data.novaMensalidade
    );
    document.getElementById(
      "comissao_aplicada"
    ).textContent = `Comissão aplicada: ${data.comissao.toFixed(2)}%`;
    document.getElementById("producao_total").textContent = formatCurrency(
      data.producaoTotal
    );
    document.getElementById("valor_mensalidade").textContent = formatCurrency(
      data.mensalidade
    );
    document.getElementById("desconto_mensalidade").textContent =
      formatCurrency(data.paga);
    document.getElementById(
      "comissao_percentual"
    ).textContent = `${data.comissao.toFixed(2)}%`;

    // Mostra containers
    resultContainer.style.display = "block";
    detailsContainer.style.display = "block";

    // Anima a exibição
    resultContainer.classList.add("animate-on-scroll");
    detailsContainer.classList.add("animate-on-scroll");

    setTimeout(() => {
      resultContainer.classList.add("animate");
      detailsContainer.classList.add("animate");
    }, 100);
  }

  // Formata valores monetários para exibição
  function formatCurrency(value) {
    return (
      "R$ " +
      value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  // Anima o texto da comissão
  function animatePercent() {
    const element = document.querySelector(".percent-reduction");
    if (element) {
      element.style.animation = "bounce 2s infinite";
    }
    setTimeout(animatePercent, 50);
  }
  animatePercent();
});
