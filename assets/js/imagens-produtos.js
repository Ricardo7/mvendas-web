var urlBase = getHost();
ready();

function ready() {

    /*var baseStr64 = "";
    imgElem.setAttribute('src', "data:image/jpg;base64," + baseStr64);*/
    //token = getCookie("token");

    myUrl = urlBase + "/Produto/GetListaProdutos";
    carregarDados(function (response) {
        populaCampoProduto(response);
    }, myUrl);


    $("#produto").change(function () {
        atualizaImagens();
    });

    $("#list-image").on("click", ".portfolio-item2>div>.image-block>.img-remov", function () {
        var imagemID = $(this).attr("id");
        removerDados(imagemID);
    });

    $("#list-image").on("change", ".portfolio-item2>div>.image-block>.checkbox-inline>.img-principal", function () {
        var imagemID = $(this).attr("id");
        var existePrincipal = 0;
        var continua = 0;
        var id;

        if ($(this).is(":checked")) { //Está marcando
            //Verifica se já existe uma imagem principal
            $("#list-image").find(".portfolio-item2>div>.image-block>.image-zoom>.image-principal").each(function () {
                existePrincipal = 1;
            });
            if (existePrincipal == 1) {
                continua = 0;
                $(this).attr('checked', false);
                bootbox.alert("Já existe uma imagem principal.");
            } else {
                continua = 1;
                $("#list-image").find(".portfolio-item2>div>.image-block>.image-zoom>#" + imagemID).attr("class", "image-principal");
            }
        } else { //Está desmarcado
            continua = 1;
            $("#list-image").find(".portfolio-item2>div>.image-block>.image-zoom>.image-principal").removeAttr("class");
        }

        if (continua == 1) {
            var principal=0;
            if ($(this).is(":checked")) {
                principal = 1;
            } else {
                principal = 0;
            }
            atualizaObjeto(imagemID,principal);
        }
    });

    $("#sel-img").change(function () {
        var selectedFile = this.files[0];

        var FR = new FileReader();

        FR.addEventListener("load", function (e) {
            $("#img-base64").val(e.target.result.split(',')[1]);
        });

        FR.readAsDataURL(selectedFile);

    });

    $("#salva-img").click(function () {
        montaObjeto();
    });

   

}

function atualizaImagens() {
    var produtoID = $("#produto option:selected").attr("id");
    myUrl = urlBase + "/Imagem/GetListaImagensProduto?produtoID=" + produtoID;

    carregarDados(function (response) {
        populaImagens(response);
    }, myUrl);
}

function populaCampoProduto(response) {
    if (response != null) {
        var dados = response.data;
        var option = '<option id="0">Selecione</option>';

        $.each(dados, function (index, data) {

            option += '<option id="' + data.IDWS + '" value="' + data.Cod + '">' + data.Cod +" - "+data.Descricao + '</option>';
        });

        $("#produto").html(option).show();
    }
}

function populaImagens(response) {
    if (response != null) {
        var dados = response.data;
        var imagem = "";
        var imgPrincipal = "";
        var imgCount = 0;
        $("#list-image").html("");
        $("#img-count").val("");

        $.each(dados, function (index, data) {
            imgCount = imgCount + 1;

            if (data.Principal == 1) {
                imgPrincipal = "class='image-principal'";
                imgChecked = "checked";
            } else {
                imgPrincipal = "";
                imgChecked = "";
;            }

            imagem += "";
            imagem += "<li class='portfolio-item2' data-id='id-"+data.IDWS+"' data-type='cat-item-4'>";
            imagem += "    <div>";
            imagem += "        <span class='image-block'>";
            imagem += "            <a class='image-zoom' href='assets/images/big/pic1.jpg' rel='prettyPhoto[gallery]' title='"+data.Nome+"'>";
            imagem += "                <img " + imgPrincipal + " id='" + data.IDWS + "' width='225' height='140' src='data:image/jpg;base64," + data.Base64 + "' alt=''" + data.Nome + "' title='" + data.Nome +"' />";
            imagem += "            </a>";
            imagem += "            <a class='img-remov' id='" + data.IDWS+"'>Deletar</a>";
            imagem += "            <label class='checkbox-inline'><input type='checkbox' id='" + data.IDWS + "' class='img-principal' "+imgChecked+"/>Principal</label>";
            imagem += "        </span>";
            imagem += "     </div>";
            imagem += "     <input type='hidden' id='" + data.IDWS + "' value='" + data.DtCriacao + "'>";
            imagem += "</li>";

        });
        
        $("#list-image").append(imagem);
        //Popula quantidade de imagens para ser utilizado no nome ao salvar novas imagens
        $("#img-count").val(imgCount);
    }
}

