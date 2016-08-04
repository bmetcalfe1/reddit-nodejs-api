/*global $*/
$( document ).ready(function() {

    $('.upVote').on('submit', function(e){
        e.preventDefault();
        var currentForm = $(this);
        var formInfo = {};
        var serializedForm  = currentForm.serializeArray();
        
        serializedForm.forEach(function(inputField){
            formInfo[inputField.name] = inputField.value;
        });
        
        //console.log(formInfo);
        
        $.post('/votePost', formInfo, function(res){
            //console.log(res);
            if(res.score){
                // var currentVote = $(`#post_score_${formInfo.postId}`).text();
                // var score = parseInt(currentVote.substring(currentVote.indexOf(':') + 1)) + 1;
                $(`#post_score_${formInfo.postId}`).text(`Votescore: ${res.score}`);
            }
        });
        
    });
    
    $('.downVote').on('submit', function(e){
        e.preventDefault();
        var currentForm = $(this);
        var formInfo = {};
        var serializedForm  = currentForm.serializeArray();
        
        serializedForm.forEach(function(inputField){
            formInfo[inputField.name] = inputField.value;
        });
        
        //console.log(formInfo);
        
        $.post('/votePost', formInfo, function(res){
            //console.log(res);
            if(res.score){
                // var currentVote = $(`#post_score_${formInfo.postId}`).text();
                // var score = parseInt(currentVote.substring(currentVote.indexOf(':') + 1)) + 1;
                $(`#post_score_${formInfo.postId}`).text(`Votescore: ${res.score}`);
            }
        });
    }); 
});