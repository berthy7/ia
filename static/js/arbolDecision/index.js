$(document).ready( function () {
   
});



$('#btnEntrenar').on('click', async function() {
    const objAjax = initObjectAjax();
        objAjax.method = "GET";
        objAjax.url = `/arbolDecision/entrenar/`;
        objAjax.callback = (response) => {
            showSmallMessage(response.tipo,response.mensaje)
        };
    genericAjax(objAjax);
})
