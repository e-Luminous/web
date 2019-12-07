$(function () {
    let submissions = [];
    let studentId = $('#StudentIdFromViewBag').val();
    let classroomId = $('#ClassroomIdFromViewBag').val();

    getTableData(studentId, classroomId, submissions);
    
    $('.btnMLPhy').on("click", function () {
        let btnMLClickedId = this.id;
        let nearestExperimentTableId = btnMLClickedId.replace('btnML', 'exp');
        let jQFormat = '#' + nearestExperimentTableId;
        let table = convertTable(jQFormat, {});
        let indexInSubmission = submissions.findIndex(p => p["experiment"]["scriptFunctionToEvaluateExperiment"] === nearestExperimentTableId);
        let experimentBaseStructure = JSON.parse(submissions[indexInSubmission]["experiment"]["experimentalTableJsonStructure"])[0];
        let keysWithRowSpans = [];
        let maxLengthOfAnArray = 0;

        for (let key in experimentBaseStructure) {
            if (experimentBaseStructure.hasOwnProperty(key) && Array.isArray(experimentBaseStructure[key])) {
                keysWithRowSpans.push(key);
                maxLengthOfAnArray = Math.max(maxLengthOfAnArray, experimentBaseStructure[key].length);
            }
        }

        let tempArrayOfObject = [];
        for (let x = 0; x < table.length; x++) {
            if (x % maxLengthOfAnArray === 0) {
                for (let y = 0; y < keysWithRowSpans.length; y++) {
                    let tmpObj = {};
                    if (tmpObj.hasOwnProperty(keysWithRowSpans[y]) === false) {
                        tmpObj[keysWithRowSpans[y]] = [table[x][keysWithRowSpans[y]]];
                    }
                    tempArrayOfObject.push(tmpObj);
                }
            }
        }

        let standardJsonForMachineLearning = JSON.parse(submissions[indexInSubmission]["experiment"]["standardJsonForMachineLearning"]);
        let reduceJson = mapReduce(table, keysWithRowSpans, maxLengthOfAnArray, tempArrayOfObject);
        let reduceJsonLength = reduceJson.length;

        let headerTable = Object.keys(standardJsonForMachineLearning[0]);

        let minimumDistance = [];
        let maximumDistance = [];
        for (let posReduce = 0; posReduce < reduceJsonLength; posReduce++){
            Euclidean_Distance(minimumDistance,maximumDistance,standardJsonForMachineLearning,headerTable,reduceJson,posReduce)
        }
        constructAnalyticalModel(minimumDistance, maximumDistance, submissions[indexInSubmission]);
    });

});

function constructAnalyticalModel(minDistance, maxDistance, submissionRequested) {
    $('#analyticalModal').modal('open');
    $('#analyticalModalHeader').text(submissionRequested["experiment"]["experimentName"]);
    
    minDistance.forEach(function (element) {
       Object.keys(element).forEach(function (key) {
           console.log(key, element[key]);
       }) 
    });
    
    console.log(minDistance);
    console.log(maxDistance);
}


