
// tree list
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

// data grid
const createDataGrid = (params) => {
    const {
        gridId,
        data,
        columnId,
        columns,
        height = "auto",
        pageSize = 12,
        summary = null,
        cellPrepared = null,
        excel = null,
        filterRow = true,
        pager=true,
        exportar = true
    } = params;

    const gridObject = {
        dataSource: data,
        keyExpr: columnId,
        height: height,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        rowAlternationEnabled: true,
        paging: { pageSize: pageSize },
        pager: {
            visible: pager,
            allowedPageSizes: [12, 24, 36, 48, 60, 72],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        groupPanel: {
            visible: true,
            allowColumnDragging: false,
        },
        filterRow: {
            visible: filterRow,
            applyFilter: "auto",
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: "Buscar...",
        },
        headerFilter: {
            visible: true,
        },
        columns: columns,
        summary: {
            totalItems: [
                {
                    column: 'ActivoCodigo',
                    displayFormat: "Total :",
                },{
                column: 'HoraKilometro',
                summaryType: 'sum',
                valueFormat: {
                    type: "fixedPoint",
                    precision: 2,
                },
                displayFormat: "{0}",
            }],
        },
    };

    if (summary) gridObject.summary = summary;
    if (cellPrepared) gridObject.onCellPrepared = (e) => cellPrepared(e);

    if (excel) {
        const { customizeCell, endColumnIdx, title, subTitle, name } = excel;

        gridObject.export = {
            enabled: exportar,
        };
        gridObject.onExporting = function (e) {
            //e.component.beginUpdate();
            //e.component.columnOption("HoraKilometroEfectivo", "visible", false);

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet(name);
            const initRow = title ? 4 : 1;

            DevExpress.excelExporter
                .exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                    topLeftCell: { row: initRow, column: 1 },
                    customizeCell: (options) => {
                        if (customizeCell) customizeCell(options);
                    },
                })
                .then(() => {
                    // header
                    if (!title) return;

                    const headerRow = worksheet.getRow(1);
                    headerRow.height = 20;
                    worksheet.mergeCells(1, 1, 1, endColumnIdx);

                    headerRow.getCell(1).value = title;
                    headerRow.getCell(1).font = { name: "Segoe UI Light", size: 15 };
                    headerRow.getCell(1).alignment = { horizontal: "center" };

                    const headerRowSubtitle = worksheet.getRow(2);
                    headerRowSubtitle.height = 20;

                    /*worksheet.mergeCells(2, 2, 2, endColumnIdx);*/

                    headerRowSubtitle.getCell(1).value = subTitle;
                    headerRowSubtitle.getCell(1).font = { name: "Segoe UI Light", size: 13 };
                    headerRowSubtitle.getCell(1).alignment = { horizontal: "left" };

                })
                .then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(
                            new Blob([buffer], { type: "application/octet-stream" }),
                            `${name}.xlsx`
                        );
                    });
                });
            e.cancel = true;
        };
    }

    return $(`#${gridId}`).dxDataGrid(gridObject).dxDataGrid("instance");
};

