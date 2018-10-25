var urlBase = "http://192.168.43.67:8080/api";

ready();

function ready(){
	
	//token = getCookie("token");
	
	//Popula todos os mapas na tela
	carregarDados(function (response){
		populaUsuariosTela(response);
	});

    $("#usuarios-btn-novo").click(function () {
        $(".content").load('cadastro-usuario.html');
        $(".content").attr("id", "0");
    });

    $("#dataTables-example").on("click", ".btn-warning", function () {
        $(".content").load("cadastro-usuario.html");
        var id = $(this).attr("id");
        $(".content").attr("id", id);
    });
	
}

function carregarDados(response){
	var retorno;
	
	$.ajax({
		type: "GET",
        url: urlBase+"/Usuario/ListaUsuarios",
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
                          data.Ativo,
                          data.IDWS
						]);
		});
		
		$('#dataTables-example').DataTable({
		  data: dataSet,
		  columns: [
			{ title: 'Nome' },
              { title: 'E-mail' },
			  { title: 'Situação',
				render: function(data, type, full) {
					if (data == "0") {
						return "Inativo";
					}else{
						return "Ativo";
					}
					
				}
              },
              {
                  title: "",
                  width: "12%",
                  className: "dt-head-center",
                  render: function (data, type, full) {
                      var acoes;
                      acoes = "<button type='button' class='btn btn-warning btn-xs' id='" + data + "'>Editar</button >&nbsp";
                      //editar = "<a href='#' id='" + data + "' class='btn btn-primary'>Editar</a>";
                      return acoes;
                  }
              }
		  ]
		});	
		
		
	}
	
}


