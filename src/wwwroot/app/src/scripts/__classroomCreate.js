// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
let temptid = $('#temptid').val();

let colorArray = [
    "red darken-1", "teal darken-1", "indigo darken-1", "blue accent-3",
    "purple darken-2", "pink darken-2", "red darken-2", "blue lighten-2",
    "indigo", "deep-purple", "blue accent-1", "deep-purple accent-3",
    "cyan lighten-3", "light-blue lighten-1", "cyan", "cyan accent-3",
    "green", "light-green", "lime", "orange", "blue-grey lighten-1"
];


$(document).ready(function () {
    
    // get Request on TeachersController(/Teachers/__getClassRoom___ using tid) and find login teachers all classrooms info 
    // and push info on Dynamic cards and show this Descending order Cards (Classrooms) without Reload page 
    
    getClassRoom();

    $("#classroomForm").submit(function (e) {
        e.preventDefault();
        let classroomTitle = $('#ClassroomTitle').val();
        let teacherid = $("#teacher_id").val();
        console.log(classroomTitle, teacherid);

        // post Request on TeachersController using (classroomTitle & teacherid) param
        // and got some response then send a get request and find current teacher classrooms
        $.post('', {cTitle : classroomTitle, tid : teacherid}, function (responseData) {
            //console.log("teacher: " + responseData);
            if(responseData === "Fail"){
                showMaterialToast("Invalid Request", "red darken-1");
                removeInputFieldDataTeacher();
            }
            else if(responseData === "SelectCourse"){
                showMaterialToast("Select Course First", "amber darken-3");
                removeInputFieldDataTeacher();
            }
            else if(responseData === "NeedCompleteTeacherProfile"){
                showMaterialToast("First Complete Teacher Profile", "teal darken-1");
                removeInputFieldDataTeacher();
            }
            else if (responseData === "SelectTitle") {
                showMaterialToast("Fill-up Course Title First", "teal darken-1");
                removeInputFieldDataTeacher();
            }
            else if(responseData === "success"){
                showMaterialToast("Classroom Created Successfully", "teal darken-1");

                removeInputFieldDataTeacher();
                getClassRoom();
            }else{

            }

            console.log(responseData);
        });
    })
});

// Show a material toast notification
// @Param data -> our message Data
// @Param style -> toast body style

function showMaterialToast(data, style) {
    M.toast({
        html : data,
        classes : style
    });
}

// Remove Input field Data
function removeInputFieldDataTeacher() {
    $('#ClassroomTitle').val("");
}


// get Request on TeachersController(/Teachers/__getClassRoom___ using tid) and find login teachers all classrooms info 
// and push info on Dynamic cards and show this Descending order Cards (Classrooms) without Reload page

function getClassRoom() {

    let classrooms = $('#classRooms');

    $.get('/Teachers/__getClassRoom___', {tid : temptid}, function (res) {
        if(res.length === 0){
            let modalForCreateNewClassroom = "<h5 class=\"center-align\">You have no classroom yet</h5>\n" +
                "    <p class=\"center-align\"><a class=\"waves-effect waves-light btn-small blue darken-3 modal-trigger\" href=\"#createClassroomModal\"><i class=\"material-icons left\">add</i>Create A New One</a></p>";

            classrooms.html(modalForCreateNewClassroom);
        }else{

            let cardsForEachClassrooms = "<p class=\"center-align\"><a class=\"waves-effect waves-light btn-small blue darken-3 modal-trigger\" href=\"#createClassroomModal\"><i class=\"material-icons left\">add</i>Create A New One</a></p>";
            cardsForEachClassrooms += "<input id=\"temptid\" hidden value=\""+res[0]["teacher"]["account"]["userId"]+"\" type=\"text\"/>";
            cardsForEachClassrooms += "<div class=\"row\">"

            for (let i = res.length - 1; i >= 0; i--){
                let randomIndex = Math.floor(Math.random() * 21);

                let eachClassroomCard = "<div class=\"col s12 l3\">\n" +
                    "                <div id=\"profile-card\" class=\"card\">\n" +
                    "                    <div class=\"card-image waves-effect waves-block waves-light\">\n" +
                    "                        <img class=\"activator\" src=\"https://img.freepik.com/free-vector/vector-illustration-mountain-landscape_1441-72.jpg?size=338&ext=jpg\" alt=\"user bg\" />\n" +
                    "                    </div>\n" +
                    "                    <div class=\"card-content\">\n" +
                    "                        <img src=\"https://pixinvent.com/materialize-material-design-admin-template/app-assets/images/avatar/avatar-7.png\" alt=\"\" class=\"circle responsive-img activator card-profile-image cyan lighten-1 padding-2\" />\n" +
                    "                        <a target='_blank' class=\"btn-floating activator btn-move-up waves-effect waves-light " + colorArray[randomIndex] + " z-depth-4 right\" href=\"/Classrooms/__StudentExperimentsForTeacher__/" + temptid + "/" + res[i]["classroomId"] + "\">" +
                    "                            <i class=\"material-icons\">send</i>\n" +
                    "                        </a>\n" +
                    "                        <h5 class=\"card-title activator grey-text text-darken-4\">" + res[i]["classroomTitle"] + "</h5>\n" +
                    "                        <p>Access Code : " + res[i]["accessCode"] + " <a ><i id='accesscodeBigModel' class=\"tiny: 1rem material-icons\">crop_free</i></a></p>\n" +
                    "                        <p>Teacher Name : " + res[i]["teacher"]["account"]["userName"] + "</p>\n" +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "            </div>";

                cardsForEachClassrooms += eachClassroomCard;
            }
            cardsForEachClassrooms += "</div>";

            classrooms.html(cardsForEachClassrooms);
        }
    })
}