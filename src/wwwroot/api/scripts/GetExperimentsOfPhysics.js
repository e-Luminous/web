$(document).ready(function () {
    var studentId = $('#StudentIdFromViewBag').val();
    var classroomId = $('#ClassroomIdFromViewBag').val();

    $.get('/Classrooms/GetPhysicsSubmissionOfTheStudent', { studentId: studentId, classroomId : classroomId }, function(data) {
        for (var i=0; i< data.length; i++){
            window[data[i]["experiment"]["experimentalTableJsonStructure"]](data[i]["experiment"]);
        }
    });
});

function InitiatePhy01(experiment) {
    console.log(experiment);
}

function InitiatePhy02(experiment) {
    console.log(experiment);
}

function InitiatePhy03(experiment) {
    console.log(experiment);
}

function InitiatePhy04(experiment) {
    console.log(experiment);
}

function InitiatePhy05(experiment) {
    console.log(experiment);
}

function InitiatePhy06(experiment) {
    console.log(experiment);
}

function InitiatePhy07(experiment) {
    console.log(experiment);
}

function InitiatePhy08(experiment) {
    console.log(experiment);
}

function InitiatePhy09(experiment) {
    console.log(experiment);
}
