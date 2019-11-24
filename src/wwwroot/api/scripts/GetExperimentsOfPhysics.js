$(document).ready(function () {
    var studentId = $('#StudentIdFromViewBag').val();
    var classroomId = $('#ClassroomIdFromViewBag').val();

    $.get('/Classrooms/GetPhysicsSubmissionOfTheStudent', { studentId: studentId, classroomId : classroomId }, function(data) {
        for (var i=0; i< data.length; i++){
            window[data[i]["experiment"]["scriptFunctionToEvaluateExperiment"]](data[i]["experiment"]);
        }
    });
});

function InitiatePhy01(experiment) {
    var exp01 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp01Table = $('#exp01Table');
    setHeaders(exp01, exp01Table);
}

function InitiatePhy02(experiment) {
    var exp02 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp02Table = $('#exp02Table');
    setHeaders(exp02, exp02Table);
}

function InitiatePhy03(experiment) {
    var exp03 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    
    //console.log(exp03);
    //console.log("length exp obj : " + exp03.length);

    var exp03Table = $('#exp03Table');
    //Set Table Headers
    var columns = setHeaders(exp03, exp03Table);
    //console.log("columns count : " + columns);
    //Set Table Body INfo
    setBody(columns, exp03Table, exp03);
}

function InitiatePhy04(experiment) {
    var exp04 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp04Table = $('#exp04Table');
    setHeaders(exp04, exp04Table);
}

function InitiatePhy05(experiment) {
    var exp05 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp05Table = $('#exp05Table');
    setHeaders(exp05, exp05Table);
}

function InitiatePhy06(experiment) {
    var exp06 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp06Table = $('#exp06Table');
    setHeaders(exp06, exp06Table);
}

function InitiatePhy07(experiment) {
    var exp07 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp07Table = $('#exp07Table');
    setHeaders(exp07, exp07Table);
}


/* Set All Table Header */
function setHeaders(list, expTable) { 
    var columns = []; 
    var header = $('<tr/>'); 
    
    for (var each in list) { 
        if ($.inArray(each, columns) == -1) { 
            columns.push(each); 
            //console.log("Each col Name " + each);
            // Creating the header 
            header.append($('<th/>').html(each)); 
        } 
    } 
    
    // Appending the header to the table 
    $(expTable).append(header); 
    return columns;
}	 


/* Set All Body Info */
function setBody(columns, exp03Table, exp03) { 

    // Traversing the JSON data 
    //for (var i = 0; i < list.length; i++) { 
        var row = $('<tr/>'); 
        for (var colIndex = 0; colIndex < columns.length; colIndex++) 
        { 
            var val = exp03[columns[colIndex]]; 
            
            //console.log("val : " + val + " size : " + val.length);

            if(val.length > 0) {
                var subRow = $("<tr/>");
                val.forEach(element => {
                    subRow.append($('<tr/>').html(element)); 
                });
                row.append($('<td/>').html(subRow));
                continue;
            }

            if (val == null) val = ""; 
                row.append($('<td/>').html(val)); 
        } 
        
        // Adding each row to the table 
        $(exp03Table).append(row); 
     
} 