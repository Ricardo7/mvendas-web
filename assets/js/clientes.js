var token;
var urlBase = "http://192.168.15.3:8080/api";

ready();

function ready() {

    //$(document).ready(function () {

    //token = getCookie("token");


    //$('#dataTables-example').dataTable();
    $(".tab-clientes-cnpj").mask("99.999.999/9999-99");
    $(".tab-clientes-fone").mask("(99)99999-9999");

    //Popula todos os campos na tela
    carregarDados(function (response) {
        populaClientesTela(response);
    });

    $("#clientes-btn-novo").click(function () {
        $(".content").load('cadastro-cliente.html');
        $(".content").attr("id","0");
    });

    $("#dataTables-example").on("click", ".btn-warning", function () {
        $(".content").load("cadastro-cliente.html");
        var id = $(this).attr("id");
        $(".content").attr("id",id);
    });
}

function carregarDados(response) {
    var retorno;

    $.ajax({
        type: "GET",
        url: urlBase + "/Cliente/GetListaClientes",
        //data: {conceitoId:1},
		/*beforeSend: function(xhr){
			xhr.setRequestHeader('X-Auth-Token', token);
		},*/
        success: function (data) {
            if (data != null) {
                //alert(JSON.stringify(data));
                //retorno = $.parseJSON(data);
                retorno = data;
                if (retorno.status == "SUCCESS") {
                    response(retorno);
                } else {
                    bootbox.alert("Status: " + retorno.message);
                }
            } else {
                bootbox.alert("Status: " + retorno.message);
            }

        },
        error: function (data, status, errorThrown) {
            bootbox.alert("Erro: " + data.error);
        }

    });

}

function populaClientesTela(response) {
    if (response != null) {
        var clientes = response.data;
        var dataSet = [];

        $.each(clientes, function (index, data) {
                dataSet.push([data.Cod,
                data.Cnpj,
                data.RazaoSocial,
                data.Email,
                data.Fone,
                data.Ativo,
                data.IDWS
            ]);
        });

        $('#dataTables-example').DataTable({
            data: dataSet,
            columns: [
                { title: 'Código' },
                {
                    title: 'Cnpj',
                    render: function (data, type, full) {
                        var cnpj;
                        cnpj = "<span class='tab-clientes-cnpj'>" + data + "</span>";
                        return cnpj;
                    }
                },
                { title: 'Razao Social' },
                { title: 'E-mail' },
                {
                    title: 'Fone',
                    render: function (data, type, full) {
                        var fone;
                        fone = "<span class='tab-clientes-fone'>" + data + "</span>";
                        return fone;
                    }
                },
                {
                    title: 'Situação',
                    width: "8%",
                    render: function (data, type, full) {
                        if (data == "0") {
                            return "Inativo";
                        } else {
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


