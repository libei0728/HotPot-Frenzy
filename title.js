var titleScreen = document.getElementById ("title-screen");
var gameScreen = document.getElementById("game-screen");
var playButton = document.getElementById("play");
document.getElementById("play").addEventListener("click",function(){
    document.getElementById("title-screen").style.display ="none";
    document.getElementById("game-screen").style.display ="block";

});

playButton.addEventListener("click", function(event){
    event.preventDefault();
    titleScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");
});