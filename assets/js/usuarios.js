var urlBase = getHost();

ready();

function ready(){
	//token = getCookie("token");
	
	var myURL = urlBase+"/Usuario/ListaUsuarios";
	//Popula todos os mapas na tela
	carregarDados(function (response){
		populaUsuariosTela(response);
	},myURL);

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


function populaUsuariosTela(response){
	if (response != null){
		var clientes = response.data;
		var dataSet = [];
		
		$.each(clientes, function(index,data){
			dataSet.push([data.Nome,
                          data.Email,
                          data.Ativo,
						  data.Tipo,
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
			  { title: 'Tipo',
				render: function(data, type, full) {
					if (data == "0") {
						return "Vendedor";
					}else if(data == "1"){
						return "Administrador";
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


