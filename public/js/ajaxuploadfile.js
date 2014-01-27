/**
 * Created with JetBrains WebStorm.
 * User: hackdc
 * Date: 14-1-25
 * Time: 上午10:38
 * To change this template use File | Settings | File Templates.
 */
jQuery.extend({

    createUploadIframe:function(id, url, fileElementId, inputs){
        var frameId = 'ajaxupload' + id;
        var formId = 'uploadform' + id;
        var fileId = 'uploadfile' + id;
        //var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="display:none" >';
        var iframe = $('<iframe id="'+frameId+'" name="'+id+'" style="display:none;">');
        //iframe.attr('action', url + '?iframe=' + callback);
        var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
        if(inputs)
        {
            for(var i in inputs)
            {
                $('<input type="hidden" name="' + i + '" value="' + inputs[i] + '" />').appendTo(form);
            }
        }

        var oldElement = $('#' + fileElementId);
        var newElement = oldElement.clone();
        oldElement.attr('id', fileId);
        oldElement.before(newElement);
        oldElement.appendTo(form);
        form.attr('action', url);
        form.attr('target', frameId);
        form.appendTo(document.body);

        iframe.appendTo(document.body);
        return form;
    },

    /**
     * 提交iframe中的form，处理返回数据
     * @param data
     */
    ajaxuploadfile:function(data){
        var id = new Date().getTime();
        var url = data.url;
        var fileElementId = data.fileElementId;
        var inputs = data.inputs||{};
        if(! url || ! fileElementId){
            return;
        }
        var frameId = 'ajaxupload' + id;
        var formId = 'uploadform' + id;

        var form = $.createUploadIframe(id, url, fileElementId, inputs);

        var returnData = {};
        var requestDone = false;
        var uploadCallback = function(){
            returnData = $("#"+frameId).html();
            //eval( "returnData = " + returnData );

            if(returnData){
                requestDone = true;
                if (data.success ){
                    data.success(returnData, status);
                }

                $("#"+frameId).remove();
                $("#"+formId).remove();
            }

        };

        if( !requestDone ) uploadCallback( "timeout" );

        form.submit();


    }
});