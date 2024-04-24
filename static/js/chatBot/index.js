

$(document).ready( function () {
});

$('#btnEntrenar').on('click', async function() {
    const objAjax = initObjectAjax();
        objAjax.method = "GET";
        objAjax.url = `/chatBot/entrenar/`;
        objAjax.callback = (response) => {
            showSmallMessage(response.tipo,response.mensaje)
        };
    genericAjax(objAjax);
})


$('#btnNuevo').on('click', async function() {
  

    $("#modal").modal("show");
})