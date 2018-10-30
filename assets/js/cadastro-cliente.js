var baseUrl = "http://192.168.0.110:8080";
var clienteId = 0;
ready();

//$(document).ready(function(){
function ready() {

    /*
    var qs = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

    var varGet1 = qs["id"]; // 123
    alert(varGet1);
    */
    clienteId = $(".content").attr("id");

    setaMascaraCampos();
		
	//Chama funções para buscar os Estados e popular na tela
    myUrl = baseUrl+"/api/Locais/GetListaEstados?siglaPais="+"BR";
	carregarDados(function (response){
		populaCampoEstado(response);
	}, myUrl);
	
	//Chama funções para buscar Cidades e popular na tela
    myUrl = baseUrl+"/api/Locais/GetListaCidadesAtualizadas?dataAt="+"1900-01-01 00:00:00";
	carregarDados(function (response){
		populaCampoCidade(response);
    }, myUrl);

    //Se o ID estiver populado é porque o registro já existe e, neste caso, deve ser alterado.
    if (clienteId != "0") {
        myUrl = baseUrl + "/api/Cliente/GetCliente?id="+clienteId;
        carregarDados(function (response) {
            populaCamposTela(response);
        }, myUrl);
    }
    
    $("#btn-voltar").click(function () {
        $(".content").attr("id", "0");
        $(".content").load('clientes.html');
	});
	
	$("#btn-salvar").click(function(){
		
		limpaFormatacaoErroCampos();
		
		if (validaCampos()){
			
			//Chama o método para buscar a cidade e em seguida enviar o objeto Cliente ao servidor
			buscaCidade($("#cidade option:selected").attr("id"));

		}
	});
	
	
	$("#cep").blur(function(){
		pesquisaCep($("#cep").val());
	});
	
}
//});

function carregarDados(response,myUrl){
	var retorno;
	
	$.ajax({
		type: "GET",
		url: myUrl,
		//data: {conceitoId:1},
		/*beforeSend: function(xhr){
			xhr.setRequestHeader('X-Auth-Token', token);
		},*/
		success: function(data)
		{
			if (data != null){
				//alert(JSON.stringify(data));
				//retorno = $.parseJSON(data);
				retorno = data;
				if (retorno.status == "SUCCESS"){
					response(retorno);  
				}else{
					bootbox.alert("Status: "+retorno.message);
				}
			}else{
				bootbox.alert("Status: "+retorno.message);
			}
			 
		},
		error: function (data, status, errorThrown) {
			bootbox.alert("Erro: "+data.error);
		}

	});
	
}


function populaCampoEstado(response){
	if (response != null){
		var dados = response.data;
		var option = '<option>Selecione</option>';
		
		$.each(dados, function(index,data){
			
            option += '<option id="' + data.IDWS + '" value="' + data.Sigla+'">'+data.Descricao+'</option>';
		});
		$("#estado").html(option).show();
	}
}

function populaCampoCidade(response){
	if (response != null){
		var dados = response.data;
		var option = '<option>Selecione</option>';
		
		$.each(dados, function(index,data){
			
            option += '<option id="'+data.IDWS+'" value="'+data.Descricao+'">'+data.Descricao+'</option>';
		});
		$("#cidade").html(option).show();
	}
}

function populaCamposTela(response) {
    if (response != null) {

        var dados = response.data;

        if (dados.Ativo == 1) {
            $("#ativo").prop("checked", true);
        } else {
            $("#ativo").prop("checked", false);
        }

        $("#cod").val(dados.Cod);
        $("#raz-social").val(dados.RazaoSocial);
        $("#nome-fantasia").val(dados.NomeFantasia);
        $("#cnpj").val(dados.Cnpj);
        $("#insc-estadual").val(dados.InscricaoEstadual);
        $("#email").val(dados.Email);
        $("#fone").val(dados.Fone);
        $("#cep").val(dados.Cep);
        $("#estado").val(dados.Cidade.Estado.Sigla);
        $("#cidade").val(dados.Cidade.Descricao);
        $("#bairro").val(dados.Bairro);
        $("#logradouro").val(dados.Logradouro);
        $("#numero").val(dados.Numero);
        $("#dtCadastro").val(dados.DtCadastro);


    }
}

