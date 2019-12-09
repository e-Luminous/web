$(document).ready(function () {
    $("#tabTeacherExperiments").attr('class', 'active');

    let teacherId = $('#TeacherIdFromViewBag').val();
    let classroomId = $('#ClassroomIdFromViewBag').val();

    $.get('/Classrooms/GetPhysicsSubmissionOfTheTeacher', 
        { teacherId: teacherId, classroomId : classroomId }, function(data) {
        console.log(data);      
            if(data.length > 0) {
                let tableID;
                for(let pos = 0; pos < 7; pos++){
                    tableID = data[pos]["experiment"]["scriptFunctionToEvaluateExperiment"];
                    setTableTitleandHead(data[pos], pos + 1, tableID);
                }
                for(let pos = 0; pos < data.length; pos++){
                    tableID = data[pos]["experiment"]["scriptFunctionToEvaluateExperiment"];
                    makeTable(tableID, data[pos]);
                }
            }
        })
});

function setTableTitleandHead(data, pos, tableID) {
    let expTitle = "ch0" + pos + "Phy";
    $('#' + expTitle).append(data["experiment"]["experimentName"]);

    let tableHead = "<tr>";
    tableHead += "<td>College Id</td>" + "<td>HSC Batch</td>" + "<td>shift</td>";
    tableHead += "<td>QualityRatio</td>" + "<td>QualityStatus</td>" + "<td>MarksGiven</td>";
    tableHead += "</tr>";
    $('#' + tableID).append(tableHead);
}

function makeTable(tableID, data) {
    let tableRow = "<tr>";
    tableRow += "<td>"+ data["student"]["collegeId"] +"</td>";
    tableRow += "<td>"+ data["student"]["hscBatch"] +"</td>";
    tableRow += "<td>"+ data["student"]["shift"] +"</td>";
    tableRow += "<td>"+ data["qualityRatio"] +"</td>";
    tableRow += "<td>"+ data["qualityStatus"] +"</td>";
    tableRow += "<td contenteditable='true'>"+ data["marksGiven"] +"</td>";
    tableRow += "</tr>";
    $('#' + tableID).append(tableRow);
}