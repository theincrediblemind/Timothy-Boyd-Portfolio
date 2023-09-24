function openFeedback(){

    if (document.getElementById("feedback").style.display === ""){
        document.getElementById("feedback").style.display="block";
    }
    

    else if (document.getElementById("feedback").style.display === "block")
    {
        document.getElementById("feedback").style.display="";
    }
}