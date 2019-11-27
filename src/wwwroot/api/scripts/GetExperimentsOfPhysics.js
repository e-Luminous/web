let initialLengthOfPhyExp = [];

$(document).ready(function () {
    $("#tabStudentExperiments").attr('class', 'active');
    let studentId = $('#StudentIdFromViewBag').val();
    let classroomId = $('#ClassroomIdFromViewBag').val();

    $.get('/Classrooms/GetPhysicsSubmissionOfTheStudent', { studentId: studentId, classroomId : classroomId }, function(data) {
        for (let i=0; i< data.length; i++) {
            InitiateExperiments(data[i]);
        }
    });
    console.log(initialLengthOfPhyExp);
});

function InitiateExperiments(submission) {
    let experimentalBaseMSONStructure = JSON.parse(submission["experiment"]["experimentalTableJsonStructure"]);
    let tableIdName = submission["experiment"]["scriptFunctionToEvaluateExperiment"];
    let tableIdQueryable = '#' + tableIdName;
    let tableDataQueryable = tableIdQueryable + ' td';
    let expTable = $(tableIdQueryable);
    console.log(submission);
    let initialRowLength;
    null==submission["apiData"]? initialRowLength = setBody(setHeaders(experimentalBaseMSONStructure,expTable),expTable,experimentalBaseMSONStructure)
                               : initialRowLength = setBody(setHeaders(JSON.parse(submission["apiData"]),expTable),expTable,JSON.parse(submission["apiData"]));
    $(tableDataQueryable).attr('contenteditable','true');
    
    let objectOfEachExpPhy = {};
    objectOfEachExpPhy[tableIdName] = initialRowLength;
    initialLengthOfPhyExp.push(objectOfEachExpPhy);
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
                });
                row.append($('<td/>').html(subRow));
                continue;
            }

            if (val === "") val = ""; 
                row.append($('<td/>').html(val));
        }
        if(i + 1 === exp.length) console.log(row.html());
        // Adding each row to the table 
        $(expTable).append(row); 
    }
    return exp.length;
    //console.log(exp.length);
} 