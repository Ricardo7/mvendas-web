var urlBase = getHost();
var usuarioID;
var token;
ready();

function ready() {
    usuarioID = getCookie("usuarioID");
	token = getCookie("token");
    $(".content").attr("id", "0");
	
	//token = getCookie("token");
	
	//Popula todos os mapas na tela
	carregarDados(function (response){
		populaDadosTela(response);
    }, urlBase + "/Pedido/GetListaPedidos?usuarioID=" + usuarioID+"&origem=1");

    $("#dataTables-example").on("click", ".btn-cancel", function () {
        var id = $(this).attr("id");

        //oTable.fnUpdate('development', parseInt(row), parseInt(col));

        carregarDados(function (response) {
            montaObjeto(response,"3");
        }, urlBase + "/Pedido/GetPedido?id=" + id);

    });

    $("#dataTables-example").on("click", ".btn-danger", function () {
        var id = $(this).attr("id");

        carregarDados(function (response) {
            montaObjeto(response, "1");
        }, urlBase + "/Pedido/GetPedido?id=" + id);
    });

    $("#dataTables-example").on("click", ".btn-success", function () {
        var id = $(this).attr("id");

        carregarDados(function (response) {
            montaObjeto(response, "2");
        }, urlBase + "/Pedido/GetPedido?id=" + id);
    });


    $("#dataTables-example").on("click", ".lnk-pedido", function () {
        var id = $(this).attr("id");

        $(".content").load("detalhes-pedido.html");
        $(".content").attr("id", id);
    });

    $("#dataTables-example").on("click", "[name=view-pedido]", function () {
        var id = $(this).attr("id");

        $(".content").load("detalhes-pedido.html");
        $(".content").attr("id", id);
    });

	
}

function populaDadosTela(response) {

	if (response != null){
        var pedidos = response.data;
        var dataSet = [];
        var vlrTotal = 0;
        
        $.each(pedidos, function (index, data) {
            $.each(data.ItensPedido, function (index, data) { vlrTotal = vlrTotal + data.VlrTotal; });

            dataSet.push([data.IDWS,
                data.Numero,
                data.Cliente.Cod+" - "+data.Cliente.RazaoSocial,
                vlrTotal.toFixed(2),
                data.Situacao,
                data.IDWS
						]);
		});
        
		$('#dataTables-example').DataTable({
		  data: dataSet,
            columns: [
                {
                    title: "",
                    width: "2%",
                    render: function (data, type, full) {

                        var acoes;
                        acoes = "<button type='button' name='view-pedido' class='btn btn-default btn-circle' id='"+data+"'><i class='fa fa-eye'></i></button>";
                        //editar = "<a href='#' id='" + data + "' class='btn btn-primary'>Editar</a>";
                        return acoes;
                    }
                },
                {
                    title: "Pedido",
                    width: "8%",
                    render: function (data, type, full) {
                      
                        var acoes;
                        acoes = "<a href='#' class='lnk-pedido' id='" + full[5] + "'>" + data + "</a >";
                        //editar = "<a href='#' id='" + data + "' class='btn btn-primary'>Editar</a>";
                        return acoes;
                    }
                },
            { title: "Cliente" },
            { title: "Valor" },
              {
                  title: "Situação",
                  width: "9%",
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
              },
              {
                  title: "",
                  width: "25%",
                  className: "dt-head-center",
                  render: function (data, type, full) {
                      var acoes;
                      acoes = "<button type='button' class='btn btn-cancel btn-xs' id='" + data + "'>Cancelar</button >&nbsp";
                      acoes = acoes + " <button type='button' class='btn btn-danger btn-xs' id='" + data + "'>Bloquear</button >";
                      acoes = acoes + " <button type='button' class='btn btn-success btn-xs' id='" + data + "'>Aprovar</button >";
                      return acoes;
                  }
              }
		  ]
        });

        /*
        var table = $("#dataTables-example").DataTable();
        
        $('#dataTables-example tbody').on('click', 'td', function () {
            var data = table.row($(this).parents('tr'));
            alert(table.cell(this).index().columnVisible);
            //table.row(data[0]).data("").draw();
            table.cell(0, 0).data().draw();
            

        });
		*/
		
	}
	
}

function montaObjeto(response, situacao) {

    if (response != null) {

        var pedido = response.data;

        var data = new Date();
        // Formata a data e a hora (note o mês + 1)
        var dataAtual = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate() + ' ' + data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();

        pedido.DtAtualizacao = dataAtual;
        pedido.Situacao = situacao;

        enviarDados(pedido);

    }

}

function enviarDados(data) {

    $.ajax({
        type: "PUT",
        url: urlBase +"/Pedido/EditaPedido",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', token);
		},
        success: function (data) {
            //var response = $.parseJSON(data);
            //bootbox.alert(response.message);
            if (data.status == "SUCCESS") {
                bootbox.alert("Pedido atualizado com sucesso.");
                //$(window.document.location).attr('href',novaURL);
            }
        },
        error: function (data, status, errorThrown) {
            bootbox.alert("Erro PUT: " + data["status"]);
        }
    });


}


