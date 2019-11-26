$(document).ready(function () {
    $("#tabStudentExperiments").attr('class', 'active');
    let studentId = $('#StudentIdFromViewBag').val();
    let classroomId = $('#ClassroomIdFromViewBag').val();

    $.get('/Classrooms/GetPhysicsSubmissionOfTheStudent', { studentId: studentId, classroomId : classroomId }, function(data) {
        for (let i=0; i< data.length; i++){
            InitiateExperiments(data[i], data[i]["experiment"]["experimentId"]);
        }
    });
});

function InitiateExperiments(submission, index) {
    let experimentalBaseMSONStructure = JSON.parse(submission["experiment"]["experimentalTableJsonStructure"]);
    let tableString = 'exp' + index + 'Table';
    let expTable = $('#'+tableString);
    let columns;
    
    if(submission["apiData"] == null) {
        columns = setHeaders(experimentalBaseMSONStructure, expTable);
        setBody(columns, expTable, experimentalBaseMSONStructure);
    }else{
        columns = setHeaders(JSON.parse(submission["apiData"]), expTable);
        setBody(columns, expTable, JSON.parse(submission["apiData"]));
    }
    $('#'+tableString+' td').attr('contenteditable','true');
}

/* Set All Table Header */
function setHeaders(list, expTable) { 
    let columns = []; 
    let header = $('<tr/>'); 
    console.log(list);
    
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

                console.log("Nth radio checked : " + val);

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

                console.log(radioString);
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
        // Adding each row to the table 
        $(expTable).append(row); 
    }
} 