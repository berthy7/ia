const getCookie = (name) => {
  const r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
  return r ? r[1] : undefined;
}

function buttonsState(className, state = "hide") {
    const tagId = className.startsWith(".") ? className : `#${className}`;
    const items = document.querySelectorAll(tagId);
    if (items.length) $(items).prop("disabled", state == "hide");
}


/*const genericAjax = (params) => {
    const loaderId = params.async ? `#${params.loaderId}` : null;
    const objectRequest = {
        method: params.method,
        url: params.url,
        data: params.data,
        async: params.async,
        headers:{
            "X-CSRFToken" : getCookie('csrftoken')
        },
        beforeSend: function () {
            if (loaderId) $(loaderId).fadeIn(800);
            params.buttonIds.forEach(el => {
                buttonsState(el);
            })
        },
        success: function (response) {
            if (loaderId) $(loaderId).fadeOut(800);
            params.buttonIds.forEach(el => {
                buttonsState(el);
            })
            if (response.tipo == "Unauthorized") {
                show_msg_lg(
                    "warning",
                    "Se ha expirado su tiempo de sesi&oacute;n, vuelva a ingresar",
                    "center"
                );
                setTimeout(() => {
                    location.href = "/Login/Logout";
                }, 5000);
                return;
            }
            if (!params.remitResponse && !response.success) {
                Swal.fire(response.error, response.message, response.tipo);
                setTimeout(() => {
                    if (params.redirect) location.href = params.redirect;
                }, 3000);
                return;
            }
            if (params.callback) params.callback(response);
        },
        error: function (jqXHR, status, err) {
            if (loaderId) $(loaderId).fadeOut(800);
            params.buttonIds.forEach(el => {
                buttonsState(el);
            })
            Swal.fire("Error", jqXHR.responseText, "error")
        },
    };
    if (params.formData) {
        objectRequest.contentType = false;
        objectRequest.processData = false;
        objectRequest.cache = false;
    }
    $.ajax(objectRequest);
};*/


let initObjectAjax = () => {
    return {
        method: "GET",
        url: "",
        data: null,
        callback: () => { },
        async: false,
        loaderId: "",
        formData: null,
        redirect: "",
        remitResponse: false,
        buttonIds: []
    }
}


const genericAjax = (params) => {

    const loaderId = params.async ? `#${params.loaderId}` : null;
    const objectRequest = {
        method: params.method,
        url: params.url,
        data: params.data,
        async: params.async,
        headers:{
            "X-CSRFToken" : getCookie('csrftoken')
        },
        beforeSend: function () {
            if (loaderId) $(loaderId).fadeIn(800);
            params.buttonIds.forEach(el => {
                const item = document.querySelector(`#${el}`);
                if (item) item.disabled = true;

            })
        },
        success: function (response) {
            if (loaderId) $(loaderId).fadeOut(800);
            params.buttonIds.forEach(el => {
                const item = document.querySelector(`#${el}`);
                if (item) item.disabled = false;
            })
            if (response.tipo == "Unauthorized") {
                showMessageLg(
                    "warning",
                    "Se ha expirado su tiempo de sesi&oacute;n, vuelva a ingresar",
                    "center"
                );
                setTimeout(() => {
                    location.href = "/Login/Logout";
                }, 5000);
                return;
            }
            if (!params.remitResponse && !response.success) {
                Swal.fire(response.error, response.message, response.tipo);

                setTimeout(() => {
                    if (params.redirect) location.href = params.redirect;
                }, 3000);
                return;
            }

            if (params.callback) params.callback(response);
        },
        error: function (jqXHR, status, err) {
            if (loaderId) $(loaderId).fadeOut(800);
            params.buttonIds.forEach(el => {
                const item = document.querySelector(`#${el}`);
                if (item) item.disabled = false;

            })
            Swal.fire("Error", jqXHR.responseText, "error")

        },
    };

    if (params.formData) {
        objectRequest.contentType = false;
        objectRequest.processData = false;
        objectRequest.cache = false;
    }

    $.ajax(objectRequest);
};

