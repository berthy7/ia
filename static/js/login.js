var id_table = '#data_table';
var class_item = '.item-form';

window.addEventListener("load", function () {
   // reload_table()
});


$('#btn-login').on('click',async function() {

      const objeto ={
          username: $("#username").val(),
          password: $("#password").val()
      }


    const objAjax = initObjectAjax();
    objAjax.method = "POST";
    objAjax.url = `/login/logon/`,
    objAjax.data = JSON.stringify({'obj':objeto});
    objAjax.callback = (response) => {
        console.log(response)
        if (response.success) {

             location.href = "/";
        }
    };
    genericAjax(objAjax);


    //    const response = await fetchData(
    //         "/login/ingresar",
    //         "POST",
    //         JSON.stringify({'obj':objeto})
    //    );
    //
    // console.log(response)
    //
    //     if(response.success){
    //        location.href = "/";
    //     }else showSmallMessage(response.tipo,response.mensaje,"center");
});