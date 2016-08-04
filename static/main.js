/*global $*/
$( document ).ready(function() {

    $('.upVote').on('submit', function(e){
        e.preventDefault();
        var currentForm = $(this);
        var formInfo = {};
        var serializedForm  = currentForm.serializeArray();
        
        serializedForm.forEach(function(inputField){
            formInfo[inputField.name] = inputField.value;
        })
        
        console.log(formInfo);
        
        $.post('/votePost', formInfo, function(res){
            console.log(res);
            if(res.score){
                // var currentVote = $(`#post_score_${formInfo.postId}`).text();
                // var score = parseInt(currentVote.substring(currentVote.indexOf(':') + 1)) + 1;
                $(`#post_score_${formInfo.postId}`).text(`Votescore: ${res.score}`)
            }
        })
        
    })
    
    
    // $upVote.on("submit", function(e){
    //     e.preventDefault();
    //     // serialize the form. want postid and userid
    //     // build a new object with serialisation
    //     var serUpVote = $( "#upVote" ).serialize();
    //     console.log(serUpVote);
    //     var that = this;
        
    //     //  // ajax call using jquery
    //     // pass tht obj to ajax call post request
    //     //post to same votePost route 
    //     $.ajax({
    //     url: "/votePost",
    //     data: serUpVote,
    //     type: "POST",
    //     dataType : "json"
    //     })
    //     // get back confiramtion in a 'done'
    //     //update current vote on page
    //     // target scote element, update
    //     .done(function( json ) {
    //     console.log( json );
    //     if (json.ok) {
    //         //$( "<h1>" ).text( json.title ).appendTo();
            
            
            
    //         }
    //     });
        
    // });
    
    // $downVote.on("submit", function(e){
    //     e.preventDefault();
    // });
        
});