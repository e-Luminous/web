var tempsid = $('#tempsid').val();

var colorArray = [
    "red darken-1", "teal darken-1", "indigo darken-1", "blue-grey darken-1",
    "purple darken-3", "blue lighten-1", "blue accent-2", "light-blue"
];

$(document).ready(function () {
    getClassRoom();
$("#classroomForm").submit(function (e) {
    e.preventDefault();
    var AccessCode = $('#AccessCode').val();
    var studentId = $("#student_id").val();
    console.log("access code: "+AccessCode);

    $.post('', {accessCode : AccessCode, sid : studentId}, function (responseData) {
        if(responseData === "failed"){
            showMaterialToast("Invalid Request", "red darken-1");
        }else if(responseData === "codeinvalid"){
            showMaterialToast("Enter a valid classroom code", "amber darken-3");
        }
        else if(responseData === "success"){
            showMaterialToast("Classroom join Successfully", "teal darken-1");

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
    console.log("sid is : " + tempsid);
    console.log("classroom is : " + classrooms);

    $.get('/Students/__getClassRoom___', {sid : tempsid}, function (res) {
        if(res.length == 0){
            var modalForCreateNewClassroom = "<h5 class=\"center-align\">You have no classroom yet</h5>\n" +
                "    <p class=\"center-align\"><a class=\"waves-effect waves-light btn-small materialize-indigo modal-trigger\" href=\"#joinClassroomModal\"><i class=\"material-icons left\">add</i>Create A New One</a></p>";

            classrooms.html(modalForCreateNewClassroom);
        }else{
            var cardsForEachClassrooms = "<p class=\"center-align\"><a class=\"waves-effect waves-light btn-small materialize-indigo modal-trigger\" href=\"#joinClassroomModal\"><i class=\"material-icons left\">add</i>Create A New One</a></p>";
            cardsForEachClassrooms += "<input id=\"tempsid\" hidden value=\""+res[0]["student"]["account"]["userId"]+"\" type=\"text\"/>";
            cardsForEachClassrooms += "<div class=\"row\">"

            for (var i = res.length - 1; i >= 0; i--){
                var randomIndex = Math.floor(Math.random() * 8);

                var eachClassroomCard = "<div class=\"col s12 l4\">\n" +
                    "      <div class=\"card \">\n" +
                    "        <div class=\"card-content "+colorArray[randomIndex]+" white-text\">\n" +
                    "          <span class=\"card-title\">"+res[i]["classroom"]["classroomTitle"]+"</span>\n" +
                    "          <p>I am a very simple card. I am good at containing small bits of information.\n" +
                    "          I am convenient because I require little markup to use effectively.</p>\n" +
                    "        </div>\n" +
                    "        <div class=\"card-action\">\n" +
                    "          <a target='_blank' href=\"/Classrooms/__student__/"+tempsid+"/"+res[i]["classroom"]["classroomId"]+"\">This is a link</a>\n" +
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