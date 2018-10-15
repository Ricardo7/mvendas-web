var baseUrl = "http://192.168.15.4:8080";
ready();

//$(document).ready(function(){
function ready(){

	$("#btn-voltar").click(function(){
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
				
	var cliente = new Object();
	cliente.IDAP = 0;
	cliente.IDWS = "0";
	cliente.Nome = $("#nome").val().toString();
	cliente.Email = $("#email").val().toString();
    cliente.Senha = senhaCript;
	cliente.Ativo = ativo;
	cliente.DtCadastro = dataAtual;
	cliente.DtAtualizacao = dataAtual;

	alert(JSON.stringify(cliente));

	enviarDados(cliente);
						
}

function enviarDados(data){
	
	$.ajax({
		type: "POST",
        url: baseUrl +"api/Usuario/AddUsuario",
		data: data,
		success: function( data)
		{
			//var response = $.parseJSON(data);
			//bootbox.alert(response.message);
			if (data.status == "SUCCESS"){
				bootbox.alert("Usuário inserido com sucesso.");
				$(".content").load('usuarios.html');
				//$(window.document.location).attr('href',novaURL);
			}
		},
		error: function (data, status, errorThrown) {
			bootbox.alert("Erro: "+data["status"]);
		}
	});
			
	
}
