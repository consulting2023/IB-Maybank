// ch-CH.js
export default {
  langInfo: {
    key: 1,
    titulo: "中文",
    pais: "China",
    sigla: "chCH",
    bandeira: require("../assets/paises/china2.png").default,
  },

  login: {
    acesse_sua_conta: "登入账号\n%{banco}",
    info_credenciais: "输入您的 %{banco} 帐户凭据以访问",
    email: "邮件",
    senha: "密码",
    // ou: '或者',
    ou: " 或 ",
    entrar: "进入",
    conheca_produtos: "发现我们的产品!",
    ola: "你好, %{nomeUsuario}",
    como_deseja_logar: "在下方选择您要登录的账户",
    pessoa_fisica: "物理人",
    pessoa_juridica: "法人",
    chave_de_acesso: "访问密钥",
    abra_o_aplicativo:
      "打开 %{banco} 应用程序，使用您的帐户登录，然后在应用程序上的 Access Key 按钮上，您将找到 Token 和 QRCode 以验证 Access Key 以进入网上银行",
    token: "令牌",
    chave_token: "在您的应用程序中输入您的访问密钥生成的令牌",
    qrcode: "QRCode",
    ler_qrcode: "扫描您的访问密钥生成的二维码",
    texto_1: "一个透明的银行，完整的和你的脸，独家产品。",
    texto_2: "您的财务生活更轻松",
    texto_3: " 通过应用程序轻松解决所有问题，并提供真正帮助您的 24 小时服务",

    preencha: "请填写所有字段",
    senhaExpirou: "您的密码已过期，请更改密码",
    senhaIncorreta: "电子邮件或密码错误，请重试",
    esqueciSenha: "忘记密码",
    alertEsqueciSenha: "请填写电子邮件以找回密码",
    modalSenha: "登录密码",
    tokenModalSenha: "令牌已发送到您的电子邮件",
    senhaModalSenha: "新密码",
    alertaCombinacoes: "注意",
    tokenEnviado: "令牌已发送到电子邮件",
    alertSemSenha: "必须填写密码才能继续",
    alertSemToken: "必须填写令牌才能继续",
    alertSenhaAlteradaComSucesso: "密码修改成功！",
    alertErroAlterarSenha: "修改密码时出错，请稍后再试",
    tituloContaNãoAprovada: "帐户未批准",
    contaNãoAprovada: "帐户未批准，请联系经理了解更多信息",
    cadastrar: "注册",
    selecionarConta: "请选择要注册的账户类型",

    erroInterno: "内部错误",
    captchaLang: "zh-CN",
    erro: "错误",
    requisicaoNaoPermitida: "请求不允许",
    erroConexao: "连接错误",
    tenteRecarregarPagina: "尝试重新加载页面",
    tokenInvalido: "无效的令牌",
    confirmeSuaIdentidadeInserindo: "请通过在应用中找到的访问密钥确认您的身份",
    ouEscaneandoEste: "或者通过应用扫描此二维码",
  },

  home: {
    saldoDigital: "银行账",
    ultiMov: "最新交易",
    saldoBloqueado: "余额已冻结",
    saldoCartao: "卡",
    saldoConvenio: "健康保险",
    saldoInvestimento: "投资",
    acoesRapida: "快速操作",
    btnAcoesRapida1: "存款",
    btnAcoesRapida2: "转账",
    btnAcoesRapida3: "付款",
    btnAcoesRapida4: "对账单",
    ultLancamentos: "最后交易",
    descr: "备注",
    descrValor: "金额 R$",
    descrData: "日期",
    descrNome: "%{descricao}",
    verMais: "查看",
    hey: "你好！",
    proprietaryAccounts: "专有账户",
    proprietaryAccountBalance: "专有账户余额",
    conta: "账户",
    saldo: "余额",
    saldoNull: "不可用",
    transactionalAccounts: "交易账户",
    transactionalAccountBalance: "交易账户余额",
  },

  extrato: {
    alertaCartao: "您没有激活卡",
    btnExtratoDigital: "银行对账单",
    btnExtratoCartao: "银行卡对账单",
    btnExtratoConvenio: "健康保险",
    btnExtratoInvestimento: "投资",
    btnExtratoParcelado: "分期付款",
    btnExtratoAgenda: "财务行程",
    modalCartaoAtivo: "您没有解锁卡",
    fecharModal: "关闭",
    breadCrumb1: "主页面",
    breadCrumb2: "对账单",
    breadCrumb3: "银行对账单",
    textoEscolhaExtrato: "选择想要查看对账单的时间段:",
    dataInicio: "初始日期:",
    dataFinal: "最终日期:",
    btnPesquisar: "搜索",
    downloadPdf: "下载 PDF",
    downloadCsv: "下载 CSV",
    saldo: "银行账",
    descr: "备注",
    descrValor: "金额 R$",
    descrData: "日期",
    descrNome: "%{descricao}",

    nenhumEncontrado: "所选日期未发现任何变动",
    extrato: "对账单",
    nenhumLancamento: "未找到",
  },

  deposito: {
    btnDepositoBoleto: "付款单存款",
    btnDepositoGerenciar: "管理付款单",
    btnDepositoTED: "TED/DOC 存款",
    btnDepositoComprovante: "发送凭证",
    breadCrumb1: "主页面",
    breadCrumb2: "存款",
    breadCrumb3: "管理付款单",
    textoEscolhaDeposito: "选择想要查看付款单的时间段",
    dataInicio: "初始日期:",
    dataFinal: "最终日期:",
    btnPesquisar: "搜索",
    btnVoltar: "返回",
    descr: "户名",
    descrNumero: "我们的号码",
    descrValor: "金额 R$",
    descrVencimento: "截止日期",
    descrStatus: "状态",
    downloadPdf: "下载 PDF",
    textBoleto: "简单的获取金额",
    dataVencimento: "截止日期",
    gerarBoleto: "生成付款单",
    fecharBoleto: "关闭",
    textTED: "只需要使用以下数据向您的账户汇款 ",
    alertTED:
      "注意：\n 在您的 DOC 或 TED 的备注字段中 填写 CPF/CNPJ 或您的帐户 ",
    textComp: "若有存款，请发送您的凭证给我们",
    eschComp: "选择凭证",
    enviarComp: "发送凭证",

    nenhumBoleto: "未找到所选日期的付款单",
    boletoGerado: "生成付款单成功，管理付款单",
    erroGerar: "生成付款单失败，请稍后再试",
    pago: "已付",
    emAberto: "未付",
    vencido: "过期",
    formatoInvalido: "无效的文件格式",
    falhaComprovante: "发送凭证失败",
    upload: "上传需要选择一个文件",
    comprovanteEnviado: "凭证发送成功",
    falhaComprovanteTente: "发送凭证失败，请稍等再试",
    deposito: "存款",
  },

  comprovante: {
    compDigital: "银行账户",
    compCartao: "卡账户",
    compConvenio: "健康保险",
    compServicos: "服务",
    compParcelado: "分期付款",
    compInvestimento: "投资",
    breadCrumb1: "主页面",
    breadCrumb2: "凭证",
    breadCrumb3: "账户凭证",
    textEscolhaComprovante: "选择想要查看凭证的时间段:",
    dataInicio: "初始日期:",
    dataFinal: "最终日期:",
    btnPesquisar: "搜索",
    valor: "金额: ",
    data: "日期: ",
    downPDf: "下载 PDF",

    nenhumComprovante: "未找到所选日期的凭证",
    nenhumCartao: "您没有激活卡",
    comprovantes: "凭证",
  },

  cobranca: {
    btnBoletoCobranca: "付款单",
    btnLoteCobranca: "多张付款单",
    btnPagadorCobranca: "新增付款人",
    btnGerarBoletoCobranca: "生成付款单",
    btnGerenciarBoletoCobranca: "管理付款单",
    btnGerarLoteCobranca: "生成多张付款单",
    btnGerenciarLoteCobranca: "管理多张付款单",
    btnCadastrarPagadorCobranca: "新增付款人",
    btnGerenciarPagadorCobranca: "管理付款人",
    textGerarBoleto: "填写以下数据可生成您的付款单",
    valorBoleto: "金额 R$ *",
    vencimentoBoleto: "截止日期",
    multaBoleto: "罚款",
    jurosBoleto: "每日利息",
    descontoBoleto: "折扣",
    abatimentoBoleto: "回扣",
    pagadorBoleto: "付款人 *",
    notaBoleto: "发票 或者 证件",
    descBoleto: "备注",
    gerarBoleto: "生成付款单",
    downBoleto: "下载PDF",
    textGerenciarBoleto: "选择您希望查看的时间段:",
    dataInicialBoleto: "初始日期:",
    dataFinalBoleto: "最终日期:",
    todosBoleto: "全部",
    pagoBoleto: "已付款",
    abertoBoleto: "未付",
    vencidoBoleto: "过期",
    sacadoBoleto: "收款人:",
    statusBoleto: "状态:",
    dataVencimentoBoleto: "截止日期:",
    valorGerenciarBoleto: "金额 R$:",
    textLote: "发送 CSV 生成多张付款单",
    arqLote: "CSV 文件",
    escolherArqLote: "选择CSV档案",
    verificarLote: "查看",
    exemploLote: "下载 CSV",
    textGerenciarLote: "选择",
    nomeArqLote: "文件名称: ",
    dataLote: "日期: ",
    qtdRegistroLote: "数量记录: ",
    registradosLote: "记录: ",
    errosLote: "错误: ",
    erroLinhaLote: "垂直线错误: ",
    msgErroLote: "信息: ",
    sacadoLote: "付款人: ",
    statusLote: "状态: ",
    vencimentoLote: "截止日期: ",
    valorLote: "金额: ",
    dwnPDFLote: "下载PDF",
    textEditarSacado: "编辑付款人的信息",
    pagadorSacado: "付款人",
    nomeSacado: "CPF/CNPJ",
    documentoSacado: "CPF/CNPJ",
    cepSacado: "CEP 居住地",
    pesquisarCepSacado: "搜寻 CEP",
    enderecoSacado: "地址",
    numeroSacado: "号码",
    complementoSacado: "补码",
    ufSacado: "州",
    municipioSacado: "城市",
    bairroSacado: "区",
    btnSacado: "更新",
    textCadastrarPagador: "请填写付款人的信息才可登记",
    btnPagador: "登记",

    digiteNome: "请输入名字",
    digiteDoc: "请输入证件",
    digiteLog: "请输入地址",
    digiteNumero: "请输入号码",
    digiteBairro: "请输入区",
    digiteCEP: "请输入 CEP 居住地",
    digiteMunicipio: "请输入城市",
    digiteEstado: "请输入州",
    falhaCadastro: "注册失败，请稍后再试",
    falhaAtualizacao: "更新失败，请稍后再试",
    falhaCEP: "CEP inválido",
    pagadorCadastrado: "付款人注册成功！",
    pagadorAtualizado: "付款人更新成功",
    funcLiberada:
      "您没有释放此功能，请通过以下方式联系我们: %{email_banco} %{telefone_banco}",
    digiteValor: "输入金额",
    escolhaPagador: "选择付款人",
    boletoGerado: "付款单生成成功",
    erroGerarTente: "生成付款单失败，请稍后再试",
    erroGerarJuros: "生成付款单失败，每月利息不能超过3%",
    vencido: "过期",
    emAberto: "未付",
    pagoEm: "已付: %{dataPago}",
    pago: "已付",
    nenhumBoleto: "未找到付款单",
    dataFinal: "截止日",
    nenhumArquivo: "未找到任何文件",
    formatoInvalido: "无效的文件格式",
    erroCSV: "CVS 文件错误，请查看: %{erroMsg}",
    analiseCSV: "分析CSV中，请在管理多张付款单追踪",
    escolhaCSV: "请选择CSV文件",
    nenhumFavorecido:
      "您没有注册任何收款人，要生成您的付款单，请先注册一个收款人",
    cobranca: "收款",
  },

  pagar: {
    linhaDigital: "付款单号码",
    btnConsultar: "咨询",
    dadosBoleto: "付款单的: ",
    favorecido: "收款人: ",
    valorDocumento: "金额: ",
    desconto: "折扣: ",
    jurosMora: "利息: ",
    multa: "罚款: ",
    totalEncargo: "总费用: ",
    vencimento: "截止日期: ",
    totalPagar: "总费用: ",
    codigoBarras: "条码: ",
    btnVoltar: "返回",
    btnProximo: "下一步",
    titleModalValidacao: "雙重身份驗證",
    textModalValidacao: "输入您的密碼並登录帳戶 %{nome_banco} 确认验证码",
    tokenValidacao: "验证码",
    titleSenha: "密码",
    textSenha: "填写密码",
    titleToken: "验证码",
    textTokenDescr: "填写验证码",
    btnPagar: "付款",

    diaUtil: "只可在工作日付款",
    foraHorario: "超过允许的时间付款",
    invalido: "条码无效",
    boletoPropria: "不可付付款单 %{nome_banco}",
    saldoInsuficiente: "余额不足",
    erroSenha: "密码或者验证码错误",
    sucesso: "付款成功\n查看凭证",
    tente: "未完成支付\n请稍后再试",
    pagar: "付款",
  },

  perfil: {
    dadosPessoais: "个人讯息",
    celular: "手机号码",
    estadoCivil: "婚姻状态",
    documento: "CPF/CNPJ",
    cep: "CEP 居住地",
    endereco: "地址",
    numero: "号码",
    completo: "号码",
    bairro: "区",
    cidade: "城市",
    estado: "州",
  },

  qrcode: {
    qrCode: "二维码",
    textQRCode: "这是您的 %{nome_banco} 二维码，分享，下载或打印可使用",
    btnQRCOde: "下载二维码",
  },

  transferencia: {
    btnEntraContas: "%{nome_banco} 账户之间",
    btnParaOutros: "其他银行",
    btnLote: "多次转账",
    textInterna: "選擇如何在帳戶之間转账",
    btnBuscarConta: "搜寻账户",
    btnBuscarTelefone: "搜寻手机号码",
    btnBuscarDocumento: "搜寻 CPF/CNPJ",
    textTelefone: "手机号码",
    btnPesquisar: "搜索",
    btnFechar: "关闭",
    textDocumento: "CPF/CNPJ",
    textAgencia: "分行代码",
    textConta: "账户",
    textDigito: "号码",
    textSelecionarConta: "以下选择账户",
    nomeConta: "名字:",
    agenciaConta: "分行代码:",
    contaConta: "账户:",
    textDadosFavorecido: "收款人:",
    saldo: "余额",
    valor: "金额 R$",
    titleLote: "发送 CSV 文件 即可多次转账",
    textLote: "CSV 文件",
    textEscolhaLote: "选择 CSV 文件",
    btnVerificarLote: "查看",
    btnDownLote: "下载 CSV",

    titleTransfOutros: "填写以下数据才可转账给其他银行",
    textBanco: "银行 *",
    selectBanco: "选择一间银行",
    textOutrosBancos: "其他银行",
    agenciaTransfOutros: "分行代码 *",
    digAgTransfOutros: "号码",
    contaTransfOutros: "账户 *",
    digitoTransfOutros: "号码 *",
    tipoConta: "什么账户 *",
    selecTipoConta: "选择账户",
    pesquisarBanco: "搜寻: ",
    documentoTransfOutros: "CPF/CNPJ *",
    favorecidoTransfOutros: "收款人 *",
    valorTransfOutros: "金额 *",
    finalidadeTransfO即可多次转账utros: "目的 *",
    selectFinalidadeTransfOutros: "选择目的",
    tranfDescrOutros: "* 必须填写!",
    titleConfirmeDados: "请确认以下数据才可转账",
    bancoConfirmeDados: "银行: ",
    contaConfirmaDados: "账户: ",
    agenciConfirmeDados: "分行代码: ",
    digitoConfirmeDados: "号码: ",
    tipoContaConfirmeDados: "什么账户: ",
    documentoConfirmeDados: "CPF/CNPJ: ",
    favorecidoConfirmeDados: "收款人: ",
    valorConfirmeDados: "金额: ",
    btnCancelar: "取消",

    btnTransferir: "转账",
    titleModalValidacao: "雙重身份驗證",
    textModalValidacao: "输入您的密碼並登录帳戶 %{nome_banco} 确认验证码 ",
    tokenValidacao: "验证码",
    titleSenha: "密码",
    textSenha: "输入密码",
    titleToken: "验证码",
    textTokenDescr: "填写验证码",

    erroSenha: "密码或者验证码错误",
    sucesso: "转账成功",
    analise: "出于安全原因正在审查转账",
    erroTransferencia: "转账失败",
    erroNumero: "此号码未找到帐户",
    erroDoc: "此证件找到帐户",
    funcionalidade:
      "您没有释放此功能，请通过以下方式联系我们: %{email_banco} %{telefone_banco}",
    formatoInvalido: "无效的文件格式",
    escolhaCSV: "选择CSV文件",
    erroCSV: "CVS 文件错误，请查看: %{erroMsg}",
    sucessoVerifique: "转战成功！查看对账单",
    escolhaBanco: "选择银行",
    digiteAgencia: "输入分行代码",
    digiteConta: "输入账户",
    digiteDigito: "输入号码",
    escolhaTipo: "选择账户",
    erroCPF: "CPF 无效",
    erroCNPJ: "CNPJ 无效",
    digiteCPF: "输入CPF或CNPJ",
    digiteFavorecido: "输入收款人名字",
    digiteValor: "输入金额",
    finalidade: "选择目的",
    erroSaldo: "余额不足",
    credito: "帐户信用",
    pagarAluguel: "付款房租/共管公寓",
    pagarTitulos: "付款证券",
    pagarDividendos: "付款分红",
    pagarMensalidade: "付款学费",
    pagarSalario: "付款薪水",
    pagarFornecedor: "付款供应商/费用",
    operacoes: "付款外汇/基金/证券交易所",
    repasse: "付款税款征收/缴纳税务",
    internacional: "付款国际汇款",
    docPoupanca: "付款DOC储蓄账户",
    docDeposito: "付款DOC司法存款",
    outros: "其他",
    bolsa: "付款奖学金",
    remuneracao: "付款合作社成员报酬",
    contaCorrente: "付款活期存款账户",
    contaPoupanca: "付款储蓄账户",
    digiteNumeroConta: "输入账号",
    transferencia: "转账",
    loteCod304: "银行号码不正确。预期值是 '000'。",
    loteCod301: "未找到提供的账户。请检查。",
    loteCod302: "记录中缺少数据。请检查必填字段。",
    loteCod303: "提供的金额不能为零。请输入有效的金额。",
    loteCod305: "提供的银行分行与提供的账户不匹配。请检查数据。",
    loteCod306: "提供的文件与提供的账户不匹配。请检查数据。",
    loteCod307: "CSV文件缺少字段或字段顺序错误。请调整文件。",
    semErro: "没有错误",
  },

  escolha_cartao: {
    ativar: "激活卡片",
    carregar1: "充值卡片",
    trocarSenha: "更改密码",
    detalhes: "详细信息",
    aquisicao: "• 一键享受所有优势！",
    aquisicaoDesc1:
      "为获得您的 %{nome_banco} 卡，您将一次性收取 R$ %{tarifa}，该费用将从您的数字账户中扣除。只需账户中有余额即可。",
    selecao: "选择您偏好的 %{nome_banco} 卡颜色",
    termos: "阅读使用条款",
    confirme: "要激活您的 %{nome_banco} 卡，请确认一些信息：",
    nome: "姓名：",
    telefone: "电话：",
    textoDescricao:
      "如果信息不正确，请通过 %{email_banco} 联系 %{nome_banco} 客服",
    token: "请输入您通过短信收到的激活代码，发送到您的手机",
    instrucao: "请输入卡号上的代码，它位于卡号上方和有效期下方",
    digite: "请输入您 %{nome_banco} 卡的最后四位数字",
    crieSenha: "为您的 %{nome_banco} 卡创建一个四位数字密码",
    desbloqueio: "恭喜！您的 %{nome_banco} 卡已成功解锁，享受吧！",
    carregar: "您想如何为您的卡充值？",
    transferencia: "转账",
    boleto: "生成一个账单来充值您的卡",
    valorBoleto: "账单金额",
    vencimento: "到期日",
    transferenciaRapida: "卡片之间快速转账。",
    codigo: "请输入您的卡片识别代码，它位于有效期下方。",
    mostrarValor: "您想转账多少钱到 %{nome_cartao}？",
    valor: "金额 R$",
    senha: "密码",
    boletoGerado: "账单生成成功！",
    pagador: "付款人",
    nossoNumero: "我们的号码",
    emissao: "发行",
    validade: "有效期",
    codigoBarras: "条形码",
    bloquear: "在这里您可以锁定或解锁您的 %{nome_banco} 卡",
    cartao: "卡片：",
    id: "ID：",
    status: "状态：",
    solicitar: "申请卡片",
  },
  ajustes: {
    ola: "您好，欢迎来到 %{nome_banco}",
    manutencao: "%{nome_banco} 的網上銀行業務",
    // manutencao1: '的 網上銀行業務',
    // manutencao2: '现在正在维护当中！',
    retornaremos: "我们很快就会恢复正常",
    info: "更多的细节请联系我们: ",
  },

  sidebar: {
    home: "首页",
    extrato: "账户明细",
    transferencia: "转账",
    deposito: "存款",
    comprovantes: "凭证",
    pagamento: "支付",
    cobranca: "收费",
    pix: "Pix",
    servico: "服务",
    cartoes: "卡片",
    qrcode: "二维码",
    tarifas: "费用",
    gratuito: "免费/月: ",
    tarifaTitulo: "数字账户费用",
    tarifaCol: "费用",
    tarifaValor: "金额",
    tarifaFechar: "关闭",
    senha: "密码",
    cambio: "汇率",
    relatorio: "报告",
  },

  header: {
    ola: "您好, ",
    conta: "银行代码: ",
    agencia: "分行代码: ",
    empresa: "公司: ",
    perfil: "个人档案",
    nenhumaNotif: "没有新消息",
    novaNotif: "您好 ",
    lidoNotif: "已读",
    cancelarNotif: "取消",
    sair: "退出",
  },
  senha: {
    senhaTitle: "密码",
    senhaLogin: "登录密码",
    senhaTransfer: "交易密码",
    token: "令牌已发送到您的电子邮件",
    senhaNova: "新密码",
    senhaTransferNova: "新交易密码",
    alertSemSenha: "必须填写密码才能继续",
    alertSemToken: "必须填写令牌才能继续",
    alertSenhaAlteradaComSucesso: "密码修改成功！",
    alertErroAlterarSenha: "修改密码时出错，请稍后再试",
  },
  relatorio: {
    relatorio: "报告",
    relatorioPixOut: "Pix 支出报告",
    relatorioPixIn: "Pix 收入报告",
    relatorioCrypto: "加密货币报告",
    dataDe: "起始日期：",
    dataAte: "结束日期：",
    customId: "自定义ID",
    endtoend: "端到端",
    nome: "姓名",
    status: "状态",
    alertPesquisa: "选择查询的时间段",
    semRelatorio: "此期间没有报告",
    concluido: "已完成",
    estornado: "已退款",
    analise: "审核中",
    movimentacao: "交易记录",
    datahora: "日期和时间",
    valCotacao: "美元汇率",
    valReal: "实际金额",
    moeda: "货币",
  },

  cambio: {
    cambiotitle: "汇率",
    moeda: "货币",
    saldo: "余额",
    comprarMoeda: "购买货币",
    saqueMoeda: "取款货币",
    escolherMoeda: "选择货币",
    valDsj: "期望金额",
    valMoeda: "货币金额",
    valLqd: "净值",
    taxa: "费用",
    tarifa: "收费",
    totalPagar: "总支付金额",
    senhaTransfer: "交易密码",
    confirmCompra: "确认购买",
    campos: "请填写字段以继续",
    limit: "最低购买金额为10,000",
    timeLimite: "锁定汇率的最短时间为1分钟，请再试一次",
    erroTravar: "锁定汇率时出错，请稍后再试或联系经理",
    verifiqueParam: "请检查参数并重试",
    senhaInformer: "购买时需要提供交易密码",
    senhaIncorreta: "密码错误",
    informeCarteira: "请输入钱包地址以进行取款",
    informeValorSaque: "请输入有效的取款金额",
    informeMoedaSaque: "选择一种货币进行取款",
    informeSenhaSaque: "请输入取款密码",
    saqueSuccess: "取款处理中！请查看取款报告",
    saqueCod101: "密码错误，请重试",
    saqueCod105: "参数不足，请检查字段并重试",
    saqueCod2: "取款余额不足，请购买以便取出更多金额",
    saquecod104: "完成取款时出错，请稍后再试或联系经理",
    sacar: "取款",
    sacar: "取款",
    valSaque: "取款金额",
    carteiraSaque: "加密钱包",
    carregando: "加载中...",
    placeholderSaque: "请填写取款钱包",
    erroCompra: "购买时出错，请稍后再试或联系经理",
    compraSuccess: "购买成功",
  },

  pix: {
    emailFail: "无效的电子邮件",
    dgtChave: "输入Pix密钥",
    chaveFail: "未找到Pix密钥",
    qrCodeFail: "未找到密钥",
    saldoInsuficiente: "余额不足",
    pixCod0:
      "PIX不可用！请稍等几分钟后再试。如果问题仍然存在，请联系客户支持以获得帮助。",
    pixCod1: "Pix成功完成！",
    pixCod3: "Pix未成功，请咨询您的经理",
    pixCod7: "生成Pix时出现问题，请稍后再试",
    pixCod9: "Pix未完成，请稍后再试",
    pixCod10: "系统检测到在短时间内多次尝试转账。请稍等几分钟后再试。",
    pixCod100: "无效的交易密码",
    agendarPixSucces: "Pix将在1小时内完成",
    msgChave: "输入",
    msgCell: "输入手机号码",
    msgEmail: "输入电子邮件",
    msgChaveRandom: "输入或粘贴随机密钥",
    msgCopy: "在此粘贴Pix",
    celular: "手机号码",
    email: "电子邮件",
    chaveRandom: "随机密钥",
    copyPaste: "复制粘贴",
    pagar: "支付",
    receber: "接收",
    gerarQrCode: "生成二维码",
    modoPix: "Pix方式",
    pesquisar: "搜索",
    transferPix: "Pix转账",
    favorecido: "收款人：",
    banco: "银行：",
    agConta: "分行和账户：",
    doc: "文件：",
    chavePix: "Pix密钥：",
    valPix: "Pix金额：",
    msg: "消息（可选）：",
    dgtSenha: "输入您的交易密码",
    tokenPix: "输入通过电子邮件发送的令牌",
    btnTransfer: "转账",
    receberPix: "接收Pix",
    selectKey: "选择密钥",
    notKey: "您还没有注册任何密钥",
    valorQrCode: "金额：",
    nomePagador: "付款人姓名",
    docPagador: "付款人文件",
    btnGerarQrCode: "生成二维码",
    qrCodeSucces: "二维码生成成功",
    coyCod: "复制代码",
    tokenInvalido: "无效的令牌",
    erro: "错误",
  },
};
