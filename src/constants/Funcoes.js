import { api, dh } from "../services/api";
import CryptoJS from "crypto-js";
import { decode, encode } from "base-64";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { v4 as uuidv4 } from "uuid";
import * as Formatar from "./Formatar";

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
    banco: process.env.NOME_BANCO_HEADER
  };

  // Adiciona headers para requisições autenticadas
  const info = getToken();
  if (logado) {
    onAction();
    headers["token"] = info.token_api;
    headers["contaid"] = info.conta_id;
    headers["chave"] = info.chave;
    headers["usuarioid"] = info.usuario_id;
    headers["acessoid"] = info.acesso_id;
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

export function comprovanteGeral(id, tipo) {
  const data = {
    url: "conta/comprovante-pdf",
    data: { id: id, app: 1 },
    method: "POST",
  };
  if (tipo) {
    data.data.tipo = tipo;
  }

  Geral_API(data, true)
    .then((res) => {
      console.log('comprovante', res);
      if (!res) {
        console.error("Dados inválidos ou ausentes.");
      } else {

        let movTipo = null;
        if (res.transferencia) {
          movTipo = "transferencia";
        } else if (res.pix) {
          movTipo = "pix";
        } else if (res.devolucao_pix) {
          movTipo = "devolucao_pix";
        } else if (res.pagamento) {
          movTipo = "pagamento";
        }

        const { dados_pagador, dados_recebedor, dados_transacao } =
          res[movTipo];

        if (movTipo == "pix") {
          var pixTipo = "";
          if (dados_pagador?.tipo == "agendamento_pix") {
            pixTipo = "agendamento";
          // } else if (dados_transacao?.status == 2) {
          //   pixTipo = "devolucao";
          } else {
            pixTipo = "normal";
          }
        }

        const doc = new jsPDF("portrait", "mm", "a4");

        const safeString = (value) => {
          return value ? String(value) : "N/A";
        };

        const addImgsAndRenderPDF = (
          logoBase64,
          imgWidthLogo,
          imgHeightLogo,
          mainIconBase64,
          iconsBase64
        ) => {
          const logoHeight = 20;
          const iconHeight = 15;
          const margin = 8;
          const pageWidth = doc.internal.pageSize.width;
          let fileName = "filename";
          let title = "";
          let date = "";
          let subtitle = "Via internet Maybank";

          if (logoBase64 && imgWidthLogo && imgHeightLogo) {
            const logoWidth = logoHeight * (imgWidthLogo / imgHeightLogo);
            doc.addImage(logoBase64, "PNG", margin, margin, logoWidth, logoHeight);
          }

          if (movTipo == "transferencia") {

            fileName = "COMPROVANTE_TRANSFERENCIA";
            title = "Comprovante de Transferência";
            date = `DATA DE EMISSÃO: ${Formatar.formatarDataComprovante(dados_transacao.data)}`;

          } else if (movTipo == "pix") {

            fileName = "COMPROVANTE_PIX";
            title = (pixTipo == "agendamento") ?
              "Comprovante Agendamento PIX"
            : (pixTipo == "normal") &&
              "Comprovante PIX";

            date = `DATA DE EMISSÃO: ${Formatar.formatarDataComprovante(dados_transacao.data_transacao)}`;

          } else if (movTipo == "devolucao_pix") {

            fileName = "COMPROVANTE_PIX";
            title = "Comprovante Devolução PIX";
            date = `DATA DE EMISSÃO: ${Formatar.formatarDataComprovante(dados_transacao.data_transacao)}`;

          } else if (movTipo == "pagamento") {

            fileName = "COMPROVANTE_PAGAMENTO";
            title = "Comprovante de Pagamento";
            date = `DATA DE EMISSÃO: ${Formatar.formatarDataComprovante(dados_transacao.data_transacao)}`;

          }

          //Ícone
          doc.setFontSize(24);
          doc.setFont(undefined, "bold");

          doc.addImage(
            mainIconBase64, 
            "PNG", 
            (pageWidth / 2) - (iconHeight / 2),
            margin, 
            iconHeight, 
            iconHeight
          );

          //Título
          doc.setFontSize(24);
          doc.setFont(undefined, "bold");
          const titleDimensions = doc.getTextDimensions(title);
          doc.text(
            title,
            pageWidth / 2, 
            margin + logoHeight, 
            {
              align: "center",
              baseline: "top",
            }
          );

          //Data de emissão
          doc.setFontSize(8);
          doc.setFont(undefined, "normal");
          doc.text(
            date, 
            pageWidth - margin,
            margin, 
            {
              align: "right",
              baseline: "top",
            }
          );

          //Subtítulo
          doc.setTextColor("#696969");
          doc.setFontSize(10);
          doc.setFont(undefined, "normal");
          doc.text(
            subtitle,
            pageWidth / 2,
            (margin * 2) + logoHeight + titleDimensions.h,
            {
              align: "center",
              baseline: "top",
            }
          );

          let cursorY = logoHeight + margin + 25;
          const valueXPosition = (pageWidth / 3);

          const addSection = (title, items, lastSection) => {
            doc.setTextColor("#696969");
            doc.setFontSize(12);
            doc.setFont(undefined, "bold");
            doc.text(title, margin, cursorY, { baseline: "top" });
            cursorY += doc.getTextDimensions(`${title}`).h + 10;

            items.forEach((obj, index) => {
              if (obj && obj.label) {
                doc.setTextColor("#000000");
                doc.setFontSize(12);
                doc.setFont(undefined, "bold");
                doc.text(
                  `${obj.label}:`, 
                  margin, 
                  cursorY,
                );

                doc.setTextColor("#696969");
                doc.setFont(undefined, "normal");

                // Essa parte serve para quebrar linhas do value que ultrapassar a margem, edite se precisar, o método de renderização sem a quebra de linha está comentado, caso precise ser usado novamente
                const maxWidth = pageWidth - valueXPosition - margin;
                const splitText = doc.splitTextToSize(safeString(obj.value), maxWidth);
                splitText.forEach((line) => {
                  doc.text(
                    line, 
                    valueXPosition, 
                    cursorY
                  );
                  if (splitText.length !== 1) cursorY += 6;
                });

                if (index != items.length - 1 && splitText.length === 1) cursorY += 6;

                // doc.text(
                //   safeString(obj.value),
                //   valueXPosition,
                //   cursorY,
                // );

                // if (index != items.length - 1) cursorY +=6;
              }
            });
            if (!lastSection) {
              cursorY += 8;
              doc.setDrawColor("#A9A9A9");
              doc.setLineWidth(0.2);
              doc.line(margin, cursorY, pageWidth - margin, cursorY);
              cursorY += 8;
            }
          };

          // Adicione as seções conforme o tipo de movimentação
          if (movTipo == "transferencia") {

            addSection("Dados do Pagador", [
              { label: "Nome", value: dados_pagador.nome },
              { label: "CPF/CNPJ", value: dados_pagador.documento },
              { label: "Conta de Origem", value: dados_pagador.conta_origem },
              { label: "Instituição", value: dados_pagador.banco },
            ]);

            addSection("Dados do Recebedor", [
              { label: "Nome", value: dados_recebedor.nome },
              { label: "CPF/CNPJ", value: dados_recebedor.documento },
              { label: "Conta", value: dados_recebedor.conta_destino },
              { label: "Instituição", value: dados_recebedor.banco },
              // { label: "Tipo de Conta", value: dados_recebedor.tipo_conta },
            ]);

            addSection("Dados da Transferência", [
              { label: "Valor", value: `R$ ${dados_transacao.valor_pago}` },
              { label: "Data da Transferência", value: Formatar.formatarDataComprovante(dados_transacao.data) },
              { label: "Horário da Transferência", value: Formatar.formatarHoraComprovante(dados_transacao.data) },
              { label: "Finalidade", value: dados_transacao.finalidade },
              { label: "Status", value: dados_transacao.status },
            ], true);

          } else if (movTipo == "pix" || movTipo == "devolucao_pix") {

            addSection("Dados do Pagador", [
              { label: "Nome", value: dados_pagador.nome },
              { label: "CPF/CNPJ", value: dados_pagador.documento },
              { label: "Instituição", value: dados_pagador.banco },
            ]);

            //Identificar se pix foi feito por chave ou por preenchimento manual
            const chaveOuConta = dados_transacao.chave_pix ? 
              { label: "Chave PIX", value: dados_transacao.chave_pix } 
            : 
              { label: "Agência e Conta", value: `${("0000" + dados_recebedor.agencia).slice(-4)} | ${dados_recebedor.conta}` };

            addSection("Dados do Recebedor", [
              { label: "Nome", value: dados_recebedor.nome },
              { label: "CPF/CNPJ", value: dados_recebedor.documento },
              { label: "Instituição", value: dados_recebedor.banco },
              chaveOuConta
            ]);

            addSection("Dados da Transação", [
              { label: "Valor", value: `R$ ${dados_transacao.valor_pago}` },
              { label: "Data da Transação", value: Formatar.formatarDataComprovante(dados_transacao.data_transacao) },
              { label: "Horário da Transação", value: Formatar.formatarHoraComprovante(dados_transacao.data_transacao) },
              dados_transacao.descricao && { label: "Descrição", value: dados_transacao.descricao },
              { label: "ID da Transação", value: dados_transacao.identificador_transacao },
            ], true);

          } else if (movTipo == "pagamento") {

            addSection("Dados do Pagador", [
              { label: "Nome", value: dados_pagador.nome },
              { label: "CPF/CNPJ", value: dados_pagador.documento },
              { label: "Conta de Origem", value: dados_pagador.conta_origem },
              { label: "Instituição", value: dados_pagador.banco },
            ]);

            addSection("Dados do Recebedor", [
              { label: "Nome", value: dados_recebedor.nome },
              { label: "CPF/CNPJ", value: dados_recebedor.documento },
              { label: "Código de barra", value: dados_transacao.codigo_barra },
            ]);

            addSection("Dados do Pagamento", [
              { label: "Valor", value: `R$ ${dados_transacao.valor_pago}` },
              { label: "Data do Pagamento", value: Formatar.formatarDataComprovante(dados_transacao.data_pagamento) },
              { label: "Horário do Pagamento", value: Formatar.formatarHoraComprovante(dados_transacao.data_pagamento) },
              { label: "Data de Vencimento", value: Formatar.formatarDataComprovante(dados_transacao.data_vencimento) },
              dados_transacao.descricao && { label: "Descrição", value: dados_transacao.descricao, },
              { label: "Desconto", value: `R$ ${dados_transacao.desconto}` },
              { label: "Juros", value: `R$ ${dados_transacao.juros}` },
              { label: "Multa", value: `R$ ${dados_transacao.multa}` },
            ], true);

          }

          cursorY += 8;
          doc.setDrawColor("#A9A9A9");
          doc.setLineWidth(0.2);
          doc.line(margin, cursorY, pageWidth - margin, cursorY);
          cursorY += 8;

          const splitText = doc.splitTextToSize(
            'Em caso de dúvidas ou se precisar de orientações, acesse nossos canais de atendimento.\nVocê deverá informar o ID da transação que aparece nesse comprovante.',
            pageWidth - (margin * 2)
          );
          splitText.forEach((line, index) => {
            doc.text(
              line,
              margin,
              cursorY,
              { baseline: 'top' }
            );
            if (index != splitText.length - 1) cursorY += 6;
          });

          cursorY += 10;

          const iconSize = 5;
          doc.text(
            'SAC',
            margin,
            cursorY,
            { baseline: 'top' }
          );
          cursorY += 8;
          doc.addImage(iconsBase64.whatsapp, "PNG", margin, cursorY, iconSize, iconSize);
          doc.text(
            '(11) 91011-2714',
            margin + iconSize + 6,
            cursorY + (iconSize / 2) - 0.25,
            { baseline: 'middle' }
          );
          cursorY += 10;
          doc.addImage(iconsBase64.phone, "PNG", margin, cursorY, iconSize, iconSize);
          doc.text(
            '0800 580 3489',
            margin + iconSize + 6,
            cursorY + (iconSize / 2) - 0.25,
            { baseline: 'middle' }
          );
          cursorY += 10;
          doc.addImage(iconsBase64.email, "PNG", margin, cursorY, iconSize, iconSize);
          doc.text(
            'sac@maybank.com.br',
            margin + iconSize + 6,
            cursorY + (iconSize / 2) - 0.25,
            { baseline: 'middle' }
          );

          doc.save(`${fileName}.pdf`);
        };

        const loadImage = (src) => {
          return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
          
            image.onload = () => resolve(image);
            image.onerror = (error) => reject(error);
          });
        };

        (async () => {
          try {

            let logoPNG, iconPNG, emailPNG, phonePNG, whatsappPNG = '';
                      
            let iconPath;
                      
            if (movTipo === 'pix') {
              const importedIcon = await import(`../assets/icons/${
                pixTipo === "agendamento" ? "clock" :
                pixTipo === "normal" ? "check-circle" : ""
              }.png`);
              iconPath = importedIcon.default;
            } else if (movTipo === 'devolucao_pix') {
              iconPath = require("../assets/icons/refresh-ccw.png").default;
            } else {
              iconPath = require("../assets/icons/check-circle.png").default;
            }
            
            [logoPNG, iconPNG, emailPNG, phonePNG, whatsappPNG] = await Promise.all([
              loadImage(require("../assets/images/logos/logo_transparente.png").default),
              loadImage(iconPath),
              loadImage(require("../assets/icons/email.png").default),
              loadImage(require("../assets/icons/phone.png").default),
              loadImage(require("../assets/icons/whatsapp.png").default),
            ]);

            const convertToBase64 = (img) => {
              const canvas = Object.assign(document.createElement("canvas"), {
                width: img.width,
                height: img.height
              });
              canvas.getContext("2d").drawImage(img, 0, 0);
              return canvas.toDataURL("image/png");
            };

            const logoBase64 = convertToBase64(logoPNG);
            const mainIconBase64 = convertToBase64(iconPNG);

            const emailBase64 = convertToBase64(emailPNG);
            const phoneBase64 = convertToBase64(phonePNG);
            const whatsappBase64 = convertToBase64(whatsappPNG);
            const iconsBase64 = { email: emailBase64, phone: phoneBase64, whatsapp: whatsappBase64 }

            addImgsAndRenderPDF(logoBase64, logoPNG.width, logoPNG.height, mainIconBase64, iconsBase64);
          } catch (error) {
            console.error("Erro ao carregar as imagens:", error);
            addImgsAndRenderPDF(null);
          }
        })();

      }
    })
    .catch((error) => {
      // console.log("Erro: ", error);
      console.error("Erro na requisição");
    });
}

