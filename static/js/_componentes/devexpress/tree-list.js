const createSimpleTree = (params) => {
  const {
    tableId,
    tableData,
    childrenKey,
    columns = [],
    pageSize = 10,
  } = params;
  return $(`#${tableId}`)
    .dxTreeList({
      dataSource: tableData,
      itemsExpr: childrenKey,
      dataStructure: "tree",
      columns: columns,
      showRowLines: true,
      showBorders: true,
      columnAutoWidth: true,
      autoExpandAll: true,
      allowColumnReordering: true,
      searchPanel: {
        visible: true,
      },
      paging: {
        enabled: true,
        pageSize: pageSize,
      },
      scrolling: {
        mode: "standard",
      },
      pager: {
        showPageSizeSelector: true,
        showInfo: true,
      },
    })
    .dxTreeList("instance");
};

const getContentButtons = (buttonItems) => {
  return buttonItems.map((el) => {
    const { icon, title, clickFn } = el;
    return {
      text: "",
      icon: `/icons/font-awesome/${icon}-solid.svg`,
      hint: title,
      cssClass: "dx-action-btn",
      onClick: function (e) {
        // console.log(title);
        clickFn(e);
      },
    };
  });
};

const getTreeContent = (treeInstance) => {
  return treeInstance.getDataSource().store()._array;
};

const setTreeContent = (treeInstance, data) => {
  treeInstance.getDataSource().store()._array = data;
  treeInstance
    .refresh()
    .done(function () {})
    .fail(function (error) {
      Swal.fire(
        "Ha ocurrido un error. Comuníquese con el Área de Sistemas",
        error,
        "error"
      );
    });
};
