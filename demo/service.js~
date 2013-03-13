function processServiceCmd(cmd) {
    var cmdParams = cmd.split(" ");

    //Command Format:
    //addUserService name=wei service=iptv8M port=OLT10/1/10/1/1 addr=滨江1号
    //port=olt/slot/pon/llid/uni
    if ( cmdParams[0] == "addUserService" ) {
        var myColumnDefs = [
            {key:"status",minWidth:100,sortable:true},
            {key:"user",minWidth:200,sortable:true},
            {key:"service",minWidth:200,resizeable:true,sortable:true},
            {key:"port",minWidth:300,resizeable:true,sortable:true},
            {key:"address",minWidth:500,resizeable:true,sortable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource([]);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["status", "user","service","port","address"]
        };
/*
        var oConfigs = { 
                paginator: new YAHOO.widget.Paginator({ 
                    rowsPerPage: 10
                })          }; 

        var myDataTable = new YAHOO.widget.DataTable("ServiceTable",
                myColumnDefs, myDataSource, null);     
*/
        var myDataTable = new YAHOO.widget.DataTable("ServiceTable",
                myColumnDefs, myDataSource, null);     

                myDataTable.addRow({status:'正常', user:'卫岳民', service:"IPTV8M", port:"OLT广场1/1/10/1", address:"阿斯蒂芬"}, 0 ); 
    }

    //Command Format:
    //showUserService 
    //option: name= port= service=
    if ( cmdParams[0] == "showUserService" ) {
        var myColumnDefs = [
            {key:"status",minWidth:100,sortable:true},
            {key:"user",minWidth:200,sortable:true},
            {key:"service",minWidth:200,resizeable:true,sortable:true},
            {key:"port",minWidth:300,resizeable:true,sortable:true},
            {key:"address",minWidth:500,resizeable:true,sortable:true}
        ];

        var myDataSource = new YAHOO.util.DataSource([]);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["status", "user","service","port","address"]
        };

/*
        var oConfigs = { 
                paginator: new YAHOO.widget.Paginator({ 
                    rowsPerPage: 10
                })          }; 

        var myDataTable = new YAHOO.widget.DataTable("ServiceTable",
                myColumnDefs, myDataSource, null);     
*/
        var myDataTable = new YAHOO.widget.DataTable("ServiceTable",
                myColumnDefs, myDataSource, null);     

        myDataTable.subscribe("rowMouseoverEvent", myDataTable.onEventHighlightRow); 
        myDataTable.subscribe("rowMouseoutEvent", myDataTable.onEventUnhighlightRow); 
        myDataTable.subscribe("rowClickEvent", myDataTable.onEventSelectRow); 

        // Programmatically select the first row 
        myDataTable.selectRow(myDataTable.getTrEl(0)); 
        // Programmatically bring focus to the instance so arrow selection works immediately 
        myDataTable.focus(); 

                myDataTable.addRow({status:'正常', user:'卫岳民', service:"IPTV8M", port:"OLT广场1/1/10/1", address:"阿斯蒂芬"}, 0 ); 
                myDataTable.addRow({status:'不正常', user:'卫岳民', service:"IPTV8M", port:"OLT广场1/1/10/1", address:"阿斯蒂芬"}, 0 ); 
                myDataTable.addRow({status:'不正常', user:'卫岳民', service:"IPTV8M", port:"OLT广场1/1/10/1", address:"阿斯蒂芬"}, 0 ); 
                myDataTable.addRow({status:'正常', user:'卫岳民', service:"IPTV8M", port:"OLT广场1/1/10/1", address:"阿斯蒂芬"}, 0 ); 
    }
}
