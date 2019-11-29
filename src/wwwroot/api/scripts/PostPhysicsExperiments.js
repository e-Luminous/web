$(function() {
    $('.conPhy').on("click", function() {
        let btnClickedId = this.id;
        let nearestExperimentTableId = btnClickedId.replace('convert', 'exp');
        let jQFormat = '#'+nearestExperimentTableId;

        let table = convertTable(jQFormat);
        console.log(table);
        /*let json = JSON.stringify(table);
        console.log(json);*/
        /*let res = document.getElementById("res");
        res.value = json;*/
    });

});

function convertTable (tableId, opts) {

    // Set options
    let defaults = {
        ignoreColumns: [],
        onlyColumns: null,
        ignoreHiddenRows: true,
        headings: null,
        allowHTML: true
    };
    
    opts = $.extend(defaults, opts);
    // console.log(opts);

    let notNull = function(value) {
        return value !== undefined && value !== null;
    };

    let ignoredColumn = function(index) {
        if (notNull(opts.onlyColumns)) {
            return $.inArray(index, opts.onlyColumns) === -1;
        }
        return $.inArray(index, opts.ignoreColumns) !== -1;
    };

    let arraysToHash = function(keys, values) {
        let result = {},
            index = 0;
        $.each(values, function(i, value) {
            // when ignoring columns, the header option still starts
            // with the first defined column
            if (index < keys.length && notNull(value)) {
                result[keys[index]] = value;
                index++;
            }
        });
        return result;
    };

    let cellValues = function(cellIndex, cell) {
        let value, result;
        if (!ignoredColumn(cellIndex)) {
            let override = $(cell).data('override');
            
            if (opts.allowHTML) {
                let cellHTML = $(cell).html();
                
                if(cellHTML.includes("বায়ু মন্ডলের চাপ")){
                    let groupStr = cellHTML.indexOf("group");
                    let groupNum = cellHTML.charAt(groupStr+5);
                    let groupName = 'group' + groupNum.toString();
                    value = $("input[name='"+groupName+"']:checked").val();
                } else if(cellHTML.includes("লম্বিক ব্যবস্থা")){
                    let typeStr = cellHTML.indexOf("typeOf");
                    let typeNum = cellHTML.charAt(typeStr+6);
                    let typeName = 'typeOf' + typeNum.toString();
                    value = $("input[name='"+typeName+"']:checked").val();
                } else {
                    value = $.trim($(cell).html());
                }
            } 
            
            else {
                value = $.trim($(cell).text());
            }
            result = notNull(override) ? override : value;
        }
        return result;
    };

    let rowValues = function(row) {
        let result = [];
        $(row).children('td,th').each(function(cellIndex, cell) {
            if (!ignoredColumn(cellIndex)) {
                result.push(cellValues(cellIndex, cell));
            }
        });
        return result;
    };

    let getHeadings = function(table) {
        let firstRow = table.find('tr:first').first();
        return notNull(opts.headings) ? opts.headings : rowValues(firstRow);
    };

    let construct = function(table, headings) {
        let i, len, txt, $row, $cell,
            tmpArray = [],
            cellIndex = 0,
            result = [];
        
        table.children('tr').each(function(rowIndex, row) {
            if (rowIndex > 0 || notNull(opts.headings)) {
                $row = $(row);
                if ($row.is(':visible') || !opts.ignoreHiddenRows) {
                    if (!tmpArray[rowIndex]) {
                        tmpArray[rowIndex] = [];
                    }
                    cellIndex = 0;
                    $row.children().each(function() {
                        if (!ignoredColumn(cellIndex)) {
                            $cell = $(this);

                            // process rowspans
                            if ($cell.filter('[rowspan]').length) {
                                len = parseInt($cell.attr('rowspan'), 10) - 1;
                                cellIndex = this.cellIndex;
                                txt = cellValues(cellIndex, $cell, []);
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
                                txt = cellValues(cellIndex, $cell, []);
                                for (i = 1; i <= len; i++) {
                                    tmpArray[rowIndex][cellIndex + i] = txt;
                                }
                            }
                            // skip column if already defined
                            while (tmpArray[rowIndex][cellIndex]) {
                                cellIndex++;
                            }
                            if (!ignoredColumn(cellIndex)) {
                                txt = tmpArray[rowIndex][cellIndex] || cellValues(cellIndex, $cell, []);
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

        $.each(tmpArray, function(i, row) {
            if (notNull(row)) {
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

function isNumber(n) { 
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
}


  