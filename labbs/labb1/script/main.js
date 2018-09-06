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
                $("#articles").prepend(`<article id='post_${amount}'><p id='post_${amount}'>${text}</p><form><span id='read_undread' value=0>Unread</span><input type='checkbox'></form></article>`);
            }else{
                $("#error_span").html("Your message is too long!");
            };
        }else{
            $("#error_span").html("Your message is too short!");
        }

        var text = $("#text_post").val("");
    });
});





