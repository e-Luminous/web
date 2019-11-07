// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var temptid = $('#temptid').val();
var colorArray = [
    "red darken-1", "teal darken-1", "indigo darken-1", "blue accent-3",
    "purple darken-2", "pink darken-2", "red darken-2", "blue lighten-2",
    "indigo", "deep-purple", "blue accent-1", "deep-purple accent-3",
    "cyan lighten-3", "light-blue lighten-1", "cyan", "cyan accent-3",
    "green", "light-green", "lime", "orange", "blue-grey lighten-1"
];


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
                var randomIndex = Math.floor(Math.random() * 21);
                
                var eachClassroomCard = "<div class=\"col s12 l3\">\n" +
                    "      <div class=\"card \">\n" +
                    "        <div class=\"card-content "+colorArray[randomIndex]+" white-text\">\n" +
                    "          <span class=\"card-title\">"+res[i]["classroomTitle"]+"</span>\n" +
                    "          <p>I am a very simple card. I am good at containing small bits of information.\n" +
                    "          I am convenient because I require little markup to use effectively.</p>\n" +
                    "        </div>\n" +
                    "        <div class=\"card-action\">\n" +
                    "          <a target='_blank' href=\"/Classrooms/__teacher__/"+temptid+"/"+res[i]["classroomId"]+"\">This is a link</a>\n" +
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