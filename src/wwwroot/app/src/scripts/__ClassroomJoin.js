var loggedInSid = $('#loggedInSid').val();

var colorArray = [
    "red darken-1", "teal darken-1", "indigo darken-1", "blue accent-3",
    "purple darken-2", "pink darken-2", "red darken-2", "blue lighten-2",
    "indigo", "deep-purple", "blue accent-1", "deep-purple accent-3",
    "cyan lighten-3", "light-blue lighten-1", "cyan", "cyan accent-3",
    "green", "light-green", "lime", "orange", "blue-grey lighten-1"
];

$(document).ready(function () {
    getClassRoomForStudent();
    
$("#classroomForm").submit(function (e) {
    e.preventDefault();
    var AccessCode = $('#AccessCode').val();
    var studentId = $("#student_id").val();
    console.log("access code: " + AccessCode);

    $.post('', {accessCode : AccessCode, sid : studentId}, function (responseData) {
        if(responseData === "failed"){
            showMaterialToast("Invalid Request", "red darken-1" );
            removeInputFieldDataStudent();
        }
        else if(responseData === "fill-up Profile") {
            showMaterialToast("Full Profile Fill-up First", "amber darken-3");
        }
        else if(responseData === "codeinvalid"){
            showMaterialToast("Enter a valid classroom code", "amber darken-3");
            removeInputFieldDataStudent();
        }
        else if(responseData === "success"){
            showMaterialToast("Classroom join Successfully", "teal darken-1");

            removeInputFieldDataStudent();
            getClassRoomForStudent();
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

function removeInputFieldDataStudent() {
    $('#AccessCode').val("");
}

function getClassRoomForStudent() {

    var classrooms = $('#classRooms');
    console.log("sid is : " + loggedInSid);
    
    $.get('/Students/__getClassRoom___', {sid : loggedInSid}, function (res) {
        if(res.length == 0){
            var modalToJoinNewClassroom = "<h5 class=\"center-align\">You have no classroom yet</h5>\n" +
                "    <p class=\"center-align\"><a class=\"waves-effect waves-light btn-small materialize-indigo modal-trigger\" href=\"#joinClassroomModal\"><i class=\"material-icons left\">add</i>Join A New One</a></p>";

            classrooms.html(modalToJoinNewClassroom);
        }
        else{

            var cardsForEachClassrooms = "<p class=\"center-align\"><a class=\"waves-effect waves-light btn-small materialize-indigo modal-trigger\" href=\"#joinClassroomModal\"><i class=\"material-icons left\">add</i>Join A New One</a></p>";
            cardsForEachClassrooms += "<input id=\"loggedInSid\" hidden value=\""+res[0]["student"]["account"]["userId"]+"\" type=\"text\"/>";
            cardsForEachClassrooms += "<div class=\"row\">"

            for (var i = res.length - 1; i >= 0; i--){
                var randomIndex = Math.floor(Math.random() * 21);

                var eachClassroomCard  = "<div class=\"col s12 l3\">\n" +
                    "                <div id=\"profile-card\" class=\"card\">\n" +
                    "                    <div class=\"card-image waves-effect waves-block waves-light\">\n" +
                    "                        <img class=\"activator\" src=\"https://img.freepik.com/free-vector/vector-illustration-mountain-landscape_1441-72.jpg?size=338&ext=jpg\" alt=\"user bg\" />\n" +
                    "                    </div>\n" +
                    "                    <div class=\"card-content\">\n" +
                    "                        <img src=\"https://pixinvent.com/materialize-material-design-admin-template/app-assets/images/avatar/avatar-7.png\" alt=\"\" class=\"circle responsive-img activator card-profile-image cyan lighten-1 padding-2\" />\n" +
                    "                        <a target='_blank' class=\"btn-floating activator btn-move-up waves-effect waves-light "+colorArray[randomIndex]+" z-depth-4 right\" href=\"/Classrooms/__student__/"+loggedInSid+"/"+res[i]["classroom"]["classroomId"]+"\">" +
                    "                            <i class=\"material-icons\">send</i>\n" +
                    "                        </a>\n" +
                    "                        <h5 class=\"card-title activator grey-text text-darken-4\">"+res[i]["classroom"]["classroomTitle"]+"</h5>\n" +
                    "                        <p>Teacher Name : "+res[i]["classroom"]["teacher"]["account"]["userName"]+"</p>\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "            </div>";

                cardsForEachClassrooms += eachClassroomCard;
            }
            cardsForEachClassrooms += "</div>";

            classrooms.html(cardsForEachClassrooms);
            console.log(res);
        }
    })
}