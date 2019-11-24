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
    var columns = setHeaders(exp01, exp01Table);
    setBody(columns, exp01Table, exp01);
    $('#exp01Table td').attr('contenteditable','true');
}

function InitiatePhy02(experiment) {
    var exp02 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp02Table = $('#exp02Table');
    var columns = setHeaders(exp02, exp02Table);
    setBody(columns, exp02Table, exp02);
    $('#exp02Table td').attr('contenteditable','true');
}

function InitiatePhy03(experiment) {
    var exp03 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    
    //console.log(exp03);
    //console.log("length exp obj : " + exp03.length);

    var exp03Table = $('#exp03Table');
    var columns = setHeaders(exp03, exp03Table);
    //console.log("columns count Exp3: " + columns);
    setBody(columns, exp03Table, exp03);
    $('#exp03Table td').attr('contenteditable','true');
}

function InitiatePhy04(experiment) {
    var exp04 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp04Table = $('#exp04Table');
    var columns = setHeaders(exp04, exp04Table);
    setBody(columns, exp04Table, exp04);
    $('#exp04Table td').attr('contenteditable','true');
}

function InitiatePhy05(experiment) {
    var exp05 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp05Table = $('#exp05Table');
    var columns = setHeaders(exp05, exp05Table);
    setBody(columns, exp05Table, exp05);
    $('#exp05Table td').attr('contenteditable','true');
}

function InitiatePhy06(experiment) {
    var exp06 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp06Table = $('#exp06Table');
    var columns = setHeaders(exp06, exp06Table);
    setBody(columns, exp06Table, exp06);
    $('#exp06Table td').attr('contenteditable','true');
}

function InitiatePhy07(experiment) {
    var exp07 = JSON.parse(experiment["experimentalTableJsonStructure"]);
    var exp07Table = $('#exp07Table');
    var columns = setHeaders(exp07, exp07Table);
    setBody(columns, exp07Table, exp07);
    $('#exp07Table td').attr('contenteditable','true');
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
function setBody(columns, expTable, exp) { 

    // Traversing the JSON data 
    //for (var i = 0; i < list.length; i++) { 
        var row = $('<tr/>'); 
        for (var colIndex = 0; colIndex < columns.length; colIndex++) 
        { 
            var val = exp[columns[colIndex]]; 
            
            //console.log("val : " + val + " size : " + val.length);

            if(columns[0] === "চাপ" && colIndex == 0) {
                var radioString = ' ';

                console.log("Nth radio checked : " + val);

                if(val == 1){
                    radioString += '<label><input type="radio" name="group1" checked/> <span>বায়ু মন্ডলের চাপ</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group1"/> <span>বায়ু মন্ডলের চাপের বেশী</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group1"/> <span>বায়ু মন্ডলের চাপের কম</span> </label>';
                }
                else if(val == 2){
                    radioString += '<label><input type="radio" name="group1"/> <span>বায়ু মন্ডলের চাপ</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group1" checked/> <span>বায়ু মন্ডলের চাপের বেশী</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group1"/> <span>বায়ু মন্ডলের চাপের কম</span> </label>';
                }
                else if(val == 3){
                    radioString += '<label><input type="radio" name="group1"/> <span>বায়ু মন্ডলের চাপ</span> </label>'+'<br>';
                    radioString += '<label><input type="radio" name="group1"/> <span>বায়ু মন্ডলের চাপের বেশী</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group1" checked/> <span>বায়ু মন্ডলের চাপের কম</span> </label>';
                }

                row.append($('<tr/>').html(radioString));
                continue;
            }

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
        $(expTable).append(row); 
     
} 