/*const genericAjax = (params) => {
    const loaderId = params.async ? `#${params.loaderId}` : null;
    const objectRequest = {
        method: params.method,
        url: params.url,
        data: params.data,
        async: params.async,
        headers:{
            "X-CSRFToken" : getCookie('csrftoken')
        },
        beforeSend: function () {
             if (loaderId) $(loaderId).fadeIn(800);
             params.buttonIds.forEach(el => {
                 const item = document.querySelector(`#${el}`);
                 if (item) item.disabled = true;
             })
        },
        success: function (response) {
             if (loaderId) $(loaderId).fadeOut(800);
             params.buttonIds.forEach(el => {
                 const item = document.querySelector(`#${el}`);
                 if (item) item.disabled = false;
             })
             if (response.tipo == "Unauthorized") {
                 show_msg_lg(
                     "warning",
                     "Se ha expirado su tiempo de sesi&oacute;n, vuelva a ingresar",
                     "center"
                 );
                 setTimeout(() => {
                     location.href = "/Login/Logout";
                 }, 5000);
                 return;
             }
             if (!params.remitResponse && !response.success) {
                 Swal.fire(response.error, response.message, response.tipo);
            
                 setTimeout(() => {
                     if (params.redirect) location.href = params.redirect;
                 }, 3000);
                 return;
             }

            if (params.callback) params.callback(response);
        },
        error: function (jqXHR, status, err) {
            if (loaderId) $(loaderId).fadeOut(800);
            params.buttonIds.forEach(el => {
                const item = document.querySelector(`#${el}`);
                if (item) item.disabled = false;

            })
            Swal.fire("Error", jqXHR.responseText, "error")
        },
    };

    if (params.formData) {
        objectRequest.contentType = false;
        objectRequest.processData = false;
        objectRequest.cache = false;
    }

    $.ajax(objectRequest);
};*/

// http request
const ajaxCall = (url, data, render, callback) => {

    $.ajax({
        method: "POST",
        body: data,headers:{
            "X-CSRFToken" : getCookie('csrftoken')
        },
        url: url,
        data: data,
        success: function (response) {
            if (render) $(render).html(response);
            if (callback) callback(response);
        },
        error: function (jqXHR, status, err) {
            showMessage(jqXHR.responseText, 'danger', 'remove');
        }
    });
}
const ajaxCallGet = (url, data, callback) => {
    $.ajax({
        method: "PUT",
        url: url,
        data: data,
        success: function (response) {
            if (callback) {
                // dictionary = JSON.parse(response)
                dictionary = response
                callback(dictionary)
            }
        },
        error: function (jqXHR, status, err) {
            showMessage('Error', jqXHR.responseText, 'danger', 'remove');
        }
    });
}
const ajaxCallLogin = (url, data, callback) => {
    $.ajax({
        method: "POST",
        url: url,
        data: data,
        success: function (response) {
            dictionary = JSON.parse(response);

            if (callback) callback(dictionary);
        },
        error: function (jqXHR, status, err) {
            showMessage(jqXHR.responseText, 'danger', 'remove');
        }
    });
}


const fetchData = async (url, method, data) => {
  try {
      
    const resquest = await fetch(url, {
      method: method,
      body: data,headers:{
            "X-CSRFToken" : getCookie('csrftoken')
        }
    });

    return await resquest.json();
      
  } catch (error) {
    showSmallMessage("error", error);
  }
};

const ajaxData = (params) => {
  const objectRequest = {
    method: params.method,
    url: params.url,
    data: params.data,
    success: function (response) {
      if (params.callback) params.callback(response);
    },
    error: function (jqXHR, status, err) {
      showSmallMessage("error", jqXHR.responseText);
    },
  };

  if (params.hasOwnProperty('formData')) {
    objectRequest.contentType = false;
    objectRequest.processData = false;
    objectRequest.cache = false;
    objectRequest.async = true;
  }

  $.ajax(objectRequest);
};

