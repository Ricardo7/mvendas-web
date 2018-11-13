$(document).ready(function () {
	
	limpaMenuAtivo();
	
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
	
	
});

function limpaMenuAtivo(){
	
	$("#menu-pedido").attr('class', '');
	$("#menu-imagens").attr('class', '');
	$("#menu-clientes").attr('class', '');
	$("#menu-usuarios").attr('class', '');
	$("#menu-config").attr('class', '');
	
}