import {api, dh} from '../services/api';
import CryptoJS from 'crypto-js';
import {decode, encode} from 'base-64'

const tokenKey = 'super_chave_secreta';
const this_version = '1.0';

export function setToken(data, pfp) {
  const crypto = CryptoJS.AES.encrypt(data, tokenKey).toString();
  localStorage.setItem('info', crypto);
  localStorage.setItem('pfp', pfp);
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
    var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
    return cipherParams;
  }
};

export const encryptKey = async () => {
  const num_cadastrado = localStorage.getItem('num');
  const key = await dateServer();
  return encode(CryptoJS.AES.encrypt(num_cadastrado, key, { format: CryptoJSAesJson }).toString());
}

export async function Geral_API(dados, logado) {
  //Checando versão do web
  let version = localStorage.getItem('ver');
  if (version !== this_version) {
    localStorage.clear();
    alert('Nova versão encontrada. Recarregando site...')
    window.location.href = '/';
  }
  localStorage.setItem('ver', this_version);
  //

  let num_aparelho = localStorage.getItem('num');

  if (num_aparelho == "" || num_aparelho == null || num_aparelho == undefined) {
    const chave_nova = Math.random().toString();
    localStorage.setItem('num', chave_nova);
  }

  const num_cadastrado = localStorage.getItem('num');
  const key = await dateServer();
  // const criptografar = CryptoJS.AES.encrypt(num_cadastrado, key).toString();
  const criptografar = await encryptKey();

  var headers = {
    'Accept': 'application/json',
    'Content-type': 'application/json',
    'token2f': criptografar,
  };

  const info = getToken();

  if (logado) {
    onAction();
    headers['token'] = info.token_api;
    headers['contaid'] = info.conta_id;
    headers['chave'] = info.chave;
  };

  const data = dados.data;
  
  const url = dados.url.startsWith('/') ? dados.url.slice(1) : dados.url;
  
  let apiFunc = {};

  switch (dados.method) {
    case "POST": apiFunc = api.post(url, data, { headers }); break;
    case "GET": apiFunc = api.get(url, { headers }); break;
    case "PDF": apiFunc = api.post(url, data, { headers, responseType: 'blob' }); break;
    default: alert('Erro de API');
  }

  const [err, result] = await callbackWrapper(apiFunc);
  if (err) {
    // console.log("Erro: ", err);
    alert('Processamento Invalido, Contate seu Gerente!');
    // this.logout();
  } else {
    return result.data;
  }
};

function getToken() {
  let pessoa = {};
  let dados = localStorage.getItem('info');
  if (dados != null && dados != '' && dados != undefined) {
    pessoa = JSON.parse(CryptoJS.AES.decrypt(dados, tokenKey).toString(CryptoJS.enc.Utf8));
    pessoa.image_home = localStorage.getItem('pfp');
  }
  return pessoa;
}

function callbackWrapper(promise) {
  return promise
    .then(result => [null, result])
    .catch(err => [err]);
}

async function dateServer() {
  const headers = {
    'Accept': 'application/json',
    'Content-type': 'application/json'
  };

  const response = await dh.get('dh', { headers })
    .then(res => {
      res = (res.data.substr(0,16)).replace('T', ' ');
      return res;
    })
    .catch(err => {
      return err;
    });
  return response;
};

function setTime() {
  const crypto = CryptoJS.AES.encrypt((new Date()).toString(), tokenKey).toString();
  localStorage.setItem('dt', crypto);
}

function onAction() {
  const encryptedDate = localStorage.getItem('dt');
  if (encryptedDate) {
    const date = CryptoJS.AES.decrypt(encryptedDate, tokenKey).toString(CryptoJS.enc.Utf8);
    var hora_acao = new Date();
    var hora_anterior = new Date(date);

    var hora_ini = Date.parse(hora_acao);
    var hora_ant = Date.parse(hora_anterior);

    var minutos = hora_ini - hora_ant;

    if (minutos > 3600000) {
    // if (minutos > 50000) {
      alert('Sua sessão expirou! Por favor logue novamente.');
      logout();
    }
  }
  setTime();
};

