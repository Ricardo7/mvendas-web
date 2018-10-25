var urlBase = "http://192.168.43.67:8080/api";
var pedidoId = "0";
ready();

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
    pedidoId = $(".content").attr("id");

    setaMascaraCampos();
		
    //Se o ID estiver populado é porque o registro já existe e, neste caso, deve ser alterado.
    if (pedidoId != "0") {
        myUrl = urlBase + "/Pedido/GetPedido?id=" + pedidoId;
        carregarDados(function (response) {
            populaCamposTela(response);
        }, myUrl);
    }
    
    $("#btn-voltar").click(function () {
        $(".content").attr("id", "0");
        $(".content").load('pedidos.html');
    });	


    $("#cancelar").click(function () {

        carregarDados(function (response) {
            montaObjeto(response, "3");
        }, urlBase + "/Pedido/GetPedido?id=" + pedidoId);

        $("#situacao").html("Cancelado");
    });

    $("#bloquear").click(function () {

        carregarDados(function (response) {
            montaObjeto(response, "1");
        }, urlBase + "/Pedido/GetPedido?id=" + pedidoId);

        $("#situacao").html("Bloqueado");
    });

    $("#aprovar").click(function () {

        carregarDados(function (response) {
            montaObjeto(response, "2");
        }, urlBase + "/Pedido/GetPedido?id=" + pedidoId);

        $("#situacao").html("Aprovado");
    });
	
}

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
                } else {
                    bootbox.alert("Status: " + JSON.stringify(retorno));
				}
			}else{
                bootbox.alert("Status: " + JSON.stringify(retorno));
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
        
        $("#numero").html(dados.Numero);
        $("#dt-emissao").html(dados.DtCriacao);
        $("#cliente").html(dados.Cliente.Cod +" - "+ dados.Cliente.RazaoSocial);
        $("#cond-pgto").html(dados.CondicaoPagamento.Cod + " - " + dados.CondicaoPagamento.Descricao);
        if (dados.Situacao == "0") {
            $("#situacao").html("Pendente");
        } else if (dados.Situacao == "1") {
            $("#situacao").html("Bloqueado");
        } else if (dados.Situacao == "2") {
            $("#situacao").html("Aprovado");
        } else if (dados.Situacao == "3") {
            $("#situacao").html("Cancelado");
        }
        $("#cnpj").html(dados.Cliente.Cnpj);
        $("#tabela-precos").html(dados.TabelaPreco.Cod + " - " + dados.TabelaPreco.Descricao);

        //Popula tabela de itens
        var dataSet = [];
        var vlrTotalDesc = 0;
        var percDesc = 0;
        var vlrTotal = 0;

        $.each(dados.ItensPedido, function (index, data) {

            vlrTotalDesc = vlrTotalDesc + (data.Quantidade * data.VlrDesconto);
            vlrTotal = vlrTotal + data.VlrTotal;

            dataSet.push([data.Produto.Cod,
                data.Produto.Descricao,
                data.Quantidade,
                data.VlrUnitario,
                data.VlrDesconto,
                data.VlrTotal
                ]);

        });

        $('#dataTables-example').DataTable({
            data: dataSet,
            bFilter: false,
            bLengthChange: false,
            columns: [
                {
                    title: "Código",
                    width: "10%"
                },
                { title: "Descrição" },
                { title: "Quantidade" },
                { title: "Vlr. Unitário"   },
                { title: "Vlr. Desconto"   },
                { title: "Total"   }
            ]
        });

        /*Popula valores totais do pedido*/
        percDesc = (100 / vlrTotal) * vlrTotalDesc;
        $("#vlr-total-desc").html("R$ " + vlrTotalDesc.toFixed(2) + " (" + percDesc.toFixed(2) + "%)");
        $("#vlr-total").html("R$ " + vlrTotal.toFixed(2));
    }
}

function setaMascaraCampos(){
	
	/*$("#cnpj").mask("99.999.999/9999-99");
	$("#fone").mask("(99) 99999-9999");
    $("#cep").mask("99999-999");
    */
    $("#vlr-total-desc").mask("999.999,00 (999.999,00)");
    $("#vlr-total").mask("999.999,00");
	
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
        url: urlBase + "/Pedido/EditaPedido",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
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