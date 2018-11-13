var baseUrl = "http://192.168.15.3:8080/api";
var usuarioId = 0;
ready();

//$(document).ready(function(){
function ready() {

    usuarioId = $(".content").attr("id");

    //Se o ID estiver populado é porque o registro já existe e, neste caso, deve ser alterado.
    if (usuarioId != "0") {
        myUrl = baseUrl + "/Usuario/GetUsuarioID?id=" + usuarioId;
        carregarDados(function (response) {
            populaCamposTela(response);
        }, myUrl);
    }

    $("#btn-voltar").click(function () {
        $(".content").attr("id", "0");
		$(".content").load('usuarios.html');
	});
	
	$("#btn-salvar").click(function(){
		
		limpaFormatacaoErroCampos();
		
		if (validaCampos()){
			
			//Chama o método para enviar o objeto ao servidor
            montaObjeto();

		}
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

function populaCamposTela(response) {
    if (response != null) {

        var dados = response.data;

        if (dados.Ativo == 1) {
            $("#ativo").prop("checked", true);
        } else {
            $("#ativo").prop("checked", false);
        }

        $("#nome").val(dados.Nome);
        $("#email").val(dados.Email);
        $("#senha").val();
        $("#dtCadastro").val(dados.DtCadastro);


    }
}

function validaCampos(){
	
	if ($("#nome").val() == ""){
		$("#nome").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Nome deve ser informado!");
	}else if($("#email").val() == ""){
		$("#email").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Email deve ser informado!");
	}else if(!validaEmail($("#email").val())){
		$("#email").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O Email informado não é válido.");
	}else if($("#senha").val() == ""){
		$("#senha").parent().attr("class", "form-group has-error"); 
		bootbox.alert("O campo Senha deve ser informado!");
	}else{
		return true;
	}
	
	return false;
	
}

function validaEmail(email){
	var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	if(!filter.test(email)){
		return false;
	}else{
		return true;
	}
}


function limpaFormatacaoErroCampos(){

	$("#nome").parent().attr("class", "form-group");
	$("#email").parent().attr("class", "form-group");
	$("#senha").parent().attr("class", "form-group"); 
}

function removeCaracteres(valor){
	
	return valor.replace(/[^\d]+/g,'');
}

function montaObjeto(){
    var ativo;
    var senhaCript = CryptoJS.MD5($("#senha").val());
	
	if ($("#ativo").is(":checked")){
		ativo = 1;
	}else{
		ativo = 0;
	}
				
	var data = new Date();
	// Formata a data e a hora (note o mês + 1)
	var dataAtual = data.getFullYear() + '-' + (data.getMonth()+1) + '-' + data.getDate() +' '+ data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();
				
    var usuario = new Object();

    if (usuarioId != "0") {
        usuario.IDWS = usuarioId;
        usuario.DtCadastro = $("#dtCadastro").val();
    } else {
        usuario.IDWS = "0";
        usuario.DtCadastro = dataAtual;
    }

	usuario.IDAP = 0;
	usuario.Nome = $("#nome").val().toString();
	usuario.Email = $("#email").val().toString();
    usuario.Senha = senhaCript;
	usuario.Ativo = ativo;
	usuario.DtAtualizacao = dataAtual;

    if (usuarioId == "0") {
        //Se Usuário ainda não existe irá inserir
        enviarDados(usuario, baseUrl + "/Usuario/AddUsuario", "POST");
    } else {
        //Se Usuário já existe irá atualizar
        enviarDados(usuario, baseUrl + "/Usuario/EditUsuario", "PUT");
    }
						
}

function enviarDados(dados,url,metodo){
    var acao;
    if (metodo == "POST") {
        acao = "inserido";
    } else {
        acao = "atualizado";
    }

    $.ajax({
		type: metodo,
        url: url,
        data: JSON.stringify(dados),
        dataType: "json",
        contentType: "application/json",
		success: function( data)
		{
			//var response = $.parseJSON(data);
			//bootbox.alert(response.message);
			if (data.status == "SUCCESS"){
                bootbox.alert("Usuário " + acao + " com sucesso.");
				$(".content").load('usuarios.html');
				//$(window.document.location).attr('href',novaURL);
			}
		},
		error: function (data, status, errorThrown) {
			bootbox.alert("Erro: "+data["status"]);
		}
	});
			
	
}