export function logout() {
  localStorage.removeItem("info");
  localStorage.removeItem("pfp");
  localStorage.removeItem("num");
  localStorage.removeItem("hora_anterior");
  localStorage.removeItem("dt");
  if (window.location.pathname != '/') window.location.href = '/';
};










// FUNÇÕES QUE AINDA SERÃO EXCLUÍDAS

export async function tarifas(dados) {
    const data = { 'conta_id': pessoa.conta_id, 'chave': 'transferencia', 'valor': dados };
    const response = await api.post('tarifa/consulta', data, { headers },);
    return response.data;
};

export async function Valida_senha(dados) {
    const data = dados;
    const response = await api.post('usuario/login', data, { headers },);
    return response.data;
};

export async function ComprovantePDFCartao(dados) {
    const data = { 'conta_id': pessoa.conta_id, 'fav': dados.fav, 'data': dados.data, 'valor': dados.valor };
    const response = await api.post('cartao/comprovante-pdf', data, { headers, responseType: 'blob' },);
    return response.data;
};


export async function ConsultaCartao() {
    const data = { 'conta_id': pessoa.conta_id };
    const response = await api.post('cartao/consultar', data, { headers },);
    return response.data;
};

export async function comprovanteCartao(dados) {
    const data = { 'conta_id': pessoa.conta_id, "data_de": dados.data_de, "data_ate": dados.data_ate }
    const response = await api.post('cartao/transacoes', data, { headers },);
    return response.data;
};

export async function novoCartao(dados) {
    const data = { 'conta_id': pessoa.conta_id, 'corCartao': dados.corCartao, 'valorCartao': dados.valorCartao };
    const response = await api.post('pedido-cartao/novo', data, { headers });
    return response.data;
};

export async function validacaoCiaCard(dados) {
    const data = dados;
    const response = await api.post('cartao/codigo-validacao', data, { headers },);
    return response.data;
};

export async function validaCodigoCia(dados) {
    const data = dados;
    const response = await api.post('cartao/valida-codigo', data, { headers },);
    return response.data;
};

export async function gerarSenhaCiacard() {
    const data = { 'contaid': pessoa.conta_id }
    const response = await api.post('cartao/gerar-senha-e-login-v2', data, { headers });
    return response.data;
};

export async function desbloquearCartao(dados) {
    const data = { 'conta_id': pessoa.conta_id, 'id_cartao': dados.id_cartao };
    const response = await api.post('cartao/unlock-card', data, { headers },);

    return response.data;
};

export async function gerarSenhaCartao(dados) {
    const data = dados;
    const response = await api.post('cartao/pass-card', data, { headers },);
    return response.data;
};

export async function cartaoDesbloqueio() {
    const data = { 'conta_id': pessoa.conta_id };
    const response = await api.post('cartao/desbloqueio', data, { headers });
    return response.data;
};

export async function boletoCartao(dados) {
    const data = { 'conta_id': pessoa.conta_id, 'valor': dados.valor, 'data': dados.data };
    const response = await api.post('cartao/gerar-boleto', data, { headers },);
    return response.data;
};

export async function pdfCartao(dados) {
    const data = dados;
    const response = await api.post('cartao/pdf-boleto', data, { headers });
    return response.data;
};

export async function cartao2p2(dados) {
    const data = dados;
    const response = await api.post('cartao/cartao', data, { headers });
    return response.data;
};

export async function cartaoTransfEnviar(dados) {
    const data = dados
    const response = await api.post('cartao/transfer-account', data, { headers });
    return response.data;
};

export async function cartaoTrocarSenha(dados) {
    const data = { 'conta_id': pessoa.conta_id, 'senha': dados };
    const response = await api.post('cartao/trocar-senha', data, { headers });
    return response.data;
};

export async function cartao_dados() {
    const data = { 'conta_id': pessoa.conta_id };
    const response = await api.post('cartao/dados-conta', data, { headers });
    return response.data;
};

export async function bloquear(dados) {
    const data = dados;
    const response = await api.post('cartao/bloqueio-cartao', data, { headers });
    return response.data;
};

export async function desbloquear(dados) {
    const data = { 'conta_id': pessoa.conta_id, 'id_cartao': dados };
    const response = await api.post('cartao/unlock-card', data, { headers });
    return response.data;
};