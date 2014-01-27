/**
 * Created with JetBrains WebStorm.
 * User: hackdc
 * Date: 14-1-25
 * Time: 上午10:38
 * To change this template use File | Settings | File Templates.
 */
jQuery.extend({
    /**
     * 组建一个iframe，内部有一个form，包括需要上传的文件以及其他需要传给服务端的参数
     * @param id
     * @param url
     * @param data
     */
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

        var oldElement = jQuery('#' + fileElementId);
        var newElement = jQuery(oldElement).clone();
        jQuery(oldElement).attr('id', fileId);
        jQuery(oldElement).before(newElement);
        jQuery(oldElement).appendTo(form);

        form.appendTo(iframe);

        jQuery(form).attr('action', url);
        jQuery(form).attr('method', 'POST');
        jQuery(form).attr('target', frameId);
        if(form.encoding)
        {
            jQuery(form).attr('encoding', 'multipart/form-data');
        }
        else
        {
            jQuery(form).attr('enctype', 'multipart/form-data');
        }
        $(iframe).appendTo(document.body);
        return form;
    },
    /**
     * 提交iframe中的form，处理返回数据
     * @param data
     */
    ajaxUpload:function(data){
        var id = new Date().getTime();
        var url = data.url;
        var inputs = data.inputs||{};
        if(url == undefined){
            return;
        }

        var form = createUploadIframe(id, data.url, data.inputs);
        var returnDate = {};
        var requestDone = false;
        var uploadCallback = function(){
            returnData.json = iframe.html();
            eval( "returnData.json = " + json );

            if(returnData.json){
                requestDone = true;
                if (data.success ){
                    data.success(returnData, status);
                }

                iframe.remove();
            }

        };

        if( !requestDone ) uploadCallback( "timeout" );
        form.submit();
    }
});