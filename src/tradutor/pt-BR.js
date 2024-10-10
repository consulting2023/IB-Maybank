// pt-BR.js
export default {
  langInfo: {
    key: 0,
    titulo: 'Português',
    pais: 'Brasil',
    sigla: 'ptBR',
    bandeira: require('../assets/paises/brasil2.png').default,
  },

  login: {
    acesse_sua_conta: 'ACESSE SUA CONTA\n%{banco}',
    info_credenciais: 'Dígite as credenciais de sua conta para acessá-la',
    email: 'email',
    senha: 'senha',
    ou: ' ou ',
    entrar: 'ENTRAR',
    conheca_produtos: 'Conheça os Nossos Produtos!',
    ola: 'Olá, %{nomeUsuario}',
    como_deseja_logar: 'Selecione abaixo a conta que deseja logar',
    pessoa_fisica: 'Pessoa Física',
    pessoa_juridica: 'Pessoa Jurídica',
    chave_de_acesso: 'Chave de Acesso',
    abra_o_aplicativo: 'Abra o aplicativo %{banco}, logue com sua Conta e no botão de Chave de Acesso no seu Aplicativo você encontrará o Token para validar a Chave de Acesso para entrar no Internet Banking.',
    token: 'Token',
    chave_token: 'Digite o Token gerado pela sua Chave de Acesso em seu App.',
    qrcode: 'QRCode',
    ler_qrcode: 'Escaneie o QRCode gerado pela sua Chave de Acesso.',
    texto_1: 'Um banco transparente, completo e com a sua cara, com produtos exclusivos.',
    texto_2: 'Sua vida financeira mais facil',
    texto_3: '  Facilidade de resolver tudo pelo aplicativo, e com um atendimento 24h que realmente te ajuda',

    preencha: 'Preencha todos os campos!',
    senhaExpirou: 'Sua senha expirou! Troque de Senha para gerar uma nova',
    senhaIncorreta: 'Email ou senha está incorreto, tente novamente',
  },

  home: {
    saldoDigital: 'Conta Digital',
    saldoCartao: 'Cartão',
    saldoConvenio: 'Convênio',
    saldoInvestimento: 'Investimento',
    acoesRapida: 'Ações Rápidas',
    btnAcoesRapida1: 'Depósito',
    btnAcoesRapida2: 'Transferência',
    btnAcoesRapida3: 'Pagamento',
    btnAcoesRapida4: 'Extrato',
    ultLancamentos: 'Últimos Lançamentos Conta Digital',
    descr: 'Descrição',
    descrValor: 'Valor R$',
    descrData: 'Data',
    descrNome: '%{descricao}',
    verMais: 'Ver Mais'
  },

  extrato: {
    alertaCartao: 'Você não tem um cartão ativo.',
    btnExtratoDigital: 'Conta Digital',
    btnExtratoCartao: 'Cartão',
    btnExtratoConvenio: 'Convênio',
    btnExtratoInvestimento: 'Investimento',
    btnExtratoParcelado: 'Pagamento Parcelado',
    btnExtratoAgenda: 'Agenda Financeira',
    modalCartaoAtivo: 'Você não tem um cartão ativo.',
    fecharModal: 'Fechar',
    breadCrumb1: 'Home',
    breadCrumb2: 'Extrato',
    breadCrumb3: 'Extrato da Conta',
    textoEscolhaExtrato: 'Escolha o período que deseja ver seu extrato:',
    dataInicio: 'Data Inicial:',
    dataFinal: 'Data Final:',
    btnPesquisar: 'Pesquisar',
    downloadPdf: 'Download Extrato PDF',
    downloadCsv: 'Download Extrato CSV',
    descr: 'Descrição',
    descrValor: 'Valor R$',
    descrData: 'Data',
    descrNome: '%{descricao}',

    nenhumEncontrado: 'Não foi encontrado nenhuma movimentação na data selecionada',
    extrato: 'Extrato',
    nenhumLancamento: 'Nenhum lançamento encontrado',
    // nenhumaMovimentacao: 'Não foi encontrado nenhuma movimentação na data selecionada'
  },

  deposito: {
    btnDepositoBoleto: 'Depósito por Boleto',
    btnDepositoGerenciar: 'Boletos de Depósito',
    btnDepositoTED: 'Depósito TED/DOC',
    btnDepositoComprovante: 'Enviar Comprovante',
    breadCrumb1: 'Home',
    breadCrumb2: 'Deposito',
    breadCrumb3: 'Gerenciar Boletos de Depósito',
    textoEscolhaDeposito: 'Escolha o período que deseja visualizar seus boletos',
    dataInicio: 'Data Inicial:',
    dataFinal: 'Data Final:',
    btnPesquisar: 'Pesquisar',
    btnVoltar: 'Voltar',
    descr: 'Nome Sacado',
    descrNumero: 'Nosso Número',
    descrValor: 'Valor R$',
    descrVencimento: 'Vencimento',
    descrStatus: 'Status',
    downloadPdf: 'Download PDF',
    textBoleto: 'Receba valores de forma simples.',
    dataVencimento: 'Data de Vencimento',
    gerarBoleto: 'Gerar Boleto',
    fecharBoleto: 'Fechar',
    textTED: 'Você só precisa usar os dados abaixo para mandar dinheiro pra sua conta digital ',
    alertTED: 'Só preste bastante atenção em uma dica:\n Coloque no campo "DESCRIÇÃO" de seu DOC ou TED\n o seu CPF/CNPJ ou sua conta digital no ',
    textComp: 'Caso já tenha feito seu Depósito, por favor nos envie seu comprovante',
    eschComp: 'Escolha um Comprovante',
    enviarComp: 'Enviar Comprovante',

    nenhumBoleto: 'Não foi encontrado nenhum boleto na data selecionada',
    boletoGerado: 'Boleto gerado com sucesso, Gerenciar Boletos',
    erroGerar: 'Erro ao gerar boleto, tente novamente mais tarde',
    pago: 'Pago',
    emAberto: 'Em Aberto',
    vencido: 'Vencido',
    formatoInvalido: 'Formato de arquivo inválido',
    falhaComprovante: 'Falha ao enviar comprovante',
    upload: 'Para fazer upload é necessário selecionar um arquivo',
    comprovanteEnviado: 'Comprovante Enviado com sucesso',
    falhaComprovanteTente: 'Falha ao enviar comprovante, tente novamente mais tarde',
    deposito: 'Depósito'
  },

  comprovante: {
    compDigital: 'Conta Digital',
    compCartao: 'Conta Cartão',
    compConvenio: 'Conta Convênio',
    compServicos: 'Serviços',
    compParcelado: 'Pagamento Parcelado',
    compInvestimento: 'Investimento',
    breadCrumb1: 'Home',
    breadCrumb2: 'Comprovantes',
    breadCrumb3: 'Comprovantes da Conta',
    textEscolhaComprovante: 'Escolha o período que deseja ver seus comprovantes:',
    dataInicio: 'De:',
    dataFinal: 'Ate:',
    btnPesquisar: 'Pesquisar',
    valor: 'Valor: ',
    data: 'Data: ',
    downPDf: 'Download PDF',

    nenhumComprovante: 'Não foram encontrados comprovantes para o período solicitado.',
    nenhumCartao: 'Você não tem um cartão ativo.',
    comprovantes: 'Comprovantes',
  },

  cobranca: {
    btnBoletoCobranca: 'Boleto de Cobrança',
    btnLoteCobranca: 'Múltiplos Boletos de Cobrança',
    btnPagadorCobranca: 'Cadastrar Pagador',
    btnGerarBoletoCobranca: 'Gerar Boleto',
    btnGerenciarBoletoCobranca: 'Gerenciar Boletos',
    btnGerarLoteCobranca: 'Gerar Múltiplos Boletos',
    btnGerenciarLoteCobranca: 'Gerenciar Múltiplos Boletos',
    btnCadastrarPagadorCobranca: 'Cadastrar Pagador',
    btnGerenciarPagadorCobranca: 'Gerenciar Pagadores',
    textGerarBoleto: 'Preencha os dados abaixo para Gerar seu Boleto de Cobrança',
    valorBoleto: 'Valor R$ *',
    vencimentoBoleto: 'Vencimento',
    multaBoleto: 'Multa em Reais',
    jurosBoleto: 'Juros Por Dia Em Reais',
    descontoBoleto: 'Desconto Em Reais',
    abatimentoBoleto: 'Abatimento Em Reais',
    pagadorBoleto: 'Pagador *',
    notaBoleto: 'Nota Fiscal ou Nº do Doc.',
    descBoleto: 'Descrição',
    gerarBoleto: 'Gerar Boleto',
    downBoleto: 'Download PDF',
    textGerenciarBoleto: 'Escolha  o período de datas que deseja ver:',
    dataInicialBoleto: 'Data Inicial:',
    dataFinalBoleto: 'Data Final:',
    todosBoleto: 'Todos',
    pagoBoleto: 'Pago',
    abertoBoleto: 'Em Aberto',
    vencidoBoleto: 'Vencido',
    sacadoBoleto: 'Sacado:',
    statusBoleto: 'Status:',
    dataVencimentoBoleto: 'Vencimento:',
    valorGerenciarBoleto: 'Valor R$:',
    textLote: 'Envie o Arquivo CSV parar Gerar Múltiplos Boletos',
    arqLote: 'Arquivo CSV',
    escolherArqLote: 'Escolha um arquivo .CSV',
    verificarLote: 'Verificar',
    exemploLote: 'Download Exemplo .CSV',
    textGerenciarLote: 'Selecione o Lote de Boleto para Gerenciar',
    nomeArqLote: 'Nome do arquivo: ',
    dataLote: 'Data: ',
    qtdRegistroLote: 'Qtde de Registros: ',
    registradosLote: 'Registrados: ',
    errosLote: 'Erros: ',
    erroLinhaLote: 'Erro na linha: ',
    msgErroLote: 'Msg: ',
    sacadoLote: 'Sacado: ',
    statusLote: 'Status: ',
    vencimentoLote: 'Vencimento: ',
    valorLote: 'Valor: ',
    dwnPDFLote: 'Download PDF',
    textEditarSacado: 'Editar Dados do Pagador',
    pagadorSacado: 'Pagador',
    nomeSacado: 'CPF/CNPJ',
    documentoSacado: 'CPF/CNPJ',
    cepSacado: 'CEP',
    pesquisarCepSacado: 'Pesquisar CEP',
    enderecoSacado: 'Endereço',
    numeroSacado: 'Numero',
    complementoSacado: 'Complemento',
    ufSacado: 'UF',
    municipioSacado: 'Município',
    bairroSacado: 'Bairro',
    btnSacado: 'Atualizar',
    textCadastrarPagador: 'Preencha os dados para Cadastrar um Pagador',
    btnPagador: 'Cadastrar',

    digiteNome: 'Digite o nome',
    digiteDoc: 'Digite o documento',
    digiteLog: 'Digite o logradouro',
    digiteNumero: 'Digite o numero',
    digiteBairro: 'Digite o bairro',
    digiteCEP: 'Digite o CEP',
    digiteMunicipio: 'Digite o municipio',
    digiteEstado: 'Digite o estado',
    falhaCadastro: 'Falha ao realizar cadastro, tente novamente mais tarde',
    falhaAtualizacao: 'Falha na atualização, tente novamente mais tarde',
    falhaCEP: 'CEP inválido',
    pagadorCadastrado: 'Pagador cadastrado com sucesso',
    pagadorAtualizado: 'Pagador atualizado com sucesso',
    funcLiberada: 'Você não possuí essa funcionalidade liberada, para habilitar entre em contato através dos meios a seguir: %{email_banco} %{telefone_banco}',
    digiteValor: 'Digite o valor',
    escolhaPagador: 'Escolha o pagador',
    boletoGerado: 'Boleto gerado com sucesso',
    erroGerarTente: 'Erro ao gerar boleto, tente novamente mais tarde.',
    erroGerarJuros: 'Erro ao gerar boleto, juros não podem ser superiores a 3% ao mês.',
    vencido: 'Vencido',
    emAberto: 'Em aberto',
    pagoEm: 'Pago: %{dataPago}',
    pago: 'Pago',
    nenhumBoleto: 'Nenhum boleto encontrado',
    dataFinal: 'Data Final',
    nenhumArquivo: 'Nenhum arquivo encontrado',
    formatoInvalido: 'Formato de arquivo inválido',
    erroCSV: 'CSV com erro, verifique: %{erroMsg}',
    analiseCSV: 'CSV em análise, acompanhe em Gerenciar Lotes',
    escolhaCSV: 'Escolha um arquivo CSV',
    nenhumFavorecido: 'Você não possui nenhum favorecido cadastrado, para gerar seu boleto, cadastre um favorecido antes.',
    cobranca: 'Cobrança'
  },

  pagar: {
    linhaDigital: 'Linha Digitável',
    btnConsultar: 'Consultar',
    dadosBoleto: 'Dados do boleto: ',
    favorecido: 'Favorecido: ',
    valorDocumento: 'Valor do Documento: ',
    desconto: 'Desconto: ',
    jurosMora: 'Juros/Mora: ',
    multa: 'Multas: ',
    totalEncargo: 'Total de Encargos: ',
    vencimento: 'Vencimento: ',
    totalPagar: 'Total a Pagar: ',
    codigoBarras: 'Código de barras: ',
    btnVoltar: 'Voltar',
    btnProximo: 'Próximo',
    titleModalValidacao: 'Autenticação de dois fatores',
    textModalValidacao: 'Digite sua senha e acesse sua conta %{nome_banco} em seu dispositivo para validar sua Chave de Acesso.',
    tokenValidacao: 'Token',
    titleSenha: 'Senha',
    textSenha: 'Digite sua senha',
    titleToken: 'Token',
    textTokenDescr: 'Digite o Token gerado pela sua Chave de Acesso em seu App.',
    btnPagar: 'Pagar',

    diaUtil: 'Pagamento só pode ser realizado em dia útil.',
    foraHorario: 'Pagamento fora do horário permitido.',
    invalido: 'Código de barras inválido',
    boletoPropria: 'Não é permitido pagar um boleto da própria %{nome_banco}',
    saldoInsuficiente: 'Saldo insuficiente',
    erroSenha: 'Erro na senha ou token invalido',
    sucesso: 'Pagamento realizado com sucesso.\nVerifique em meus comprovantes.',
    tente: 'Não foi possivel concluir o Pagamento.\nTente novamente mais tarde.',
    pagar: 'Pagar',
  },

  perfil: {
    dadosPessoais: 'Dados Pessoais',
    celular: 'Celular',
    estadoCivil: 'Estado Civil',
    documento: 'CPF/CNPJ',
    cep: 'CEP',
    endereco: 'Endereço',
    numero: 'Número',
    completo: 'Complemento',
    bairro: 'Bairro',
    cidade: 'Cidade',
    estado: 'Estado',
  },

  qrcode: {
    qrCode: 'QRCode',
    textQRCode: 'Esse é o seu QRCode &{nomeBanco}, mostre ele ou  faça Download e imprima para permitir que as pessoas realizem pagamentos para você',
    btnQRCOde: 'Download QRCode',
  },

  transferencia: {
    btnEntraContas: 'Contas %{nome_banco}',
    btnParaOutros: 'Outros Bancos',
    btnLote: 'Em Lote (%{nome_banco})',
    textInterna: 'Escolha como deseja Transferir entre as Contas do %{nome_banco}',
    btnBuscarConta: 'Buscar Por Conta',
    btnBuscarTelefone: 'Buscar Por Telefone',
    btnBuscarDocumento: 'Buscar Por CPF/CNPJ',
    textTelefone: 'Telefone',
    btnPesquisar: 'Pesquisar',
    btnFechar: 'Fechar',
    textDocumento: 'CPF/CNPJ',
    textAgencia: 'Agência',
    textConta: 'Conta',
    textDigito: 'Digito',
    textSelecionarConta: 'Selecione abaixo a conta',
    nomeConta: 'Nome:',
    agenciaConta: 'Agência:',
    contaConta: 'Conta:',
    textDadosFavorecido: 'Dados do Favorecido:',
    saldo: 'Saldo',
    valor: 'Valor R$',
    titleLote: 'Envie o Arquivo CSV para realizar uma Transferência interna em Lote',
    textLote: 'Arquivo CSV',
    textEscolhaLote: 'Escolha um arquivo .CSV',
    btnVerificarLote: 'Verificar',
    btnDownLote: 'Download Exemplo .CSV',

    
    titleTransfOutros: 'Preencha os Campos para realizar a Transferência para Outros Bancos',
    textBanco: 'Banco *',
    selectBanco: 'Selecione o Banco que Deseja Transferir',
    textOutrosBancos: 'Outros Bancos',
    agenciaTransfOutros: 'Agencia *',
    digAgTransfOutros: 'Digito',
    contaTransfOutros: 'Conta *',
    digitoTransfOutros: 'Digito *',
    tipoConta: 'Tipo de Conta *',
    selecTipoConta: 'Selecione o Tipo de Conta',
    pesquisarBanco: 'Pesquisar: ',
    documentoTransfOutros: 'CPF/CNPJ *',
    favorecidoTransfOutros: 'Favorecido *',
    valorTransfOutros: 'Valor *',
    finalidadeTransfOutros: 'Finalidade *',
    selectFinalidadeTransfOutros: 'Selecione a Finalidade',
    tranfDescrOutros: 'Campos com * são Obrigadorios!',
    titleConfirmeDados: 'Confirme os Dados para realizar a transferencia',
    bancoConfirmeDados: 'Banco: ',
    contaConfirmaDados: 'Conta: ',
    agenciConfirmeDados: 'Agencia: ',
    digitoConfirmeDados: 'Digito: ',
    tipoContaConfirmeDados: 'Tipo de Conta: ',
    documentoConfirmeDados: 'CPF/CNPJ: ',
    favorecidoConfirmeDados: 'Favorecido: ',
    valorConfirmeDados: 'Valor: ',
    btnCancelar: 'Cancelar',

    btnTransferir: 'Transferir',
    titleModalValidacao: 'Autenticação de dois fatores',
    textModalValidacao: 'Digite sua senha e acesse sua conta %{nome_banco} em seu dispositivo para validar sua Chave de Acesso.',
    tokenValidacao: 'Token',
    titleSenha: 'Senha',
    textSenha: 'Digite sua senha',
    titleToken: 'Token',
    textTokenDescr: 'Digite o Token gerado pela sua Chave de Acesso em seu App.',


    erroSenha: 'Erro de senha ou token invalido',
    sucesso: 'Transferência realizada com sucesso.',
    analise: 'Transferência em análise por motivos de segurança.',
    erroTransferencia: 'Não foi possivel concluir a transferência',
    erroNumero: 'Não foi encontrada nenhuma conta com este número',
    erroDoc: 'Não foi encontrada nenhuma conta com este documento',
    funcionalidade: 'Você não possuí essa funcionalidade liberada, para habilitar entre em contato através dos meios a seguir: %{email_banco} %{telefone_banco}',
    formatoInvalido: 'Formato de arquivo inválido',
    escolhaCSV: 'Escolha um arquivo CSV',
    erroCSV: 'CSV com erro, verifique: %{erroMsg}',
    sucessoVerifique: 'Transferência efetuada com sucesso! Verifique o extrato.',
    escolhaBanco: 'Escolha o banco',
    digiteAgencia: 'Digite a agencia',
    digiteConta: 'Digite a conta',
    digiteDigito: 'Digite o digito',
    escolhaTipo: 'Escolha o tipo de conta',
    erroCPF: 'CPF Inválido',
    erroCNPJ: 'CNPJ Inválido',
    digiteCPF: 'Digite o CPF ou CNPJ',
    digiteFavorecido: 'Digite o nome do favorecido',
    digiteValor: 'Digite o valor',
    finalidade: 'Escolha a finalidade',
    erroSaldo: 'Saldo insuficiente',
    credito: 'Crédito em Conta',
    pagarAluguel: 'Pagamento de Aluguel/Condomínio',
    pagarTitulos: 'Pagamento de Duplicata/Títulos',
    pagarDividendos: 'Pagamento de Dividendos',
    pagarMensalidade: 'Pagamento de Mensalidade Escolar',
    pagarSalario: 'Pagamento de Salários',
    pagarFornecedor: 'Pagamento de Fornecedores/Honorários',
    operacoes: 'Operações de Câmbios/Fundos/Bolsa de Valores',
    repasse: 'Repasse de Arrecadação/Pagamento de Tributos',
    internacional: 'Transferência Internacional em Real',
    docPoupanca: 'DOC para Poupança',
    docDeposito: 'DOC para Depósito Judicial',
    outros: 'Outros',
    bolsa: 'Pagamento de bolsa auxílio',
    remuneracao: 'Remuneração à cooperado',
    contaCorrente: 'Conta corrente',
    contaPoupanca: 'Conta poupança',
    digiteNumeroConta: 'Digite o número da conta',
    transferencia: 'Transferência'
  },

  escolha_cartao: {
    ativar: 'Ativar Cartão',
    carregar: 'Carregar Cartão',
    trocarSenha: 'Trocar Senha',
    detalhes: 'Detalhes',
    aquisicao: '• Todas as vantagens em um só click!',
    aquisicaoDesc1: 'Para a aquisição do seu cartão %{nome_banco} será cobrado o valor de R$ %{tarifa} uma única vez, o qual será debitado em sua conta digital. Para isto basta ter saldo em sua conta.',
    // aquisicaoDesc2: 'será cobrado o valor de R$ ',
    // aquisicaoDesc3: 'uma única vez, o qual será debitado em sua conta digital. Para isto basta ter saldo em sua conta.',
    selecao: 'Selecione a cor de sua preferência para seu cartão %{nome_banco}',
    termos: 'Leia os termos de uso',
    confirme: 'Para ativar seu cartão %{nome_banco} confirme alguns dados: ',
    // confirme2: ' confirme alguns dados: ',
    nome: 'Nome: ',
    telefone: 'Telefone: ',
    textoDescricao: 'Caso os dados estejam incorretos, entre em contato com o suporte %{nome_banco} no %{email_banco}',
    // textoDescricao2: ' no ',
    token: 'Digite o código de ativação do Token, enviado via SMS para o seu celular',
    instrucao: 'Digite o código do cartão, ele fica acima do número do cartão e abaixo da validade',
    digite: 'Digite os 4 últimos digitos de seu cartão %{nome_banco}',
    crieSenha: 'Crie uma senha de acesso de 4 dígitos para seu cartão %{nome_banco}',
    desbloqueio: 'Parabéns! Seu cartão %{nome_banco} foi desbloqueado com sucesso. Aproveite!!',
    // desbloqueio1: 'Parabéns! Seu cartão ',
    // desbloqueio2: ' foi desbloqueado com sucesso. Aproveite!!',
    carregar: 'Como Deseja carregar seu cartão?',
    transferencia: 'Transferencia',
    boleto: 'Gere um boleto para recarregar seu cartão',
    valorBoleto: 'Valor do Boleto',
    vencimento: 'Vencimento',
    transferenciaRapida: 'Transferência rápida entre cartões.',
    codigo: 'Digite o código identificador do seu cartão, ele fica logo abaixo da data de validade.',
    mostrarValor: 'Quanto deseja transferir para %{nome_cartao} ?',
    valor: 'Valor R$',
    senha: 'Senha',
    boletoGerado: 'Boleto gerado com sucesso!',
    pagador: 'Pagador',
    nossoNumero: 'Nosso número',
    emissao: 'Emissão',
    validade: 'Validade',
    codigoBarras: 'Código de barras',
    bloquear: 'Aqui você consegue bloquear ou desbloquear seu cartão %{nome_banco}',
    cartao: 'Cartão: ',
    id: 'ID: ',
    status: 'Status: '
  },

  ajustes: {
    ola: 'Ola, Seja Bem Vindo ao %{nome_banco}',
    manutencao: 'O Internet Banking do %{nome_banco} está em manutenção no momento!',
    // manutencao1: 'O Internet Banking do ',
    // manutencao2: ' esta em manutenção no momento!',
    retornaremos: 'Em Breve Retornaremos funcionando normalmente.',
    info: 'Para mais informações entre em contado com a nossa central de ajuda: ',
  },

  servicos: {
    recarregueApp: 'Recarregue seus aplicativos de forma fácil e rápida',
    recarregueCel: 'Recarregue seu celular ou fixo de forma fácil e rápida',
    cel: 'Número do Celular',
    recarregueSer: 'Recarregue seus serviços de entretenimento de forma fácil e rápida.',
    recarregueGames: 'Recarregue seus games de forma fácil e rápida',
    tituloTel: 'Recarga de Telefone',
    tituloEntr: 'Entretenimento',
    tituloGames: 'Games',
    tituloApps: 'Aplicativos'
  },

  siso: {
    produtos: 'Nossos Produtos',
    realizar: 'Quer realizar um projeto ou um sonho? Viajar, casar, estudar, reformar a casa ou até investir no seu negócio? Nós podemos te ajudar a realizar esse sonho!',
    pf: 'Pessoa Física',
    pj: 'Pessoa Jurídica',
    cpf: 'Para prosseguirmos vamos precisar que você preencha seu CPF',
    continuar: 'Continuar',
    cnpj: 'Para prosseguirmos vamos precisar que você preencha o CNPJ de sua empresa',
    nomeEmpresa: '*Nome Empresa:',
    digiteNomeEmpresa: 'Digite o Nome da Empresa',
    emailEmpresa: 'E-Mail da Empresa:',
    digiteEmailEmpresa: 'Digite o E-Mail da Empresa',
    cel: 'Telefone Celular:',
    valorDesejado: '*Valor Desejado:',
    valorMedio: '*Valor Médio dos Títulos:',
    quantidadeTil: '*Quantidade Média de Títulos',
    quantidadeSacados: '*Quantidade Média de Sacados',
    prazo: '*Prazo (Dias): ',
    simular: 'Simular',
    nomeDeEmpresa: 'Nome de Empresa',
    cnpjLabel: 'CNPJ',
    dataSimulacao: 'Data da Simualação',
    valorSolicitado: 'Valor Solicitado R$',
    quantidadeTitulos: 'Quantidade de Títulos',
    valorMedio2: 'Valor Médio dos Títulos R$',
    prazoMedio: 'Prazo Médio em Dias',
    quantidadeSacados2: 'Quantidade de Sacados',
    valorLiberado: 'Valor Liberado R$',
    taxa: 'Taxa de Juros Mensal %',
    iof: 'IOF R$',
    cet: 'CET %',
    pdf: 'Baixar PDF de Simulação',
    refazer: 'Refazer a Simulação',
    aprovar: 'Aprovar a Simulação',
    interessado: 'Ficou interessado em nossos produtos? Aproveite para instalar o nosso Aplicativo escolhendo a Loja disponivel em seu dispositivo movel no botões abaixo e scaneando o QRCode',
    solicitacoes: 'Ja existe solicitações feitas anteriormente',
    dataSimulacao2: 'Data de Simulação: ',
    valorDesejado2: 'Valor a ser Creditado: ',
    obrigado: 'Obrigado por Aprovar a Simulação!',
    aproveite: ' Aproveite para abrir uma conta no nosso Banco Digital.'
  },

  sidebar: {
    home: 'Home',
    extrato: 'Extrato',
    transferencia: 'Transferência',
    deposito: 'Depósito',
    comprovantes: 'Comprovantes',
    pagamento: 'Pagamento',
    cobranca: 'Cobrança',
    pix: "Pix",
    servico: 'Serviços',
    cartoes: 'Cartões',
    qrcode: 'QRCode',
    tarifas: 'Tarifas',
    gratuito: 'Gratuito/Mês: ',
    tarifaTitulo: 'Tarifas Conta Digital ',
    tarifaCol: 'Tarifa',
    tarifaValor: 'Valor',
    tarifaFechar: 'Fechar'
  },

  header: {
    ola: 'Olá, ',
    conta: 'C/C: ',
    agencia: 'Ag: ',
    empresa: 'Empresa: ',
    perfil: 'Perfil',
    nenhumaNotif: 'Nenhuma mensagem nova',
    // novaNotif: 'Olá ',
    lidoNotif: 'Marcar como lido',
    cancelarNotif: 'Cancelar',
    sair: 'Sair'
  },

}