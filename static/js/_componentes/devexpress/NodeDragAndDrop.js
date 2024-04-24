let objDragAndDrop = {
    id: "",
    padreId: "",
    elementId: "",
    datalist: [],
    columns: [],
    options: false,
};

function CargarDragAndDrop(params) {

    const treeList = $(`#${params.elementId}`).dxTreeList({
        dataSource: params.datalist,
        rootValue: -1,
        keyExpr: params.id,
        rowDragging: {
            allowDropInsideItem: true,
            allowReordering: true,
            onDragChange(e) {
                const visibleRows = treeList.getVisibleRows();
                const sourceNode = treeList.getNodeByKey(e.itemData.EstructuraEstadoFinancieroId);
                let targetNode = visibleRows[e.toIndex].node;

                while (targetNode && targetNode.data) {
                    if (targetNode.data.EstructuraEstadoFinancieroId === sourceNode.data.EstructuraEstadoFinancieroId) {
                        e.cancel = true;
                        break;
                    }
                    targetNode = targetNode.parent;
                }
            },
            onReorder(e) {
                const visibleRows = e.component.getVisibleRows();

                if (e.dropInsideItem) {
                    e.itemData.Head_ID = visibleRows[e.toIndex].key;
                } else {
                    const sourceData = e.itemData;
                    const toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex;
                    let targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null;

                    if (targetData && e.component.isRowExpanded(targetData.EstructuraEstadoFinancieroId)) {
                        sourceData.Head_ID = targetData.EstructuraEstadoFinancieroId;
                        targetData = null;
                    } else {
                        sourceData.Head_ID = targetData ? targetData.Head_ID : e.component.option('rootValue');
                    }

                    const sourceIndex = params.datalist.indexOf(sourceData);
                    params.datalist.splice(sourceIndex, 1);

                    const targetIndex = params.datalist.indexOf(targetData) + 1;
                    params.datalist.splice(targetIndex, 0, sourceData);
                }

                e.component.refresh();
            },
        },
        parentIdExpr: params.padreId,

        //allowColumnResizing: false,
        //columnResizingMode: 'nextColumn',
        //columnMinWidth: 50,
        //columnAutoWidth: false,

        
        columns: params.columns,

        expandedRowKeys: [1],
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
    }).dxTreeList('instance');


    if (params.options) {
        $('#allowDropInside').dxCheckBox({
            text: 'Permitir soltar elemento interior',
            value: true,
            onValueChanged(e) {
          
                treeList.option('rowDragging.allowDropInsideItem', e.value);
            },
        });

        $('#allowReordering').dxCheckBox({
            text: 'Permitir Reordenar',
            value: true,
            onValueChanged(e) {
                treeList.option('rowDragging.allowReordering', e.value);
            },
        });

        $('#dragIcons').dxCheckBox({
            text: 'Mostrar iconos de arrastre',
            value: true,
            onValueChanged(e) {
                treeList.option('rowDragging.showDragIcons', e.value);
            },
        });
    } else {
        treeList.option('rowDragging.allowDropInsideItem', false);
        treeList.option('rowDragging.allowReordering', false);
        treeList.option('rowDragging.showDragIcons', false);
    }

}

