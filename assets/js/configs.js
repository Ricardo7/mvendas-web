var baseUrl = "http://192.168.0.110:8080/api";
var usuarioId = 0;
ready();

//$(document).ready(function(){
function ready() {

    //usuarioId = $(".content").attr("id");

    //Se o ID estiver populado é porque o registro já existe e, neste caso, deve ser alterado.

    myUrl = baseUrl + "/Configuracoes/GetConfiguracoes";
    carregarDados(function (response) {
        populaCamposTela(response);
    }, myUrl);

    // $("#btn-voltar").click(function () {
    //     $(".content").attr("id", "0");
    //     $(".content").load('usuarios.html');
    // });

    $("#btn-salvar").click(function () {

        //limpaFormatacaoErroCampos();

        if (validaCampos()) {

            //Chama o método para enviar o objeto ao servidor
            montaObjeto();

        }
    });

}
//});

function carregarDados(response, myUrl) {
    var retorno;

    $.ajax({
        type: "GET",
        url: myUrl,
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

function populaCamposTela(response) {
    if (response != null) {

        var dados = response.data;


        $("#TempoMaxSemSinc").val(dados.TempoMaxSemSinc);
        $("#TempoEntreCadaSinc").val(dados.TempoEntreCadaSinc);
        $("#PeriodoParaIndicadores").val(dados.TempoEntreCadaSinc);
        $("#Id").val(dados.ID);

    }
}

function validaCampos() {

    if ($("#TempoMaxSemSinc").val() == "") {
        $("#TempoMaxSemSinc").parent().attr("class", "form-group has-error");
        bootbox.alert("O campo TempoMaxSemSinc deve ser informado!");
    } else if ($("#TempoEntreCadaSinc").val() == "") {
        $("#TempoEntreCadaSinc").parent().attr("class", "form-group has-error");
        bootbox.alert("O campo TempoEntreCadaSinc deve ser informado!");
    } else if ($("#PeriodoParaIndicadores").val() == "") {
        $("#PeriodoParaIndicadores").parent().attr("class", "form-group has-error");
        bootbox.alert("O campo PeriodoParaIndicadores deve ser informado!");
    } else {
        return true;
    }

    return false;

}


//function limpaFormatacaoErroCampos() {

//    $("#TempoMaxSemSinc").parent().attr("class", "form-group");
//    $("#TempoEntreCadaSinc").parent().attr("class", "form-group");
//    $("#PeriodoParaIndicadores").parent().attr("class", "form-group");
//}

//function removeCaracteres(valor) {

//    return valor.replace(/[^\d]+/g, '');
//}

function montaObjeto() {

    var configs = new Object();

    configs.TempoMaxSemSinc = $("#TempoMaxSemSinc").val().toString();
    configs.TempoEntreCadaSinc = $("#TempoEntreCadaSinc").val().toString();
    configs.PeriodoParaIndicadores = $("#PeriodoParaIndicadores").val().toString();
    configs.ID = $("#Id").val().toString();

    //Se Usuário já existe irá atualizar
    enviarDados(configs, baseUrl + "/Configuracoes/EditaConfiguracoes", "PUT");

}

function enviarDados(dados, url, metodo) {
    var acao;
    acao = "atualizado";


    $.ajax({
        type: metodo,
        url: url,
        data: JSON.stringify(dados),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            //var response = $.parseJSON(data);
            //bootbox.alert(response.message);
            if (data.status == "SUCCESS") {
                bootbox.alert("Usuário " + acao + " com sucesso.");
                $(".content").load('configs.html');
                //$(window.document.location).attr('href',novaURL);
            }
        },
        error: function (data, status, errorThrown) {
            bootbox.alert("Erro: " + data["status"]);
        }
    });


}
