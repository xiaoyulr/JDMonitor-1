//[rule:code ?]
//[rule:转口令 ?]
//token="xxxxxx"
var token = "xxxxxxx"
var code = param(1);
sendText("正在解析口令，请稍等片刻......")
var _data = {"code": code}
request({
    url: 'https://api.jds.codes/jd/jCommand',
    method: 'POST',
    dataType:'json',
    headers: {
        "content-type": "application/json",
        "Authorization": "Bearer "+token,
    },
    body: _data
},function(err, resp, data) {
    if (!err && resp.statusCode == 200) {
     if(data){
      sendText(data.data.jumpUrl)}
    }else{
      sendText("网络请求失败："+data.msg)
     }
});