/**
 * Created by bvargas on 12/11/2022.
 */
let chatCompleto = "";

let patterns = []
let responses = []

window.addEventListener("load", function () {
   mensajeBot("Hola")
   loadGrid(objPy.lista);
   loadGridPattern(patterns);
   loadGridResponse(responses);

});


/* dataGrid*/
const getColumns = () => {
  return [
      {
          caption: "Id", dataField: "id",
          sortIndex: 1,
          sortOrder: "asc",
          width: '10%'
      },
      { caption: "Etiquetas", dataField: "tag"},
      { caption: "Acciones",
          type: "buttons",
          buttons: [{
              hint: 'Editar',
              icon: `edit`,
              size : 18,
              cssClass: "dx-action-btn",
              onClick(e) {
                  edit_item(e);
              },
          },
              {
                  hint: 'ELiminar',
                  icon: `trash`,
                  cssClass: "dx-action-btn text-red-fo",
                  onClick(e) {
                      delete_item(e);
                  }
              }        ],
          visible: true,
          minWidth: 20
      }
  ];
};
const loadGrid = (data) => {
  createDataGrid({
      gridId: "dataGrid",
      data,
      columnId: "id",
      columns: getColumns(),
      pageSize: 24,
  });
};


function edit_item(e) {
  const self = e.row.data;
  $('#id').val(self.id)
  $('#tag').val(self.tag)

  const objAjax = initObjectAjax();
  objAjax.method = "GET";
  objAjax.url = `/chatBot/obtenerRespuestas/${self.id}`;
  objAjax.callback = (response) => {
      patterns = response.data.patterns
      loadGridPattern(patterns);
      responses = response.data.responses
      loadGridResponse(responses);
  };
  genericAjax(objAjax);
  $("#update").prop('hidden', false);
  $("#insert").prop('hidden', true);
  $("#div_id").prop('hidden', false);
  $('#modal').modal('show')
}

function delete_item(e) {
  Swal.fire({
      icon: "warning",
      title: "¿Está seguro de que desea eliminar?",
      text: "",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: '#009688',
      cancelButtonColor: '#ef5350',
      confirmButtonText: 'Aceptar',
      cancelButtonText: "Cancelar"
  }).then((result) => {
      if (result.value) {

          const objAjax = initObjectAjax();
          objAjax.method = "GET";
          objAjax.url = `/chatBot/delete/${e.row.data.id}`;
          objAjax.callback = (response) => {
            if (response.success) {
                loadGrid(response.data);
            }
            showSmallMessage(response.tipo, response.mensaje);
          };
          genericAjax(objAjax);
      }
  })
}

function logEvent(eventName) {
    const logList = $('#events ul');
    const newItem = $('<li>', { text: eventName });
    logList.prepend(newItem);
  }

const loadGridPattern = (data) => {
    $('#dataGridPattern').dxDataGrid({
        dataSource: data,
        keyExpr: 'id',
        showBorders: true,
        paging: {
          enabled: false,
        },
        editing: {
          mode: 'row',
          allowUpdating: true,
          allowDeleting: true,
          allowAdding: true,
        },
        columns: [
            { caption: "Patrones", dataField: "message" },
        ],
        onEditingStart() {
            console.log("a")
          logEvent('EditingStart');
        },
        onInitNewRow() {
            console.log("b")
          logEvent('InitNewRow');
        },
        onRowInserting() {
            console.log("c")
          logEvent('RowInserting');
        },
        onRowInserted(e) {
            console.log("d")
            console.log(e)
          logEvent('RowInserted');
          actualizarRespuesta(e.data,'/chatBot/insertPattern/');
        },
        onRowUpdating() {
            console.log("e")
          logEvent('RowUpdating');
        },
        onRowUpdated(e) {
            console.log("f")
            console.log(e)
          logEvent('RowUpdated');
          actualizarRespuesta(e.data,'/chatBot/updatePattern/');
        },
        onRowRemoving() {
            console.log("g")
          logEvent('RowRemoving');
        },
        onRowRemoved(e) {
            console.log("h")
          logEvent('RowRemoved');
          eliminarRespuesta(`/chatBot/deletePattern/${e.key}`);
        },
        onSaving() {
            console.log("i")
          logEvent('Saving');
        },
        onSaved() {
          logEvent('Saved');
        },
        onEditCanceling() {
            console.log("k")
          logEvent('EditCanceling');
        },
        onEditCanceled() {
            console.log("l")
          logEvent('EditCanceled');
        },
      });
};
const loadGridResponse = (data) => {
    $('#dataGridResponse').dxDataGrid({
        dataSource: data,
        keyExpr: 'id',
        showBorders: true,
        paging: {
          enabled: false,
        },
        editing: {
          mode: 'row',
          allowUpdating: true,
          allowDeleting: true,
          allowAdding: true,
        },
        columns: [
            { caption: "Respuestas", dataField: "message" },
        ],
        onEditingStart() {
            console.log("a")
          logEvent('EditingStart');
        },
        onInitNewRow() {
            console.log("b")
          logEvent('InitNewRow');
        },
        onRowInserting() {
            console.log("c")
          logEvent('RowInserting');
        },
        onRowInserted(e) {
            console.log("d")
            console.log(e)
          logEvent('RowInserted');
          actualizarRespuesta(e.data,'/chatBot/insertResponse/');
        },
        onRowUpdating() {
            console.log("e")
          logEvent('RowUpdating');
        },
        onRowUpdated(e) {
            console.log("f")
            console.log(e)
          logEvent('RowUpdated');
          actualizarRespuesta(e.data,'/chatBot/updateResponse/');
        },
        onRowRemoving() {
            console.log("g")
          logEvent('RowRemoving');
        },
        onRowRemoved(e) {
            console.log("h")
          logEvent('RowRemoved');
          eliminarRespuesta(`/chatBot/deleteResponse/${e.key}`);
        },
        onSaving() {
            console.log("i")
          logEvent('Saving');
        },
        onSaved(e) {
          logEvent('Saved');
      
        },
        onEditCanceling() {
            console.log("k")
          logEvent('EditCanceling');
        },
        onEditCanceled() {
            console.log("l")
          logEvent('EditCanceled');
        },
      });
};

