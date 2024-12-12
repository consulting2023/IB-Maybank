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
import Produtos from "../../constants/Produtos";

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
      loadingCsv: false,
      disabledCsv: false,
      saldos: {},

      continue: true,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });
    window.addEventListener("scroll", this.handleScroll);
    this.SaldoConta();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { loading, hasMore } = this.state;

    // Verifica se o scroll está próximo ao final da página
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;

    // Executa a função somente se não estiver carregando e houver mais dados
    if (!loading && hasMore && scrollTop + clientHeight >= scrollHeight - 50) {
      this.loadMoreExtrato();
    }
  };

  loadMoreExtrato = () => {
    const { pessoa, dataDe, dataAte, ultimoId, extrato } = this.state;

    this.setState({ loading: true });

    const data = {
      url: "conta/extrato",
      data: {
        conta_id: pessoa.conta_id,
        data_de: Formatar.formatarDateAno(dataDe),
        data_ate: Formatar.formatarDateAno(dataAte),
        ult_id: ultimoId,
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
        hasMore: novosDados.length === 50, // Verifica se ainda há mais resultados
      });
    });
  };

  verExtrato = () => {
    const { dataDe, dataAte, pessoa } = this.state;

    const hoje = new Date() + 1;

    const dataInicio = new Date(dataDe);
    const dataFim = new Date(dataAte);

    // Verificar se as datas são válidas
    if (dataInicio > hoje || dataFim > hoje) {
      this.props.alerts(
        "Data inválida",
        "Informe no máximo a data do dia atual.",
        "warning"
      );
      return;
    }

    // Verificar diferença de dois dias entre as datas
    // const diffInMilliseconds = Math.abs(dataFim - dataInicio);
    // const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    // if (diffInDays > 2) {
    //   this.props.alerts(
    //     "Intervalo inválido",
    //     "Selecione no máximo um intervalo de dois dias.",
    //     "warning"
    //   );
    //   return;
    // }

    this.setState({
      loading: true,
      disabled: true,
      extrato: [],
      ultimoId: null,
      hasMore: true,
    });

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
        hasMore: arr.length === 50, // Verifica se ainda há mais resultados
      });
    });
  };

  fetchExtrato = async () => {
    this.setState({
      loading: true,
      disabled: true,
    });

    const { dataDe, dataAte, pessoa } = this.state;

    const hoje = new Date() + 1;

    const dataInicio = new Date(dataDe);
    const dataFim = new Date(dataAte);

    if (dataInicio > hoje || dataFim > hoje) {
      this.props.alerts(
        "Data inválida",
        "Informe no máximo a data do dia atual.",
        "warning"
      );
    } else {

      const data = {
        url: "conta/extrato",
        data: {
          conta_id: pessoa.conta_id,
          data_de: Formatar.formatarDateAno(dataDe),
          data_ate: Formatar.formatarDateAno(dataAte),
          custom_id: this.state.custom_id || "",
          // ult_id: '48694416'
          // ult_id: '48683525'
          ult_id: '63742347'
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

        } else {
          const arr = keys.flatMap((key) => res[key]);
          const soma = arr.reduce((acc, e) => acc + e.valor, 0);

          console.log(arr);

          // this.setState({
          //   extrato: arr,
          //   ultimoId: arr[arr.length - 1].id,
          //   soma,
          //   mostrarExtrato: true,
          //   // hasMore: arr.length === 50, // Verifica se ainda há mais resultados
          // });
        }
      });
    }

    this.setState({
      loading: false,
      disabled: false,
    });
  }

  carregarExtratoCsv = async () => {
    const { dataDe, dataAte, pessoa } = this.state;

    // console.log("Data de início:", dataDe);
    // console.log("Data de término:", dataAte);

    const hoje = new Date();
    const dataInicio = new Date(dataDe);
    const dataFim = new Date(dataAte);

    // console.log("Data atual:", hoje);
    // console.log("Data de início convertida:", dataInicio);
    // console.log("Data de término convertida:", dataFim);

    const data = {
      url: "conta/extrato",
      data: {
        conta_id: pessoa.conta_id,
        data_de: Formatar.formatarDateAno(dataDe), // Certifique-se de que o formato de data está correto
        data_ate: Formatar.formatarDateAno(dataAte), // Certifique-se de que o formato de data está correto
        isfile: true,
      },
      method: "POST",
    };

    try {
      const res = await Funcoes.Geral_API(data, true);
      // console.log("Resposta da API:", res); // Verifique se a resposta está correta
      if (res && Object.keys(res).length > 0) {
        return res;
      }
      // console.log("Nenhum dado retornado pela API");
      return []; // Caso contrário, retorna um array vazio
    } catch (error) {
      console.error("Erro ao carregar extrato:", error);
      this.props.alerts(
        "Erro ao carregar extrato",
        "Ocorreu um problema ao carregar os dados.",
        "error"
      );
      return [];
    }
  };

  extrato_csv = async () => {
    const { dataDe, dataAte, pessoa, soma } = this.state;

    // Inicia o loading
    this.setState({ loadingCsv: true, disabledCsv: true });

    try {
      // Chama o endpoint uma única vez
      const dadosExtrato = await this.carregarExtratoCsv();
      // console.log("Dados do extrato:", dadosExtrato); // Verifique se os dados foram carregados corretamente

      if (!dadosExtrato || Object.keys(dadosExtrato).length === 0) {
        this.props.alerts(
          "Sem dados",
          "Nenhum dado encontrado para o período selecionado.",
          "info"
        );
        return;
      }

      // Define valores padrão caso estejam indefinidos
      const saldoTotal = soma ? soma.toFixed(2).replace(".", ",") : "0,00";
      const saldoDisponivel = saldoTotal;

      // Cabeçalho das colunas
      const columns = [
        "Data",
        "Custom ID",
        "Id",
        "Data/Hora",
        "Descrição",
        "Valor",
        "Conta",
        "Status",
      ];

      // Processar o objeto de retorno
      const rows = [];

      for (const [data, transacoes] of Object.entries(dadosExtrato)) {
        transacoes.forEach((item) => {
          rows.push([
            data, // Adiciona a data como uma nova coluna
            item.custom_id || "N/A",
            item.id || "",
            new Date(item.dataHora).toLocaleString(),
            item.descricao || "",
            item.valor || 0, // Retorna o valor como float diretamente
            item.conta_id || "",
            item.bloqueado ? "Bloqueado" : "Desbloqueado",
          ]);
        });
      }

      // Conteúdo CSV
      const csvContent = [
        columns.join(","), // Cabeçalho
        ...rows.map((row) => row.join(",")), // Dados
      ].join("\n");

      // Criando o arquivo para download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Garantindo que a URL seja criada corretamente
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "extrato_movimentacao.csv");

      // Usar appendChild para garantir que o link esteja no DOM
      document.body.appendChild(link);

      // Acionar o clique para download
      link.click();

      // Remover o link após o download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      this.props.alerts(
        "CSV Gerado",
        "O arquivo CSV foi gerado com sucesso.",
        "success"
      );
    } catch (error) {
      console.error("Erro ao gerar o CSV:", error);
      this.props.alerts(
        "Erro ao gerar CSV",
        "Ocorreu um problema ao carregar os dados.",
        "error"
      );
    } finally {
      // Finaliza o loading
      this.setState({ loadingCsv: false, disabledCsv: false });
    }
  };

  extrato_pdf = async () => {
    // console.log(this.state.saldos);
    const { extrato, dataDe, dataAte, pessoa, soma } = this.state;

    // Verificação de dados antes de gerar o PDF
    if (!extrato || extrato.length === 0) {
      this.props.alerts(
        "Sem dados",
        "Nenhum dado encontrado para o período selecionado.",
        "info"
      );
      return;
    }

    // Configurações do PDF
    const doc = new jsPDF();
    doc.setFontSize(12);

    // Definindo o saldo total e disponível
    const saldoTotal = soma ? soma.toFixed(2).replace(".", ",") : "0,00";
    const saldoDisponivel = saldoTotal;

    // Cabeçalho do PDF
    doc.text("Extrato de Movimentação da Conta:", 10, 10);
    doc.text(
      `Período: ${new Date(dataDe).toLocaleDateString()} até ${new Date(
        dataAte
      ).toLocaleDateString()}`,
      10,
      20
    );
    doc.text(`Cliente: ${pessoa?.nome || "N/A"}`, 10, 30);
    doc.text(`Agência/Conta: 0001 / ${pessoa?.conta_id || "N/A"}`, 10, 40);
    doc.text(`Saldo Total: R$ ${this.state.saldos.digital.saldo}`, 10, 50);
    doc.text(`Saldo Do Dia: R$ ${saldoDisponivel}`, 10, 60);
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
      dataHora: new Date(item.dataHora).toLocaleString(), // Formata a data para incluir hora também
      descricao: item.descricao || "",
      valor: item.valor ? item.valor.toFixed(2).replace(".", ",") : "0,00",
      conta: item.conta_id || "",
      custom_id: item.custom_id || "N/A",
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

  SaldoConta = () => {
    const data = {
      url: "conta/saldo",
      data: { conta_id: Funcoes.pessoa.conta_id },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      // console.log(res);
      let tmpSaldos = this.state.saldos;

      if (Produtos.saldoDigital)
        tmpSaldos.digital = {
          saldo: Formatar.formatarMoeda(res.digital),
        };

      // if (Produtos.saldoCartao) tmpSaldos.push({ show: false, icone: Icones.saldo2, titulo: i18n.t('home.saldoCartao'), saldo: Formatar.formatarMoeda(res.cartao), saldoTrue: res.cartao });

      // if (Produtos.saldoCredito) tmpSaldos.push({ show: false, icone: Icones.saldo3, titulo: i18n.t('home.saldoConvenio'), saldo: Formatar.formatarMoeda(res.credito), saldoTrue: res.credito });

      // if (Produtos.saldoInvestimento) tmpSaldos.push({ show: false, icone: Icones.saldo4, titulo: i18n.t('home.saldoConvenio'), saldo: Formatar.formatarMoeda(res.investimento), saldoTrue: res.investimento });

      this.setState({ saldos: tmpSaldos });
    });
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

                  <div>
                    {/* Indicador de loading */}
                    {this.state.loadingCsv && (
                      <div className="loading-overlay">
                        <div className="spinner"></div>
                        <p>Gerando arquivo CSV, por favor, aguarde...</p>
                      </div>
                    )}

                    {/* Botão para gerar o CSV */}

                    <Button
                      className="mr-1"
                      onClick={this.extrato_csv}
                      disabled={this.state.loadingCsv || this.state.disabledCsv}
                    >
                      {this.state.loading
                        ? "Gerando..."
                        : "Download Extrato CSV"}
                    </Button>
                  </div>
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
                  {extrato.map((row, index) => (
                    <tr key={`${row.id}-${index}`}>
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
