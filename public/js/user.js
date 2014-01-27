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
    $.ajaxFileUpload({
        url:"/jupload",
        fileElementId:fileElementId,
        success:function(){
            alert(1);
        }
    })
}