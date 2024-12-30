import React, { Component } from "react";
import "../../templates/style_cartoes.scss";
import * as Funcoes from "../../constants/Funcoes";
import {
  Container,
  Col,
  Row,
  Modal,
  Alert,
  Breadcrumb,
  Image,
  Accordion,
  Card,
  Button,
  InputGroup,
  Link,
} from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import { addDays, subDays } from "date-fns";
import CurrencyInput from "react-currency-input";
import BannerTitle from "../../components/bannerTitle/bannerTitle";
import * as Formatar from "../../constants/Formatar";
import Produtos from "../../constants/Produtos";
import Objetos from "../../constants/Objetos";
import Icones from "../../constants/Icon";
import * as Iconfa from "react-icons/fa";
import * as Icon from "react-bootstrap-icons";
import ReactLoading from "react-loading";
import OtpInput from "react-otp-input";
import i18n from "../../tradutor/tradutor";

export default class EscolhaCartao extends Component {
  constructor() {
    super();
    global.boleto = "";
    global.configuracao_login = false;
    this.state = {
      pessoa: [],
      //solicitar cartao
      checked: false,
      cartao1: true,
      cartao2: false,
      disabled: false,
      valor_cartao: "",
      chave: "",
      tarifa: 0,
      solicitar: false,
      corCartao: "",
      saldoDigital: 0,

      // ativar cartao
      cartao_status: [],
      cartao_desbloqueado: false,
      ativar: false,
      cadastro_ativo: false,
      cadastro_inativo: true,
      confirmar_id_cartao: false,
      confirmar_id_cartao_pj: false,
      confirma_sms: false,
      desbloqueio_efetuado: false,
      id_cartao: "",
      sms: "",
      tel: "",
      gerar_senha: false,
      senha: "",
      confirmar_senha: "",
      doc: "",
      nosso_id: "",
      texto: "",
      token_login_ciacard: "",
      id_conta_cartao: "",
      aguarde: false,

      //recarga cartao
      carregar: false,
      boleto_recarga: true,
      transf_recarga: false,
      advanced: "",
      dataVecimento: new Date(),
      date_escolha: false,
      pdf: null,
      boletosRecargas: [],
      modal_boleto: false,
      loading: false,
      transf_dados: [],
      nosso_id: "",
      cartao_id: "",
      id_nosso_cartao: "",
      mostrar_valor: false,
      nome_cartao: "",
      id_cartaoTransf: "",
      saldoCartao: 0,
      password: "",
      cancelar_buscar: true,

      // trocar senha
      trocarSenha: false,
      nova_senha: "",
      confirma_nova_senha: "",

      // Detalhes
      detalhes: false,
      cartao_id_status: 0,
      operacao: "",
      cadeado: "",
      isSwitchOn: false,
      detalhes_numero_cartao: "",
      detalhes_id_cartao_numero: "",
      detalhes_cartao_status: "",
    };
  }

  componentDidMount = () => {
    const pessoa = Funcoes.pessoa;
    this.setState({ pessoa: pessoa });

    const dados = {
      url: "cartao/consultar",
      data: { conta_id: Funcoes.pessoa.conta_id },
      method: "POST",
    };

    Funcoes.Geral_API(dados, true).then((res) => {
      this.setState({ cartao_status: res });
    });

    const data = {
      url: "conta/saldo",
      data: { conta_id: Funcoes.pessoa.conta_id },
      method: "POST",
    };

    Funcoes.Geral_API(data, true).then((res) => {
      this.setState({ saldoDigital: res.digital, saldoCartao: res.cartao });
    });

    // tarifas
    const data2 = {
      url: "tarifa/consulta",
      data: {
        chave: "solicitacao_cartao",
        conta_id: pessoa.conta_id,
      },
      method: "POST",
    };

    Funcoes.Geral_API(data2, true).then((res) => {
      console.log(res);
      if (this.state.pessoa.pf_pj == "pf" || this.state.pessoa.pf_pj == "pj") {
        this.setState({ tarifa: res });
      }
    });
  };

  //possui cartao / cartao status
  cartao = () => {
    const cartao_status = this.state.cartao_status;

    if (this.state.pessoa.pf_pj == "pf") {
      var doc = this.state.pessoa.cpf_cnpj.replace(/[^0-9]+/g, "");
      if (doc.length == 11) {
        this.setState({ doc: Formatar.cpf_mask(doc), texto: "CPF: " });
      } else if (doc.length == 14) {
        this.setState({ doc: Formatar.cnpj_mask(doc), texto: "CNPJ: " });
      }
    } else {
      var doc = this.state.pessoa.doc;

      if (doc.length == 11) {
        this.setState({
          doc: Formatar.cpf_mask(this.state.pessoa.doc),
          texto: "CPF:",
        });
      } else if (doc.length == 14) {
        this.setState({
          doc: Formatar.cnpj_mask(this.state.pessoa.doc),
          texto: "CNPJ: ",
        });
      }
    }

    if (cartao_status[0]) {
      if (
        cartao_status.dataHoraDesbloqueio == null ||
        cartao_status.dataHoraDesbloqueio == ""
      ) {
        this.setState({ cadastro_ativo: true, cadastro_inativo: false });
        this.ativacao();
      } else {
        this.setState({ cartao_desbloqueado: true, cadastro_inativo: false });
      }
    }
  };

  //solicitar cartao
  solicitar_cartao = () => {
    var cartao = "";

    if (this.state.pessoa.pf_pj == "pf") {
      var valor_cartao = this.state.tarifa;

      if (this.state.cartao1 == true) {
        cartao = process.env.CARTAO1;
      } else {
        cartao = process.env.CARTAO2;
      }
    } else {
      var valor_cartao = this.state.tarifa;
      cartao = process.env.CARTAO3;
    }

    const dados = {
      url: "pedido-cartao/novo",
      data: {
        conta_id: this.state.pessoa.conta_id,
        corCartao: cartao,
        valorCartao: valor_cartao,
      },
      method: "POST",
    };
    console.log(dados);
    if (parseFloat(this.state.saldoDigital) < parseFloat(valor_cartao)) {
      alert(
        "Saldo insuficiente, " +
          "Realize uma recarga em sua conta digital para continuar a operação."
      );
    } else if (this.state.checked != true) {
      alert("Você precisa aceitar os termos de uso para solicitar um cartão");
    } else {
      Funcoes.Geral_API(dados, true).then((res) => {
        console.log(res);
        var nome = this.state.pessoa.nome;
        if (res == 0) {
          alert(
            nome + ", Ocorreu um erro ao solicitar o cartão tente novamente"
          );
        } else if (res == 1) {
          alert(
            nome +
              ", Seu cartão foi solicitado com sucesso em breve recebera um email com as novidades"
          );
        } else if (res == 2) {
          alert(
            nome +
              ", Já existe uma solicitação do cartão, aguarde em breve recebera um email com as novidades"
          );
        }
      });
    }
  };

