// 京东口令
// [rule: raw [\s\S]*[(|)|#|@|$|%|¥|￥|!|！]([0-9a-zA-Z]{10,14})[#|@|$|%|¥|￥|!|！|)][\s\S]*]
function main(text) {
    var headers = {
        "User-Agent": "Mozilla/5.0 (Linux; U; Android 11; zh-cn; KB2000 Build/RP1A.201005.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 HeyTapBrowser/40.7.19.3 uuid/cddaa248eaf1933ddbe92e9bf4d72cb3",
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NDQxMjQzNywianRpIjoiOWU1ZTQ1NjAtMTBlYS00M2E3LWJkZDMtNGJjNTJkMThmYjIwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjUwNzEwNDE5NzgiLCJuYmYiOjE2NTQ0MTI0MzcsImV4cCI6MTY4NTk0ODQzN30.O0SPonGIjnAE-Ov96heNiTpTCFJgXlS5jzYaZwLLI5o"
    };
    try {
        var data = request({
            url: "https://api.windfgg.cf/jd/code",
            "headers": headers,
            "method": "post",
            "dataType": "json",
            "body": { "code": text }
        })

        if (data.code == "200") {
            var data = data.data
            var jumpUrl = data.jumpUrl
            var activityId = jumpUrl.replace(/.*\?activityId\=([^\&]*)\&?.*/g, "$1")
            if (jumpUrl.indexOf("https://cjhydz-isv.isvjcloud.com/wxTeam/activity") != -1) {
                sendText(`## ${data.title} ##\nexport jd_cjhy_activityId="${activityId}"`)
            }
            else if (jumpUrl.indexOf("wxCartKoi/cartkoi") != -1) {
                sendText(`## ${data.title} ##\nexport jd_wxCartKoi_activityId="${activityId}"`)
            }
            else if (jumpUrl.indexOf("wxUnPackingActivity") != -1) {
                sendText(`## ${data.title} ##\nexport T_WX_UNPACKING_URL="${jumpUrl.split("&")[0]}"`)
            }
            else if (jumpUrl.indexOf("wxFansInterActionActivity") != -1) {
                sendText(`## ${data.title} ##\nexport T_FANS_INTER_ACTIVITY_ID="${activityId}"`)
            }
            else if (jumpUrl.indexOf("https://lzkjdz-isv.isvjcloud.com/wxTeam/activity2") != -1) {
                sendText(`## ${data.title} ##\nexport jd_zdjr_activityId="${activityId}"`)
            }
            else if (jumpUrl.indexOf("wxCollectCard") != -1) {
                sendText(`## ${data.title} ##\nexport jd_wxCollectCard_activityId="${activityId}"`)
            }
            // if (jumpUrl.indexOf("WxHbShareActivity") != -1) {
            //     sendText(`## ${data.title} ##\nexport jd_cjhy_activityId="${activityId}"`)
            //     exports["T_HB_SHARE_URL"] = jumpUrl.split("&")[0]
            // }
            // if (jumpUrl.indexOf("openCard") != -1 && jumpUrl.indexOf("venderId=") != -1) {
            //     exports["VENDER_ID"] = queries["venderId"]
            // }
            else if (jumpUrl.indexOf("microDz") != -1) {
                sendText(`## ${data.title} ##\nexport jd_wdz_activityId="${activityId}"`)
            }
            else if (jumpUrl.indexOf("wxSecond") != -1) {
                sendText(`## ${data.title} ##\nexport jd_wxSecond_activityId="${activityId}"`)
            }
            else if (jumpUrl.indexOf("https://lzkj-isv.isvjcloud.com/drawCenter/activity") != -1) {
                sendText(`## ${data.title} ##\nexport jd_drawCenter_activityId="${activityId}"`)
            }
            else if (jumpUrl.indexOf("wxShareActivity") != -1 && jumpUrl.indexOf("activityId") != -1) {
                sendText(`## ${data.title} ##\nexport jd_fxyl_activityId="${activityId}"`)
            }
            else if (jumpUrl.indexOf("https://lzkj-isv.isvjcloud.com/lzclient") != -1) {
                sendText(`## ${data.title} ##\nexport M_WX_LUCK_DRAW_URL="${jumpUrl.split("&")[0]}"`)
            }
            else if (jumpUrl.indexOf("wxCollectionActivity") != -1 && jumpUrl.indexOf("cjhy") == -1) {
                sendText(`## ${data.title} ##\nexport jd_cjhy_activityId="${activityId}"`)
            }
            else {
                sendText(`## ${data.title} ##\n${jumpUrl}`)
            }
        }
    } catch (e) {
        sendText("无法响应！！！")
    }

}
var text = "(" + param(1) + ")"
main(text)
