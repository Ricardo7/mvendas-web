var urlBase = getHost();
var usuarioID;

ready();

function ready() {
    usuarioID = getCookie("usuarioID");
 
    //$('#dataTables-example').dataTable();
    $(".tab-clientes-cnpj").mask("99.999.999/9999-99");
    $(".tab-clientes-fone").mask("(99)99999-9999");

	var myURL = urlBase + "/Cliente/GetListaClientes?usuarioID=" + usuarioID+"&origem=1";
	
    //Popula todos os campos na tela
    carregarDados(function (response) {
        populaClientesTela(response);
    },myURL);

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


