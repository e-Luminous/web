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
    
    console.log(exp03);
    var exp03Table = $('#exp03Table');
    setHeaders(exp03, exp03Table);
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


function setHeaders(list, expTable) { 
    var columns = []; 
    var header = $('<tr/>'); 
    
    for (var each in list) { 
        if ($.inArray(each, columns) == -1) { 
            columns.push(each); 
            
            // Creating the header 
            header.append($('<th/>').html(each)); 
        } 
    } 
    
    // Appending the header to the table 
    $(expTable).append(header); 
}	 