import React, { Component } from "react";
import ReactPagination from "react-js-pagination";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { addDays } from "date-fns";
import br from "date-fns/locale/pt-BR";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import Objetos from "../../constants/Objetos";
import * as Funcoes from "../../constants/Funcoes";
import * as Formatar from "../../constants/Formatar";
import { Container, Row, Col, Breadcrumb, Form, Button } from "react-bootstrap";
import ReactLoading from "react-loading";
import i18n from "../../tradutor/tradutor";
import jsPDF from "jspdf";
import "jspdf-autotable";

registerLocale("pt-BR", br);

export default class ComprovanteConta extends Component {
  constructor() {
    super();
    this.state = {
      dadosImg: "",
      dataDe: new Date(),
      dataAte: new Date(),
      comprovantes: [],
      dadosCorrentista: [],
      paginacao: 1,
      numeroRegistro: 0,
      cortarComprovante: [],
      loading: false,
      disabled: false,
      custom_id: "",
    };
  }
  // componentDidiMout() {
  //   Funcoes.pessoa;
  //   var arr = pessoa;
  //   this.setState({ dadosCorrentista: arr });
  // }

  verComprovante = () => {
    this.setState({ loading: true, disabled: true });
    let data = {};

    if (this.state.custom_id === "") {
      data = {
        url: "comprovante/lista",
        data: {
          conta_id: Funcoes.pessoa.conta_id,
          data_de: Formatar.formatarDateAno(this.state.dataDe),
          data_ate: Formatar.formatarDateAno(this.state.dataAte),
        },
        method: "POST",
      };
    } else {
      data = {
        url: "comprovante/lista",
        data: {
          conta_id: Funcoes.pessoa.conta_id,
          data_de: Formatar.formatarDateAno(this.state.dataDe),
          data_ate: Formatar.formatarDateAno(this.state.dataAte),
          custom_id: this.state.custom_id || "",
        },
        method: "POST",
      };
    }

    Funcoes.Geral_API(data, true).then((res) => {
      console.log(res);
      if (res) {
        let arr = [];
        Object.keys(res).forEach((key) => {
          arr.push(res[key]);
        });

        // Ordena os comprovantes pela data mais recente
        arr.sort((a, b) => {
          const dateA = new Date(a.mov.dataHora);
          const dateB = new Date(b.mov.dataHora);
          return dateB - dateA; // Mais recente para mais antiga
        });

        let array_cortar_aux = [];
        arr.map((dados) => array_cortar_aux.push(dados));

        this.setState({ paginacao: 1 });
        let numero1_aux = 0;
        let numero2_aux = 10;
        this.setState({
          cortarComprovante: array_cortar_aux.slice(numero1_aux, numero2_aux),
        });

        this.setState({
          loading: false,
          comprovante: true,
          numeroRegistro: arr.length,
          comprovantes: arr,
          disabled: false,
        });
      } else {
        alert(i18n.t("comprovante.nenhumComprovante"));
        this.setState({ loading: false, disabled: false });
      }
    });
  };

  paginacao = (numero) => {
    let array_cortar = [];
    this.state.comprovantes.map((dados) => array_cortar.push(dados));

    this.setState({ paginacao: numero });
    let numero1 = (numero - 1) * 10;
    let numero2 = numero * 10;
    this.setState({ cortarComprovante: array_cortar.slice(numero1, numero2) });
  };