  //cor de cartão para solicitar
  corCartao = (id) => {
    if (id == 1) {
      if (this.state.cartao1 == true) {
        this.setState({ cartao2: false });
      } else {
        this.setState({ cartao2: false, cartao1: true });
      }
    } else {
      if (this.state.cartao2 == true) {
        this.setState({ cartao1: false });
      } else {
        this.setState({ cartao1: false, cartao2: true });
      }
    }
  };

  //termos cartao
  termos = (id) => {
    if (id == 1) {
      window.open(process.env.BASE + "termo-cartao.pdf");
    } else {
      window.open(process.env.BASE + "termo.pdf");
    }
  };

  // ativação do cartao//
  ativacao = () => {
    if (this.state.cartao_status[0]) {
      alert("Seu cartão " + process.env.NOME_BANCO + " já está desbloqueado");
    } else if (this.state.cadastro_inativo == true) {
      alert(
        "Para ativar seu cartão " +
          process.env.NOME_BANCO +
          " primeiro você precisa solicitar um cartão."
      );
    } else {
      this.setState({ ativar: true });
    }
  };

  //recarga do cartao
  carregar = () => {
    if (this.state.cartao_status[0]) {
      this.setState({ carregar: true, mostrar_valor: false });
    } else if (
      this.state.cartao_status.dataHoraDesbloqueio == null ||
      this.state.cartao_status.dataHoraDesbloqueio == ""
    ) {
      alert(
        "Para carregar seu cartão " +
          process.env.NOME_BANCO +
          " primeiro você precisa ativalo."
      );
    } else {
      alert(
        "Para carregar seu cartão " +
          process.env.NOME_BANCO +
          " primeiro você precisa solicitar um cartão."
      );
    }
  };

  senha = () => {
    if (this.state.cartao_status[0]) {
      this.setState({ trocarSenha: true });
    } else if (
      this.state.cartao_status.dataHoraDesbloqueio == null ||
      this.state.cartao_status.dataHoraDesbloqueio == ""
    ) {
      alert(
        "Para trocar a senha de seu cartão " +
          process.env.NOME_BANCO +
          " primeiro você precisa ativa-lo."
      );
    } else {
      alert(
        "Para trocar a senha de seu cartão " +
          process.env.NOME_BANCO +
          " primeiro você precisa solicitar um cartão."
      );
    }
  };

  detalhes = () => {
    if (this.state.cartao_status[0]) {
      this.cartao_dados();
    } else if (
      this.state.cartao_status.dataHoraDesbloqueio == null ||
      this.state.cartao_status.dataHoraDesbloqueio == ""
    ) {
      alert(
        "Para visualizar os detalhes de seu cartão " +
          process.env.NOME_BANCO +
          " primeiro você precisa ativa-lo."
      );
    } else {
      alert(
        "Para visualizar os detalhes de seu cartão " +
          process.env.NOME_BANCO +
          " primeiro você precisa solicitar um cartão."
      );
    }
  };

  //envio de token por sms pela ciacard
  CodigoValidacao_ciacard = () => {
    const dados = {
      url: "cartao/codigo-validacao",
      data: {
        documento: this.state.pessoa.cpf_cnpj,
        telefone: this.state.pessoa.celular.replace(/[^0-9]+/g, ""),
      },
      method: "POST",
    };

    Funcoes.Geral_API(dados).then((res) => {
      var nome = this.state.pessoa.razao_social;
      if (res == 1) {
        this.setState({
          confirma_sms: true,
          cadastro_ativo: false,
          aguarde: false,
        });
      } else {
        alert(nome + ", Erro, Tente Novamente");
        this.setState({ aguarde: false });
      }
    });
  };

  //validação do token sms feita pela ciacard
  validaCodigoCiacard = () => {
    if (this.state.sms != "") {
      this.setState({ aguarde: true });

      const dados = {
        url: "cartao/valida-codigo",
        data: {
          documento: Funcoes.pessoa.cpf_cnpj,
          telefone: Funcoes.pessoa.celular.replace(/[^0-9]+/g, ""),
          code: this.state.sms,
        },
        method: "POST",
      };

      Funcoes.Geral_API(dados).then((res) => {
        var nome = this.state.pessoa.razao_social;
        if (res == 1) {
          this.GerarSenha_ciacard();
        } else {
          alert(nome + ", Erro, Tente Novamente");
          this.setState({ aguarde: false });
        }
      });
    } else {
      alert("Digite o código SMS");
    }
  };

  //criação de senha do cartao feita pela ciacard
  GerarSenha_ciacard = () => {
    const dados = {
      url: "cartao/gerar-senha-e-login-v2",
      data: {
        contaid: this.state.pessoa.conta_id,
      },
      method: "POST",
    };
    Funcoes.Geral_API(dados).then((res) => {
      var nome = this.state.pessoa.razao_social;
      if (res !== 0 && this.state.pessoa.pf_pj == "pf") {
        this.setState({
          confirmar_id_cartao: true,
          confirma_sms: false,
          aguarde: false,
        });
      } else if (res !== 0 && this.state.pessoa.pf_pj == "pj") {
        this.setState({ confirmar_id_cartao: true, confirma_sms: false });
      } else {
        alert(nome + ", Erro, Tente Novamente");
      }
    });
  };

  // desbloqueio do cartao feito pela ciacard
  desbloqueio_cartao_ciacard = () => {
    this.setState({ aguarde: true });

    const dados = {
      url: "cartao/unlock-card",
      data: {
        id_cartao: parseInt(this.state.id_cartao),
        conta_id: this.state.pessoa.conta_id,
      },
      method: "POST",
    };

    var nome = this.state.pessoa.razao_social;
    Funcoes.Geral_API(dados).then((res) => {
      if (res != 0) {
        this.setState({ gerar_senha: true, confirmar_id_cartao: false });
      } else {
        alert(nome + ", Erro, Tente Novamente");
      }
    });
  };

  // criação da senha do cartão
  gerar_senha_cartao = () => {
    var cartao_int = this.state.id_cartao;

    const dados = {
      url: "cartao/pass-card",
      data: {
        idcartao: cartao_int,
        senha: this.state.senha,
      },
      method: "POST",
    };

    if (this.state.senha == "") {
      alert("Sua senha não pode ser vazia!");
    } else if (this.state.senha != this.state.confirmar_senha) {
      alert("As senhas devem ser iguais!");
    } else {
      Funcoes.Geral_API(dados).then((res) => {
        if (res != 0) {
          this.salvar_desbloqueio_cartao();
        } else {
          alert(nome + ", Erro, Tente Novamente");
        }
      });
    }
  };

