$(document).ready(function () {
    $("#tabTeacherExperiments").attr('class', 'active');

    let teacherId = $('#TeacherIdFromViewBag').val();
    let classroomId = $('#ClassroomIdFromViewBag').val();

    $.get('/Classrooms/GetPhysicsSubmissionOfTheTeacher', 
        { classroomId : classroomId }, function(data) {
        //console.log(data);      
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
        }
        else {
            for(let pos = 1; pos <= 7; pos++){
                let titleID = "ch0" + pos + "Phy";
                let tableID = "exp0" + pos + "Phy";
                $('#' + titleID).hide();
                $('#' + tableID).hide();
            }
            $('.btnPhyTec').hide();
            $('.phy1Remove').hide();
        }
    });
    
    $('.btnPhyTec').click(function () {
        let btnIdValue = this.id;
        let clickedTableID = btnIdValue.replace("btn", "exp");

        let submissionID = $('#' + clickedTableID + ' td:nth-child(1)').map(function(){
            return $(this).text();
        }).get();
        
        let marksGiven = $('#' + clickedTableID + ' td:nth-child(7)').map(function(){
            return $(this).text();
        }).get();

        let allSubmissions = [];
        
        for (let pos = 0; pos < marksGiven.length; pos++){
            let objSubmission = {
                "submissionId" : submissionID[pos],
                "marksGiven" : marksGiven[pos]
            };
            allSubmissions.push(objSubmission);
        }
        //console.log(allSubmissions);
        
        $.post('/Classrooms/PostPhysicsSubmissionOfTheTeacher', 
            {allSubmissions : allSubmissions}, function (res) {
            if(res === "success") showMaterialToast("Data Stored Successfully", "green darken-1");
        })
    });
    
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

function showMaterialToast(data, style) {
    M.toast({
        html : data,
        classes : style
    });
}