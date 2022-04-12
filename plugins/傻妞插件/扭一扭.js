// [rule: 扭一扭 ?(\d?)$]
// [rule: 短视频 (.{2}) ?(\d)?$]
// [priority: 10]

function main() {
    let num 
    let type = "热舞"
    let doSendVideo=true
    if(ImType().indexOf("wx")>-1){
        if("true"!=get("nynSendToWx")){
            doSendVideo=false
        }
    }
        
    let url = "http://xiaoapi.cn/api/jingxuanshipin.php?type="+encodeURI(type)
    for (var i=0;i< 1;i++){
        let red = request({
            url: url
        }
        ,(e,i,b)=>{
            if(e||i["statusCode"]!=200){
                sendText(`接口错误:${JSON.stringify([e,i,b])}`)
                return
            }
            b=(b+"")
            b = b.substring(b.indexOf("链接：")+3)
            if(doSendVideo){
                sendVideo(b)    
            }else{
                sendText(b)
            }
        })
        
    }
}
main()