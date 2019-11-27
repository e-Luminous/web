let initialLengthOfPhyExp = {};
let submissionTableApi = [];

$(document).ready(function () {
    $("#tabStudentExperiments").attr('class', 'active');
    let studentId = $('#StudentIdFromViewBag').val();
    let classroomId = $('#ClassroomIdFromViewBag').val();

    $.get('/Classrooms/GetPhysicsSubmissionOfTheStudent', { studentId: studentId, classroomId : classroomId }, function(data) {
        for (let i=0; i< data.length; i++) {
            InitiateExperiments(data[i]);
            submissionTableApi.push(data[i]);
        }
        console.log($('#exp03Phy').html());
    });
    
    
    
    $('.btnPhy').click(function () {
        let btnIdValue = this.id;
        let clickedTableID = btnIdValue.replace("btn", "exp");
        let clickedTableCurrentLength = initialLengthOfPhyExp[clickedTableID][clickedTableID];
        
        //let submissionAPIIndex = Object.keys(submissionTableApi["experiment"]).indexOf(keytoFind);
        let tBody = findBaseTBody(clickedTableID);

        clickedTableCurrentLength++;
        
        tBody = tBody.replace(/"group"/g, "'group"+ clickedTableCurrentLength + "'");
        tBody = tBody.replace(/"typeOf"/g, "'typeOf"+ clickedTableCurrentLength + "'");
        
        initialLengthOfPhyExp[clickedTableID][clickedTableID] = clickedTableCurrentLength;
        
        console.log(tBody);
        $('#'+clickedTableID).append('<tr>' + tBody + '</tr>');
        console.log("Now length : " + clickedTableCurrentLength);
    });
    
    
});

function findBaseTBody(expName) {
    for (let pos = 0; pos < submissionTableApi.length; pos++){
        if(submissionTableApi[pos]["experiment"]["scriptFunctionToEvaluateExperiment"]
            === expName){
            return submissionTableApi[pos]["experiment"]["experimentalTableBodyMarkUp"];
        }
    }
}

function InitiateExperiments(submission) {
    let experimentalBaseMSONStructure = JSON.parse(submission["experiment"]["experimentalTableJsonStructure"]);
    let tableIdName = submission["experiment"]["scriptFunctionToEvaluateExperiment"];
    let tableIdQueryable = '#' + tableIdName;
    let tableDataQueryable = tableIdQueryable + ' td';
    let expTable = $(tableIdQueryable);
    let initialRowLength;
    null==submission["apiData"]? initialRowLength = setBody(setHeaders(experimentalBaseMSONStructure,expTable),expTable,experimentalBaseMSONStructure)
                               : initialRowLength = setBody(setHeaders(JSON.parse(submission["apiData"]),expTable),expTable,JSON.parse(submission["apiData"]));
    $(tableDataQueryable).attr('contenteditable','true');
    
    let objectOfEachExpPhy = {};
    objectOfEachExpPhy[tableIdName] = initialRowLength;
    initialLengthOfPhyExp[tableIdName] = objectOfEachExpPhy;
}


/* Set All Table Header */
function setHeaders(list, expTable) { 
    let columns = []; 
    let header = $('<tr/>'); 
    //console.log(list);
    
    for (let each in list[0]) { 
        if ($.inArray(each, columns) === -1) { 
            columns.push(each); 
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
    for (let i = 0; i < exp.length; i++) { 
        let row = $('<tr/>'); 
        for (let colIndex = 0; colIndex < columns.length; colIndex++) 
        { 
            let val = exp[i][columns[colIndex]]; 
            
            // console.log("val : " + val + " size : " + val.length);

            if(columns[0] === "চাপ" && colIndex === 0) {
                let radioString = ' ';

                //console.log("Nth radio checked : " + val);

                if(val === 0){
                    radioString += '<label><input type="radio" name="group'+i+'" checked/> <span>বায়ু মন্ডলের চাপ</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপের বেশী</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপের কম</span> </label>';
                }
                else if(val === 1){
                    radioString += '<label><input type="radio" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপ</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group'+i+'" checked/> <span>বায়ু মন্ডলের চাপের বেশী</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপের কম</span> </label>';
                }
                else if(val === 2){
                    radioString += '<label><input type="radio" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপ</span> </label>'+'<br>';
                    radioString += '<label><input type="radio" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপের বেশী</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="group'+i+'" checked/> <span>বায়ু মন্ডলের চাপের কম</span> </label>';
                }

                //console.log(radioString);
                row.append($('<tr/>').html(radioString));
                continue;
            }

            if(columns[0] === "ব্যবস্থা" && colIndex === 0) {
                let radioString = ' ';

                if(val === 0){
                    radioString += '<label><input type="radio" name="typeOf'+i+'" checked/> <span>লম্বিক ব্যবস্থা</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="typeOf'+i+'"/> <span>আড়াআড়ি ব্যবস্থা</span> </label>' + '<br>';
                }
                else if(val === 1){
                    radioString += '<label><input type="radio" name="typeOf'+i+'" /> <span>লম্বিক ব্যবস্থা</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" name="typeOf'+i+'" checked/> <span>আড়াআড়ি ব্যবস্থা</span> </label>' + '<br>';
                }
                
                row.append($('<tr/>').html(radioString));
                continue;
            }

            if(val.length > 0) {
                let subRow = $("<tr/>");
                val.forEach(element => {
                    subRow.append($('<tr/>').html(element));
                    //subRow.append($('<td/>').html('</tr>'));
                });
                row.append($('<td/>').html(subRow));
                continue;
            }

            if (val === "") val = ""; 
                row.append($('<td/>').html(val));
        }
        //if(i + 1 === exp.length) console.log(row.html());
        // Adding each row to the table 
        $(expTable).append(row); 
    }
    return exp.length;
    //console.log(exp.length);
} 