function validaCampos(){
	
	if ($("#cod").val() == ""){
		$("#cod").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Código deve ser informado!");
	}else if ($("#raz-social").val() == ""){
		$("#raz-social").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Razão Social deve ser informado!");
	}else if($("#cnpj").val() == ""){
		$("#cnpj").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo CNPJ deve ser informado!");
	}else if(!validaCNPJ($("#cnpj").val())){
		$("#cnpj").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O CNPJ informado não é válido.");
	}else if($("#email").val() == ""){
		$("#email").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Email deve ser informado!");
	}else if(!validaEmail($("#email").val())){
		$("#email").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O Email informado não é válido.");
	}else if($("#fone").val() == ""){
		$("#fone").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Fone deve ser informado!");
	}else if(!validaTelefone($("#fone").val())){
		$("#fone").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O Fone informado não é válido!");
	}else if($("#cep").val() == ""){
		$("#cep").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo CEP deve ser informado!");
	}else if(!validaCep($("#cep").val())){
		$("#cep").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O CEP informado não é válido!");
	}else if($("#estado").val() == ""){
		$("#estado").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Estado deve ser informado!");
	}else if($("#cidade").val() == ""){
		$("#cidade").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Cidade deve ser informado!");
	}else if($("#bairro").val() == ""){
		$("#bairro").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Bairro deve ser informado!");
	}else if($("#logradouro").val() == ""){
		$("#logradouro").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Logradouro deve ser informado!");
	}else if($("#numero").val() == ""){
		$("#numero").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Número deve ser informado!");
	}else{
		return true;
	}
	
	return false;
	
}

function setaMascaraCampos(){
	
	$("#cnpj").mask("99.999.999/9999-99");
	$("#fone").mask("(99) 99999-9999");
	$("#cep").mask("99999-999");
	
}

function validaCNPJ(cnpj) {
	
	var soma =0;
	var j = 5;
	var digito;
	
	cnpj = cnpj.replace(/[^\d]+/g,'');
	
	// Elimina CNPJs invalidos conhecidos
	if (cnpj == "00000000000000" || 
		cnpj == "11111111111111" || 
		cnpj == "22222222222222" || 
		cnpj == "33333333333333" || 
		cnpj == "44444444444444" || 
		cnpj == "55555555555555" || 
		cnpj == "66666666666666" || 
		cnpj == "77777777777777" || 
		cnpj == "88888888888888" || 
		cnpj == "99999999999999"){
		return false;
	}
	for (i=0;i < 12;i++){
		soma += j*cnpj.substr(i,1);
		j--;
		if(j<2){
			j = 9;
		}
	}
	digito = soma % 11;
	
	if (digito < 2){
		digito = 0;
	}else{
		digito = 11 - digito;
	}
	
	if (cnpj.substr(12,1) != digito ){
		return false;
		
	}else{
		j = 6;
		soma = 0;
		for (i=0;i < 13;i++){
			soma += j*cnpj.substr(i,1);
			j--;
			if(j<2){
				j = 9;
			}
		}
		digito = soma % 11;
		
		if (digito < 2){
			digito = 0;
		}else{
			digito = 11 - digito;
		}
		
		if(cnpj.substr(13,1) != digito){
			return false;
		}
	}
	return true;
}

function validaEmail(email){
	var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	if(!filter.test(email)){
		return false;
	}else{
		return true;
	}
}

function validaTelefone(fone){
	fone = fone.replace(/[^\d]+/g,'');
		
	var filter = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
	if (!filter.test(fone)){
		return false;
	}else{
		return true;
	}
}

function validaCep(cep){
		
	var filter = /^[0-9]{5}-[0-9]{3}$/;
	if (!filter.test(cep)){
		return false;
	}else{
		return true;
	}
}

function limpaFormatacaoErroCampos(){

	$("#cod").parent().attr("class", "form-group");
	$("#raz-social").parent().attr("class", "form-group");
	$("#cnpj").parent().attr("class", "form-group"); 
	$("#cnpj").parent().attr("class", "form-group"); 
	$("#email").parent().attr("class", "form-group"); 
	$("#email").parent().attr("class", "form-group"); 
	$("#fone").parent().attr("class", "form-group"); 
	$("#cep").parent().attr("class", "form-group"); 
	$("#estado").parent().attr("class", "form-group"); 
	$("#cidade").parent().attr("class", "form-group"); 
	$("#bairro").parent().attr("class", "form-group"); 
	$("#logradouro").parent().attr("class", "form-group"); 
}

function limpaFormularioCep(){

	//Limpa valores do formulário de cep.
	document.getElementById('logradouro').value=("");
	document.getElementById('bairro').value=("");
	document.getElementById('estado').value=("");
	document.getElementById('cidade').value=("");

}

