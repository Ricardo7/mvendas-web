var urlBase = getHost();
var token;

$(document).ready(function () {

    validaUsuarioAutenticado();
	
	limpaMenuAtivo();
    $("#btn-logout").click(function () {
        deleteCookie("token");
        deleteCookie("usuarioID");
        $(window.document.location).attr("href", "login.html");
    });

	$("#menu-pedido").click(function(){
		limpaMenuAtivo();
		$("#menu-pedido").attr('class', 'active-menu');
		$(".content").load('pedidos.html');
    });

    $("#menu-imagens").click(function(){
        limpaMenuAtivo();
        $("#menu-imagens").attr('class', 'active-menu');
        $(".content").load('imagens-produtos.html');
    });

	$("#menu-clientes").click(function(){
		limpaMenuAtivo();
		$("#menu-clientes").attr('class', 'active-menu');
		$(".content").load('clientes.html');
	});
	
	$("#menu-usuarios").click(function(){
		limpaMenuAtivo();
		$("#menu-usuarios").attr('class', 'active-menu');
		$(".content").load('usuarios.html');
	});
	
	$("#menu-config").click(function(){
		limpaMenuAtivo();
		$("#menu-config").attr('class', 'active-menu');
		$(".content").load('configs.html');
	});

    $("#menu-agenda").click(function () {
        limpaMenuAtivo();
        $("#menu-agenda").attr('class', 'active-menu');
        $(".content").load('agenda.html');
    });
	
});

function limpaMenuAtivo(){
	
	$("#menu-pedido").attr('class', '');
	$("#menu-imagens").attr('class', '');
	$("#menu-clientes").attr('class', '');
	$("#menu-usuarios").attr('class', '');
	$("#menu-config").attr('class', '');
	$("#menu-agenda").attr('class', '');
	
}

function validaUsuarioAutenticado() {
    token = getCookie("token");
    novaURL = "login.html";
    
    if (token != null) {

        $.ajax({
            type: "GET",
            url: urlBase + "/Usuario/ValidarUsuarioToken",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", token);
            },
            success: function (data) {
                var response = data;

                if (response != null) {

                    if (response.status == "ERROR") {
                        deleteCookie("token");
                        deleteCookie("usuarioID");
                        $(window.document.location).attr('href', novaURL);
		
                    } else {
                        //$("#nome-usuario").val(response.data.Nome);
                    }
                }
            },
            error: function (ex) {
                deleteCookie("token");
                deleteCookie("usuarioID");
                alert("Erro:  " + ex.message);
            }

        });
    } else {
        $(window.document.location).attr('href', novaURL);
    }
}