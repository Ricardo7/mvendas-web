var urlBase = "http://192.168.15.4:8080";

ready();

function ready(){
	
	//token = getCookie("token");
	
	//Popula todos os mapas na tela
	carregarDados(function (response){
		populaUsuariosTela(response);
	});

    $("#usuarios-btn-novo").click(function () {
        $(".content").load('cadastro-usuario.html');
    });
	
}

function carregarDados(response){
	var retorno;
	
	$.ajax({
		type: "GET",
        url: urlBase+"/api/Usuario/ListaUsuarios",
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

function populaUsuariosTela(response){
	if (response != null){
		var clientes = response.data;
		var dataSet = [];
		
		$.each(clientes, function(index,data){
			dataSet.push([data.Nome,
                          data.Email,
                          data.Email,
						  data.Ativo
						]);
		});
		
		$('#dataTables-example').DataTable({
		  data: dataSet,
		  columns: [
			{ title: 'Nome' },
              { title: 'E-mail' },
              { title: 'Perfil' },
			{ title: 'Situação',
				render: function(data, type, full) {
					if (data == "0") {
						return "Inativo";
					}else{
						return "Ativo";
					}
					
				}
			}
		  ]
		});	
		
		
	}
	
}


