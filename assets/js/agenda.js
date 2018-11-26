var urlBase = getHost();

ready();

function ready() {

    myUrl = urlBase + "/Usuario/ListaUsuarios";
    carregarDados(function (response) {
        populaCampoUsuario(response);
    }, myUrl);

    $("#btn-filtrar").click(function () {
        limpaFormatacaoErroCampos();
                
        if (validaCampos()) {
            //Monta URL com parametros
            var usuarioId = $("#usuarios option:selected").attr("id");
            var dataIni = $("#data-ini").val();
            var dataFim = $("#data-fim").val();
            myUrl = urlBase + "/Atividade/GetListaAtividadesClienteCheckin?usuarioID=" + usuarioId + "&dataIni=" + dataIni + "&dataFim=" + dataFim;

            carregarDados(function (response) {
                populaAtividades(response);
            }, myUrl);
        }
    });
    
}

function validaCampos() {
    if ($("#usuarios").val() == "") {
        $("#usuarios").parent().attr("class", "form-group has-error");
        bootbox.alert("O campo Vendedor deve ser selecionado!");
    } else if ($("#data-ini").val() == "") {
        $("#data-ini").parent().attr("class", "form-group has-error");
        bootbox.alert("O campo Data Início deve ser informado!");
    } else if ($("#data-fim").val() == "") {
        $("#data-fim").parent().attr("class", "form-group has-error");
        bootbox.alert("O campo Data Fim deve ser informado!");
    }else {
        return true;
    }

    return false;
}

function limpaFormatacaoErroCampos() {

    $("#usuarios").parent().attr("class", "form-group");
    $("#data-ini").parent().attr("class", "form-group");
    $("#data-fim").parent().attr("class", "form-group");
}
function populaCampoUsuario(response) {
    if (response != null) {
        var dados = response.data;
        var option = '<option id="0">Selecione</option>';

        $.each(dados, function (index, data) {

            option += '<option id="' + data.IDWS + '" value="' + data.Nome + '">' + data.Nome + '</option>';
        });

        $("#usuarios").html(option).show();
    }
}

function populaAtividades(response) {
    if (response != null) {
        
        //Inicializa o mapa
        var initialCoordinates = [-29.1680600, -51.1794400];
        var initialZoomLevel = 12;

        // create a map in the "map" div, set the view to a given place and zoom
        var map = L.map('map').setView(initialCoordinates, initialZoomLevel);

        // add an OpenStreetMap tile layer
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: ''
        }).addTo(map);
        //-/-Inicializa o mapa

        var dados = response.data;
        var atividade = "";
        var coordinates;
        var markerMessage;
        

        $.each(dados, function (index, data) {
            atividade += "";
            atividade += "<a href='#' class='list-group-item'>";
            atividade += "  <h5 class='list-group-item-heading'><b>" + formatDataUser(data.DataAtividade)+" "+data.HoraAtividade +"</b></h5>";
            atividade += "  <span class='list-group-item-text'>"+data.Assunto+" - "+data.Cliente.RazaoSocial+"</span>";
            atividade += "</a>";

            coordinates = [data.Latitude, data.Longitude];
            markerMessage = "Assunto: "+data.Assunto;
            markerMessage += "</br>Cliente: " + data.Cliente.RazaoSocial;
            markerMessage += "</br>Agenda: " + formatDataUser(data.DataAtividade) + " " + data.HoraAtividade;
            markerMessage += "</br>Checkin: " + formatDataUser(data.DataCheckin.split(" ")[0]) + " " + data.DataCheckin.split(" ")[1];

            L.marker(coordinates).addTo(map).bindPopup(markerMessage);
        });

        $("#atividades").html(atividade);
    }


}

function formatDataUser(data) {

    return data.split('-').reverse().join('/');
}