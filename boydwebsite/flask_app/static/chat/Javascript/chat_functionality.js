function sendMessage()
{
    let user_name = document.getElementById('user-name').innerHTML + ": ";
    let message = document.getElementById('message').value;
    document.getElementById('chat').innerHTML = document.getElementById('chat').innerHTML + user_name + message + "<br>";
    if (document.getElementById('chat').innerHTML.includes("owner@") && !(document.getElementById('chat').innerHTML.includes("guest@")))
    {
        document.getElementById('chat').style.color = "blue";
        document.getElementById('chat').style.textAlign = "right";

    }
    else if (document.getElementById('chat').innerHTML.includes("owner"))
    {
        document.getElementById('chat').style.color = "blue";

    }
    else
    {
        document.getElementById('chat').style.color = "grey";
        document.getElementById('chat').style.textAlign = "left";
    }
}

function leaveChat()
{
    window.location.href = "/home";
}