  // salvar a ativação do cartao
  salvar_desbloqueio_cartao = () => {
    const dados = {
      url: "cartao/desbloqueio",
      data: {
        conta_id: this.state.pessoa.conta_id,
      },
      method: "POST",
    };
    Funcoes.Geral_API(dados).then((res) => {
      this.setState({
        gerar_senha: false,
        desbloqueio_efetuado: true,
        cartao_desbloqueado: true,
      });
      this.consulta_interna_cartao();
    });
  };

  // consultar a ativação do cartao
  consulta_interna_cartao = () => {
    const dados = {
      url: "cartao/consultar",
      data: {
        conta_id: this.state.pessoa.conta_id,
      },
      method: "POST",
    };

    Funcoes.Geral_API(dados).then((res) => {
      res.dados_cartao = res[0];
    });
  };

  // gerar o boleto de recarga do cartão
  gerar_boleto = () => {
    global.boleto = "";

    if (this.state.advanced == 0 || this.state.advanced == "") {
      alert("Digite o valor");
    } else {
      var valor = this.state.advanced;
      var data = this.state.dataVecimento;

      var tamanho = toString(data).length;

      if (this.state.date_escolha == true) {
        data = data.split("/");
        data = data[2] + "-" + data[1] + "-" + data[0];
      } else {
        data = data.toJSON();
      }

      valor = valor.replace(".", "");
      valor = valor.replace(".", "");
      valor = valor.replace(".", "");
      valor = valor.replace(",", "");

      const dados = {
        url: "cartao/gerar-boleto",
        data: {
          valor: valor,
          data: data,
          conta_id: this.state.pessoa.conta_id,
        },
        method: "POST",
      };

      Funcoes.Geral_API(dados).then((res) => {
        if (res.id) {
          var data_emissao = res.dataProcessamento.split("T");
          var data_vencimento = res.dataVencimento.split("T");
          data_emissao = data_emissao[0].split("-");
          data_vencimento = data_vencimento[0].split("-");
          data_emissao =
            data_emissao[2] + "/" + data_emissao[1] + "/" + data_emissao[0];
          data_vencimento =
            data_vencimento[2] +
            "/" +
            data_vencimento[1] +
            "/" +
            data_vencimento[0];

          global.boleto = {
            id_boleto_ciacard: res.id,
            agencia: res.agencia,
            carteira: res.carteira,
            /*  cedente_cep: res.cepPagador,
                         cedente_cidade:res.cidadePagador, */
            cedente_documento: res.documentoBeneficiario,
            cedente_endereco: res.documentoBeneficiario,
            cedente_nome: res.nomeBeneficiario,
            cedente_uf: res.ufPagador,
            /* conta:res.conta, */
            idConta: res.idConta,
            data_emissao: data_emissao,
            data_vencimento: data_vencimento,
            instrucoes:
              "Recarga " +
              process.env.NOME_BANCO +
              " - Receber o valor informado",
            /* juros:res.juros, */
            linha_digitavel: res.linhaDigitavel,
            /* multa:res.multa, */
            nosso_numero: res.nossoNumero,
            numero_documento: res.numeroDoDocumento,
            /* path:res.path, */
            sacado_cep: res.cepPagador,
            sacado_cidade: res.cidadePagador,
            sacado_documento: res.documentoPagador,
            sacado_endereco: res.logradouroPagador,
            sacado_nome: res.nomePagador,
            /* sacado_tipo_documento:res.sacado_tipo_documento, */
            sacado_uf: res.ufPagador,
            /* sequencial:res.sequencial, */
            usuario_id: res.id,
            valor: Formatar.formatReal(res.valorBoleto),
            status: res.status,
          };

          this.setState({
            advanced: "",
            boletosRecargas: global.boleto,
            modal_boleto: true,
            carregar: false,
            loading: false,
          });
        }
      });
      alert("Gerando seu Boleto, Aguarde");
      this.setState({ loading: true, carregar: false });
    }
  };

  // Download Boleto base64
  gerar_pdf_boleto = (id) => {
    this.setState({ loading: true, modal_boleto: false });

    const dados = {
      url: "cartao/pdf-boleto",
      data: {
        id: id.id,
        idConta: id.idConta,
      },
      method: "POST",
    };

    Funcoes.Geral_API(dados).then((res) => {
      alert("Boleto baixado com sucesso!");
      this.setState({ loading: false, modal_boleto: false });
      const linkSource = `data:application/pdf;base64,${res}`;
      const downloadLink = document.createElement("a");
      const fileName = "Boleto_cartão.pdf";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();

      /*  const file = `data:application/pdf;base64,${res}`;
             var anchor = document.createElement('a');
             anchor.download = "Boleto.pdf";
             anchor.href = (window.webkitURL || window.URL).createObjectURL(file);
             anchor.dataset.downloadurl = ['application/pdf', anchor.download, anchor.href].join(':');
             anchor.click(); */
    });
  };

  // gerar a transferencia de recarga do cartão
  transf_cartao = (id) => {
    this.setState({
      nosso_id: this.state.cartao_status[0].id,
      cartao_id: this.state.cartao_status[0].id_conta_cartao,
      id_nosso_cartao: this.state.cartao_status[0].id_cartao,
    });

    id = parseInt(id);
    var nome = this.state.pessoa.nome.split(" ")[0];

    if (this.state.id_cartaoTransf == "") {
      this.setState({ mostrar_valor: false, cancelar_buscar: true });
      alert(nome + ", Preenca com o Código do cartão de destino!");
    } else if (this.state.id_nosso_cartao == id) {
      this.setState({ mostrar_valor: false, cancelar_buscar: true });
      alert(
        nome +
          ", Código do cartão destino não pode ser igual ao código do cartão origem."
      );
    } else {
      const dados = {
        url: "cartao/cartao",
        data: {
          id_cartao: id,
        },
        method: "POST",
      };
      Funcoes.Geral_API(dados).then((res) => {
        if (res != 0) {
          if (res.correntista.nome != null) {
            this.setState({
              id_conta_cartao: res.cartao.id_conta_cartao,
              mostrar_valor: true,
              nome_cartao: res.correntista.nome,
              cancelar_buscar: false,
            });
          } else {
            this.setState({
              id_conta_cartao: res.cartao.id_conta_cartao,
              mostrar_valor: true,
              nome_cartao: res.correntista.razao_social,
              cancelar_buscar: false,
            });
          }
        } else {
          this.setState({ mostrar_valor: false, cancelar_buscar: true });
          alert(nome + ", Código Invalido!");
        }
      });
    }
  };

