import { api, dh } from "../services/api";
import CryptoJS from "crypto-js";
import { decode, encode } from "base-64";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { v4 as uuidv4 } from "uuid";

const tokenKey = "super_chave_secreta";
const this_version = "1.0";

export function setToken(data, pfp) {
  const crypto = CryptoJS.AES.encrypt(data, tokenKey).toString();
  localStorage.setItem("info", crypto);
  localStorage.setItem("pfp", pfp);
}

export const pessoa = getToken();

export const CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
    if (cipherParams.iv) j.iv = cipherParams.iv.toString();
    if (cipherParams.salt) j.s = cipherParams.salt.toString();
    return JSON.stringify(j);
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    return cipherParams;
  },
};

export const encryptKey = async () => {
  const num_cadastrado = localStorage.getItem("num");
  const key = await dateServer();
  return encode(
    CryptoJS.AES.encrypt(num_cadastrado, key, {
      format: CryptoJSAesJson,
    }).toString()
  );
};

export async function Geral_API(dados, logado) {
  // Checando versão do web
  let version = localStorage.getItem("ver");
  if (version !== this_version) {
    localStorage.clear();
    alert("Nova versão encontrada. Recarregando site...");
    window.location.href = "/";
  }
  localStorage.setItem("ver", this_version);

  let num_aparelho = localStorage.getItem("num");

  if (!num_aparelho) {
    const chave_nova = Math.random().toString();
    localStorage.setItem("num", chave_nova);
  }

  const num_cadastrado = localStorage.getItem("num");
  const key = await dateServer();
  const criptografar = await encryptKey();

  // Define os headers iniciais
  var headers = {
    Accept: "application/json",
    token2f: criptografar,
    banco: process.env.NOME_BANCO
  };

  // Adiciona headers para requisições autenticadas
  const info = getToken();
  if (logado) {
    onAction();
    headers["token"] = info.token_api;
    headers["contaid"] = info.conta_id;
    headers["chave"] = info.chave;
  }

  const data = dados.data;

  // Se o `data` for `FormData`, não define manualmente o `Content-Type`
  const isFormData = data instanceof FormData;
  if (!isFormData) {
    headers["Content-type"] = "application/json";
  }

  const url = dados.url.startsWith("/") ? dados.url.slice(1) : dados.url;

  let apiFunc = {};

  switch (dados.method) {
    case "POST":
      apiFunc = api.post(url, data, { headers });
      break;
    case "GET":
      apiFunc = api.get(url, { headers });
      break;
    case "PDF":
      apiFunc = api.post(url, data, { headers, responseType: "blob" });
      break;
    default:
      alert("Erro de API");
  }

  const [err, result] = await callbackWrapper(apiFunc);
  if (err) {
    alert("Processamento inválido, contate seu gerente!");
  } else {
    return result.data;
  }
}


function getToken() {
  let pessoa = {};
  let dados = localStorage.getItem("info");
  if (dados != null && dados != "" && dados != undefined) {
    pessoa = JSON.parse(
      CryptoJS.AES.decrypt(dados, tokenKey).toString(CryptoJS.enc.Utf8)
    );
    pessoa.image_home = localStorage.getItem("pfp");
  }
  return pessoa;
}

function callbackWrapper(promise) {
  return promise.then((result) => [null, result]).catch((err) => [err]);
}

async function dateServer() {
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
  };

  const response = await dh
    .get("dh", { headers })
    .then((res) => {
      res = res.data.substr(0, 16).replace("T", " ");
      return res;
    })
    .catch((err) => {
      return err;
    });
  return response;
}

function setTime() {
  const crypto = CryptoJS.AES.encrypt(
    new Date().toString(),
    tokenKey
  ).toString();
  localStorage.setItem("dt", crypto);
}