function montaObjeto() {
    var produtoID = $("#produto option:selected").attr("id");
    var produtoNome = $("#produto option:selected").attr("value");
    var imgBase64 = $("#img-base64").val();
    var imgCount = $("#img-count").val();
    var principal;
    var existePrincipal = 0;

    //Verifica se já existe uma imagem principal
    $("#list-image").find(".portfolio-item2>div>.image-block>.image-zoom>.image-principal").each(function () {
        existePrincipal = 1;
    });

    if ($("#img-principal").is(":checked")) {
        principal = 1;
    } else {
        principal = 0;
    }

    if (produtoID == "0") {
        bootbox.alert("Produto não selecionado");
        $("#fecha-modal").trigger("click");
    } else if (imgBase64 == "") {
        bootbox.alert("Nenhuma imagem selecionada");
    } else if (existePrincipal == 1 && principal == 1) {
        bootbox.alert("Já existe uma imagem principal, desmarque a opção <b>Principal</b> para continuar");
    } else {

        if (imgCount == "" || imgCount == 0) {
            imgCount = 1;
        }

        imgCount = parseInt(imgCount) + 1;

        var date = new Date();
        // Formata a data e a hora (note o mês + 1)
        var dataAtual = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

        var imagem = new Object();
        imagem.Nome = produtoNome + "_IMG" + imgCount + ".jpg";
        imagem.Base64 = imgBase64;
        imagem.Principal = principal;
        imagem.ProdutoID = produtoID;
        imagem.DtCriacao = dataAtual;
        imagem.DtAtualizacao = dataAtual;


        enviarDados(imagem, urlBase + "/Imagem/AddImagem","POST");
    }
}

function atualizaObjeto(imagemID,principal) {
    var produtoID = $("#produto option:selected").attr("id");
    var imgNome = $("#list-image").find(".portfolio-item2>div>.image-block>.image-zoom>#" + imagemID).attr("title");
    var imgBase64 = $("#list-image").find(".portfolio-item2>div>.image-block>.image-zoom>#" + imagemID).attr("src");
    var dataCadastro = $("#list-image").find(".portfolio-item2>#" + imagemID).attr("value");
    imgBase64 = imgBase64.split(',')[1];
    

    var date = new Date();
    // Formata a data e a hora (note o mês + 1)
    var dataAtual = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();


    var imagem = new Object();
    imagem.IDWS = imagemID;
    imagem.Nome = imgNome;
    imagem.Principal = principal;
    imagem.ProdutoID = produtoID;
    imagem.Base64 = imgBase64;
    imagem.DtCriacao = dataCadastro;
    imagem.DtAtualizacao = dataAtual;

    enviarDados(imagem, urlBase + "/Imagem/EditaImagem", "PUT");
}

function enviarDados(dados, urlDest, metodo) {
    var acao;
    if (metodo == "POST") {
        acao = "inserido";
    } else {
        acao = "atualizado";
    }

    $.ajax({
        type: metodo,
        url: urlDest,
        data: JSON.stringify(dados),
        dataType: "json",
        contentType: "application/json",
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', token);
		},
        success: function (data) {
            //var response = $.parseJSON(data);
            //bootbox.alert(response.message);
            if (data.status == "SUCCESS") {
                bootbox.alert("Imagem " + acao + " com sucesso.");
                atualizaImagens();
                $("#fecha-modal").trigger("click");
                //$(window.document.location).attr('href',novaURL);
            }
        },
        error: function (data, status, errorThrown) {
            bootbox.alert("Erro PUT: " + data["status"]);
        }
    });


}

function removerDados(id) {

    $.ajax({
        type: "DELETE",
        url: urlBase + "/Imagem/RemoveImagem?id="+id,
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', token);
		},
        success: function (data) {
            //var response = $.parseJSON(data);
            //bootbox.alert(response.message);
            if (data.status == "SUCCESS") {
                bootbox.alert("Imagem removida com sucesso.");
                atualizaImagens();
                //$(window.document.location).attr('href',novaURL);
            }
        },
        error: function (data, status, errorThrown) {
            bootbox.alert("Erro PUT: " + data["status"]);
        }
    });


}
