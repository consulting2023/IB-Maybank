import React, { Component } from "react";
import * as Funcoes from "../../constants/Funcoes";
import "../../templates/style_extrato.scss";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Button,
  ButtonGroup,
  Table,
} from "react-bootstrap";
import * as Formatar from "../../constants/Formatar";
import { addDays } from "date-fns";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import DatePicker from "react-datepicker";
import Objetos from "../../constants/Objetos";
import ReactLoading from "react-loading";
import i18n from "../../tradutor/tradutor";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default class ExtratoConta extends Component {
  constructor() {
    super();
    this.state = {
      extrato: [],
      dataDe: new Date(),
      dataAte: new Date(),
      mostrarExtrato: false,
      ultimoId: null,
      loading: false,
      disabled: false,
      soma: 0,
      hasMore: true,
      custom_id: "",
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      this.state.loading ||
      !this.state.hasMore
    ) {
      return;
    }
    this.loadMoreExtrato();
  }

  loadMoreExtrato = () => {
    const { pessoa, dataDe, dataAte, ultimoId, extrato } = this.state;

    this.setState({ loading: true });

    const data = {
      url: "conta/extrato",
      data: {
        conta_id: pessoa.conta_id,
        data_de: Formatar.formatarDateAno(dataDe),
        data_ate: Formatar.formatarDateAno(dataAte),
        ultimo_id: ultimoId,
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      const keys = Object.keys(res);
      if (keys.length === 0) {
        this.setState({ hasMore: false, loading: false });
        return;
      }

      const novosDados = keys.flatMap((key) => res[key]);
      const soma = novosDados.reduce(
        (acc, e) => acc + e.valor,
        this.state.soma
      );

      this.setState({
        extrato: [...extrato, ...novosDados],
        ultimoId: novosDados[novosDados.length - 1].id,
        soma,
        loading: false,
        hasMore: novosDados.length === 50,
      });
    });
  };

  verExtrato = () => {
    this.setState({
      loading: true,
      disabled: true,
      extrato: [],
      ultimoId: null,
      hasMore: true,
    });

    const { dataDe, dataAte, pessoa } = this.state;

    const data = {
      url: "conta/extrato",
      data: {
        conta_id: pessoa.conta_id,
        data_de: Formatar.formatarDateAno(dataDe),
        data_ate: Formatar.formatarDateAno(dataAte),
        custom_id: this.state.custom_id || "",
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      const keys = Object.keys(res);
      if (keys.length === 0) {
        this.props.alerts(
          "Nenhuma movimentação encontrada",
          "Selecione outro período ou tente novamente mais tarde",
          "warning"
        );
        this.setState({
          loading: false,
          disabled: false,
          mostrarExtrato: false,
        });
        return;
      }

      const arr = keys.flatMap((key) => res[key]);
      const soma = arr.reduce((acc, e) => acc + e.valor, 0);

      this.setState({
        extrato: arr,
        ultimoId: arr[arr.length - 1].id,
        soma,
        mostrarExtrato: true,
        loading: false,
        disabled: false,
        hasMore: arr.length === 50,
      });
    });
  };

  extrato_csv = () => {
    const { extrato, dataDe, dataAte, pessoa, soma } = this.state;

    // Define valores padrão caso estejam indefinidos
    const saldoTotal = soma ? soma.toFixed(2).replace(".", ",") : "0,00";
    const saldoDisponivel = saldoTotal;

    // Cabeçalhos e informações principais
    const headers = [
      `Extrato de Movimentação da Conta:`,
      `${dataDe.toLocaleDateString()} até ${dataAte.toLocaleDateString()}`,
      `Cliente:`,
      `${pessoa?.nome || "N/A"}`,
      `Agência/Conta:`,
      `0001 / ${pessoa?.conta_id || "N/A"}`,
      `Saldo Total:`,
      saldoTotal,
      `Saldo Disponível:`,
      saldoDisponivel,
      `Saldo Bloqueado:`,
      "",
    ];

    // Cabeçalho das colunas
    const columns = [
      "Custom ID", // Nova coluna para custom_id
      "Id",
      "Data/Hora",
      "Descrição",
      "Valor",
      "Conta",
      "Saldo",
      "Order",
      "Bloqueado",
    ];

    // Dados das transações no formato CSV
    const rows = extrato.map((item) => [
      item.custom_id || "N/A", // Adiciona o custom_id
      item.id || "",
      new Date(item.dataHora).toLocaleDateString(),
      item.descricao || "",
      item.valor ? item.valor.toFixed(2).replace(".", ",") : "0,00",
      item.conta_id || "",
      item.saldo ? item.saldo.toFixed(2).replace(".", ",") : "0,00",
      "",
      "Desbloqueado",
    ]);

    // Convertendo para CSV
    const csvContent = [
      headers.join(","), // Cabeçalhos principais
      columns.join(","), // Cabeçalho das colunas
      ...rows.map((row) => row.join(",")), // Dados das linhas
    ].join("\n");

    // Criando o arquivo para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "extrato_movimentacao.csv";
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  extrato_pdf = () => {
    const { extrato, dataDe, dataAte, pessoa, soma } = this.state;

    // Configurações do PDF
    const doc = new jsPDF();
    doc.setFontSize(12);
    const saldoTotal = soma ? soma.toFixed(2).replace(".", ",") : "0,00";
    const saldoDisponivel = saldoTotal;

    // Cabeçalho do PDF
    doc.text("Extrato de Movimentação da Conta:", 10, 10);
    doc.text(
      `Período: ${dataDe.toLocaleDateString()} até ${dataAte.toLocaleDateString()}`,
      10,
      20
    );
    doc.text(`Cliente: ${pessoa?.nome || "N/A"}`, 10, 30);
    doc.text(`Agência/Conta: 0001 / ${pessoa?.conta_id || "N/A"}`, 10, 40);
    doc.text(`Saldo Total: R$ ${saldoTotal}`, 10, 50);
    doc.text(`Saldo Disponível: R$ ${saldoDisponivel}`, 10, 60);
    doc.text("Saldo Bloqueado: R$ 0,00", 10, 70);

    // Cabeçalho da tabela
    const columns = [
      { header: "ID", dataKey: "id" },
      { header: "Data/Hora", dataKey: "dataHora" },
      { header: "Descrição", dataKey: "descricao" },
      { header: "Valor", dataKey: "valor" },
      { header: "Conta", dataKey: "conta" },
      { header: "Custom Id", dataKey: "custom_id" },
    ];

    // Dados da tabela
    const rows = extrato.map((item) => ({
      id: item.id || "",
      dataHora: new Date(item.dataHora).toLocaleDateString(),
      descricao: item.descricao || "",
      valor: item.valor ? item.valor.toFixed(2).replace(".", ",") : "0,00",
      conta: item.conta_id || "",
      custom_id: item.custom_id,
    }));

    // Adicionando a tabela ao PDF
    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => Object.values(row)),
      startY: 80,
      theme: "striped",
      styles: { fontSize: 10 },
    });

    // Gerar e fazer download do PDF
    doc.save("extrato_movimentacao.pdf");
  };

  render() {
    const {
      extrato,
      dataDe,
      dataAte,
      loading,
      mostrarExtrato,
      soma,
      disabled,
    } = this.state;

    return (
      <div className="extrato">
        <BannerTitle
          title={i18n.t("extrato.extrato")}
          img={Objetos.extratoImg}
        />

        <Container className="p-3 col-md-10 d-flex justify-content-center">
          <Row className="baseWindow px-5 py-4">
            <Col>
              <Row>
                <p className="mb-4" style={{ fontSize: "1.30em" }}>
                  <strong>{i18n.t("extrato.textoEscolhaExtrato")}</strong>
                </p>
              </Row>
              <Row>
                <Col className="form-group">
                  <label>{i18n.t("extrato.dataInicio")}</label>
                  <br />
                  <DatePicker
                    className="form-control text-center"
                    locale="pt-BR"
                    selected={dataDe}
                    required
                    dateFormat="dd/MM/yyyy"
                    popperPlacement="bottom"
                    maxDate={addDays(new Date(), 0)}
                    onChange={(data) => this.setState({ dataDe: data })}
                  />
                </Col>
                <Col className="form-group">
                  <label>{i18n.t("extrato.dataFinal")}</label>
                  <br />
                  <DatePicker
                    className="form-control text-center"
                    locale="pt-BR"
                    selected={dataAte}
                    required
                    dateFormat="dd/MM/yyyy"
                    popperPlacement="bottom"
                    maxDate={addDays(new Date(), 0)}
                    onChange={(data) => this.setState({ dataAte: data })}
                  />
                </Col>
                <Col className="form-group">
                  <label>Custom ID</label>
                  <br />
                  <input
                    type="text"
                    className="form-control text-center"
                    value={this.state.custom_id || ""}
                    required
                    onChange={(e) =>
                      this.setState({ custom_id: e.target.value })
                    }
                    placeholder="Digite o custom_id"
                  />
                </Col>
              </Row>
              <Row className="form-group m-0">
                <Button
                  onClick={this.verExtrato}
                  disabled={disabled}
                  className="m-auto px-5 py-2 btnProcurarExtrato"
                >
                  {i18n.t("extrato.btnPesquisar")}
                </Button>
              </Row>
            </Col>
          </Row>
        </Container>

        <Container className="p-3 col-md-10">
          {loading && (
            <ReactLoading
              className="d-block m-auto"
              type={"spin"}
              color={"#000"}
              height={"5%"}
            />
          )}

          {mostrarExtrato && (
            <Col className="baseWindow px-5 py-4">
              <Row>
                <ButtonGroup className="buttonGroup flex-row justify-content-between">
                  <Button className="mr-1" onClick={this.extrato_pdf}>
                    {i18n.t("extrato.downloadPdf")}
                  </Button>
                  <Button className="mr-1" onClick={this.extrato_csv}>
                    {i18n.t("extrato.downloadCsv")}
                  </Button>
                </ButtonGroup>
                {soma !== 0 && (
                  <div className="d-flex flex-grow-1">
                    <p className="my-auto ml-auto texto-saldos-Extrato">
                      Total no período:
                      <span className={soma < 0 ? "redText" : "greenText"}>
                        {" "}
                        R$ {Formatar.formatReal(soma)}
                      </span>
                    </p>
                  </div>
                )}
              </Row>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Conta</th>
                    <th>Saldo</th>
                    <th>Custom ID</th>
                  </tr>
                </thead>
                <tbody>
                  {extrato.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{Formatar.formatarDate(row.dataHora)}</td>
                      <td>{row.descricao}</td>
                      <td>{Formatar.formatReal(row.valor)}</td>
                      <td>{row.conta_id}</td>
                      <td>{Formatar.formatReal(row.saldo)}</td>
                      <td>{row.custom_id}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {loading && (
                <div className="text-center mt-3">
                  <ReactLoading type={"spin"} color={"#000"} height={50} />
                </div>
              )}
            </Col>
          )}
        </Container>
      </div>
    );
  }
}