function onAction() {
  const encryptedDate = localStorage.getItem("dt");
  if (encryptedDate) {
    const date = CryptoJS.AES.decrypt(encryptedDate, tokenKey).toString(
      CryptoJS.enc.Utf8
    );
    var hora_acao = new Date();
    var hora_anterior = new Date(date);

    var hora_ini = Date.parse(hora_acao);
    var hora_ant = Date.parse(hora_anterior);

    var minutos = hora_ini - hora_ant;

    if (minutos > 3600000) {
      // if (minutos > 50000) {
      alert("Sua sessão expirou! Por favor logue novamente.");
      logout();
    }
  }
  setTime();
}

export function logout() {
  localStorage.removeItem("info");
  localStorage.removeItem("pfp");
  localStorage.removeItem("num");
  localStorage.removeItem("hora_anterior");
  localStorage.removeItem("dt");
  if (window.location.pathname != "/") window.location.href = "/";
}

export function comprovante_pdf(id) {
  const data = {
    url: "conta/comprovante-pdf",
    data: { id: id, app: 1 },
    method: "POST",
  };

  Geral_API(data, true)
    .then((res) => {
      console.log("Resposta da API:", res);

      if (!res) {
        console.error("Dados inválidos ou ausentes.");
        return;
      }

      if (res.pix) {
        comprovante_ver(id);
        return;
      }

      // Identifica se o retorno é PIX ou Transferência
      const transferencia = res.transferencia;
      if (!transferencia) {
        console.error("Nenhum dado de transferência ou PIX encontrado.");
        return;
      }

      const dados_pagador = transferencia.dados_pagador || {};
      const dados_recebedor = transferencia.dados_recebedor || {};
      const dados_transacao = transferencia.dados_transacao || {};

      const doc = new jsPDF();
      const startY = 70;
      const tableWidth = 190;
      const cellPadding = 5;
      const cellHeight = 10;
      let cursorY = startY;

      // Adiciona o logotipo
      const addLogoAndGeneratePDF = (logoBase64) => {
        if (logoBase64) {
          doc.addImage(logoBase64, "PNG", 10, 10, 40, 40);
        }

        doc.setFontSize(14);
        doc.text(
          `Comprovante de ${res.pix ? "PIX" : "Transferência"}`,
          10,
          cursorY - 10
        );

        // Desenha tabela com espaçamento entre título e resultado
        const drawTableRow = (label, value) => {
          // Simula a borda com espaçamento
          doc.rect(10, cursorY, tableWidth, cellHeight); // Borda externa (sem borda central)
          doc.text(`${label}:`, 15, cursorY + cellPadding); // Coloca o texto do título
          doc.text(value, 105, cursorY + cellPadding); // Coloca o valor à direita
          cursorY += cellHeight; // Move o cursor para a próxima linha
        };

        // Dados da transação
        drawTableRow(
          "Data",
          res.pix
            ? dados_transacao.data_transacao || "N/A"
            : dados_transacao.data || "N/A"
        );
        drawTableRow("Valor Pago", `R$ ${dados_transacao.valor_pago || "N/A"}`);
        if (res.pix) {
          drawTableRow("Chave PIX", dados_transacao.chave_pix || "N/A");
          drawTableRow(
            "ID Transação",
            dados_transacao.identificador_transacao || "N/A"
          );
          drawTableRow("Status", dados_transacao.status || "N/A");
        } else {
          drawTableRow("Finalidade", dados_transacao.finalidade || "N/A");
          drawTableRow("Status", dados_transacao.status || "N/A");
        }

        cursorY += 10; // Espaço entre as seções

        if (transferencia.tipo == "saida") {
          // Dados do pagador
          doc.setFontSize(12);
          doc.text("Dados do Pagador", 10, cursorY);
          cursorY += 10;
          drawTableRow("Nome", dados_pagador.nome || "N/A");
          drawTableRow("Documento", dados_pagador.documento || "N/A");
          drawTableRow("Conta Origem", dados_pagador.conta_origem || "N/A");
          drawTableRow("Banco", dados_pagador.banco || "N/A");
          drawTableRow("Tipo", dados_pagador.tipo || "N/A");

          cursorY += 10; // Espaço entre as seções

          // Dados do recebedor
          doc.text("Dados do Recebedor", 10, cursorY);
          cursorY += 10;
          drawTableRow("Nome", dados_recebedor.nome || "N/A");
          drawTableRow(
            "Conta Destino",
            res.pix
              ? `${dados_recebedor.agencia || "N/A"} | ${
                  dados_recebedor.conta || "N/A"
                }`
              : dados_recebedor.conta_destino || "N/A"
          );
          drawTableRow("Documento", dados_recebedor.documento || "N/A");
          drawTableRow("Banco", dados_recebedor.banco || "N/A");
          if (!res.pix) {
            drawTableRow("Tipo de Conta", dados_recebedor.tipo_conta || "N/A");
          }
        } else {
          doc.setFontSize(12);
          doc.text("Dados do Pagador", 10, cursorY);
          cursorY += 10;
          drawTableRow("Nome", dados_recebedor.nome || "N/A");
          drawTableRow(
            "Conta Destino",
            res.pix
              ? `${dados_recebedor.agencia || "N/A"} | ${
                  dados_recebedor.conta || "N/A"
                }`
              : dados_recebedor.conta_destino || "N/A"
          );
          drawTableRow("Documento", dados_recebedor.documento || "N/A");
          drawTableRow("Banco", dados_recebedor.banco || "N/A");
          if (!res.pix) {
            drawTableRow("Tipo de Conta", dados_recebedor.tipo_conta || "N/A");
          }
          cursorY += 10; // Espaço entre as seções
          doc.text("Dados do Recebedor", 10, cursorY);
          cursorY += 10;
          drawTableRow("Nome", dados_pagador.nome || "N/A");
          drawTableRow("Documento", dados_pagador.documento || "N/A");
          drawTableRow("Conta Origem", dados_pagador.conta_origem || "N/A");
          drawTableRow("Banco", dados_pagador.banco || "N/A");
          drawTableRow("Tipo", dados_pagador.tipo || "N/A");
        }

        // Dados do pagador
        /* doc.setFontSize(12);
        doc.text("Dados do Pagador", 10, cursorY);
        cursorY += 10;
        drawTableRow("Nome", dados_pagador.nome || "N/A");
        drawTableRow("Documento", dados_pagador.documento || "N/A");
        drawTableRow("Conta Origem", dados_pagador.conta_origem || "N/A");
        drawTableRow("Banco", dados_pagador.banco || "N/A");
        drawTableRow("Tipo", dados_pagador.tipo || "N/A");

        cursorY += 10; // Espaço entre as seções

        // Dados do recebedor
        doc.text("Dados do Recebedor", 10, cursorY);
        cursorY += 10;
        drawTableRow("Nome", dados_recebedor.nome || "N/A");
        drawTableRow(
          "Conta Destino",
          res.pix
            ? `${dados_recebedor.agencia || "N/A"} | ${
                dados_recebedor.conta || "N/A"
              }`
            : dados_recebedor.conta_destino || "N/A"
        );
        drawTableRow("Documento", dados_recebedor.documento || "N/A");
        drawTableRow("Banco", dados_recebedor.banco || "N/A");
        if (!res.pix) {
          drawTableRow("Tipo de Conta", dados_recebedor.tipo_conta || "N/A");
        } */

        doc.save("comprovante.pdf");
      };

      const image = new Image();
      image.src = require("../assets/images/logos/icon_logo.png").default;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const logoBase64 = canvas.toDataURL("image/png");
        addLogoAndGeneratePDF(logoBase64);
      };

      image.onerror = () => {
        console.error("Erro ao carregar a imagem do logotipo.");
        addLogoAndGeneratePDF(null);
      };
    })
    .catch((error) => {
      console.error("Erro na requisição ou ao gerar o PDF", error);
    });
}

