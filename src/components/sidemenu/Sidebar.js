import React, { Component } from "react";
import "../../templates/style_sidebar.scss";
import { Modal, Row, Col, Container } from "react-bootstrap";
import { ProSidebar, Menu, MenuItem, SidebarContent } from "react-pro-sidebar";
import { Link } from 'react-router-dom';
import Produtos from "../../constants/Produtos";
import * as Formatar from "../../constants/Formatar";
import * as Funcoes from "../../constants/Funcoes";
import i18n from '../../tradutor/tradutor';
import LangButton from '../langButton/LangButton';
import Icones from '../../constants/Icon';

export default class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      tarifasShow: false,
      tarifasSidebar: [],
      pessoa: [],
      arr2: [],
      lang: '',
    };
  }

  componentDidMount() {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });
    console.log(localStorage.getItem("nivel"))
  }

  componentWillUnmount() {
    this.componentDidMount();
  }

  listar_tarifas = () => {
    this.setState({ tarifasShow: true });

    const dados = {
      url: 'tarifa/consulta-lista',
      data: { 'conta_id': this.state.pessoa.conta_id },
      method: 'POST',
    };

    Funcoes.Geral_API(dados, true).then((result) => {
      var arr = [];
      var arr2 = [];

      Object.keys(result).forEach((key) => {
        var valor_local = "";
        var franquia = "";

        if (this.state.pessoa.pf_pj == "pf") {
          valor_local = result[key].valor_local;
        } else {
          valor_local = result[key].valor_localpj;
        }

        if (result[key].franquia_gratuita && result[key].franquia_gratuita != 0) {
          franquia = i18n.t('sidebar.gratuito') + result[key].franquia_gratuita;
        }

        arr2.push({
          id: key,
          descricao: result[key].descricao,
          valor_local: valor_local,
          franquia: franquia,
        });

        arr.push(result[key]);
      });

      this.setState({ arr2 });
      this.setState({ tarifasSidebar: arr });
    });
  };

  // logout = () => {
  //   localStorage.removeItem("info");
  //   localStorage.removeItem("pfp");
  //   localStorage.removeItem("hora_anterior");
  //   localStorage.removeItem('num_cadastrado');
  //   window.location.href = "/";
  // };

  traduzir = async (data) => {
    this.props.langProp(data);
  }

  render() {
    const { pessoa } = this.state;

    if (Object.keys(pessoa).length > 0) {
        return (
          <Col className="sidebar col-2 p-0 position-sticky">
            <ProSidebar>
              <SidebarContent className="pb-9">
                <Menu className="p-0">
                  {Produtos.lista_produtos.map((value) => {
                    if (value.mostrar) {
                      if (value.key != 17) {
                        return (
                          <MenuItem
                            className="pl-2"
                            icon={value.icone}
                            key={value.key}
                          >
                            <Link to={value.rota} key={value.key.toString()}>
                              <span className="m-1">{i18n.t(value.titulo)}</span>
                            </Link>
                          </MenuItem>
                        );
                      } else {
                        return (
                          <MenuItem
                            className="pl-2"
                            key={value.key.toString()}
                            icon={value.icone}
                            onClick={() => {
                              this.listar_tarifas();
                            }}
                          >
                            <span className="textMenu">{i18n.t(value.titulo)}</span>
                          </MenuItem>
                        );
                      }
                    } else {
                      return <div key={value.key.toString()}> </div>;
                    }
                  })}

                  <MenuItem
                    className="pl-2"
                    key={"999"}
                    icon={Icones.sair}
                    onClick={() => {
                      Funcoes.logout();
                    }}
                  >
                    <span className="m-1">{i18n.t('header.sair')}</span>
                  </MenuItem>

                </Menu>
                {
                  Produtos.mostrar_tradutor ? (
                    <div className="sidebar-lang-wrapper m-3 pl-2">
                      < LangButton langProp={this.traduzir} />
                    </div>
                  ) : null
                }
              </SidebarContent>

            </ProSidebar>

            <Modal
              animation={false}
              show={this.state.tarifasShow}
              onHide={() => this.setState({ tarifasShow: false })}
            >
              <Modal.Header>
                {i18n.t('sidebar.tarifaTitulo') + process.env.NOME_BANCO}
              </Modal.Header>
              <Modal.Body>
                <Container className="mt-4 col-md-10" >
                  <Row className="mt-3">
                    <Col>
                      <table
                        id="tabela-extrato"
                        className="table table-striped table-sm"
                      >
                        <thead>
                          <tr>
                            <th scope="col">{i18n.t('sidebar.tarifaCol')}</th>
                            <th scope="col">{i18n.t('sidebar.tarifaValor')}</th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.arr2.map((dados) => (
                            <tr key={dados.id}>
                              <td>{dados.descricao}</td>
                              <td>
                                {Formatar.formatarMoeda(dados.valor_local)}
                              </td>
                              <td>{dados.franquia}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </Container>
                <button
                  type="button"
                  className="btn float-right"
                  onClick={() => this.setState({ tarifasShow: false })}
                >
                  {i18n.t('sidebar.tarifaFechar')}
                </button>
              </Modal.Body>
            </Modal>
          </Col>
        );
    } else {
      return null;
    }
  }
}