function Euclidean_Distance(minimumDistance,maximumDistance,standardJsonForMachineLearning,headerTable,reduceJson,posReduce) {
    let headerLength = headerTable.length;
    let standardJsonLength = standardJsonForMachineLearning.length;

    let miniBest = new Array(headerLength).fill(10000);
    let maxiBest = new Array(headerLength).fill(0);
    
    for(let posStandard = 0; posStandard < standardJsonLength; posStandard++){
        for(let posHeader = 0; posHeader < headerLength; posHeader++){
            let keyName = headerTable[posHeader];
            if(keyName === "ব্যবস্থা" || keyName === "চাপ") continue;
            let objStandard = standardJsonForMachineLearning[posStandard][keyName];
            let objReduce = reduceJson[posReduce][keyName];

            if(objReduce.length > 0) {
                if(posStandard === 0){
                    miniBest[posHeader] = new Array(objReduce.length).fill(10000);
                    maxiBest[posHeader] = new Array(objReduce.length).fill(0);
                }
                for(let subpos = 0; subpos < objReduce.length; subpos++) {
                    let tempDistance = Math.abs(objStandard[subpos] - objReduce[subpos]);
                    miniBest[posHeader][subpos] = Math.min(miniBest[posHeader][subpos], tempDistance);
                    maxiBest[posHeader][subpos] = Math.max(maxiBest[posHeader][subpos], tempDistance);
                }
            }
            else{
                let tempDistance = Math.abs(standardJsonForMachineLearning[posStandard][headerTable[posHeader]]
                    - reduceJson[posReduce][headerTable[posHeader]]);
                miniBest[posHeader] = Math.min(miniBest[posHeader], tempDistance);
                maxiBest[posHeader] = Math.max(maxiBest[posHeader], tempDistance);
            }
        }
    }

    let tempObjMinimum= {}, tempObjMaximum = {};
    for(let posHeader = 0; posHeader < headerLength; posHeader++){
        let keys = headerTable[posHeader];
        if(keys === "ব্যবস্থা" || keys === "চাপ") continue;
        let miniDistance = miniBest[posHeader];
        let maxDistance = maxiBest[posHeader];
        tempObjMinimum[keys] = miniDistance;
        tempObjMaximum[keys] = maxDistance;
    }
    minimumDistance.push(tempObjMinimum);
    maximumDistance.push(tempObjMaximum);
}


function getTableData(studentId, classroomId, submissions) {
    $.get('/Classrooms/GetPhysicsSubmissionOfTheStudent', {
        studentId: studentId,
        classroomId: classroomId
    }, function (data) {
        for (let i = 0; i < data.length; i++) {
            submissions.push(data[i]);
        }
    }).then(function () {
        showMaterialToast("Ready to explore", "grey darken-3");
    });
}

function mapReduce(data, keysWithRowSpans, maxRowSpans, initArrayOfObjects) {
    let spanLength = keysWithRowSpans.length;
    let initAOBLength = initArrayOfObjects.length;

    if (maxRowSpans === 0) {
        return data;
    } else {
        let traverseStart = 0;
        let traverseEnd = spanLength - 1;

        return data.reduce((r, e, i, a) => {
            if (i % maxRowSpans === 0) {
                const next = [];

                for (let x = 1; x < maxRowSpans; x++) {
                    next.push(a[i + x]);
                }

                let obj = {...e};
                let yy = -1;

                for (let xx = traverseStart; xx <= traverseEnd; xx++) {
                    const tempObject = initArrayOfObjects[xx];
                    obj = {...obj, ...tempObject};
                    yy = xx;
                }

                if (yy !== initAOBLength - 1) {
                    traverseStart += spanLength;
                    traverseEnd += spanLength;
                }


                for (let index = 0; index < next.length; index++) {
                    if (next[index]) {
                        for (let spanKey = 0; spanKey < spanLength; spanKey++) {
                            obj[keysWithRowSpans[spanKey]].push(next[index][keysWithRowSpans[spanKey]]);
                        }
                    }
                }

                r.push(obj);
            }
            return r;
        }, []);
    }
}

