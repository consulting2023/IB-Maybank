import * as moment from "moment";

export function formatarDate($data) {
  let today = new Date($data).toLocaleDateString("pt-BR");
  return today;
}

export function formatarDateGerenciadorBoletos(data) {
  if (data) {
    let ano = data.split("-")[0];
    let mes = data.split("-")[1];
    let dia = data.split("-")[2];

    return dia + "/" + mes + "/" + ano;
  }
}

export function formatarDateGerenciadorBoletosComparativo(data) {
  let ano = data.split("-")[0];
  let mes = data.split("-")[1];
  let dia = data.split("-")[2];

  return ano + "/" + mes + "/" + dia;
}

export function formatarDateDiaMesAno(data) {
  let dia = data.split("/")[0];
  let mes = data.split("/")[1];
  let ano = data.split("/")[2];

  return ano + "/" + mes + "/" + dia;
}

export function formatarMoeda($valor) {
  let moeda = Number($valor).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  return moeda;
}

export function formatReal(amount) {
  var decimalCount = 2;
  var decimal = ",";
  var thousands = ".";

  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
}

export function formatarDateSave($data) {
  return moment(new Date($data)).format("DD/MM/YYYY");
}

export function formatarDateAno($data) {
  return moment(new Date($data)).format("YYYY-MM-DD");
}

export function formatarDateAnoComparativo($data) {
  return moment(new Date($data)).format("YYYY/MM/DD");
}

export function formatarDateMesAno($data) {
  return moment(new Date($data)).format("MM/YY");
}

export function formatarDateDiaMes($data) {
  return moment(new Date($data)).format("DD/MM");
}

export function formatarDateMesInterpolacao($data1, $data2) {
  var dates = [];

  var firstDate = moment($data1).startOf("day");
  var lastDate = moment($data2).startOf("day");

  dates.push(moment(firstDate.toDate()).format("DD/MM"));
  while (firstDate.add(1, "days").diff(lastDate) < 0) {
    dates.push(moment(firstDate.clone().toDate()).format("DD/MM"));
  }
  dates.push(moment(lastDate.toDate()).format("DD/MM"));
  return dates;
}

export function cpf_mask(cpf) {
  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return cpf;
}

export function cnpj_mask(cnpj) {
  cnpj = cnpj.replace(/\D/g, "");
  cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
  cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
  return cnpj;
}

export function cel_mask(num) {
  num = num.replace(/\D/g, "");
  num = num.replace(/(\d{2})(\d)/, "($1) $2");

  if (num.replace(/\D/g, "").length > 10) {
    num = num.replace(/(\d{5})(\d)/, "$1-$2");
  } else {
    num = num.replace(/(\d{4})(\d)/, "$1-$2");
  }
  return num;
}

export function cnae_mask(cnae) {
  cnae = cnae.replace(/\D/g, '');
      if (cnae.length <= 4) {
        cnae = cnae.replace(/^(\d{1,4})$/, '$1');
    } else if (cnae.length === 5) {
        cnae = cnae.replace(/^(\d{4})(\d{1})$/, '$1-$2');
    } else if (cnae.length <= 7) {
        cnae = cnae.replace(/^(\d{4})(\d{1})(\d{0,2})$/, '$1-$2/$3');
    }
  return cnae;
}

export function cep_mask(cep) {
    cep = cep.replace(/\D/g, '');

    if (cep.length <= 5) {
        cep = cep.replace(/^(\d{1,5})$/, '$1');
    } else if (cep.length === 6) {
        cep = cep.replace(/^(\d{5})(\d{1})$/, '$1-$2');
    } else if (cep.length <= 8) {
        cep = cep.replace(/^(\d{5})(\d{1})(\d{0,3})$/, '$1-$2$3');
    }
    return cep;
}

export function formatarTelefone(value) {
  // Remove caracteres não numéricos
  value = value.replace(/\D/g, "");

  if (value.length <= 10) {
    // Formato de telefone fixo: (XX) XXXX-XXXX
    return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  } else {
    // Formato de celular: (XX) XXXXX-XXXX
    return value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3");
  }
}

export function TestaCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj == "") return false;

  if (cnpj.length != 14) return false;

  if (
    cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999"
  )
    return false;

  var tamanho = cnpj.length - 2;
  var numeros = cnpj.substring(0, tamanho);
  var digitos = cnpj.substring(tamanho);
  var soma = 0;
  var pos = tamanho - 7;
  for (var i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  var resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
}

export function decimalMask(num) {
  num = num.toString().replace(".", ",");
  return num;
}

export function formatarDateAnoHora($data) {
  return moment(new Date($data)).format("YYYY-MM-DD HH:mm");
}

export function formatarDateAnoHoraSegundo($data) {
  return moment(new Date($data)).format("YYYY-MM-DD HH:mm:ss");
}
