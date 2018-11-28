var host = "http://192.168.43.67:8080/api";

function getHost() {
    return host;
}

function carregarDados(response, myUrl){
	var retorno;

	$.ajax({
		type: "GET",
        url: myUrl,
		//data: {origem:1},
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', token);
		},
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
			bootbox.alert("Erro GET: "+JSON.stringify(data));
		}

	});
	
}