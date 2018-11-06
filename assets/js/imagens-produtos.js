var urlBase = "http://192.168.15.12:8080/api";


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

function carregarDados(response, myurl){
	var retorno;
	
	$.ajax({
		type: "GET",
        url: myurl,
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
                imgPrincipal = "id='image-principal'";
            } else {
                imgPrincipal = "";
            }

            imagem += "";
            imagem += "<li class='portfolio-item2' data-id='id-"+data.IDWS+"' data-type='cat-item-4'>";
            imagem += "    <div>";
            imagem += "        <span class='image-block'>";
            imagem += "            <a class='image-zoom' href='assets/images/big/pic1.jpg' rel='prettyPhoto[gallery]' title='"+data.Nome+"'>";
            imagem += "                <img " + imgPrincipal + " width='225' height='140' src='data:image/jpg;base64," + data.Base64 + "' alt=''" + data.Nome + "' title='" + data.Nome +"' />";
            imagem += "            </a>";
            imagem += "            <a class='img-remov' id='" + data.IDWS+"'>Deletar</a>";
            imagem += "        </span>";
            imagem += "     </div>";
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
    $("#list-image").find(".portfolio-item2>div>.image-block>.image-zoom>#image-principal").each(function () {
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


        enviarDados(imagem);
    }
}

function enviarDados(data) {

    $.ajax({
        type: "POST",
        url: urlBase + "/Imagem/AddImagem",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            //var response = $.parseJSON(data);
            //bootbox.alert(response.message);
            if (data.status == "SUCCESS") {
                bootbox.alert("Imagem inserida com sucesso.");
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
