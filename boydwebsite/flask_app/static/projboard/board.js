function editCard(clicked_id)
{
    let cardnum = (clicked_id.charAt(clicked_id.length - 1));
    let card = document.getElementById("card" + cardnum);
    card.contentEditable = "true";
    card.addEventListener("keypress", function(event){
        if (event.key === "Enter")
        {
            card.contentEditable = "false";
        }
    });
}

function submitCard(clicked_id)
{  

    let cardnum = (clicked_id.charAt(clicked_id.length - 1));
    let card = document.getElementById("card" + cardnum);
    let next_num = String(Number(cardnum) + 2);
    let to_set = document.getElementById("card" + next_num);
    if (next_num === "5"|| next_num ==="6")
    {
        to_set.innerHTML += "<br>" + card.innerHTML;
    }
    else
    {
        to_set.innerHTML = card.innerHTML;
    }
    card.innerHTML ="";
    card.addEventListener("keypress", function(event){
        if (event.key === "Enter")
        {
            card.contentEditable = "false";
        }
    });
}