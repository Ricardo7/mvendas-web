var urlBase = "http://192.168.15.4:8080";

ready();

function ready(){
	
	//token = getCookie("token");
	
	//Popula todos os mapas na tela
	carregarDados(function (response){
		populaUsuariosTela(response);
	});
	
	
}

function carregarDados(response){
	var retorno;
	
	$.ajax({
		type: "GET",
        url: urlBase +"api/Pedido/GetListaPedidos",
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
			dataSet.push([data.Numero,
                data.Observacao,
                data.VlrTotal,
                data.Situacao
						]);
		});
		
		$('#dataTables-example').DataTable({
		  data: dataSet,
		  columns: [
			{ title: 'Pedido' },
              { title: 'Cliente' },
              { title: 'Valor' },
			{ title: 'Situação',
				render: function(data, type, full) {
					if (data == "0") {
                        return "Pendente";
                    }else if(data == "1"){
                        return "Bloqueado";
                    } else if (data == "2") {
                        return "Aprovado";
                    } else if (data == "3") {
                        return "Cancelado";
                    }
					
				}
			}
		  ]
		});	
		
		
	}
	
}