export async function comprovante_ver(id) {
  const data = {
    url: "conta/comprovante-pdf",
    data: { id: id, app: 1 },
    method: "POST",
  };

  try {
    const res = await Geral_API(data, true);

    if (!res || !res.pix) {
      console.error("Dados inválidos ou ausentes.");
      setLoading(false);
      setShowModalComprovante({ visible: false });
      return;
    }

    const pix = res.pix;
    const { dados_pagador, dados_recebedor, dados_transacao } = pix;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let cursorY = 20;

    // Função para adicionar logotipo e gerar PDF
    const addLogoAndGeneratePDF = (logoBase64) => {
      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 10, 10, 40, 40);
      }

      // Informações do banco
      doc.setFontSize(12);
      doc.text("MAY BANK INTERMEDIACAO DE NEGOCIOS EIRELI", 60, cursorY + 10);
      cursorY += 30;

      // Título do comprovante
      doc.setFontSize(16);
      doc.text("Comprovante PIX", pageWidth / 2, cursorY, {
        align: "center",
      });
      cursorY += 10;

      doc.setFontSize(10);
      doc.text(
        `DATA DE EMISSÃO: ${dados_transacao.data_transacao}`,
        pageWidth - 60,
        cursorY,
        { align: "right" }
      );
      cursorY += 10;

      // Função para adicionar seções ao PDF
      const addSection = (title, items) => {
        doc.setFontSize(12);
        doc.text(title, 10, cursorY);
        cursorY += 8;

        items.forEach(({ label, value }) => {
          doc.setFontSize(10);
          doc.text(`${label}:`, 10, cursorY);
          doc.text(value ? String(value) : "N/A", 70, cursorY);
          cursorY += 6;
        });

        cursorY += 8; // Espaço entre seções
      };

      // Dados do Pagador
      addSection("Dados do Pagador", [
        { label: "Nome", value: dados_pagador.nome },
        { label: "CPF", value: dados_pagador.documento },
        { label: "Conta de Origem", value: dados_pagador.conta_origem },
        { label: "Banco", value: dados_pagador.banco },
      ]);

      // Dados do Recebedor
      addSection("Dados do Recebedor", [
        { label: "Nome", value: dados_recebedor.nome },
        { label: "Banco", value: dados_recebedor.banco },
        { label: "Agência", value: dados_recebedor.agencia },
        { label: "Conta", value: dados_recebedor.conta },
        { label: "Documento", value: dados_recebedor.documento },
        { label: "Chave PIX", value: dados_transacao.chave_pix },
      ]);

      // Dados da Transação
      addSection("Dados da Transação", [
        { label: "Valor", value: `R$ ${dados_transacao.valor_pago}` },
        { label: "Chave PIX", value: dados_transacao.chave_pix },
        {
          label: "Data/Hora da Transação",
          value: dados_transacao.data_transacao,
        },
        {
          label: "Identificador da Transação",
          value: dados_transacao.identificador_transacao,
        },
        {
          label: "Descrição",
          value: dados_transacao.descricao,
        },
      ]);

      // Salva o PDF
      doc.save("comprovante_pix.pdf");

      setLoading(false);
      setShowModalComprovante({ visible: false });
    };

    // Carrega e converte o logotipo
    const image = new Image();
    image.src = require("../assets/images/logos/icon_logo.png").default;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const logoBase64 = canvas.toDataURL("image/png");
      addLogoAndGeneratePDF(logoBase64);
    };

    image.onerror = () => {
      console.error("Erro ao carregar a imagem do logotipo.");
      addLogoAndGeneratePDF(null);
    };
  } catch (error) {
    console.error("Erro na requisição ou ao gerar o PDF", error);
    setLoading(false);
    setShowModalComprovante({ visible: false });
  }
}