//comprovante transferencia
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
          cursorY += 10; // Espaço entre as seções
          doc.text("Dados do Pagador", 10, cursorY);
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

// comprovante pix
export async function comprovante_ver(id) {
  const data = {
    url: "conta/comprovante-pdf",
    data: { id: id, app: 1 },
    method: "POST",
  };

  try {
    const res = await Geral_API(data, true);

    const pix = res.pix;
    const { dados_pagador, dados_recebedor, dados_transacao } = pix;

    const doc = new jsPDF('landscape', 'mm', 'a4');

    const addLogoAndGeneratePDF = (logoBase64, imgWidth, imgHeight) => {
      const logoHeight = 20;
      const margin = 8;
      const pageWidth = doc.internal.pageSize.width;

      if (logoBase64 && imgWidth && imgHeight) {
        const logoWidth = logoHeight * (imgWidth / imgHeight);
        doc.addImage(logoBase64, "PNG", margin, margin, logoWidth, logoHeight);
      }

      //Título
      doc.setFontSize(24);
      doc.setFont(undefined, "bold");
      doc.text(
        "Comprovante PIX",
        pageWidth / 2,
        margin,
        {
          align: "center",
          baseline: "top"
        }
      );

      //Data de emissão
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text(
        `DATA DE EMISSÃO: ${Formatar.formatarDataComprovante(dados_transacao.data_transacao)}`,
        pageWidth - margin,
        margin,
        { 
          align: "right",
          baseline: "top"
        }
      );

      //Subtítulo
      doc.setTextColor("#696969");
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(
        "Via internet MAY BANK INTERMEDIACAO DE NEGOCIOS EIRELI",
        pageWidth / 2, 
        margin + logoHeight,
        { 
          align: "center",
          baseline: "bottom"
        }
      );

      // Função para adicionar seções ao PDF
      let cursorY = logoHeight + margin + 15;
      const addSection = (title, items, lastSection) => {

        doc.setTextColor("#696969");
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text(title, margin, cursorY, { baseline: "top" });
        cursorY += doc.getTextDimensions(`${title}`).h + 10;

        items.forEach(({ label, value }, index) => {
          doc.setTextColor("#000000");
          doc.setFontSize(12);
          doc.setFont(undefined, "bold");
          doc.text(`${label}:`, margin, cursorY);

          doc.setTextColor("#696969");
          doc.setFont(undefined, "normal");
          doc.text(value ? String(value) : "N/A", ((pageWidth / 4) + margin), cursorY);

          if (index != (items.length - 1))
            cursorY += 6;
        });
        if (!lastSection) {
          cursorY += 8;
          doc.setDrawColor("#A9A9A9");
          doc.setLineWidth(0.2);
          doc.line(margin, cursorY, (pageWidth - margin), cursorY); 
          cursorY += 8;
        }
      };

      // Dados do Pagador
      addSection("Dados do Pagador", [
        { label: "Nome", value: dados_pagador.nome },
        { label: "CPF/CNPJ", value: dados_pagador.documento },
        { label: "Instituição", value: dados_pagador.banco },
      ]);

      // Dados do Recebedor
      addSection("Dados do Recebedor", [
        { label: "Nome", value: dados_recebedor.nome },
        { label: "CPF/CNPJ", value: dados_recebedor.documento },
        { label: "Instituição", value: dados_recebedor.banco },
        { label: "Chave PIX", value: dados_transacao.chave_pix },
      ]);

      // Dados da Transação
      let transacaoData = [
        { label: "Valor", value: `R$ ${dados_transacao.valor_pago}` },
        { label: "Data da Transação", value: Formatar.formatarDataComprovante(dados_transacao.data_transacao) },
        { label: "Horário da Transação", value: Formatar.formatarHoraComprovante(dados_transacao.data_transacao) },
        { label: "ID da Transação", value: dados_transacao.identificador_transacao }
      ]

      if (dados_transacao.descricao) {
        transacaoData.splice(
          transacaoData.length - 1, 0,
          { label: "Descrição", value: dados_transacao.descricao }
        );
      }

      addSection("Dados da Transação", transacaoData, true);

      // Salva o PDF
      doc.save("COMPROVANTE_PIX.pdf");
    };

    // Carrega e converte o logotipo
    const image = new Image();
    image.src = require("../assets/images/logos/logo_transparente.png").default;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const logoBase64 = canvas.toDataURL("image/png");
      addLogoAndGeneratePDF(logoBase64, image.width, image.height);
    };

    image.onerror = () => {
      console.error("Erro ao carregar a imagem do logotipo.");
      addLogoAndGeneratePDF(null);
    };
  } catch (error) {
    console.error("Erro na requisição ou ao gerar o PDF", error);
  }
}
export async function comprovante_crypto(dados) {
  console.log(pessoa)
  try {
    

    const pix = dados[0];
   

    const doc = new jsPDF('landscape', 'mm', 'a4');

    const addLogoAndGeneratePDF = (logoBase64, imgWidth, imgHeight) => {
      const logoHeight = 20;
      const margin = 8;
      const pageWidth = doc.internal.pageSize.width;

      if (logoBase64 && imgWidth && imgHeight) {
        const logoWidth = logoHeight * (imgWidth / imgHeight);
        doc.addImage(logoBase64, "PNG", margin, margin, logoWidth, logoHeight);
      }

      //Título
      doc.setFontSize(24);
      doc.setFont(undefined, "bold");
      doc.text(
        "Comprovante Cambio",
        pageWidth / 2,
        margin,
        {
          align: "center",
          baseline: "top"
        }
      );

      //Data de emissão
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text(
        `DATA DE EMISSÃO: ${pix.data_hora_transferencia}`,
        pageWidth - margin,
        margin,
        { 
          align: "right",
          baseline: "top"
        }
      );

      //Subtítulo
      doc.setTextColor("#696969");
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(
        "Via internet MAY BANK INTERMEDIACAO DE NEGOCIOS EIRELI",
        pageWidth / 2, 
        margin + logoHeight,
        { 
          align: "center",
          baseline: "bottom"
        }
      );

      // Função para adicionar seções ao PDF
      let cursorY = logoHeight + margin + 15;
      const addSection = (title, items, lastSection) => {

        doc.setTextColor("#696969");
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text(title, margin, cursorY, { baseline: "top" });
        cursorY += doc.getTextDimensions(`${title}`).h + 10;

        items.forEach(({ label, value }, index) => {
          doc.setTextColor("#000000");
          doc.setFontSize(12);
          doc.setFont(undefined, "bold");
          doc.text(`${label}:`, margin, cursorY);

          doc.setTextColor("#696969");
          doc.setFont(undefined, "normal");
          doc.text(value ? String(value) : "N/A", ((pageWidth / 4) + margin), cursorY);

          if (index != (items.length - 1))
            cursorY += 6;
        });
        if (!lastSection) {
          cursorY += 8;
          doc.setDrawColor("#A9A9A9");
          doc.setLineWidth(0.2);
          doc.line(margin, cursorY, (pageWidth - margin), cursorY); 
          cursorY += 8;
        }
      };

      // Dados do Pagador
      addSection("Dados da Conta", [
        { label: "Nome", value: pessoa.nome },
        { label: "CPF/CNPJ", value: pessoa.cpf_cnpj },
        { label: "Instituição", value: process.env.NOME_BANCO },
      ]);

      // Dados do Recebedor
      addSection("Dados Transação", [
        { label: "Moeda", value: pix.moeda_symbol },
        { label: "Transação ID", value: pix.transaction_id },
        { label: "Valor", value: ` ${pix.valor_real}` },
        { label: "Data da Transação", value: pix.data_hora_transferencia },
        { label: "ID da Transação", value: pix.transacao_id }
      ]);

   

      

      // Salva o PDF
      doc.save("COMPROVANTE_Crypto.pdf");
    };

    // Carrega e converte o logotipo
    const image = new Image();
    image.src = require("../assets/images/logos/logo_transparente.png").default;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const logoBase64 = canvas.toDataURL("image/png");
      addLogoAndGeneratePDF(logoBase64, image.width, image.height);
    };

    image.onerror = () => {
      console.error("Erro ao carregar a imagem do logotipo.");
      addLogoAndGeneratePDF(null);
    };
  } catch (error) {
    console.error("Erro na requisição ou ao gerar o PDF", error);
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
