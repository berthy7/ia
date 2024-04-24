$(document).ready( function () {
  
});

$('#btnEjecutar').on('click', async function() {
    const objAjax = initObjectAjax();
        objAjax.method = "GET";
        objAjax.url = `/temperatura/convertir/${$('#gradoCentigrado').val()}`;
        objAjax.callback = (response) => {
            if (response.success) {
                showToast(response.tipo, response.mensaje);
                $('#valorFahrenheit').text(response.data)
            }else showSmallMessage(response.tipo,response.mensaje)
        };
        genericAjax(objAjax);
})
