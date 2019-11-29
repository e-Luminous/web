$(function () {
    $('.conPhy').on("click", function () {
        let btnClickedId = this.id;
        let nearestExperimentTableId = btnClickedId.replace('convert', 'exp');
        let jQFormat = '#' + nearestExperimentTableId;
        let table = convertTable(jQFormat, {});
        let functionToCall = btnClickedId.replace('convert', 'mapReduce');
        let reducedDataSet = JSON.stringify(window[functionToCall](table));
        console.log(reducedDataSet);
    });
});
function convertTable(tableId, opts) {
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
        let result = {}, index = 0;
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
                }
                else if (cellHTML.includes("লম্বিক ব্যবস্থা")) {
                    let typeStr = cellHTML.indexOf("typeOf");
                    let typeNum = cellHTML.charAt(typeStr + 6);
                    let typeName = 'typeOf' + typeNum.toString();
                    value = $("input[name='" + typeName + "']:checked").val();
                }
                else {
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
        let i, len, txt, $row, $cell, tmpArray = [], cellIndex = 0, result = [];
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
function isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}
function convertArrayToFloat(arr) {
    return arr.map(function (x) {
        return isNumber(x) ? parseFloat(x) : 0;
    });
}
/** Library for JSON Reducer **/
/* Experiment 01 */
function mapReduce01Phy(data) {
    return data.reduce((r, e, i, a) => {
        if (i % 3 === 0) {
            const next = [];
            next.push(a[i + 1]);
            next.push(a[i + 2]);
            const obj = Object.assign(Object.assign({}, e), { "সময়, t(s)": [e["সময়, t(s)"]] });
            for (let i = 0; i < next.length; i++) {
                if (next[i]) {
                    obj["সময়, t(s)"].push(next[i]["সময়, t(s)"]);
                }
            }
            r.push(obj);
        }
        return r;
    }, []);
}
function mapReduce02Phy(data) {
    return data;
}
function mapReduce03Phy(data) {
    return data.reduce((r, e, i, a) => {
        if (i % 3 === 0) {
            const next = [];
            next.push(a[i + 1]);
            next.push(a[i + 2]);
            const obj = Object.assign(Object.assign({}, e), { "১০টি দোলনের জন্য সময়, t(s)": [e["১০টি দোলনের জন্য সময়, t(s)"]], "দোলনকাল,t/10 (s)": [e["দোলনকাল,t/10 (s)"]] });
            for (let i = 0; i < next.length; i++) {
                if (next[i]) {
                    obj["১০টি দোলনের জন্য সময়, t(s)"].push(next[i]["১০টি দোলনের জন্য সময়, t(s)"]);
                    obj["দোলনকাল,t/10 (s)"].push(next[i]["দোলনকাল,t/10 (s)"]);
                }
            }
            r.push(obj);
        }
        return r;
    }, []);
}
function mapReduce04Phy(data) {
    return data;
}
function mapReduce05Phy(data) {
    return data.reduce((r, e, i, a) => {
        if (i % 3 === 0) {
            const next = [];
            next.push(a[i + 1]);
            next.push(a[i + 2]);
            const obj = Object.assign(Object.assign({}, e), { "২০টি দোলনের সময়, t(s)": [e["২০টি দোলনের সময়, t(s)"]], "দোলনকাল, t/20 (s)": [e["দোলনকাল, t/20 (s)"]] });
            for (let i = 0; i < next.length; i++) {
                if (next[i]) {
                    obj["২০টি দোলনের সময়, t(s)"].push(next[i]["২০টি দোলনের সময়, t(s)"]);
                    obj["দোলনকাল, t/20 (s)"].push(next[i]["দোলনকাল, t/20 (s)"]);
                }
            }
            r.push(obj);
        }
        return r;
    }, []);
}
function mapReduce06Phy(data) {
    return data.reduce((r, e, i, a) => {
        if (i % 3 === 0) {
            const next = [];
            next.push(a[i + 1]);
            next.push(a[i + 2]);
            const obj = Object.assign(Object.assign({}, e), { "আবদ্ধনলের উপর প্রান্তের পাঠ, a(cm)": [e["আবদ্ধনলের উপর প্রান্তের পাঠ, a(cm)"]], "আবদ্ধনলের পারদ প্রান্তের পাঠ, b(cm)": [e["আবদ্ধনলের পারদ প্রান্তের পাঠ, b(cm)"]], "খোলানলের পারদ শীর্ষের পাঠ, c(cm)": [e["খোলানলের পারদ শীর্ষের পাঠ, c(cm)"]], "বায়ু স্তম্ভের দৈর্ঘ্য, L = a-b (cm)": [e["বায়ু স্তম্ভের দৈর্ঘ্য, L = a-b (cm)"]], "বদ্ধ ও খোলা নলের পারদ শীর্ষের পাঠ পার্থক্য, h = c~b (cm)": [e["বদ্ধ ও খোলা নলের পারদ শীর্ষের পাঠ পার্থক্য, h = c~b (cm)"]], "আবদ্ধ বায়ুর মোট চাপ H±h (Pa)": [e["আবদ্ধ বায়ুর মোট চাপ H±h (Pa)"]], "গুণফল, H±h * L": [e["গুণফল, H±h * L"]] });
            for (let i = 0; i < next.length; i++) {
                if (next[i]) {
                    obj["আবদ্ধনলের উপর প্রান্তের পাঠ, a(cm)"].push(next[i]["আবদ্ধনলের উপর প্রান্তের পাঠ, a(cm)"]);
                    obj["আবদ্ধনলের পারদ প্রান্তের পাঠ, b(cm)"].push(next[i]["আবদ্ধনলের পারদ প্রান্তের পাঠ, b(cm)"]);
                    obj["খোলানলের পারদ শীর্ষের পাঠ, c(cm)"].push(next[i]["খোলানলের পারদ শীর্ষের পাঠ, c(cm)"]);
                    obj["বায়ু স্তম্ভের দৈর্ঘ্য, L = a-b (cm)"].push(next[i]["বায়ু স্তম্ভের দৈর্ঘ্য, L = a-b (cm)"]);
                    obj["বদ্ধ ও খোলা নলের পারদ শীর্ষের পাঠ পার্থক্য, h = c~b (cm)"].push(next[i]["বদ্ধ ও খোলা নলের পারদ শীর্ষের পাঠ পার্থক্য, h = c~b (cm)"]);
                    obj["আবদ্ধ বায়ুর মোট চাপ H±h (Pa)"].push(next[i]["আবদ্ধ বায়ুর মোট চাপ H±h (Pa)"]);
                    obj["গুণফল, H±h * L"].push(next[i]["গুণফল, H±h * L"]);
                }
            }
            r.push(obj);
        }
        return r;
    }, []);
}
function mapReduce07Phy(data) {
    return data.reduce((r, e, i, a) => {
        if (i % 3 === 0) {
            const next = [];
            next.push(a[i + 1]);
            next.push(a[i + 2]);
            const obj = Object.assign(Object.assign({}, e), { "সুতারটান": [e["সুতারটান"]], "তরঙ্গদৈর্ঘ্য": [e["তরঙ্গদৈর্ঘ্য"]], "সুরশলাকার কম্পাঙ্ক": [e["সুরশলাকার কম্পাঙ্ক"]] });
            for (let i = 0; i < next.length; i++) {
                if (next[i]) {
                    obj["সুতারটান"].push(next[i]["সুতারটান"]);
                    obj["তরঙ্গদৈর্ঘ্য"].push(next[i]["তরঙ্গদৈর্ঘ্য"]);
                    obj["সুরশলাকার কম্পাঙ্ক"].push(next[i]["সুরশলাকার কম্পাঙ্ক"]);
                }
            }
            r.push(obj);
        }
        return r;
    }, []);
}
//# sourceMappingURL=_PostPhysicsExperiments.js.map