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
                    setTableRow(tableID, data[pos]);
                }

                for(let pos = 0; pos < 7; pos++){
                    let btnID = "btn0" + (pos + 1) + "Phy";
                    tableID = data[pos]["experiment"]["scriptFunctionToEvaluateExperiment"];
                    $('#' + tableID).append("<td><a class=\"right-align btn-floating btn-large waves-effect waves-light materialize-indigo btnPhyTec\" id=\""+btnID+"\"><i class=\"material-icons\">save</i></a></td>");
                }
            }
        })
});

function setTableTitleandHead(data, pos, tableID) {
    let expTitle = "ch0" + pos + "Phy";
    $('#' + expTitle).append(data["experiment"]["experimentName"]);

    let tableHead = "<tr>";
    tableHead += "<th>Submission Id</th>" + "<th>College Id</th>" + "<th>HSC Batch</th>" + "<th>Shift</th>";
    tableHead += "<th>Quality Ratio</th>" + "<th>Quality Status</th>" + "<th>Marks Given</th>";
    tableHead += "</tr>";
    $('#' + tableID).append(tableHead);
}

function setTableRow(tableID, data) {
    let tableRow = "<tr>";
    tableRow += "<td>"+ data["submissionId"] + "</td>";
    tableRow += "<td>"+ data["student"]["collegeId"] +"</td>";
    tableRow += "<td>"+ data["student"]["hscBatch"] +"</td>";
    tableRow += "<td>"+ data["student"]["shift"] +"</td>";
    tableRow += "<td>"+ data["qualityRatio"] +"</td>";
    tableRow += "<td>"+ data["qualityStatus"] +"</td>";
    tableRow += "<td contenteditable='true'>"+ data["marksGiven"] +"</td>";
    tableRow += "</tr>";
    $('#' + tableID).append(tableRow);
}