// helpers


// validate form
const printError = (element, validMessage) => {
  const itemError = document.getElementById(`help-${element.id}`);

  if (itemError) return;

  const invalidItem = document.createElement('div');
  
  invalidItem.setAttribute('id', `help-${element.id}`);
  invalidItem.classList.add('invalid-feedback');
  invalidItem.innerHTML = validMessage;
  element.parentElement.insertAdjacentElement("beforeend", invalidItem);
}
const eraseError = (element) => {
  const itemError = document.getElementById(`help-${element.id}`);
  if (itemError) itemError.parentElement.removeChild(itemError);
}
const getLabel = (itemId) => {
  const itemTag = document.querySelector(`label[for=${itemId}]`);
  return itemTag?.textContent ? itemTag.textContent.replace(" *", "").trim() : null;
}
const validateElements = (params) => {
  let { items, message, labels, flag } = params;

  items.forEach(item => {
      if (item.id) {
          const isValid = item.checkValidity();

          if (!isValid && item.hasAttribute('required')) {
              const errorMessage = item.validationMessage;
              const textFragment = `${item.id}: ${errorMessage}`;
              message += message ? `\n${textFragment}` : textFragment;
              printError(item, errorMessage);
              flag = true;

              const itemLabel = getLabel(item.id);
              if (itemLabel) labels.push(itemLabel);
          }
          else eraseError(item);
      }
  });

  return [flag, message, labels];
}
const formValidation = (id) => {
  let flag = false;
  let message = "";
  let labels = [];
  const formElement = document.getElementById(id);

  const elements = [
    "input[type=text]:enabled",
    "select[required]",
    "input[type=number]:enabled",
    "textarea:enabled",
    "input[type=email]:enabled",
    "input[type=password]:enabled",
    "input[type=file]:enabled",
    "input[type=search]:enabled",
    "input[type=time]:enabled",
  ];

  elements.forEach((item) => {
    const items = document.querySelectorAll(`#${id} ${item}`);
    [flag, message] = validateElements({ items, message, labels, flag });
  });
  formElement.classList.add("was-validated");

  return { error: flag, message: message, labels };
};

function get_current_date(date_obj) {
    return format_dmy(date_obj.getDate() + "/" + (date_obj.getMonth() + 1) + "/" + date_obj.getFullYear());
}

function get_current_hour(date_obj) {
    return date_obj.getHours() + ":" + date_obj.getMinutes();
}

function get_current_time(date_obj) {
    return date_obj.getFullYear() + "-" + (date_obj.getMonth() + 1) + "-" + date_obj.getDate() + ' ' + date_obj.getHours() + ":" + date_obj.getMinutes();
}

function str_to_date(cadena) {
    var partd = cadena.split("/");
    return new Date(partd[1] + '/' + partd[0] + '/' + partd[2]);
}

function format_dmy(valor) {
    var res = '';

    if (!['', null].includes(valor)) {
        var partd = valor.split("/")

        vlm = (parseInt(partd[1]) < 10)? '0' + partd[1]: vlm = partd[1];
        vld = (parseInt(partd[0]) < 10)? '0' + partd[0]: vld = partd[0];

        res = vld + '/' + vlm + '/' + partd[2];
    }

    return res;
}


function limpiarSelect(e) {
    $(e).html('');
    $(e).selectpicker('destroy');
    $(e).selectpicker({
      size: 10,
      liveSearch: true,
      liveSearchPlaceholder: 'Buscar',
      title: 'Seleccione'
    });
}


const formatDateTime = (stringDate, oldFormat, newFormat) => {
    return stringDate ? moment(stringDate, oldFormat).format(newFormat) : null;
};