  // gerar o pagamento de transferencia do cartão
  gerar_pagamennto = () => {
    this.setState({ loading: true, carregar: false });
    var saldo_atual = this.state.saldoCartao;
    var valor_conta = this.state.advanced;
    var dinheiro = this.state.advanced;

    var js = {
      amount: valor_conta,
      description: "Transferência para " + this.state.nome_cartao,
      originalAccount: this.state.cartao_id,
      destinationAccount: this.state.id_conta_cartao,
    };

    if (valor_conta == "") {
      alert("Digite o Valor a ser pago");
      this.setState({ loading: false, carregar: true });
    } else if (this.state.password == "") {
      alert("Digite a senha");
      this.setState({ loading: false, carregar: true });
    } else if (parseInt(valor_conta) > parseInt(saldo_atual)) {
      alert("Saldo Insuficiente");
      this.setState({ loading: false, carregar: true });
    } else {
      const dados = {
        url: "usuario/login",
        data: {
          email: this.state.pessoa.email,
          password: this.state.password,
          sub_banco_id: "",
          token_aparelho: "",
          nome_aparelho: "",
        },
        method: "POST",
      };

      Funcoes.Geral_API(dados).then((res) => {
        if (res == 0) {
          this.setState({ loading: false, carregar: true });
          alert("Senha Incorreta");
        } else {
          this.transf_enviar();
        }
      });
    }
  };

  // realizar a transferencia da recarga do cartão
  transf_enviar = () => {
    var valor_conta = this.state.advanced;

    const dados = {
      url: "cartao/transfer-account",
      data: JSON.stringify({
        amount: valor_conta,
        description: "Transferência para " + this.state.nome_cartao,
        originalAccount: this.state.cartao_id,
        destinationAccount: this.state.id_conta_cartao,
      }),
      method: "POST",
    };

    Funcoes.Geral_API(dados).then((res) => {
      if (res.message == "Transferencia efetuado.") {
        alert("Transferência realizada com sucesso");
        this.setState({ loading: false, carregar: false });
        window.location.href = "/cartoes";
      } else {
        alert("Erro na tranferência tente novamente");
        this.setState({ loading: false, carregar: true });
      }
    });
  };

  // alterar a senha
  alterar_senha = () => {
    if (this.state.nova_senha == "") {
      alert("Você deve preencher o campo de Nova Senha");
    } else if (this.state.nova_senha != this.state.confirma_nova_senha) {
      alert("A Nova Senha precisa ser igual a senha de Confirmação");
    } else {
      this.setState({ loading: true, trocarSenha: false });

      const dados = {
        url: "cartao/trocar-senha",
        data: JSON.stringify({
          conta_id: this.state.pessoa.conta_id,
          senha: this.state.nova_senha,
        }),
        method: "POST",
      };

      Funcoes.Geral_API(dados).then((res) => {
        if (res == 1) {
          alert("Senha alterada com sucesso!");
          this.setState({ loading: false, trocarSenha: true });
        } else {
          this.setState({ loading: false, trocarSenha: true });
          alert("Erro, tente novamente mais tarde");
        }
      });
    }
  };

  //detalhes do cartão
  cartao_dados = () => {
    this.setState({ detalhes: false, loading: true });

    const dados = {
      url: "cartao/dados-conta",
      data: {
        conta_id: this.state.pessoa.conta_id,
      },
      method: "POST",
    };

    Funcoes.Geral_API(dados).then((res) => {
      if (res[0].id_status) {
        var keys = Object.keys(res);
        var tamanho_keys = keys.length;

        for (var i = 0; i < tamanho_keys; i++) {
          if (
            res[i].id_account == this.state.cartao_status[0].id_conta_cartao
          ) {
            if (res[i].id_status == 1) {
              this.setState({
                detalhes_numero_cartao: res[i].number,
                detalhes_id_cartao_numero: res[i].id_card,
                detalhes_cartao_status: "Bloqueado",
                cartao_id_status: 1,
                operacao: "Desbloquear",
                cadeado: <Iconfa.FaLock />,
                isSwitchOn: false,
              });
            } else if (res[i].id_status == 2) {
              this.setState({
                detalhes_numero_cartao: res[i].number,
                detalhes_id_cartao_numero: res[i].id_card,
                detalhes_cartao_status: "Desbloqueado",
                cartao_id_status: 2,
                operacao: "Bloquear",
                cadeado: <Iconfa.FaUnlock />,
                isSwitchOn: true,
              });
            }
          }
        }
        this.setState({
          detalhes: true,
          loading: false,
        });
      }
    });
  };

  desbloquear_bloquear_cartao = (id) => {
    if (id == 1) {
      this.setState({ loading: true, detalhes: false });

      const dados = {
        url: "cartao/bloqueio-cartao",
        data: JSON.stringify({
          id_cartao: this.state.cartao_status[0].id_cartao,
          id_status: 2,
        }),
        method: "POST",
      };

      Funcoes.Geral_API(dados).then((res) => {
        alert("O seu cartão " + process.env.NOME_BANCO + " foi Desbloqueado!");
        this.setState({ loading: false, detalhes: false });
        window.location.href = "/cartoes";
      });
    } else if (id == 2) {
      this.setState({ loading: true, detalhes: false });

      const dados = {
        url: "cartao/unlock-card",
        data: JSON.stringify({
          conta_id: pessoa.conta_id,
          id_cartao: this.state.cartao_status[0].id_cartao,
        }),
        method: "POST",
      };

      Funcoes.Geral_API(dados).then((res) => {
        alert("O seu cartão " + process.env.NOME_BANCO + " foi Bloqueado!");
        this.setState({ loading: false, detalhes: false });
        window.location.href = "/cartoes";
      });
    }
  };

