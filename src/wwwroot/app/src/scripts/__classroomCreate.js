// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function () {
    $("#classroomForm").submit(function (e) {
         e.preventDefault();
        var classroomTitle = $('#ClassroomTitle').val();
        var teacherid = $("#teacher_id").val();
        console.log(classroomTitle, teacherid);

         $.post('', {cTitle : classroomTitle, tid : teacherid}, function (responseData) {
             if(responseData === "Fail"){
                 showMaterialToast("Invalid Request", "red darken-1");
             }else if(responseData === "SelectCource"){
                 showMaterialToast("Select Cource First", "teal darken-1");
             }
             else if(responseData === "success"){
                 //showMaterialToast("Select Cource First", "teal darken-1");
             }

             console.log(responseData);
         });
    })
});


function showMaterialToast(data, style) {
    M.toast({
        html : data,
        classes : style
    });
}