export async function getUniqueToken() {
  const localStorageKey = "uniqueInstallationToken";

  // Verifica se o token já existe no localStorage
  let token = localStorage.getItem(localStorageKey);

  if (!token) {
    // Gera um novo token se não existir
    token = uuidv4();
    localStorage.setItem(localStorageKey, token);
  }

  return token;
}

export async function getUserIp() {
  try {
    // Faz a chamada para a API ipify
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Erro ao obter o IP do usuário:", error);
    return;
  }
}

// FUNÇÕES QUE AINDA SERÃO EXCLUÍDAS

export async function tarifas(dados) {
  const data = {
    conta_id: pessoa.conta_id,
    chave: "transferencia",
    valor: dados,
  };
  const response = await api.post("tarifa/consulta", data, { headers });
  return response.data;
}

export async function Valida_senha(dados) {
  const data = dados;
  const response = await api.post("usuario/login", data, { headers });
  return response.data;
}

export async function ComprovantePDFCartao(dados) {
  const data = {
    conta_id: pessoa.conta_id,
    fav: dados.fav,
    data: dados.data,
    valor: dados.valor,
  };
  const response = await api.post("cartao/comprovante-pdf", data, {
    headers,
    responseType: "blob",
  });
  return response.data;
}

export async function ConsultaCartao() {
  const data = { conta_id: pessoa.conta_id };
  const response = await api.post("cartao/consultar", data, { headers });
  return response.data;
}

