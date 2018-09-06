function submit(){
    alert("hej");
};

$(document).ready(function() {
    $("#post_dummy").hide();
    var amount = 0;

    $("#submit").click(function(){
        var current_time = new Date($.now());
        var text = $("#text_post").val();


        if (text.length > 0){
            if(text.length <= 140){
                $("#articles").prepend(`<article id='post_${amount}'><p id='post_${amount}_text' class="post_text">${text}</p><span id='read_${amount}'>Unread</span><form><input type='checkbox' id='read_box_${amount}' class='read_box'></form></article>`);
                var text = $("#text_post").val("");
                $(".read_box").change(function(){
                    click_read(this);
                });
                amount = amount + 1;
            }else{
                $("#error_span").html("Your message is too long!");
            };
        }else{
            $("#error_span").html("Your message is too short!");
        };

    });


});

function click_read(current){
    var number = $(current).attr("id").split("_")[2];
    alert(number);
    if($("#read_"+number).text() == 'Unread'){
        $("#read_"+number).text("Read");
    }else{
        $("#read_"+number).text("Unread");
    };
};
