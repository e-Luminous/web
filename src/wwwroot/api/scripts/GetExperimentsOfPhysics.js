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
    
}

function InitiatePhy02(experiment) {
    var exp02 = JSON.parse(experiment["experimentalTableJsonStructure"]);
}

function InitiatePhy03(experiment) {
    var exp03 = JSON.parse(experiment["experimentalTableJsonStructure"]);
}

function InitiatePhy04(experiment) {
    var exp04 = JSON.parse(experiment["experimentalTableJsonStructure"]);
}

function InitiatePhy05(experiment) {
    var exp05 = JSON.parse(experiment["experimentalTableJsonStructure"]);
}

function InitiatePhy06(experiment) {
    var exp06 = JSON.parse(experiment["experimentalTableJsonStructure"]);
}

function InitiatePhy07(experiment) {
    var exp07 = JSON.parse(experiment["experimentalTableJsonStructure"]);
}