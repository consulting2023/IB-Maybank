// pt-BR.js
export default {
  langInfo: {
    key: 3,
    titulo: "Español",
    pais: "Espanha",
    sigla: "esPN",
    bandeira: require("../assets/paises/espanha.png").default,
  },

  login: {
    acesse_sua_conta: "ACCEDA A SU CUENTA\n%{banco}",
    info_credenciais: "Introduzca las credenciales de su cuenta para acceder",
    email: "correo electrónico",
    senha: "contraseña",
    ou: " o ",
    entrar: "ENTRAR",
    conheca_produtos: "¡Conozca Nuestros Productos!",
    ola: "Hola, %{nomeUsuario}",
    como_deseja_logar:
      "Seleccione la cuenta que desea iniciar sesión a continuación",
    pessoa_fisica: "Persona Física",
    pessoa_juridica: "Persona Jurídica",
    chave_de_acesso: "Token de Acceso",
    abra_o_aplicativo:
      "El token de acceso es un segundo paso de verificación para garantizar más seguridad en su transacción. Se enviará a su correo electrónico, permitiendo el acceso a la Banca por Internet",
    token: "Token",
    chave_token: "Ingrese el token de acceso para continuar",
    qrcode: "Código QR",
    ler_qrcode: "Escanee el código QR generado por su Clave de Acceso.",
    texto_1:
      "Un banco transparente, completo y con su estilo, con productos exclusivos.",
    texto_2: "Su vida financiera más fácil",
    texto_3:
      "Facilidad para resolver todo a través de la aplicación, y con una atención 24 horas que realmente le ayuda",

    preencha: "¡Complete todos los campos!",
    senhaExpirou:
      "¡Su contraseña ha caducado! Cambie la contraseña para generar una nueva",
    senhaIncorreta:
      "El correo electrónico o la contraseña son incorrectos, intente nuevamente",
    esqueciSenha: "Olvidé la contraseña",
    alertEsqueciSenha:
      "Complete el correo electrónico para recuperar la contraseña",
    modalSenha: "Contraseña de Inicio de Sesión",
    tokenModalSenha: "Token enviado a su correo electrónico",
    senhaModalSenha: "Nueva Contraseña",
    alertaCombinacoes: "Atención",
    tokenEnviado: "Token enviado al correo electrónico",
    alertSemSenha: "Es obligatorio rellenar la contraseña para continuar",
    alertSemToken: "Es obligatorio rellenar el token para continuar",
    alertSenhaAlteradaComSucesso: "¡Contraseña cambiada con éxito!",
    alertErroAlterarSenha:
      "Error al cambiar la contraseña, intente nuevamente más tarde",
    tituloContaNãoAprovada: "Cuenta No Aprobada",
    contaNãoAprovada:
      "Cuenta no aprobada, contacte al gerente para más información",
    cadastrar: "Registrar",
    selecionarConta: "Seleccione el tipo de cuenta para registrar",

    erroInterno: "Error interno",
    captchaLang: "es",
    erro: "Error",
    requisicaoNaoPermitida: "Solicitud no permitida",
    erroConexao: "Error de conexión",
    tenteRecarregarPagina: "Intenta recargar la página",
    tokenInvalido: "Token inválido",
    confirmeSuaIdentidade: "Confirme su identidad",
    insiraCodigoEnviadoEmail: "Ingrese el código enviado a su correo electrónico y SMS",
    insiraCodigoChave: "Ingrese el código de la Clave de Acceso de la app",
    insiraCodigoEnviadoEmailChave: "Ingrese el código enviado a su correo electrónico o SMS y encontrado en la Clave de Acceso de la app",
    ouQr: "o",
    escaneieQr: "Escanee el Código QR con la Clave de Acceso de la app",
  },

  home: {
    ultiMov: "Últimos movimientos",
    saldoDigital: "Cuenta Digital",
    saldoBloqueado: "Saldo Bloqueado",
    saldoCartao: "Tarjeta",
    saldoConvenio: "Convenio",
    saldoInvestimento: "Inversión",
    acoesRapida: "Acciones Rápidas",
    btnAcoesRapida1: "Depósito",
    btnAcoesRapida2: "Transferencia",
    btnAcoesRapida3: "Pago",
    btnAcoesRapida4: "Extracto",
    ultLancamentos: "Últimos Movimientos de la Cuenta Digital",
    descr: "Descripción",
    descrValor: "Valor €",
    descrData: "Fecha",
    descrNome: "%{descricao}",
    verMais: "Ver Más",
    hey: "¡Hola!",
    proprietaryAccounts: "Cuentas Propietarias",
    proprietaryAccountBalance: "Saldo de la cuenta propietaria",
    conta: "Cuenta",
    saldo: "Saldo",
    saldoNull: "No disponible",
    transactionalAccounts: "Cuentas Transaccionales",
    transactionalAccountBalance: "Saldo de la cuenta transaccional",
  },

  extrato: {
    alertaCartao: "Vous n'avez pas de carte active.",
    btnExtratoDigital: "Compte Numérique",
    btnExtratoCartao: "Carte",
    btnExtratoConvenio: "Convention",
    btnExtratoInvestimento: "Investissement",
    btnExtratoParcelado: "Paiement Échelonné",
    btnExtratoAgenda: "Agenda Financier",
    modalCartaoAtivo: "Vous n'avez pas de carte active.",
    fecharModal: "Fermer",
    breadCrumb1: "Accueil",
    breadCrumb2: "Extrait",
    breadCrumb3: "Extrait du Compte",
    textoEscolhaExtrato: "Choisissez la période que vous souhaitez consulter dans votre extrait :",
    dataInicio: "Date de Début :",
    dataFinal: "Date de Fin :",
    btnPesquisar: "Rechercher",
    downloadPdf: "Télécharger l'Extrait PDF",
    downloadCsv: "Télécharger l'Extrait CSV",
    descr: "Description",
    descrValor: "Valeur €",
    descrData: "Date",
    descrNome: "%{descricao}",

    nenhumEncontrado: "Aucun mouvement trouvé à la date sélectionnée",
    extrato: "Extrait",
    nenhumLancamento: "Aucun lancement trouvé",
  },

  deposito: {
    btnDepositoBoleto: "Depósito por Boleto",
    btnDepositoGerenciar: "Gestionar Boletos de Depósito",
    btnDepositoTED: "Depósito TED/DOC",
    btnDepositoComprovante: "Enviar Comprobante",
    breadCrumb1: "Inicio",
    breadCrumb2: "Depósito",
    breadCrumb3: "Gestionar Boletos de Depósito",
    textoEscolhaDeposito: "Elija el período que desea visualizar sus boletos",
    dataInicio: "Fecha Inicial:",
    dataFinal: "Fecha Final:",
    btnPesquisar: "Buscar",
    btnVoltar: "Volver",
    descr: "Nombre del Beneficiario",
    descrNumero: "Nuestro Número",
    descrValor: "Valor €",
    descrVencimento: "Vencimiento",
    descrStatus: "Estado",
    downloadPdf: "Descargar PDF",
    textBoleto: "Reciba valores de forma sencilla.",
    dataVencimento: "Fecha de Vencimiento",
    gerarBoleto: "Generar Boleto",
    fecharBoleto: "Cerrar",
    textTED:
      "Solo necesita usar los datos a continuación para enviar dinero a su cuenta digital",
    alertTED:
      'Preste mucha atención a un consejo:\nColoque en el campo "DESCRIPCIÓN" de su DOC o TED\nsu CPF/CNPJ o su cuenta digital en el ',
    textComp:
      "Si ya ha realizado su depósito, envíenos su comprobante, por favor",
    eschComp: "Seleccione un Comprobante",
    enviarComp: "Enviar Comprobante",

    nenhumBoleto: "No se encontraron boletos en la fecha seleccionada",
    boletoGerado: "¡Boleto generado con éxito, Gestionar Boletos!",
    erroGerar: "Error al generar el boleto, intente nuevamente más tarde",
    pago: "Pagado",
    emAberto: "Pendiente",
    vencido: "Vencido",
    formatoInvalido: "Formato de archivo inválido",
    falhaComprovante: "Error al enviar comprobante",
    upload: "Para cargar, debe seleccionar un archivo",
    comprovanteEnviado: "Comprobante Enviado con éxito",
    falhaComprovanteTente:
      "Error al enviar comprobante, intente nuevamente más tarde",
    deposito: "Depósito",
  },

  comprovante: {
    compDigital: "Cuenta Digital",
    compCartao: "Cuenta Tarjeta",
    compConvenio: "Cuenta Convenio",
    compServicos: "Servicios",
    compParcelado: "Pago a Plazos",
    compInvestimento: "Inversión",
    breadCrumb1: "Inicio",
    breadCrumb2: "Comprobantes",
    breadCrumb3: "Comprobantes de la Cuenta",
    textEscolhaComprovante: "Elija el período que desea ver sus comprobantes:",
    dataInicio: "De:",
    dataFinal: "Hasta:",
    btnPesquisar: "Buscar",
    valor: "Valor: ",
    data: "Fecha: ",
    downPDf: "Descargar PDF",

    nenhumComprovante:
      "No se encontraron comprobantes para el período solicitado.",
    nenhumCartao: "No tienes una tarjeta activa.",
    comprovantes: "Comprobantes",
  },

  cobranca: {
    btnBoletoCobranca: "Boleto de Cobro",
    btnLoteCobranca: "Múltiples Boletos de Cobro",
    btnPagadorCobranca: "Registrar Pagador",
    btnGerarBoletoCobranca: "Generar Boleto",
    btnGerenciarBoletoCobranca: "Gestionar Boletos",
    btnGerarLoteCobranca: "Generar Múltiples Boletos",
    btnGerenciarLoteCobranca: "Gestionar Múltiples Boletos",
    btnCadastrarPagadorCobranca: "Registrar Pagador",
    btnGerenciarPagadorCobranca: "Gestionar Pagadores",
    textGerarBoleto:
      "Complete los datos a continuación para Generar su Boleto de Cobro",
    valorBoleto: "Valor € *",
    vencimentoBoleto: "Vencimiento",
    multaBoleto: "Multa en Euros",
    jurosBoleto: "Intereses por Día en Euros",
    descontoBoleto: "Descuento en Euros",
    abatimentoBoleto: "Reducción en Euros",
    pagadorBoleto: "Pagador *",
    notaBoleto: "Nota Fiscal o Nº del Doc.",
    descBoleto: "Descripción",
    gerarBoleto: "Generar Boleto",
    downBoleto: "Descargar PDF",
    textGerenciarBoleto: "Elija el período de fechas que desea ver:",
    dataInicialBoleto: "Fecha Inicial:",
    dataFinalBoleto: "Fecha Final:",
    todosBoleto: "Todos",
    pagoBoleto: "Pagado",
    abertoBoleto: "Pendiente",
    vencidoBoleto: "Vencido",
    sacadoBoleto: "Beneficiario:",
    statusBoleto: "Estado:",
    dataVencimentoBoleto: "Vencimiento:",
    valorGerenciarBoleto: "Valor €:",
    textLote: "Cargue el Archivo CSV para Generar Múltiples Boletos",
    arqLote: "Archivo CSV",
    escolherArqLote: "Seleccione un archivo .CSV",
    verificarLote: "Verificar",
    exemploLote: "Descargar Ejemplo .CSV",
    textGerenciarLote: "Seleccione el Lote de Boleto para Gestionar",
    nomeArqLote: "Nombre del archivo: ",
    dataLote: "Fecha: ",
    qtdRegistroLote: "Cantidad de Registros: ",
    registradosLote: "Registrados: ",
    errosLote: "Errores: ",
    erroLinhaLote: "Error en la línea: ",
    msgErroLote: "Mensaje: ",
    sacadoLote: "Beneficiario: ",
    statusLote: "Estado: ",
    vencimentoLote: "Vencimiento: ",
    valorLote: "Valor: ",
    dwnPDFLote: "Descargar PDF",
    textEditarSacado: "Editar Datos del Pagador",
    pagadorSacado: "Pagador",
    nomeSacado: "NIF/CIF",
    documentoSacado: "NIF/CIF",
    cepSacado: "Código Postal",
    pesquisarCepSacado: "Buscar Código Postal",
    enderecoSacado: "Dirección",
    numeroSacado: "Número",
    complementoSacado: "Complemento",
    ufSacado: "Provincia",
    municipioSacado: "Municipio",
    bairroSacado: "Barrio",
    btnSacado: "Actualizar",
    textCadastrarPagador: "Complete los datos para Registrar un Pagador",
    btnPagador: "Registrar",

    digiteNome: "Introduzca el nombre",
    digiteDoc: "Introduzca el documento",
    digiteLog: "Introduzca la dirección",
    digiteNumero: "Introduzca el número",
    digiteBairro: "Introduzca el barrio",
    digiteCEP: "Introduzca el código postal",
    digiteMunicipio: "Introduzca el municipio",
    digiteEstado: "Introduzca la provincia",
    falhaCadastro:
      "Error al realizar el registro, intente nuevamente más tarde",
    falhaAtualizacao: "Error al actualizar, intente nuevamente más tarde",
    falhaCEP: "Código postal inválido",
    pagadorCadastrado: "Pagador registrado con éxito",
    pagadorAtualizado: "Pagador actualizado con éxito",
    funcLiberada:
      "No dispone de esta funcionalidad habilitada. Para activarla, contacte con los siguientes medios: %{email_banco} %{telefone_banco}",
    digiteValor: "Introduzca el valor",
    escolhaPagador: "Elija el pagador",
    boletoGerado: "Boleto generado con éxito",
    erroGerarTente: "Error al generar el boleto, intente nuevamente más tarde.",
    erroGerarJuros:
      "Error al generar el boleto, los intereses no pueden superar el 3% mensual.",
    vencido: "Scaduto",
emAberto: "In sospeso",
pagoEm: "Pagato: %{dataPago}",
pago: "Pagato",
nenhumBoleto: "Nessun bollettino trovato",
dataFinal: "Data Finale",
nenhumArquivo: "Nessun file trovato",
formatoInvalido: "Formato del file non valido",
erroCSV: "Errore nel CSV, verifica: %{erroMsg}",
analiseCSV: "CSV in analisi, procedi in Gestione Lotti",
escolhaCSV: "Seleziona un file CSV",
nenhumFavorecido:
  "Non hai alcun beneficiario registrato. Registrane uno per generare il tuo bollettino.",
cobranca: "Riscossione",
  },

  pagar: {
    linhaDigital: "Línea Digital",
    btnConsultar: "Consultar",
    dadosBoleto: "Datos del boleto: ",
    favorecido: "Beneficiario: ",
    valorDocumento: "Valor del Documento: ",
    desconto: "Descuento: ",
    jurosMora: "Intereses/Mora: ",
    multa: "Multas: ",
    totalEncargo: "Total de Cargos: ",
    vencimento: "Vencimiento: ",
    totalPagar: "Total a Pagar: ",
    codigoBarras: "Código de Barras: ",
    btnVoltar: "Volver",
    btnProximo: "Siguiente",
    titleModalValidacao: "Autenticación de dos factores",
    textModalValidacao:
      "Introduzca su contraseña y acceda a su cuenta %{nome_banco} en su dispositivo para validar su Clave de Acceso.",
    tokenValidacao: "Token",
    titleSenha: "Contraseña",
    textSenha: "Introduzca su contraseña",
    titleToken: "Token",
    textTokenDescr:
      "Introduzca el Token generado por su Clave de Acceso en su aplicación.",
    btnPagar: "Pagar",

    diaUtil: "El pago solo puede realizarse en días laborables.",
    foraHorario: "Pago fuera del horario permitido.",
    invalido: "Código de barras inválido",
    boletoPropria: "No está permitido pagar un boleto del propio %{nome_banco}",
    saldoInsuficiente: "Saldo insuficiente",
    erroSenha: "Error en la contraseña o token inválido",
    sucesso: "Pago realizado con éxito.\nVerifique en sus comprobantes.",
    tente: "No se pudo completar el pago.\nInténtelo nuevamente más tarde.",
    pagar: "Pagar",
  },

  perfil: {
    dadosPessoais: "Données Personnelles",
    celular: "Téléphone mobile",
    estadoCivil: "État Civil",
    documento: "NIF/CIF",
    cep: "Code Postal",
    endereco: "Adresse",
    numero: "Numéro",
    completo: "Complément",
    bairro: "Quartier",
    cidade: "Ville",
    estado: "Région",
  },

  qrcode: {
    qrCode: "Código QR",
    textQRCode:
      "Este es tu Código QR de %{nomeBanco}, muéstralo o descárgalo e imprímelo para permitir que las personas realicen pagos hacia ti.",
    btnQRCOde: "Descargar Código QR",
  },

  transferencia: {
    btnEntraContas: "Cuentas %{nome_banco}",
    btnParaOutros: "Otros Bancos",
    btnLote: "En Lote (%{nome_banco})",
    textInterna:
      "Elija cómo desea Transferir entre las Cuentas de %{nome_banco}",
    btnBuscarConta: "Buscar por Cuenta",
    btnBuscarTelefone: "Buscar por Teléfono",
    btnBuscarDocumento: "Buscar por NIF/CIF",
    textTelefone: "Teléfono",
    btnPesquisar: "Buscar",
    btnFechar: "Cerrar",
    textDocumento: "NIF/CIF",
    textAgencia: "Agencia",
    textConta: "Cuenta",
    textDigito: "Dígito",
    textSelecionarConta: "Seleccione la cuenta a continuación",
    nomeConta: "Nombre:",
    agenciaConta: "Agencia:",
    contaConta: "Cuenta:",
    textDadosFavorecido: "Datos del Beneficiario:",
    saldo: "Saldo",
    valor: "Valor €",
    titleLote:
      "Cargue el Archivo CSV para realizar una Transferencia Interna en Lote",
    textLote: "Archivo CSV",
    textEscolhaLote: "Elija un archivo .CSV",
    btnVerificarLote: "Verificar",
    btnDownLote: "Descargar Ejemplo .CSV",

    titleTransfOutros:
      "Complete los Campos para realizar la Transferencia a Otros Bancos",
    textBanco: "Banco *",
    selectBanco: "Seleccione el Banco al que desea transferir",
    textOutrosBancos: "Otros Bancos",
    agenciaTransfOutros: "Agencia *",
    digAgTransfOutros: "Dígito",
    contaTransfOutros: "Cuenta *",
    digitoTransfOutros: "Dígito *",
    tipoConta: "Tipo de Cuenta *",
    selecTipoConta: "Seleccione el Tipo de Cuenta",
    pesquisarBanco: "Buscar: ",
    documentoTransfOutros: "NIF/CIF *",
    favorecidoTransfOutros: "Beneficiario *",
    valorTransfOutros: "Valor *",
    finalidadeTransfOutros: "Finalidad *",
    selectFinalidadeTransfOutros: "Seleccione la Finalidad",
    tranfDescrOutros: "¡Los campos marcados con * son obligatorios!",
    titleConfirmeDados: "Confirme los Datos para realizar la transferencia",
    bancoConfirmeDados: "Banco: ",
    contaConfirmaDados: "Cuenta: ",
    agenciConfirmeDados: "Agencia: ",
    digitoConfirmeDados: "Dígito: ",
    tipoContaConfirmeDados: "Tipo de Cuenta: ",
    documentoConfirmeDados: "NIF/CIF: ",
    favorecidoConfirmeDados: "Beneficiario: ",
    valorConfirmeDados: "Valor: ",
    btnCancelar: "Cancelar",

    btnTransferir: "Transferir",
    titleModalValidacao: "Autenticación de dos factores",
    textModalValidacao:
      "Ingrese su contraseña y acceda a su cuenta %{nome_banco} en su dispositivo para validar su Clave de Acceso.",
    tokenValidacao: "Token",
    titleSenha: "Contraseña",
    textSenha: "Ingrese su contraseña de transferencia",
    titleToken: "Token",
    textTokenDescr: "Ingrese el Token enviado a su correo electrónico",

    erroSenha: "Error de contraseña o token inválido",
    sucesso: "Transferencia realizada con éxito.",
    analise: "Transferencia en análisis por motivos de seguridad.",
    erroTransferencia: "No fue posible completar la transferencia",
    erroNumero: "No se encontró ninguna cuenta con este número",
    erroDoc: "No se encontró ninguna cuenta con este documento",
    funcionalidade:
      "No dispone de esta funcionalidad habilitada. Para activarla, contacte con los siguientes medios: %{email_banco} %{telefone_banco}",
    formatoInvalido: "Formato de archivo inválido",
    escolhaCSV: "Seleccione un archivo CSV",
    erroCSV: "CSV con error, verifique: %{erroMsg}",
    sucessoVerifique:
      "¡Transferencia realizada con éxito! Verifique el extracto.",
    escolhaBanco: "Seleccione el banco",
    digiteAgencia: "Ingrese la agencia",
    digiteConta: "Ingrese la cuenta",
    digiteDigito: "Ingrese el dígito",
    escolhaTipo: "Seleccione el tipo de cuenta",
    erroCPF: "NIF Inválido",
    erroCNPJ: "CIF Inválido",
    digiteCPF: "Ingrese el NIF o CIF",
    digiteFavorecido: "Ingrese el nombre del beneficiario",
    digiteValor: "Ingrese el valor",
    finalidade: "Seleccione la finalidad",
    erroSaldo: "Saldo insuficiente",
    credito: "Crédito en Cuenta",
    pagarAluguel: "Pago de Alquiler/Condominio",
    pagarTitulos: "Pago de Duplicata/Títulos",
    pagarDividendos: "Pago de Dividendos",
    pagarMensalidade: "Pago de Mensualidad Escolar",
    pagarSalario: "Pago de Salarios",
    pagarFornecedor: "Pago de Proveedores/Honorarios",
    operacoes: "Operaciones de Cambios/Fondos/Bolsa de Valores",
    repasse: "Recaudación/Impuestos",
    internacional: "Transferencia Internacional en Euros",
    docPoupanca: "DOC para Ahorros",
    docDeposito: "DOC para Depósito Judicial",
    outros: "Otros",
    bolsa: "Pago de beca",
    remuneracao: "Remuneración al cooperado",
    contaCorrente: "Cuenta corriente",
    contaPoupanca: "Cuenta de ahorros",
    digiteNumeroConta: "Ingrese el número de la cuenta",
    transferencia: "Transferencia",
    loteCod304: "El número del banco es incorrecto. Se esperaba '000'.",
    loteCod301: "No se encontró la cuenta proporcionada. Por favor, verifique.",
    loteCod302: "Faltan datos en el registro. Revise los campos obligatorios.",
    loteCod303: "El valor no puede ser cero. Ingrese un valor válido.",
    loteCod305:
      "La agencia proporcionada no coincide con la cuenta proporcionada. Verifique los datos.",
    loteCod306:
      "El documento proporcionado no está relacionado con la cuenta proporcionada. Revise los datos.",
    loteCod307:
      "El CSV contiene campos faltantes o fuera de orden. Por favor, ajuste el archivo.",
    semErro: "Sin Errores",
  },

  escolha_cartao: {
    ativar: "Activar Tarjeta",
    carregar1: "Cargar Tarjeta",
    trocarSenha: "Cambiar Contraseña",
    detalhes: "Detalles",
    aquisicao: "• ¡Todas las ventajas en un solo clic!",
    aquisicaoDesc1:
      "Para adquirir su tarjeta %{nome_banco} se cobrará una tarifa única de %{tarifa} €, que se debitará de su cuenta digital. Para ello, debe tener saldo en su cuenta.",
    selecao:
      "Seleccione el color de su preferencia para su tarjeta %{nome_banco}",
    termos: "Lea los términos de uso",
    confirme: "Para activar su tarjeta %{nome_banco}, confirme algunos datos:",
    nome: "Nombre: ",
    telefone: "Teléfono: ",
    textoDescricao:
      "Si los datos no son correctos, póngase en contacto con el soporte %{nome_banco} en %{email_banco}",
    token:
      "Ingrese el código de activación del Token, enviado por SMS a su móvil",
    instrucao:
      "Ingrese el código de la tarjeta, que está encima del número de la tarjeta y debajo de la fecha de vencimiento",
    digite: "Ingrese los últimos 4 dígitos de su tarjeta %{nome_banco}",
    criarSenha:
      "Cree una contraseña de acceso de 4 dígitos para su tarjeta %{nome_banco}",
    desbloqueio:
      "¡Enhorabuena! Su tarjeta %{nome_banco} ha sido desbloqueada con éxito. ¡Disfrútelo!",
    carregar: "¿Cómo desea cargar su tarjeta?",
    transferencia: "Transferencia",
    boleto: "Genere un boleto para recargar su tarjeta",
    valorBoleto: "Importe del Boleto",
    vencimento: "Vencimiento",
    transferenciaRapida: "Transferencia rápida entre tarjetas.",
    codigo:
      "Ingrese el código identificador de su tarjeta, que está justo debajo de la fecha de vencimiento.",
    mostrarValor: "¿Cuánto desea transferir a %{nome_cartao}?",
    valor: "Valor €",
    senha: "Contraseña",
    boletoGerado: "¡Boleto generado con éxito!",
    pagador: "Pagador",
    nossoNumero: "Nuestro número",
    emissao: "Emisión",
    validade: "Validez",
    codigoBarras: "Código de barras",
    bloquear: "Aquí puede bloquear o desbloquear su tarjeta %{nome_banco}",
    cartao: "Tarjeta: ",
    id: "ID: ",
    status: "Estado: ",
    solicitar: "Solicitar Tarjeta",
  },

  ajustes: {
    ola: "Hola, Bienvenido a %{nome_banco}",
    manutencao:
      "¡El Internet Banking de %{nome_banco} está en mantenimiento en este momento!",
    retornaremos: "Volveremos pronto funcionando normalmente.",
    info: "Para más información, póngase en contacto con nuestro centro de ayuda: ",
  },

  servicos: {
    recarregueApp: "Recargue sus aplicaciones de forma fácil y rápida",
    recarregueCel: "Recargue su móvil o teléfono fijo de forma fácil y rápida",
    cel: "Número de Teléfono",
    recarregueSer:
      "Recargue sus servicios de entretenimiento de forma fácil y rápida.",
    recarregueGames: "Recargue sus juegos de forma fácil y rápida",
    tituloTel: "Recarga de Teléfono",
    tituloEntr: "Entretenimiento",
    tituloGames: "Juegos",
    tituloApps: "Aplicaciones",
  },

  siso: {
    produtos: "Nuestros Productos",
    realizar:
      "¿Quiere realizar un proyecto o un sueño? Viajar, casarse, estudiar, reformar su casa o incluso invertir en su negocio. ¡Podemos ayudarle a cumplir ese sueño!",
    pf: "Persona Física",
    pj: "Persona Jurídica",
    cpf: "Para continuar, necesitamos que complete su CPF",
    continuar: "Continuar",
    cnpj: "Para continuar, necesitamos que complete el CNPJ de su empresa",
    nomeEmpresa: "*Nombre de la Empresa:",
    digiteNomeEmpresa: "Introduzca el Nombre de la Empresa",
    emailEmpresa: "Correo Electrónico de la Empresa:",
    digiteEmailEmpresa: "Introduzca el Correo Electrónico de la Empresa",
    cel: "Teléfono Móvil:",
    valorDesejado: "*Valor Deseado:",
    valorMedio: "*Valor Medio de los Títulos:",
    quantidadeTil: "*Cantidad Media de Títulos",
    quantidadeSacados: "*Cantidad Media de Sacados",
    prazo: "*Plazo (Días):",
    simular: "Simular",
    nomeDeEmpresa: "Nombre de la Empresa",
    cnpjLabel: "CNPJ",
    dataSimulacao: "Fecha de Simulación",
    valorSolicitado: "Valor Solicitado €",
    quantidadeTitulos: "Cantidad de Títulos",
    valorMedio2: "Valor Medio de los Títulos €",
    prazoMedio: "Plazo Medio en Días",
    quantidadeSacados2: "Cantidad de Sacados",
    valorLiberado: "Valor Liberado €",
    taxa: "Tasa de Interés Mensual %",
    iof: "IOF €",
    cet: "CET %",
    pdf: "Descargar PDF de Simulación",
    refazer: "Refacer la Simulación",
    aprovar: "Aprobar la Simulación",
    interessado:
      "¿Interesado en nuestros productos? Aproveche para instalar nuestra Aplicación eligiendo la Tienda disponible en su dispositivo móvil y escaneando el Código QR.",
    solicitacoes: "Ya existen solicitudes realizadas anteriormente",
    dataSimulacao2: "Fecha de Simulación:",
    valorDesejado2: "Valor a ser Acreditado:",
    obrigado: "¡Gracias por Aprobar la Simulación!",
    aproveite: " Aproveche para abrir una cuenta en nuestro Banco Digital.",
  },

  sidebar: {
    home: "Inicio",
    extrato: "Extracto",
    transferencia: "Transferencia",
    deposito: "Depósito",
    comprovantes: "Comprobantes",
    pagamento: "Pago",
    cobranca: "Cobro",
    pix: "Pix",
    servico: "Servicios",
    cartoes: "Tarjetas",
    qrcode: "Código QR",
    tarifas: "Tarifas",
    gratuito: "Gratuito/Mes: ",
    tarifaTitulo: "Tarifas Cuenta Digital ",
    tarifaCol: "Tarifa",
    tarifaValor: "Valor",
    tarifaFechar: "Cerrar",
    senha: "Contraseñas",
    cambio: "Cambio",
    relatorio: "Informe",
  },

  header: {
    ola: "Hola, ",
    conta: "C/C: ",
    agencia: "Ag: ",
    empresa: "Empresa: ",
    perfil: "Perfil",
    nenhumaNotif: "No hay mensajes nuevos",
    lidoNotif: "Marcar como leído",
    cancelarNotif: "Cancelar",
    sair: "Salir",
  },

  senha: {
    senhaTitle: "Contraseña",
    senhaLogin: "Contraseña de Inicio de Sesión",
    senhaTransfer: "Contraseña de Transacción",
    token: "Token Enviado a su Correo Electrónico",
    senhaNova: "Nueva Contraseña",
    senhaTransferNova: "Nueva Contraseña de Transacción",
    alertSemSenha: "Es obligatorio rellenar la contraseña para continuar",
    alertSemToken: "Es obligatorio rellenar el token para continuar",
    alertSenhaAlteradaComSucesso: "¡Contraseña cambiada con éxito!",
    alertErroAlterarSenha:
      "Error al cambiar la contraseña, intente nuevamente más tarde",
  },

  relatorio: {
    relatorio: "Informe",
    relatorioPixOut: "Informe de Salida Pix",
    relatorioPixIn: "Informe de Entrada Pix",
    relatorioCrypto: "Informe Crypto",
    dataDe: "Fecha Desde:",
    dataAte: "Fecha Hasta:",
    customId: "ID Personalizado",
    endtoend: "End To End",
    nome: "Nombre",
    status: "Estado",
    alertPesquisa: "Seleccione el período para buscar",
    semRelatorio: "No hay informes durante este período",
    concluido: "Concluido",
    estornado: "Reembolsado",
    analise: "En Análisis",
    movimentacao: "Movimientos",
    datahora: "Fecha y Hora",
    valCotacao: "Valor de Cotización del Dólar",
    valReal: "Valor Real",
    moeda: "Moneda",
  },

  cambio: {
    cambiotitle: "Cambio",
    moeda: "Moneda: ",
    saldo: "Saldo: ",
    comprarMoeda: "Comprar Moneda",
    saqueMoeda: "Retirar Moneda",
    escolherMoeda: "Seleccionar Moneda",
    valDsj: "Valor Deseado",
    valMoeda: "Valor de la Moneda",
    valLqd: "Valor Líquido",
    taxa: "Tasa",
    tarifa: "Tarifa",
    totalPagar: "Total a Pagar",
    senhaTransfer: "Contraseña de Transacción",
    confirmCompra: "Confirmar Compra",
    campos: "Por favor, rellene los campos para continuar",
    limit: "El valor mínimo de compra es de 10.000",
    timeLimite:
      "Tiempo mínimo para fijar la cotización de 1 minuto, intente de nuevo",
    erroTravar:
      "Error al fijar la cotización, intente nuevamente más tarde o contacte al gerente",
    verifiqueParam: "Verifique los parámetros e intente nuevamente",
    senhaInformer:
      "Es necesario informar la contraseña de transacción para comprar",
    senhaIncorreta: "Contraseña Incorrecta",
    informeCarteira: "Informe la cartera para el retiro",
    informeValorSaque: "Ingrese un valor de retiro válido",
    informeMoedaSaque: "Seleccione una moneda para el retiro",
    informeSenhaSaque: "Ingrese la contraseña para realizar el retiro",
    saqueSuccess: "Retiro en proceso. Verifique el informe de Retiro",
    saqueCod101: "Contraseña incorrecta, intente nuevamente",
    saqueCod105:
      "Parámetros insuficientes, verifique los campos e intente nuevamente",
    saqueCod2:
      "Saldo insuficiente para el retiro, realice una compra para poder retirar más del saldo",
    saquecod104:
      "Error al completar el retiro, intente nuevamente más tarde o contacte al gerente",
    sacar: "Retirar",
    valSaque: "Valor del Retiro",
    carteiraSaque: "Cartera Crypto",
    carregando: "Cargando...",
    placeholderSaque: "Complete la cartera para el retiro",
    erroCompra:
      "Error al realizar la compra, intente nuevamente más tarde o contacte al gerente",
    compraSuccess: "Compra realizada con éxito",
  },

  pix: {
    emailFail: "Correo Electrónico Inválido",
    dgtChave: "Introduzca la clave Pix",
    chaveFail: "Clave Pix no encontrada",
    qrCodeFail: "Clave no encontrada",
    saldoInsuficiente: "Saldo Insuficiente",
    pixCod0:
      "PIX NO DISPONIBLE. Espere unos minutos e intente nuevamente. Si el problema persiste, contacte al soporte al cliente.",
    pixCod1: "¡Pix realizado con éxito!",
    pixCod3: "Pix no realizado, por favor consulte con su gerente",
    pixCod7: "Hubo un problema al generar el Pix, intente nuevamente más tarde",
    pixCod9: "Pix no realizado, intente nuevamente más tarde",
    pixCod10:
      "El sistema detectó múltiples intentos de transferencia en un corto intervalo de tiempo. Espere unos minutos e intente nuevamente.",
    pixCod100: "Contraseña de Transacción Inválida",
    agendarPixSucces: "El Pix se efectuará en hasta 1 hora",
    msgChave: "Ingrese el ",
    msgCell: "Ingrese el Teléfono",
    msgEmail: "Ingrese el Correo Electrónico",
    msgChaveRandom: "Ingrese o pegue la clave Aleatoria",
    msgCopy: "Pegue el Pix aquí",
    celular: "Teléfono Móvil",
    email: "Correo Electrónico",
    chaveRandom: "Clave Aleatoria",
    copyPaste: "Copiar y Pegar",
    pagar: "Pagar",
    receber: "Recibir",
    gerarQrCode: "Generar QR Code",
    modoPix: "Método de Pix",
    pesquisar: "Buscar",
    transferPix: "Transferencia Pix",
    favorecido: "Beneficiario:",
    banco: "Banco: ",
    agConta: "Agencia y Cuenta:",
    doc: "Documento:",
    chavePix: "Clave Pix:",
    valPix: "Valor del Pix:",
    msg: "Mensaje (opcional):",
    dgtSenha: "Ingrese su Contraseña de Transacción",
    tokenPix: "Ingrese el Token enviado por Correo Electrónico",
    btnTransfer: "Transferir",
    receberPix: "Recibir Pix",
    selectKey: "Seleccionar Clave",
    notKey: "Aún no tiene ninguna clave registrada",
    valorQrCode: "Valor: ",
    nomePagador: "Nombre del Pagador",
    docPagador: "Documento del Pagador",
    btnGerarQrCode: "Generar Código QR",
    qrCodeSucces: "Código QR generado con éxito",
    coyCod: "Copiar Código",
    tokenInvalido: "Token inválido",
    erro: "error",
  },
};
