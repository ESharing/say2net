
/* 
* Service Resource :
* port, link, vlan, vc, pw, ce, lsp, 
* port: Port location(Node Shelf-Slot-Port), work status(ok), work information(bandwidth=10M), customer(wei yuemin), service id(001)
* Command: show port on node xxx
*/
function processResourceCmd(cmd) {
	// here just for demo, from design view, a xml for cmd-fun parser to load fun dynamically should be consider
	if ( cmd == "show port" ) {
		showPort();
	}
}

function showPort() {
    YAHOO.example.RowSelection = function() {
        var myColumnDefs = [
            {key:"Location",sortable:true},
            {key:"Status", sortable:true},
            {key:"Value", sortable:true},
            {key:"Customer Name", sortable:true},
			{key:"Service ID", sortable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.port);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["Location","Status","Value","Customer Name","Service ID"]
        };

        var standardSelectDataTable = new YAHOO.widget.DataTable("content",
                myColumnDefs, myDataSource, null);
                
        // Subscribe to events for row selection
        standardSelectDataTable.subscribe("rowMouseoverEvent", standardSelectDataTable.onEventHighlightRow);
        standardSelectDataTable.subscribe("rowMouseoutEvent", standardSelectDataTable.onEventUnhighlightRow);
        standardSelectDataTable.subscribe("rowClickEvent", standardSelectDataTable.onEventSelectRow);

        // Programmatically select the first row
        standardSelectDataTable.selectRow(standardSelectDataTable.getTrEl(0));
        // Programmatically bring focus to the instance so arrow selection works immediately
        standardSelectDataTable.focus();
        
        return {
            oDS: myDataSource,
            oDTStandardSelect: standardSelectDataTable
        };
    }();

}