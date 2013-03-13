function processConfigCmd(cmd) {

var myColumnDefs = [
    {key:"When",minWidth:200, sortable:true},
    {key:"Where",minWidth:300,resizeable:true, sortable:true},
    {key:"What",minWidth:500,resizeable:true, sortable:true},
	{key:"Severity", sortable:true}
];

var myDataSource = new YAHOO.util.DataSource([]);
myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
myDataSource.responseSchema = {
    fields: ["When","Where","What","Severity"]
};

var oConfigs = { 
        paginator: new YAHOO.widget.Paginator({ 
            rowsPerPage: 10
        })          }; 

var myDataTable = new YAHOO.widget.DataTable("ConfigTable",
        myColumnDefs, myDataSource, oConfigs);     

		myDataTable.addRow({When:"a", Where:"b", What:"c", Severity:"d"}, 0 ); 
}
