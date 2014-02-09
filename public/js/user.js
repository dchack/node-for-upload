/**
 * Created with JetBrains WebStorm.
 * User: dchack
 * Date: 13-11-21
 * Time: 下午4:47
 * To change this template use File | Settings | File Templates.
 */

function uploadImage(){
    $('#upform').submit();
}
$(document).ready(function(){

        $("#background").fadeIn(4000);
});

function aupload(fileElementId){
    $("#progress").css("width", "0%");
    $.ajaxFileUpload({
        url:"/jupload",
        fileElementId:fileElementId,
        success:function(){
            alert("上传成功");
        }
    });

    getUploadProgress();
}

function getUploadProgress(){
    var progress = 0;
    $.ajax({
        url : "/uploadprogress",
        dataType: "json",
        success:function(msg){
            //alert("done" + msg.progress);
            progress = msg.progress;
            $("#progress").css("width", progress +"%");
            if(progress < 100){
                setTimeout("getUploadProgress('/uploadprogress')",1);
            }
        }
    })
}