  comprovante_pdf = (id) => {
    const data = {
      url: "conta/comprovante-pdf",
      data: { id: id, app: 1 },
      method: "POST",
    };

    Funcoes.Geral_API(data, true)
      .then((res) => {
        console.log("Resposta da API:", res);

        if (!res) {
          console.error("Dados inválidos ou ausentes.");
          return;
        }

        // Identifica se o retorno é PIX ou Transferência
        const transferencia = res.pix || res.transferencia;
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
          drawTableRow(
            "Valor Pago",
            `R$ ${dados_transacao.valor_pago || "N/A"}`
          );
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

          doc.save("comprovante.pdf");
        };

        const image = new Image();
        image.src = require("../../assets/images/logos/icon_logo.png").default;

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
  };

  render() {
    return (
      <>
        <BannerTitle
          title={i18n.t("comprovante.comprovantes")}
          img={Objetos.comprovanteImg}
        />

        <Container className="mt-4 col-md-10">
          <Breadcrumb>
            <Breadcrumb.Item href="/home">
              {i18n.t("comprovante.breadCrumb1")}
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/comprovantes">
              {i18n.t("comprovante.breadCrumb2")}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {i18n.t("comprovante.breadCrumb2")}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Container>
        <Container className="blocoPesquisaExt mt-4 col-md-10 d-flex justify-content-center">
          <div>
            <p className="text-center">
              <strong>{i18n.t("comprovante.textEscolhaComprovante")}</strong>
            </p>

            <Row className=" px-5 py-4">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>{i18n.t("comprovante.dataInicio")}</Form.Label>
                  <DatePicker
                    className="form-control"
                    locale="pt-BR"
                    dateFormat="dd/MM/yyyy"
                    selected={this.state.dataDe}
                    required
                    popperPlacement="down"
                    onChange={(data) => this.setState({ dataDe: data })}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>{i18n.t("comprovante.dataFinal")}</Form.Label>
                  <DatePicker
                    className="form-control"
                    locale="pt-BR"
                    dateFormat="dd/MM/yyyy"
                    selected={this.state.dataAte}
                    required
                    popperPlacement="down"
                    maxDate={addDays(new Date(), 0)}
                    onChange={(data) => this.setState({ dataAte: data })}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Custom ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={this.state.custom_id}
                    onChange={(e) =>
                      this.setState({ custom_id: e.target.value })
                    }
                    placeholder="Informe o ID"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <div
                className="form-group col-lg-2"
                style={{ marginTop: "auto" }}
              >
                <button
                  onClick={() => this.verComprovante()}
                  disabled={this.state.disabled}
                  className="btn btnProcurarComprovante btn-sm btn-success"
                >
                  {i18n.t("comprovante.btnPesquisar")}
                </button>
              </div>
            </Row>
          </div>
        </Container>
        {this.state.loading ? (
          <ReactLoading
            className="loadingPagar"
            type={"bubbles"}
            color={"#000"}
            height={"15%"}
            width={"15%"}
          />
        ) : (
          this.state.comprovantes.length > 0 && (
            <Container
              className="mt-4 col-lg-10"
              style={{
                border: "1px solid #dddddd",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "15px",
                fontSize: "16px",
              }}
            >
              {this.state.cortarComprovante.map((comprovante) => (
                <div
                  key={comprovante.mov.id}
                  style={{
                    border: "1px solid #aaaaaa",
                    borderRadius: "10px",
                    margin: "10px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    backgroundColor: "rgba(240,240,240)",
                  }}
                >
                  <Row>
                    <div style={{ marginTop: "10px" }} className="col-lg-6">
                      <strong>{comprovante.mov.descricao}</strong>
                    </div>
                    <div style={{ marginTop: "10px" }} className="col-lg-2">
                      {" "}
                      <strong>{i18n.t("comprovante.valor")} </strong>
                      {Formatar.formatarMoeda(comprovante.mov.valor * -1.0)}
                    </div>
                    <div style={{ marginTop: "10px" }} className="col-lg-2">
                      <strong>{i18n.t("comprovante.data")} </strong>
                      {Formatar.formatarDate(comprovante.mov.dataHora)}
                    </div>
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-sm baixarComprovante btn-success"
                      onClick={() =>
                        Funcoes.comprovanteGeral(comprovante.mov.id)
                      }
                    >
                      Ver PDF
                    </button>
                  </Row>
                </div>
              ))}
              <div
                className="d-flex justify-content-center"
                style={{ marginTop: "10px" }}
              >
                <ReactPagination
                  itemClass="page-item"
                  linkClass="page-link"
                  hideNavigation
                  activePage={this.state.paginacao}
                  itemsCountPerPage={10}
                  totalItemsCount={this.state.numeroRegistro}
                  pageRangeDisplayed={5}
                  onChange={this.paginacao.bind(this)}
                />
              </div>
            </Container>
          )
        )}
      </>
    );
  }
}
