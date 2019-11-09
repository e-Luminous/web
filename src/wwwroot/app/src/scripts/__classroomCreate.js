// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var temptid = $('#temptid').val();
var colorArray = [
    "red darken-1", "teal darken-1", "indigo darken-1", "blue-grey darken-1",
    "purple darken-3", "blue lighten-1", "blue accent-2", "light-blue"
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
             }else if(responseData === "SelectCourse"){
                 showMaterialToast("Select Course First", "teal darken-1");
             }
             else if (responseData === "SelectTitle") {
                 showMaterialToast("Fill-up Course Title First", "teal darken-1");
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

                var eachClassroomCard  = "<div class=\"col s12 l3\">\n" +
                    "                <div id=\"profile-card\" class=\"card\">\n" +
                    "                    <div class=\"card-image waves-effect waves-block waves-light\">\n" +
                    "                        <img class=\"activator\" src=\"https://img.freepik.com/free-vector/vector-illustration-mountain-landscape_1441-72.jpg?size=338&ext=jpg\" alt=\"user bg\" />\n" +
                    "                    </div>\n" +
                    "                    <div class=\"card-content\">\n" +
                    "                        <img src=\"https://pixinvent.com/materialize-material-design-admin-template/app-assets/images/avatar/avatar-7.png\" alt=\"\" class=\"circle responsive-img activator card-profile-image cyan lighten-1 padding-2\" />\n" +
                    "                        <a target='_blank' class=\"btn-floating activator btn-move-up waves-effect waves-light "+colorArray[randomIndex]+" z-depth-4 right\" href=\"/Classrooms/__teacher__/"+temptid+"/"+res[i]["classroomId"]+"\">" +
                    "                            <i class=\"material-icons\">send</i>\n" +
                    "                        </a>\n" +
                    "                        <h5 class=\"card-title activator grey-text text-darken-4\">"+res[i]["classroomTitle"]+"</h5>\n" +
                    "                        <p>Access Code : "+res[i]["accessCode"]+" <a ><i id='accesscodeBigModel' class=\"tiny: 1rem material-icons\">crop_free</i></a></p>\n" +
                    "                        <p>Teacher Name : "+res[i]["teacher"]["account"]["userName"]+"</p>\n" +
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