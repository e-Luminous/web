$(function () {
    $('.conPhy').on("click", function () {
        let btnClickedId = this.id;
        let nearestExperimentTableId = btnClickedId.replace('convert', 'exp');
        let jQFormat = '#' + nearestExperimentTableId;
        tableToJson(jQFormat);
    });
});
function tableToJson(table) {
    let results = [];
    let headings = [];
    $(table + " tr th").each(function (i, v) {
        headings.push($(v).text());
    });
    let defaults = {
        ignoreColumns: [],
        onlyColumns: null,
        ignoreHiddenRows: true,
        headings: null,
        allowHTML: true
    };
    let notNull = function (value) {
        return value !== undefined && value !== null;
    };
}
//# sourceMappingURL=_PostPhysicsExperiments.js.map