  render() {
    const { checked } = this.state;
    return (
      <>
        <section>
          <BannerTitle
            title={i18n.t("sidebar.cartoes")}
            img={Objetos.cartaoImg}
          />

          {/* Container de escolha */}
          <Container fluid className="mt-4">
            {/* <p className="text-center" style={{ fontSize: '1.65em' }}>Escolha o metodo de Cartao</p> */}

            <Col className="text-center baseWindow">
              {/* Solicitar */}
              <Button
                style={{ marginRight: 10 }}
                onClick={() => this.setState({ solicitar: true })}
                variant="outline-primary"
                className="baseButtonPrimary"
              >
                <Row className="w-80 m-auto">
                  <Col xs={5} className="m-auto px-0">
                    <Iconfa.FaBarcode className="iconCartao" />
                  </Col>
                  <Col xs={7} className="px-0 my-auto">
                    <p className="buttonTitle m-auto">
                      {i18n.t("escolha_cartao.solicitar")}
                    </p>
                  </Col>
                </Row>
              </Button>

              {/* Ativação */}

              <Button
                style={{ marginRight: 10 }}
                onClick={() => this.cartao()}
                variant="outline-primary"
                className="baseButtonPrimary"
              >
                <Row className="w-80 m-auto">
                  <Col xs={5} className="m-auto px-0">
                    <Icon.JournalText className="iconCartao" style={{}} />
                  </Col>
                  <Col xs={7} className="px-0 my-auto">
                    <p className="buttonTitle m-auto">
                      {i18n.t("escolha_cartao.ativar")}
                    </p>
                  </Col>
                </Row>
              </Button>

              {/* Recarga */}

              <Button
                style={{ marginRight: 10 }}
                onClick={() => this.carregar()}
                variant="outline-primary"
                className="baseButtonPrimary"
              >
                <Row className="w-80 m-auto">
                  <Col xs={5} className="m-auto px-0">
                    <Icon.ArrowLeftRight className="iconCartao" style={{}} />
                  </Col>
                  <Col xs={7} className="px-0 my-auto">
                    <p className="buttonTitle m-auto">
                      {i18n.t("escolha_cartao.carregar1")}
                    </p>
                  </Col>
                </Row>
              </Button>

              {/* Troca de senha */}

              <Button
                style={{ marginRight: 10 }}
                onClick={() => {
                  this.senha();
                }}
                variant="outline-primary"
                className="baseButtonPrimary"
              >
                <Row className="w-80 m-auto">
                  <Col xs={5} className="m-auto px-0">
                    <Iconfa.FaRegKeyboard className="iconCartao" style={{}} />
                  </Col>
                  <Col xs={7} className="px-0 my-auto">
                    <p className="buttonTitle m-auto">
                      {i18n.t("escolha_cartao.trocarSenha")}
                    </p>
                  </Col>
                </Row>
              </Button>

              {Produtos.escolha_cartao.detalhes ? (
                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => this.detalhes()}
                  variant="outline-primary"
                  className="baseButtonPrimary"
                >
                  <Row className="w-80 m-auto">
                    <Col xs={5} className="m-auto px-0">
                      <Icon.FileEarmarkArrowUp
                        className="iconCartao"
                        style={{}}
                      />
                    </Col>
                    <Col xs={7} className="px-0 my-auto">
                      <p className="buttonTitle m-auto">
                        {i18n.t("escolha_cartao.detalhes")}
                      </p>
                    </Col>
                  </Row>
                </Button>
              ) : null}
            </Col>
          </Container>

          {/* Modal Solicitação */}
          <Modal
            centered
            animation={true}
            size="lg"
            show={this.state.solicitar}
            onHide={() => (window.location.href = "/cartoes")}
          >
            <Modal.Body>
              <div>
                <Alert style={{ fontSize: "13px" }} variant="secondary">
                  <span>
                    {/* • Todas as vantagens em um só click! */}
                    {i18n.t("escolha_cartao.aquisicao")}
                  </span>
                  <br />
                  <br />
                  <p>
                    {/* Para a aquisição do seu cartão  */}
                    {i18n.t("escolha_cartao.aquisicaoDesc1", {
                      nome_banco: process.env.NOME_BANCO,
                      tarifa: Formatar.formatReal(this.state.tarifa),
                    })}
                    {/* {process.env.NOME_BANCO} */}
                    {/* será cobrado o valor de R$  */}
                    {/* {i18n.t('escolha_cartao.aquisicaoDesc2')} */}
                    {/* {Formatar.formatReal(this.state.tarifa)} */}
                    {/* uma única vez, o qual será debitado em sua conta digital. Para isto basta ter saldo em sua conta. */}
                    {/* {i18n.t('escolha_cartao.aquisicaoDesc3')} */}
                  </p>
                </Alert>
                {/* <h6>Selecione a cor de sua preferência para seu cartão  */}
                <h6>
                  {i18n.t("escolha_cartao.selecao", {
                    nome_banco: process.env.NOME_BANCO,
                  })}
                </h6>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Radio
                      checked={this.state.cartao1}
                      style={{ backgroundColor: "transparent" }}
                      onChange={() => this.corCartao(1)}
                    />
                    &nbsp;&nbsp; {process.env.CARTAO1}
                  </InputGroup.Prepend>
                  &nbsp;&nbsp;&nbsp;
                  {Produtos.escolha_cartao.ativar.cor2 ? (
                    <InputGroup.Prepend>
                      <InputGroup.Radio
                        checked={this.state.cartao2}
                        onChange={() => this.corCartao(2)}
                      />
                      &nbsp;&nbsp; {process.env.CARTAO2}
                    </InputGroup.Prepend>
                  ) : null}
                </InputGroup>
                {/* <Button className="termosCartao" onClick={() => this.termos(1)}>Leia os termos de uso</Button> &nbsp;&nbsp; */}
                <Button className="termosCartao" onClick={() => this.termos(1)}>
                  {i18n.t("escolha_cartao.termos")}
                </Button>{" "}
                &nbsp;&nbsp;
                <Button className="termosCartao" onClick={() => this.termos(2)}>
                  {i18n.t("escolha_cartao.termos")}
                </Button>
                <br />
                <br />
                <Alert
                  variant="info"
                  style={{ backgroundColor: "transparent" }}
                >
                  <InputGroup className="mb-3" style={{ margin: "10px 0" }}>
                    <InputGroup.Prepend>
                      <InputGroup.Checkbox
                        style={{ width: "25px", height: "25px" }}
                        checked={this.state.checked}
                        onChange={() => this.setState({ checked: !checked })}
                      />
                      <p style={{ margin: "auto" }}>
                        Declaro que li e aceito os termos de uso e de
                        privacidade {process.env.NOME_BANCO}
                      </p>
                    </InputGroup.Prepend>
                  </InputGroup>
                </Alert>
                <Button
                  onClick={() => {
                    this.setState({ solicitar: false });
                    window.location.href = "/cartoes";
                  }}
                  className="btn-danger btnCartaoCancelar"
                >
                  Cancelar
                </Button>
                <Button
                  className="btnCartaoSucesso"
                  style={{ float: "right" }}
                  onClick={() => this.solicitar_cartao()}
                >
                  Solicitar
                </Button>
              </div>
            </Modal.Body>
          </Modal>
          {/* Modal Ativação */}
          <Modal
            centered
            animation={true}
            size="lg"
            show={this.state.ativar}
            onHide={() => (window.location.href = "/cartoes")}
          >
            <Modal.Body>
              <Alert variant="secondary">
                <h6>
                  {/* Para ativar seu cartão  */}
                  {i18n.t("escolha_cartao.confirme", {
                    nome_banco: process.env.NOME_BANCO,
                  })}
                  {/* {process.env.NOME_BANCO} */}
                  {/* confirme alguns dados: */}
                  {/* {i18n.t('escolha_cartao.confirme2')} */}
                </h6>
                <hr />
                <span>
                  {/* Nome:  */}
                  {i18n.t("escolha_cartao.nome")}
                  {this.state.pessoa.razao_social}
                </span>{" "}
                <br />
                <span>
                  {this.state.texto} {this.state.doc}
                </span>{" "}
                <br />
                <span>
                  {/* Telefone:  */}
                  {i18n.t("escolha_cartao.telefone")}
                  {this.state.pessoa.celular}
                </span>
              </Alert>

              <p className="textDescr">
                <Icon.InfoCircle />
                <i>
                  {/* Caso os dados estejam incorretos, entre em contato com o suporte  */}
                  {i18n.t("escolha_cartao.textoDescricao", {
                    nome_banco: process.env.NOME_BANCO,
                    email_banco: process.env.EMAIL_BANCO,
                  })}
                  {/* {process.env.NOME_BANCO} */}
                  {/* no  */}
                  {/* {i18n.t('escolha_cartao.textoDescricao2')} */}
                  {/* {process.env.EMAIL_BANCO} */}
                </i>
              </p>
              <hr />
              {this.state.cadastro_ativo ? (
                <div>
                  <br />
                  <Button
                    onClick={() => {
                      this.setState({ ativar: false });
                      window.location.href = "/cartoes";
                    }}
                    className="btn-danger btnCartaoCancelar"
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="btnCartaoSucesso"
                    onClick={
                      () =>
                        this.CodigoValidacao_ciacard() /* this.setState({ cadastro_ativo: false, confirma_sms: true }) */
                    }
                    style={{ float: "right" }}
                  >
                    Continuar
                  </Button>
                </div>
              ) : null}

              {this.state.confirma_sms ? (
                <div>
                  <h6>
                    {/* Digite o código de ativação do Token, enviado via SMS para o seu celular */}
                    {i18n.t("escolha_cartao.token")}
                  </h6>

                  <input
                    ref={(input) => {
                      this.sms = input;
                    }}
                    type="text"
                    value={this.state.sms}
                    onChange={(e) => this.setState({ sms: e.target.value })}
                  />
                  <br />
                  <br />
                  <Button
                    onClick={() => {
                      this.setState({ ativar: false });
                      window.location.href = "/cartoes";
                    }}
                    className="btn-danger btnCartaoCancelar"
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="btnCartaoSucesso"
                    onClick={
                      () =>
                        this.validaCodigoCiacard() /* this.setState({ confirma_sms: false, confirmar_id_cartao: true }) */
                    }
                    style={{ float: "right" }}
                  >
                    Continuar
                  </Button>
                </div>
              ) : null}

              {this.state.confirmar_id_cartao ? (
                <div>
                  <h6>{i18n.t("escolha_cartao.instrucao")}</h6>
                  <input
                    type="text"
                    value={this.state.id_cartao}
                    onChange={(e) =>
                      this.setState({ id_cartao: e.target.value })
                    }
                    style={{ width: "100%" }}
                    ref={(input) => {
                      this.id_cartao = input;
                    }}
                  />
                  <br />
                  <br />
                  <Button
                    onClick={() => {
                      this.setState({ ativar: false });
                      window.location.href = "/cartoes";
                    }}
                    className="btn-danger btnCartaoCancelar"
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="btnCartaoSucesso"
                    onClick={
                      () =>
                        this.desbloqueio_cartao_ciacard() /* this.setState({ confirmar_id_cartao: false, confirma_id_cartao_pj: true }) */
                    }
                    style={{ float: "right" }}
                  >
                    Continuar
                  </Button>
                </div>
              ) : null}

              {this.state.confirma_id_cartao_pj ? (
                <div>
                  <h6>
                    {/* Digite os 4 últimos digitos de seu cartão  */}
                    {i18n.t("escolha_cartao.digite", {
                      nome_banco: process.env.NOME_BANCO,
                    })}
                    {/* {process.env.NOME_BANCO} */}
                  </h6>
                  <input
                    type="text"
                    value={this.state.id_cartao}
                    onChange={(e) =>
                      this.setState({ id_cartao: e.target.value })
                    }
                    ref={(input) => {
                      this.id_cartao = input;
                    }}
                  />
                  <br />
                  <br />
                  <Button
                    onClick={() => {
                      this.setState({ ativar: false });
                      window.location.href = "/cartoes";
                    }}
                    className="btn-danger btnCartaoCancelar"
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="btnCartaoSucesso"
                    onClick={
                      () =>
                        this.desbloqueio_cartao_ciacard() /*  this.setState({ confirma_id_cartao_pj: false, gerar_senha: true }) */
                    }
                    style={{ float: "right" }}
                  >
                    Continuar
                  </Button>
                </div>
              ) : null}

              {this.state.gerar_senha ? (
                <div>
                  <h6>
                    {/* Crie uma senha de acesso de 4 dígitos para seu cartão  */}
                    {i18n.t("escolha_cartao.crieSenha", {
                      nome_banco: process.env.NOME_BANCO,
                    })}
                    {/* {process.env.NOME_BANCO} */}
                  </h6>
                  <input
                    type="password"
                    maxLength={4}
                    value={this.state.senha}
                    onChange={(e) => this.setState({ senha: e.target.value })}
                    ref={(input) => {
                      this.senha = input;
                    }}
                  />{" "}
                  <br />
                  <br />
                  <input
                    type="password"
                    maxLength={4}
                    value={this.state.confirmar_senha}
                    onChange={(e) =>
                      this.setState({ confirmar_senha: e.target.value })
                    }
                    ref={(input) => {
                      this.confirmar_senha = input;
                    }}
                  />
                  <br />
                  <br />
                  <Button
                    onClick={() => {
                      this.setState({ ativar: false });
                      window.location.href = "/cartoes";
                    }}
                    className="btn-danger btnCartaoCancelar"
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="btnCartaoSucesso"
                    onClick={
                      () =>
                        this.gerar_senha_cartao() /* this.setState({ gerar_senha: false, desbloqueio_efetuado: true }) */
                    }
                    style={{ float: "right" }}
                  >
                    Continuar
                  </Button>
                </div>
              ) : null}

              {this.state.desbloqueio_efetuado ? (
                <div>
                  <h6>
                    {/* Parabéns! Seu cartão  */}
                    {i18n.t("escolha_cartao.desbloqueio", {
                      nome_banco: process.env.NOME_BANCO,
                    })}
                    {/* {process.env.NOME_BANCO} */}
                    {/* foi desbloqueado com sucesso. Aproveite!! */}
                    {/* {i18n.t('escolha_cartao.desbloqueio2')} */}
                  </h6>
                  <Button
                    className="btnCartaoSucesso"
                    onClick={() => {
                      this.setState({ ativar: false });
                      window.location.href = "/cartoes";
                    }}
                    style={{ float: "right" }}
                    variant="success"
                  >
                    Concluir
                  </Button>
                </div>
              ) : null}
            </Modal.Body>
          </Modal>
          {/* Modal Recarga */}
          <Modal
            centered
            animation={true}
            size="lg"
            show={this.state.carregar}
            onHide={() => (window.location.href = "/cartoes")}
          >
            <Modal.Body>
              <div>
                <h5>
                  {/* Como Deseja carregar seu cartão? */}
                  {i18n.t("escolha_cartao.carregar")}
                </h5>
                <hr />
                <Container>
                  <Row className="justify-content-center">
                    <Button
                      className="btn btnCartaoRecarga btn-primary col-5 mt-12 text-center "
                      style={{ justifyContent: "center" }}
                      size="lg"
                      variant="success"
                      onClick={() =>
                        this.setState({
                          boleto_recarga: true,
                          transf_recarga: false,
                        })
                      }
                    >
                      Boleto
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      style={{ justifyContent: "center" }}
                      size="lg"
                      className="btn btnCartaoRecarga btn-primary col-5 mt-12 text-center "
                      variant="success"
                      onClick={() => {
                        this.setState({
                          mostrar_valor: false,
                          transf_recarga: true,
                          boleto_recarga: false,
                        });
                      }}
                    >
                      {/* Transferencia */}
                      {i18n.t("escolha_cartao.transferencia")}
                    </Button>
                  </Row>
                </Container>

                {this.state.boleto_recarga ? (
                  <div>
                    <hr />
                    <h5>
                      {/* Gere um boleto para recarregar seu cartão */}
                      {i18n.t("escolha_cartao.boleto")}
                    </h5>
                    {/* <span>Valor do Boleto</span> */}
                    <span>{i18n.t("escolha_cartao.valorBoleto")}</span>
                    <CurrencyInput
                      className="form-control"
                      thousandSeparator="."
                      precision={0}
                      value={this.state.advanced}
                      onChange={(valor) => this.setState({ advanced: valor })}
                    />
                    {/* <label>Vencimento</label> */}
                    <label>{i18n.t("escolha_cartao.vencimento")}</label>
                    <br></br>
                    <DatePicker
                      className="form-control"
                      locale="pt-BR"
                      selected={this.state.dataVecimento}
                      popperPlacement="down"
                      dateFormat="dd/MM/yyyy"
                      required
                      onChange={(dataVecimento) =>
                        this.setState({ dataVecimento })
                      }
                      minDate={addDays(new Date(), 0)}
                    />
                    <br />
                    <br />
                    <Button
                      onClick={() => {
                        this.setState({ carregar: false });
                        window.location.href = "/cartoes";
                      }}
                      className="btn-danger btnCartaoCancelar"
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="btnCartaoSucesso"
                      style={{ float: "right" }}
                      type="button"
                      onClick={() => this.gerar_boleto()}
                    >
                      Gerar Boleto
                    </Button>
                  </div>
                ) : null}
                {this.state.transf_recarga ? (
                  <div>
                    <hr />
                    {/* <h5>Transferência rápida entre cartões.</h5> */}
                    <h5>{i18n.t("escolha_cartao.transferenciaRapida")}</h5>

                    <span>
                      {/* Digite o código identificador do seu cartão, ele fica logo abaixo da data de validade. */}
                      {i18n.t("escolha_cartao.codigo")}
                    </span>
                    <br />
                    <br />
                    <input
                      type="text"
                      value={this.state.id_cartaoTransf}
                      onChange={(e) => {
                        this.setState({ id_cartaoTransf: e.target.value });
                      }}
                      ref={(input) => {
                        this.id_cartaoTransf = input;
                      }}
                    />

                    <Button
                      className="btn  btn-sm btn-success"
                      style={{ marginLeft: 10, marginTop: "-5px" }}
                      onClick={() =>
                        this.transf_cartao(this.state.id_cartaoTransf)
                      }
                    >
                      Pesquisar
                    </Button>
                    <br />
                    <br />

                    {this.state.cancelar_buscar ? (
                      <div>
                        <Button
                          onClick={() => {
                            this.setState({ carregar: false });
                            window.location.href = "/cartoes";
                          }}
                          className="btn-danger btnCartaoCancelar"
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : null}

                    {this.state.mostrar_valor ? (
                      <div>
                        <hr />
                        <h5>
                          {/* Quanto deseja transferir para  */}
                          {i18n.t("escolha_cartao.mostrarValor")}
                          {this.state.nome_cartao}?
                        </h5>
                        {/* <span>Valor R$</span> */}
                        <span>{i18n.t("escolha_cartao.valor")}</span>
                        <br />
                        <CurrencyInput
                          className="form-control"
                          thousandSeparator="."
                          precision={0}
                          value={this.state.advanced}
                          onChange={(valor) =>
                            this.setState({ advanced: valor })
                          }
                        />
                        <br />
                        {/* <span>Senha</span> */}
                        <span>i18n.t('escolha_cartao.senha')</span>
                        <br />
                        <OtpInput
                          isInputSecure={true}
                          focusInput={1}
                          isInputNum={true}
                          value={this.state.password}
                          onChange={(value) => {
                            this.setState({ password: value });
                          }}
                          numInputs={6}
                          className="tokenValidacao"
                        />
                        <Button
                          onClick={() => {
                            this.setState({ carregar: false });
                            window.location.href = "/cartoes";
                          }}
                          className="btn-danger btnCartaoCancelar"
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="btnCartaoSucesso"
                          style={{ float: "right" }}
                          variant="success"
                          onClick={() => this.gerar_pagamennto()}
                        >
                          Recarga
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Modal.Body>
          </Modal>

          {this.state.loading ? (
            <Modal
              centered
              animation={true}
              size="lg"
              show={this.state.loading}
            >
              <Modal.Body>
                <ReactLoading
                  className="loadingPagar"
                  type={"bubbles"}
                  color={"#000"}
                  height={"15%"}
                  width={"15%"}
                />
              </Modal.Body>
            </Modal>
          ) : (
            <Modal
              centered
              animation={true}
              size="lg"
              show={
                this.state.modal_boleto
              } /* onHide={() => window.location.href = '/cartoes'} */
            >
              <Modal.Body>
                <div>
                  {/* <h4>Boleto gerado com sucesso!</h4> */}
                  <h4>i18n.t('escolha_cartao.boletoGerado')</h4>
                  <hr />
                  <span>Dados:</span>
                  <br />
                  {/* <h6>Pagador</h6> */}
                  <h6>i18n.t('escolha_cartao.pagador')</h6>
                  <h5>{global.boleto.sacado_nome}</h5>
                  {/* <h6>Nosso número</h6> */}
                  <h6>i18n.t('escolha_cartao.nossoNumero')</h6>
                  <h5>{global.boleto.nosso_numero}</h5>
                  {/* <h6>Emissão</h6> */}
                  <h6>i18n.t('escolha_cartao.emissao')</h6>
                  <h5>{global.boleto.data_emissao}</h5>
                  {/* <h6>Validade</h6> */}
                  <h6>i18n.t('escolha_cartao.validade')</h6>
                  <h5>{global.boleto.data_vencimento}</h5>
                  {/* <h6>Valor R$</h6> */}
                  <h6>i18n.t('escolha_cartao.valor')</h6>
                  <h5>{global.boleto.valor}</h5>
                  <hr />
                  {/* <h6>Código de barras</h6> */}
                  <h6>i18n.t('escolha_cartao.codigoBarras')</h6>
                  <h5>{global.boleto.linha_digitavel}</h5>

                  <br />

                  <Button
                    onClick={() => {
                      this.setState({ modal_boleto: false });
                      window.location.href = "/cartoes";
                    }}
                    className="btn-danger btnCartaoCancelar"
                  >
                    Cancelar
                  </Button>
                  <Button
                    style={{ float: "right" }}
                    className="btnCartaoSucesso"
                    varriant="success"
                    onClick={() =>
                      this.gerar_pdf_boleto({
                        id: global.boleto.id_boleto_ciacard,
                        idConta: global.boleto.idConta,
                      })
                    }
                  >
                    Download PDF
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          )}

          {/* Modal Trocar a senha */}
          <Modal
            centered
            animation={true}
            size="lg"
            show={this.state.trocarSenha}
            onHide={() => (window.location.href = "/cartoes")}
          >
            <Modal.Body>
              <h4>
                Para alterar a senha de acesso ao seu cartão{" "}
                {process.env.NOME_BANCO}, digite a nova senha e confirme.
              </h4>{" "}
              <hr />
              <span>Nova Senha</span> <br />
              <OtpInput
                isInputSecure={true}
                focusInput={1}
                isInputNum={true}
                value={this.state.nova_senha}
                onChange={(value) => {
                  this.setState({ nova_senha: value });
                }}
                numInputs={4}
                className="tokenValidacao"
              />
              {/* <input type='password' maxLength={4} value={this.state.nova_senha} onChange={(e) => this.setState({ nova_senha: e.target.value })} ref={(input) => { this.nova_senha = input; }} /> <br /> */}
              <span>Confirmar Nova Senha</span> <br />
              <OtpInput
                isInputSecure={true}
                focusInput={1}
                isInputNum={true}
                value={this.state.confirma_nova_senha}
                onChange={(value) => {
                  this.setState({ confirma_nova_senha: value });
                }}
                numInputs={4}
                className="tokenValidacao"
              />
              {/* <input type='password' maxLength={4} value={this.state.confirma_nova_senha} onChange={(e) => this.setState({ confirma_nova_senha: e.target.value })} ref={(input) => { this.confirma_nova_senha = input; }} /><br /><br /> */}
              <Button
                onClick={() => {
                  this.setState({ trocarSenha: false });
                  window.location.href = "/cartoes";
                }}
                className="btn-danger btnCartaoCancelar"
              >
                Cancelar
              </Button>
              <Button
                className="btnCartaoSucesso"
                style={{ float: "right" }}
                type="button"
                onClick={() => this.alterar_senha()}
              >
                Trocar senha
              </Button>
            </Modal.Body>
          </Modal>

          {/* Modal Detalhes */}
          <Modal
            centered
            animation={true}
            size="lg"
            show={
              this.state.detalhes
            } /* onHide={() => window.location.href = '/cartoes'} */
          >
            <Modal.Body>
              <h3>
                {/* Aqui você consegue bloquear ou desbloquear seu cartão {process.env.NOME_BANCO} */}
                {i18n.t("escolha_cartao.bloquear", {
                  nome_banco: process.env.NOME_BANCO,
                })}
              </h3>
              <hr />
              <br />
              {/* <h4>Cartão: <u>{this.state.detalhes_numero_cartao}</u></h4> */}
              <h4>
                {i18n.t("escolha_cartao.cartao")}
                <u>{this.state.detalhes_numero_cartao}</u>
              </h4>
              {/* <h4>ID: <u>{this.state.detalhes_id_cartao_numero}</u></h4> */}
              <h4>
                {i18n.t("escolha_cartao.id")}
                <u>{this.state.detalhes_id_cartao_numero}</u>
              </h4>
              {/* <h4>Status: <u>{this.state.detalhes_cartao_status}</u> &nbsp; {this.state.cadeado}</h4> */}
              <h4>
                {i18n.t("escolha_cartao.status")}
                <u>{this.state.detalhes_cartao_status}</u> &nbsp;{" "}
                {this.state.cadeado}
              </h4>
              <br />
              <hr />

              <Button
                onClick={() => {
                  this.setState({ detalhes: false });
                  window.location.href = "/cartoes";
                }}
                className="btn-danger btnCartaoCancelar"
              >
                Cancelar
              </Button>
              <Button
                className="btnCartaoSucesso"
                style={{ float: "right" }}
                type="button"
                onClick={() =>
                  this.desbloquear_bloquear_cartao(this.state.cartao_id_status)
                }
              >
                {this.state.operacao}
              </Button>
            </Modal.Body>
          </Modal>

          <Modal centered animation={true} size="lg" show={this.state.loading}>
            <Modal.Body>
              <ReactLoading
                className="loadingPagar"
                type={"bubbles"}
                color={"#000"}
                height={"15%"}
                width={"15%"}
              />
            </Modal.Body>
          </Modal>
        </section>
      </>
    );
  }
}
