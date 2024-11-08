import React, { Component } from "react";
import * as Funcoes from "../../constants/Funcoes";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import ReactLoading from "react-loading";
import i18n from "../../tradutor/tradutor";
import * as Formatar from "../../constants/Formatar";

export default class RelatorioEntrada extends Component {
  constructor() {
    super();
    this.state = {
      extrato: [], // Dados carregados da API
      dataDe: "", // Data de início da pesquisa
      dataAte: "", // Data de fim da pesquisa
      id: "", // ID informado pelo usuário
      mostrarExtrato: false,
      loading: false,
      disabled: false,
      hasMore: true, // Se há mais dados a serem carregados
      lastItemId: null, // ID do último item carregado
      pessoa: [],
    };
    this.observer = null; // Controla o observador
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });
  }

  componentDidUpdate(_, prevState) {
    // Se dados novos forem carregados, configurar observador novamente
    if (this.state.mostrarExtrato && prevState.extrato !== this.state.extrato) {
      this.setupObserver();
    }
  }

  // Atualiza os campos de data e ID no estado conforme o usuário insere os valores
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // Função chamada ao clicar em "Pesquisar"
  verExtrato = () => {
    if (this.state.dataDe == "" || this.state.dataAte == "") {
      alert("Escolha o periodo para pesquisar!");
    } else {
      this.setState({
        extrato: [], // Limpa o array para evitar duplicidade de dados
        mostrarExtrato: false, // Oculta a tabela enquanto carrega novos dados
        loading: true,
        disabled: true,
        lastItemId: null, // Reseta o ID do último item
        hasMore: true, // Reseta o controle de carregamento infinito
      });

      const { dataDe, dataAte, id, pessoa } = this.state;

      const data = {
        url: "pix/relatorio-pix",
        data: {
          conta_id: pessoa.conta_id,
          data_de: dataDe,
          data_ate: dataAte,
          ultimo_id: "", // Inicia a pesquisa sem último item carregado
          tipo_relatorio: "PixIn",
          end_to_end: "",
          custom_id: id || "",
        },
        method: "POST",
      };

      Funcoes.Geral_API(data, true).then((res) => {
        if (res.status && res.dados.length > 0) {
          this.setState({
            extrato: res.dados,
            loading: false,
            disabled: false,
            hasMore: res.dados.length > 0,
            lastItemId: res.dados[res.dados.length - 1].id, // Atualiza o último item carregado
            mostrarExtrato: true,
          });
        } else {
          alert("Sem Relatorio durante esse Periodo")
          this.setState({
            loading: false,
            disabled: false,
            hasMore: false,
          });
        }
      });
    }
  };

  setupObserver = () => {
    if (this.observer) {
      this.observer.disconnect();
    }

    const node = document.getElementById("end-of-list");
    if (node) {
      this.observer = new IntersectionObserver(this.handleIntersection, {
        threshold: 1,
      });
      this.observer.observe(node);
    }
  };

  // Detecta quando o usuário rola até o final da página
  handleIntersection = (entries) => {
    const { loading, hasMore } = this.state;
    if (entries[0].isIntersecting && !loading && hasMore) {
      this.loadMoreData(); // Carrega mais resultados automaticamente
    }
  };

  // Função para carregar mais dados
  loadMoreData = () => {
    const { dataDe, dataAte, id, lastItemId, pessoa } = this.state;

    this.setState({ loading: true });

    const data = {
      url: "pix/relatorio-pix",
      data: {
        conta_id: pessoa.conta_id,
        data_de: dataDe,
        data_ate: dataAte,
        ultimo_id: lastItemId || "",
        tipo_relatorio: "PixIn",
        end_to_end: "",
        custom_id: id || "",
      },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      if (res.status && res.dados.length > 0) {
        this.setState((prevState) => ({
          extrato: prevState.extrato.concat(res.dados),
          loading: false,
          hasMore: res.dados.length > 0,
          lastItemId: res.dados[res.dados.length - 1].id,
        }));
      } else {
        this.setState({
          loading: false,
          hasMore: false,
        });
      }
    });
  };

  render() {
    return (
      <div className="extrato">
        <Container className="p-3 col-md-10">
          <Row className="baseWindow px-5 py-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Data De</Form.Label>
                <Form.Control
                  type="date"
                  name="dataDe"
                  value={this.state.dataDe}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Data Até</Form.Label>
                <Form.Control
                  type="date"
                  name="dataAte"
                  value={this.state.dataAte}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Custom ID</Form.Label>
                <Form.Control
                  type="text"
                  name="id"
                  value={this.state.id}
                  onChange={this.handleInputChange}
                  placeholder="Informe o ID"
                />
              </Form.Group>
            </Col>

            <Col>
              <Button onClick={this.verExtrato} disabled={this.state.disabled}>
                {i18n.t("extrato.btnPesquisar")}
              </Button>
            </Col>
          </Row>

          {this.state.loading ? (
            <ReactLoading
              className="d-block m-auto"
              type={"spin"}
              color={"#000"}
              height={"5%"}
            />
          ) : (
            this.state.mostrarExtrato && (
              <Col className="baseWindow px-5 py-4">
                <Row>
                  <Table striped bordered id="tabela-extrato">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th scope="col">Nome</th>
                        <th className="text-right" scope="col">
                          {i18n.t("extrato.descrValor")}
                        </th>
                        <th className="text-right" scope="col">
                          {i18n.t("extrato.descrData")}
                        </th>
                        <th>Custom ID</th>
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.extrato.map((dado) => (
                        <tr key={dado.id}>
                          <td>{dado.id}</td>
                          <td>{dado.nome}</td>
                          <td
                            className={
                              "text-right " +
                              (dado.valor < 0 ? "redText" : "greenText")
                            }
                          >
                            {Formatar.formatReal(dado.valor)}
                          </td>
                          <td className="text-right">
                            {Formatar.formatarDate(dado.data_hora)}
                          </td>
                          <td className="text-right">{dado.mensagem}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Row>

                {this.state.hasMore && (
                  <div
                    id="end-of-list"
                    style={{ height: "1px", background: "transparent" }}
                  />
                )}
              </Col>
            )
          )}
        </Container>
      </div>
    );
  }
}