function mensajeBot(mensaje){
    let hora = moment().format("HH:mm");
    chatCompleto = chatCompleto +  `<li class="clearfix">
            <div class="chat-avatar">
                <img src="/static/imagen/chatbot.png" class="rounded" alt="ChatBot" />
                <i>${hora}</i>
            </div>
            <div class="conversation-text">
                <div class="ctext-wrap">
                    <i>ChatBot</i>
                    <p>
                        ${mensaje}
                    </p>
                </div>
            </div>
        </li>`
        $('#div_chat').empty()
        $('#div_chat').append(chatCompleto)
}
function mensajeUsuario(mensaje){
    let hora = moment().format("HH:mm");
    chatCompleto = chatCompleto +  `<li class="clearfix odd">
        <div class="chat-avatar">
            <img src="/static/template/assets/images/users/avatar-1.jpg" class="rounded" alt="Usuario" />
            <i>${hora}</i>
        </div>
        <div class="conversation-text">
            <div class="ctext-wrap">
                <i>Usuario</i>
                <p>\
                ${mensaje}
                </p>
            </div>
        </div> 
    </li>`
    $('#div_chat').empty()
    $('#div_chat').append(chatCompleto)
}
$('#btnEnviarMensaje').on('click', async function() {
    if($('#inputMensaje').val() == ""){
        return showSmallMessage("warning","Ingrese un mensaje!")
    }
  
    const objAjax = initObjectAjax();
        objAjax.method = "GET";
        objAjax.url = `/chatBot/mensaje/${$('#inputMensaje').val()}`;
        objAjax.callback = (response) => {
            if (response.success) {
                mensajeUsuario($('#inputMensaje').val());
                showToast(response.tipo, response.mensaje);
                mensajeBot(response.data);
                $('#inputMensaje').val('')

            }else showSmallMessage(response.tipo,response.mensaje)
        };
    genericAjax(objAjax);
})
$('#btnNuevo').on('click', async function() {
    $("#id").val('');
    $("#tag").val('');
    patterns = []
    loadGridPattern(patterns);
    responses = []
    loadGridResponse(responses);
    $("#div_id").prop('hidden', true);
    $("#insert").prop('hidden', false);
    $("#update").prop('hidden', true);
    $("#modal").modal("show");
})

$('#btnEntrenar').on('click', async function() {
    const objAjax = initObjectAjax();
        objAjax.method = "GET";
        objAjax.url = `/chatBot/entrenar/`;
        objAjax.loaderId = "spinner";
        objAjax.buttonIds = ["btnEntrenar","btnNuevo","btnEnviarMensaje"]
        objAjax.async = true;
        objAjax.callback = (response) => {
            showSmallMessage(response.tipo,response.mensaje)
            window.location = "/"
        };
    genericAjax(objAjax);
})

$('#insert').on('click', async function() {
    const validationData = formValidation('submit_form');
    if (validationData.error) {
        showSmallMessage("warning", 'Por favor, ingresa todos los campos requeridos (*)');
        return;
    }
     const intent ={
        id: $("#id").val(),
        tag: $("#tag").val()
    }
    const req ={
        intent:intent,
        patterns:patterns,
        responses:responses
    }
    const objAjax = initObjectAjax();
        objAjax.method = "POST";
        objAjax.url = `/chatBot/insert/`;
        objAjax.data = JSON.stringify({'req':req});
        objAjax.callback = (response) => {
            if (response.success) {
                $('#modal').modal('hide');
                loadGrid(response.data);
            }
            showSmallMessage(response.tipo, response.mensaje);
        };
        genericAjax(objAjax);
})

$('#update').on('click', async function() {
  const validationData = formValidation('submit_form');
  if (validationData.error) {
      showSmallMessage("warning", 'Por favor, ingresa todos los campos requeridos (*)');
      return;
  }
   const intent ={
      id: $("#id").val(),
      tag: $("#tag").val()
  }
  const objAjax = initObjectAjax();
      objAjax.method = "POST";
      objAjax.url = `/chatBot/update/`;
      objAjax.data = JSON.stringify({'obj':intent});
      objAjax.callback = (response) => {
          if (response.success) {
              $('#modal').modal('hide');
              loadGrid(response.data);
          }
          showSmallMessage(response.tipo, response.mensaje);
      };
      genericAjax(objAjax);
})


function actualizarRespuesta(obj,url){
  obj.fkintent = Number($('#id').val())
  if(obj.fkintent != 0){
    const objAjax = initObjectAjax();
    objAjax.method = "POST";
    objAjax.url = url;
    objAjax.data = JSON.stringify({'obj':obj});
    objAjax.callback = (response) => {
      console.log(response)
        if (response.success) {
        }
        showSmallMessage(response.tipo, response.mensaje);
    };
    genericAjax(objAjax);
  }
}

function eliminarRespuesta(url) {
  const objAjax = initObjectAjax();
  objAjax.method = "GET";
  objAjax.url = url;
  objAjax.callback = (response) => {
    console.log(response)
    showSmallMessage(response.tipo, response.mensaje);
  };
  genericAjax(objAjax);
}