export async function comprovanteCartao(dados) {
  const data = {
    conta_id: pessoa.conta_id,
    data_de: dados.data_de,
    data_ate: dados.data_ate,
  };
  const response = await api.post("cartao/transacoes", data, { headers });
  return response.data;
}

export async function novoCartao(dados) {
  const data = {
    conta_id: pessoa.conta_id,
    corCartao: dados.corCartao,
    valorCartao: dados.valorCartao,
  };
  const response = await api.post("pedido-cartao/novo", data, { headers });
  return response.data;
}

export async function validacaoCiaCard(dados) {
  const data = dados;
  const response = await api.post("cartao/codigo-validacao", data, { headers });
  return response.data;
}

export async function validaCodigoCia(dados) {
  const data = dados;
  const response = await api.post("cartao/valida-codigo", data, { headers });
  return response.data;
}

export async function gerarSenhaCiacard() {
  const data = { contaid: pessoa.conta_id };
  const response = await api.post("cartao/gerar-senha-e-login-v2", data, {
    headers,
  });
  return response.data;
}

export async function desbloquearCartao(dados) {
  const data = { conta_id: pessoa.conta_id, id_cartao: dados.id_cartao };
  const response = await api.post("cartao/unlock-card", data, { headers });

  return response.data;
}

export async function gerarSenhaCartao(dados) {
  const data = dados;
  const response = await api.post("cartao/pass-card", data, { headers });
  return response.data;
}

export async function cartaoDesbloqueio() {
  const data = { conta_id: pessoa.conta_id };
  const response = await api.post("cartao/desbloqueio", data, { headers });
  return response.data;
}

export async function boletoCartao(dados) {
  const data = {
    conta_id: pessoa.conta_id,
    valor: dados.valor,
    data: dados.data,
  };
  const response = await api.post("cartao/gerar-boleto", data, { headers });
  return response.data;
}

export async function pdfCartao(dados) {
  const data = dados;
  const response = await api.post("cartao/pdf-boleto", data, { headers });
  return response.data;
}

export async function cartao2p2(dados) {
  const data = dados;
  const response = await api.post("cartao/cartao", data, { headers });
  return response.data;
}

export async function cartaoTransfEnviar(dados) {
  const data = dados;
  const response = await api.post("cartao/transfer-account", data, { headers });
  return response.data;
}

export async function cartaoTrocarSenha(dados) {
  const data = { conta_id: pessoa.conta_id, senha: dados };
  const response = await api.post("cartao/trocar-senha", data, { headers });
  return response.data;
}

export async function cartao_dados() {
  const data = { conta_id: pessoa.conta_id };
  const response = await api.post("cartao/dados-conta", data, { headers });
  return response.data;
}

export async function bloquear(dados) {
  const data = dados;
  const response = await api.post("cartao/bloqueio-cartao", data, { headers });
  return response.data;
}

export async function desbloquear(dados) {
  const data = { conta_id: pessoa.conta_id, id_cartao: dados };
  const response = await api.post("cartao/unlock-card", data, { headers });
  return response.data;
}
