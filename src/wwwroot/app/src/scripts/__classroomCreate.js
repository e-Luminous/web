// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var temptid = $('#temptid').val();

$(document).ready(function () {
    getClassRoom();
    
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
                 showMaterialToast("Classroom Created Successfully", "teal darken-1");

                 $('#ClassroomTitle').val("");
                 getClassRoom();
             }else{
                 
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

function getClassRoom() {
    
    var classrooms = $('#classRooms');
    console.log("Tid is : " + temptid);
    
    $.get('/Teachers/__getClassRoom___', {tid : temptid}, function (res) {
        if(res.length == 0){
            var modalForCreateNewClassroom = "<h5 class=\"center-align\">You have no classroom yet</h5>\n" +
                "    <p class=\"center-align\"><a class=\"waves-effect waves-light btn-small materialize-indigo modal-trigger\" href=\"#createClassroomModal\"><i class=\"material-icons left\">add</i>Create A New One</a></p>";
            
            classrooms.html(modalForCreateNewClassroom);
        }else{
            var cardsForEachClassrooms = "<p class=\"center-align\"><a class=\"waves-effect waves-light btn-small materialize-indigo modal-trigger\" href=\"#createClassroomModal\"><i class=\"material-icons left\">add</i>Create A New One</a></p>";
            cardsForEachClassrooms += "<input id=\"temptid\" hidden value=\""+res[0]["teacher"]["account"]["userId"]+"\" type=\"text\"/>";
            cardsForEachClassrooms += "<div class=\"row\">"
            
            for (var i = res.length - 1; i >= 0; i--){
                var eachClassroomCard = "<div class=\"col s12 m6\">\n" +
                    "      <div class=\"card blue-grey darken-1\">\n" +
                    "        <div class=\"card-content white-text\">\n" +
                    "          <span class=\"card-title\">"+res[i]["classroomTitle"]+"</span>\n" +
                    "          <p>I am a very simple card. I am good at containing small bits of information.\n" +
                    "          I am convenient because I require little markup to use effectively.</p>\n" +
                    "        </div>\n" +
                    "        <div class=\"card-action\">\n" +
                    "          <a href=\"#\">This is a link</a>\n" +
                    "          <a href=\"#\">This is a link</a>\n" +
                    "        </div>\n" +
                    "      </div>\n" +
                    "    </div>";

                cardsForEachClassrooms += eachClassroomCard;
            }
            cardsForEachClassrooms += "</div>";
            
            classrooms.html(cardsForEachClassrooms);
            console.log(res);
        }
    })
}