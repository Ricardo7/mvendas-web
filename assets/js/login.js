	//var token = $.cookie("token");
	var token = getCookie("token");
	var novaURL = "index.html";
    var baseURL = "http://192.168.15.12:8080/api/";
	
$(document).ready(function(){

	if (token != null){
		
		$.ajax({
			type: "GET",
			url: baseURL+"Usuario/ValidarUsuarioToken",
			/*beforeSend: function(xhr){
				xhr.setRequestHeader("X-Auth-Token", token);
			},*/
			success: function(data){
				var response;
				if (data != null){
					response = $.parseJSON(data);
					
					if (response.status == "SUCCESS"){
						
						$(window.document.location).attr('href',novaURL);
					};
				}
			},
			error: function (ex) {
				deleteCookie("token");
			}
		
		});
	}

	$("#btn-login").click(function(){
		if ($("#user").val() == ""){
			bootbox.alert("Email n�o informado!");
		}else if($("#pass").val() == ""){
			bootbox.alert("Senha n�o informada!", function(){ console.log('Informe o senha para continuar!'); });
		}else{
			
			var passCript = CryptoJS.MD5($("#pass").val());
			//console.log($("#user").val().toString());
			$.ajax({
				type: "GET",
				url: baseURL+"Usuario/ValidarUsuario",
				data: {email:$("#user").val().toString(),senha:passCript.toString()},
				success: function(data){		
					var response = data;
					
					if(response.status == "SUCCESS" && response.cod == 200){
						if ($("#mantem").is(':checked')){
							//$.cookie("token",response.data.token);
							
							setCookie("token",response.data.token);
						}
						$(window.document.location).attr('href',novaURL);
					}else{
						bootbox.alert("Usu�rio ou Senha incorretos.");
						
					};
					 
				},
				error: function (data, status, errorThrown) {
					deleteCookie("token");
					console.log(data);
					console.log(errorThrown);
					bootbox.alert(data["message"]);
				}

			});
		}
		
	});


	$("#btn-cadastro").click(function(){
		if ($("#name").val() == ""){
				bootbox.alert("O campo Nome deve ser informado!");
			}else if($("#lastname").val() == ""){
				bootbox.alert("O campo Sobrenome deve ser informado!");
			}else if($("#email").val() == ""){
				bootbox.alert("O campo Email deve ser informado!");
			}else if($("#pass-cad").val() == ""){
				bootbox.alert("O campo Senha deve ser informado!");
			}else if($("#conf-pass").val() == ""){
				bootbox.alert("O campo Confirmar Senha deve ser informado!");
			}else if($("#pass-cad").val() != $("#conf-pass").val()){
				bootbox.alert("Senhas diferentes!");
			}else{
				var dados = '{"id":"'+"0"
							+'","nome":"'+$("#name").val().toString()
							+'","sobrenome":"'+$("#lastname").val().toString()
							+'","email":"'+$("#email").val().toString()
							+'","cpf":"'+"0"
							+'","senha":"'+CryptoJS.MD5($("#pass-cad").val()).toString()
							+'","status":"'+"1"
							+'","tipo":"'+"2"
							+'","data_criacao":"'+"now"
							+'","data_atualizacao":"'+"now"
							+'","data_fim":"'+""
							+'"}';
			$.ajax({
				type: "POST",
				url: "/app/usuario",
				data: dados,
				success: function( data)
				{
					//var response = $.parseJSON(data);
					//bootbox.alert(response.message);
					bootbox.alert(data["message"]);
					if (data["status"] == "SUCCESS"){
						$(window.document.location).attr('href',novaURL);
					}
				},
				error: function (data, status, errorThrown) {
					bootbox.alert("Erro: "+data["status"]);
				},
				contentType: "application/json",
				dataType: 'json'
			});
		}
	});
	/*
	$.ajax({
		type: "DELETE",
		url: "/app/usuario/4",
		//data: {id:5,email:"ronaldops06@yahoo.com.br"},
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-Auth-Token', token);
		},
		success: function( data )
		{
			alert(data["message"]);
		},
		error: function (data, status, errorThrown) {
			alert("Status: "+status);
			alert("Erro: "+data["status"]);
		}
	});*/
	
	
});