function convertTable(tableId, opts) {
    let defaults = {
        ignoreColumns: [],
        onlyColumns: null,
        ignoreHiddenRows: true,
        headings: null,
        allowHTML: true
    };

    opts = $.extend(defaults, opts);

    let notNull = function (value) {
        return value !== undefined && value !== null;
    };

    let ignoredColumn = function (index) {
        if (notNull(opts.onlyColumns)) {
            return $.inArray(index, opts.onlyColumns) === -1;
        }
        return $.inArray(index, opts.ignoreColumns) !== -1;
    };

    let arraysToHash = function (keys, values) {
        let result = {},
            index = 0;
        $.each(values, function (i, value) {
            // when ignoring columns, the header option still starts
            // with the first defined column
            if (index < keys.length && notNull(value)) {
                result[keys[index]] = value;
                index++;
            }
        });
        return result;
    };

    let cellValues = function (cellIndex, cell) {
        let value, result;
        if (!ignoredColumn(cellIndex)) {
            let override = $(cell).data('override');

            if (opts.allowHTML) {
                let cellHTML = $(cell).html();

                if (cellHTML.includes("বায়ু মন্ডলের চাপ")) {
                    let groupStr = cellHTML.indexOf("group");
                    let groupNum = cellHTML.charAt(groupStr + 5);
                    let groupName = 'group' + groupNum.toString();
                    value = $("input[name='" + groupName + "']:checked").val();
                } else if (cellHTML.includes("লম্বিক ব্যবস্থা")) {
                    let typeStr = cellHTML.indexOf("typeOf");
                    let typeNum = cellHTML.charAt(typeStr + 6);
                    let typeName = 'typeOf' + typeNum.toString();
                    value = $("input[name='" + typeName + "']:checked").val();
                } else {
                    value = $.trim($(cell).html());
                }
            } else {
                value = $.trim($(cell).text());
            }
            result = notNull(override) ? override : value;
        }
        return result;
    };

    let rowValues = function (row) {
        let result = [];
        $(row).children('td,th').each(function (cellIndex, cell) {
            if (!ignoredColumn(cellIndex)) {
                result.push(cellValues(cellIndex, cell));
            }
        });
        return result;
    };

    let getHeadings = function (table) {
        let firstRow = table.find('tr:first').first();
        return notNull(opts.headings) ? opts.headings : rowValues(firstRow);
    };

    let construct = function (table, headings) {
        let i, len, txt, $row, $cell,
            tmpArray = [],
            cellIndex = 0,
            result = [];

        table.children('tr').each(function (rowIndex, row) {
            if (rowIndex > 0 || notNull(opts.headings)) {
                $row = $(row);
                if ($row.is(':visible') || !opts.ignoreHiddenRows) {
                    if (!tmpArray[rowIndex]) {
                        tmpArray[rowIndex] = [];
                    }
                    cellIndex = 0;
                    $row.children().each(function () {
                        if (!ignoredColumn(cellIndex)) {
                            $cell = $(this);

                            // process rowspans
                            if ($cell.filter('[rowspan]').length) {
                                len = parseInt($cell.attr('rowspan'), 10) - 1;
                                cellIndex = this.cellIndex;
                                txt = cellValues(cellIndex, $cell);
                                for (i = 1; i <= len; i++) {
                                    if (!tmpArray[rowIndex + i]) {
                                        tmpArray[rowIndex + i] = [];
                                    }
                                    tmpArray[rowIndex + i][cellIndex] = txt;
                                }
                            }
                            // process colspans
                            if ($cell.filter('[colspan]').length) {
                                len = parseInt($cell.attr('colspan'), 10) - 1;
                                cellIndex = this.cellIndex;
                                txt = cellValues(cellIndex, $cell);
                                for (i = 1; i <= len; i++) {
                                    tmpArray[rowIndex][cellIndex + i] = txt;
                                }
                            }
                            // skip column if already defined
                            while (tmpArray[rowIndex][cellIndex]) {
                                cellIndex++;
                            }
                            if (!ignoredColumn(cellIndex)) {
                                txt = tmpArray[rowIndex][cellIndex] || cellValues(cellIndex, $cell);
                                if (notNull(txt)) {
                                    tmpArray[rowIndex][cellIndex] = txt;
                                }
                            }
                        }
                        cellIndex++;
                    });
                }
            }
        });

        $.each(tmpArray, function (i, row) {
            if (notNull(row)) {
                // filter table inputs to number
                row = convertArrayToFloat(row);
                txt = arraysToHash(headings, row);
                result[result.length] = txt;
            }
        });
        return result;
    };

    // Run
    let headings = getHeadings($(tableId));
    return construct($(tableId), headings);
}


function convertArrayToFloat(arr) {
    return arr.map(function (x) {
        //return isNumber(x) ? parseFloat(x) : 0;
        return isNaN(x) ? 0 : parseFloat(x);
    });
}

function showMaterialToast(data, style) {
    M.toast({
        html : data,
        classes : style
    });
}