function cepCallback(conteudo) {
	
	if (!("erro" in conteudo)) {
		//Atualiza os campos com os valores.
		document.getElementById('logradouro').value=(conteudo.logradouro);
		document.getElementById('bairro').value=(conteudo.bairro);
		document.getElementById('estado').value=(conteudo.uf);
		document.getElementById('cidade').value=(conteudo.localidade);
	} 
	else {
		//CEP não Encontrado.
		limpaFormularioCep();
	}
}
        
function pesquisaCep(valor) {
	
	//Verifica se campo cep possui valor informado.
	if (valor != "") {

		//Valida o formato do CEP.
		if(validaCep(valor)) {

			//Preenche os campos com "..." enquanto consulta webservice.
			document.getElementById('logradouro').value="...";
			document.getElementById('bairro').value="...";
			document.getElementById('estado').value="...";
			document.getElementById('cidade').value="...";

			//Cria um elemento javascript.
			var script = document.createElement('script');

			//Sincroniza com o callback.
			script.src = 'https://viacep.com.br/ws/'+ valor + '/json/?callback=cepCallback';

			//Insere script no documento e carrega o conteúdo.
			document.body.appendChild(script);

		}
		else {
			//cep é inválido.
			limpaFormularioCep();
		}
	}
	else {
		//cep sem valor, limpa formulário.
		limpaFormularioCep();
	}
}

function removeCaracteres(valor){
	
	return valor.replace(/[^\d]+/g,'');
}

function buscaCidade(cidadeId){
    var myUrl = baseUrl+"/api/Locais/GetCidade?id="+cidadeId;
	
	carregarDados(function (response){
		montaObjeto(response);
	}, myUrl);
	
}

function montaObjeto(response) {
    var cidade = new Object();
	cidade = response.data;
    
	var ativo;
	
	if ($("#ativo").is(":checked")){
		ativo = 1;
	}else{
		ativo = 0;
	}
				
	var date = new Date();
	// Formata a data e a hora (note o mês + 1)
    var dataAtual = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	
    var cliente = new Object();

    if (clienteId != "0") {
        cliente.IDWS = clienteId;
        cliente.DtCadastro = $("#dtCadastro").val();
    } else {
        cliente.IDWS = "0";
        cliente.DtCadastro = dataAtual;
    }

    cliente.IDAP = 0;
	cliente.Cod = $("#cod").val().toString();
	cliente.Cnpj = removeCaracteres($("#cnpj").val().toString());
	cliente.RazaoSocial = $("#raz-social").val().toString();
	cliente.NomeFantasia = $("#nome-fantasia").val().toString();
	cliente.InscricaoEstadual = $("#insc-estadual").val().toString();
	cliente.Email = $("#email").val().toString();
	cliente.Fone = removeCaracteres($("#fone").val());
	cliente.Cep = removeCaracteres($("#cep").val());
	cliente.Bairro = $("#bairro").val().toString();
	cliente.Logradouro = $("#logradouro").val().toString();
	cliente.Numero = $("#numero").val();
	cliente.Status = 1;
	cliente.Ativo = ativo;
    cliente.DtAtualizacao = dataAtual;
    cliente.Cidade = cidade;
    cliente.SegmentoMercado = null;
    
    if (clienteId == "0") {
        //Se cliente ainda não existe irá inserir
        enviarDados(cliente, baseUrl + "/api/Cliente/AddCliente", "POST");
    } else {
        //Se cliente já existe irá atualizar
        enviarDados(cliente, baseUrl + "/api/Cliente/EditaCliente", "PUT");
    }
						
}

function enviarDados(dados,urlDest,metodo){
    var acao;
    if (metodo == "POST") {
        acao = "inserido";
    } else {
        acao = "atualizado";
    }

    $.ajax({
        url: urlDest,
        type: metodo,
        data: JSON.stringify(dados),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
		success: function(data)
		{
			//var response = $.parseJSON(data);
			//bootbox.alert(response.message);
			if (data.status == "SUCCESS"){
                bootbox.alert("Cliente "+acao+" com sucesso.");
                $(".content").attr("id", "0");
				$(".content").load('clientes.html');
				//$(window.document.location).attr('href',novaURL);
			}
		},
		error: function (data, status, errorThrown) {
            bootbox.alert("Erro: " + JSON.stringify(data));
        }
	});
	
}
