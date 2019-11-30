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
        //console.log($('#exp03Phy').html());
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
        
        // console.log(tBody);
        
        if(tBody.includes("rowspan")) {
            $('#'+clickedTableID).append(tBody);
        } else {
            $('#'+clickedTableID).append('<tr>' + tBody + '</tr>');
        }
        //console.log("Now length : " + clickedTableCurrentLength);
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

    /*Design Initiation*/
    let collapsibleHeaderToTarget = '#' + tableIdName.replace('exp', 'ch');
    $(collapsibleHeaderToTarget).append(submission["experiment"]["experimentName"]);
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
    
    let maxRowSpan = 0;

    //Find max rowSpan
    
    for(let poscol = 0; poscol < columns.length; poscol++){
        if(exp[0][columns[poscol]].length > 0){
            maxRowSpan = Math.max(exp[0][columns[poscol]].length, maxRowSpan);
        }
    }

    //console.log("max row " + maxRowSpan);
    
    // Traversing the JSON data 
    for (let i = 0; i < exp.length; i++) { 
        //let row = $('<tr/>'); 
        let rowStr = "<tr>";

        if(maxRowSpan === 0){
            for (let colIndex = 0; colIndex < columns.length; colIndex++){
                rowStr += "<td>"+exp[i][columns[colIndex]]+"</td>";
            }
            rowStr += "</tr>";
        }
        else {

            let value = exp[i][columns[0]];
            let radioString = "";
            //চাপ
            if(columns[0] === "চাপ") {
                rowStr += "<td rowspan="+maxRowSpan+">";
                
                if(value === 0){
                    radioString += '<label><input type="radio" value="0" name="group'+i+'" checked/> <span>বায়ু মন্ডলের চাপ</span> </label>';
                    radioString += '<label><input type="radio" value="1" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপের বেশী</span> </label>';
                    radioString += '<label><input type="radio" value="2" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপের কম</span> </label>';
                }
                else if(value === 1){
                    radioString += '<label><input type="radio" value="0" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপ</span> </label>';
                    radioString += '<label><input type="radio" value="1" name="group'+i+'" checked/> <span>বায়ু মন্ডলের চাপের বেশী</span> </label>';
                    radioString += '<label><input type="radio" value="2" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপের কম</span> </label>';
                }
                else if(value === 2){
                    radioString += '<label><input type="radio" value="0" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপ</span> </label>';
                    radioString += '<label><input type="radio" value="1" name="group'+i+'"/> <span>বায়ু মন্ডলের চাপের বেশী</span> </label>';
                    radioString += '<label><input type="radio" value="2" name="group'+i+'" checked/> <span>বায়ু মন্ডলের চাপের কম</span> </label>';
                }
                rowStr += radioString + "</td>";
            }

            //ব্যবস্থা
            if(columns[0] === "ব্যবস্থা") {
               
                rowStr += "<td rowspan="+maxRowSpan+">";

                if(value === 0){
                    radioString += '<label><input type="radio" value="0" name="typeOf'+i+'" checked/> <span>লম্বিক ব্যবস্থা</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" value="1" name="typeOf'+i+'"/> <span>আড়াআড়ি ব্যবস্থা</span> </label>' + '<br>';
                }
                else if(value === 1){
                    radioString += '<label><input type="radio" value="0" name="typeOf'+i+'"/> <span>লম্বিক ব্যবস্থা</span> </label>' + '<br>';
                    radioString += '<label><input type="radio" value="1" name="typeOf'+i+'" checked/> <span>আড়াআড়ি ব্যবস্থা</span> </label>' + '<br>';
                }
                rowStr += radioString + "</td>";
            }

            for (let colIndex = 0; colIndex < columns.length; colIndex++){
                
                if((columns[0] === "ব্যবস্থা" || columns[0] ==="চাপ") && (colIndex === 0)) continue;
                let eachVal = exp[i][columns[colIndex]];

                if(eachVal.length > 1){
                    rowStr += "<td>"+eachVal[0]+"</td>";
                }
                else {
                    rowStr += "<td rowspan="+maxRowSpan+">"+eachVal+"</td>";
                }
            }
            rowStr += "</tr>";

            let posCnt = 1;
            while(posCnt < maxRowSpan){
                rowStr += "<tr>";
                for (let colIndex = 0; colIndex < columns.length; colIndex++){
                    let eachVal = exp[i][columns[colIndex]];
                    if(eachVal.length > 1){
                        rowStr += "<td>"+eachVal[posCnt]+"</td>";
                    }
                }
                posCnt++;
                rowStr += "</tr>";
            }
        }

        $(expTable).append(rowStr); 
    }
    return exp.length;

} 