const editableDataGrid = (params) => {
    const {
        gridId,
        data,
        columnId,
        columns,
        mode = "popup",
        configMode = null,
        disableFields = [],
        disableEditFields = [],
        enableColumnId = false,
        validateFields = null,
        deleteItem = null,
        allowActions = {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
        },
        editorPrepareActions = null,
        contentReadyActions = null,
        editingStartActions = null,
        headerFilter = true,
        columnChooser = false,
    } = params;

    const gridObject = {
        dataSource: data,
        keyExpr: columnId,
        showBorders: true,
        columnAutoWidth: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: "Buscar...",
        },
        headerFilter: {
            visible: headerFilter,
        },
        columns: columns,
        /*paging: {
          enabled: false,
        },*/
        noDataText: "No hay datos",
        editing: {
            mode,
            /*allowUpdating(e) {
                return e.row.data.AprobacionJornada == null;
              },
              allowDeleting(e) {
                return e.row.data.AprobacionJornada == null;
              },*/
            allowAdding: allowActions["allowAdding"],
            allowUpdating: allowActions["allowUpdating"],
            allowDeleting: allowActions["allowDeleting"],
            texts: {
                deleteRow: "Eliminar",
                cancelRow: "Cancelar",
                cancelRowChanges: "Cancelar",
                saveRowChanges: "Guardar",
                saveRow: "Guardar",
                editRow: "Editar",
            },
        },
        onEditorPreparing(e) {
            // console.log("onEditorPreparing", e.dataField, e.value, e);
            if (
                e.parentType === "dataRow" &&
                ((e.dataField === columnId && !enableColumnId) ||
                    disableFields.includes(e.dataField) ||
                    (typeof e.row.data[columnId] == "number" &&
                        disableEditFields.includes(e.dataField)))
            ) {
                e.editorOptions.disabled = true;
            }

            if (editorPrepareActions) editorPrepareActions(e);
        },
        onContentReady(e) {
            console.log("onContentReady");
            console.log(e);

            if (contentReadyActions) contentReadyActions(e);
        },
        onRowValidating(e) {
            console.log("onRowValidating");
            console.log(e);

            if (!validateFields) {
                e.isValid = false;
                return;
            }

            if (e.isValid) {
                e.promise = validateFields(e)
                    .then(function (response) {
                        console.log("Grid saved item", response);
                        e.isValid = true;
                        setTimeout(() => {
                            const gridComponent = e.component;
                            const items = getGridContent(gridComponent);

                            if (response.action == "insert") {
                                items.pop();
                                items.push(response.item);
                                gridComponent.refresh();
                            }
                        }, 300);
                    })
                    .catch((response) => {
                        e.isValid = false;
                        console.log(response);
                        e.errorText = `ERROR: ${response.message}`;
                    });
            }
        },
        onEditingStart(e) {
            console.log("EditingStart", e);

            if (editingStartActions) editingStartActions(e);
        },
        /*onInitNewRow(e) {
          console.log("InitNewRow", e);
        },
        onRowInserting(e) {
          console.log("RowInserting", e);
        },
        onRowInserted(e) {
          console.log("RowInserted", e);
        },
        onRowUpdating(e) {
          console.log("RowUpdating", e);
        },
        onRowUpdated(e) {
          console.log("RowUpdated", e);
        },*/
        onRowRemoving(e) {
            if (!deleteItem) return;
            deleteItem(e);
        },
        /*onRowRemoved(e) {
          console.log("RowRemoved", e);
        },
        onSaving(e) {
          console.log("Saving", e);
        },
        onSaved(e) {
          console.log("Saved", e);
        },
        onEditCanceling(e) {
          console.log("EditCanceling", e);
        },
        onEditCanceled(e) {
          console.log("EditCanceled", e);
        },*/
    };

    if (configMode) gridObject[mode] = configMode;

    if (columnChooser) {
        gridObject["columnChooser"] = {
            enabled: true,
            mode: "select",
            position: {
                my: "right top",
                at: "right bottom",
                of: ".dx-datagrid-column-chooser-button",
            },
            search: {
                enabled: true,
                editorOptions: { placeholder: "Search column" },
            },
            selection: {
                recursive: true,
                selectByClick: true,
                allowSelectAll: true,
            },
        };
    }

    console.log(gridObject);

    return $(`#${gridId}`).dxDataGrid(gridObject).dxDataGrid("instance");
};

const getGridContent = (gridInstance) => {
    return gridInstance.getDataSource().store()._array;
};

const setGridContent = (gridInstance, data) => {
    gridInstance.getDataSource().store()._array = data;
    gridInstance
        .refresh()
        .done(function () { })
        .fail(function (error) {
            Swal.fire(
                "Ha ocurrido un error. Comuníquese con el Área de Sistemas",
                error,
                "error"
            );
        });
};
