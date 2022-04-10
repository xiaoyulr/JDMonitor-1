// 京东口令
// [rule: raw [\s\S]*[(|)|#|@|$|%|¥|￥|!|！]([0-9a-zA-Z]{10,14})[#|@|$|，|,|%|¥|￥|!|！][\s\S]*]

var jcode = param(1);

function main() {
    var ret = call("jd_cmd")(jcode)
    var exports = {}
    if (!ret) {
        return
    }
    queries = ret.queries
    //cj组队瓜分
    if (ret.raw.indexOf("https://cjhydz-isv.isvjcloud.com/wxTeam/activity") != -1 ) {
        exports["jd_cjhy_activityId"] = queries["activityId"]
    }
    //zd组队瓜分
    if (ret.raw.indexOf("https://lzkjdz-isv.isvjcloud.com/wxTeam/activity2") != -1) {
        exports["jd_zdjr_activityId"] = queries["activityId"]
    }
    //集卡抽奖
    if (ret.raw.indexOf("wxCollectCard") != -1) {
        exports["M_WX_COLLECT_CARD_URL"] = ret.raw.split("&")[0]
    }
    //开卡有礼
    if (ret.raw.indexOf("openCard") != -1 && ret.raw.indexOf("venderId=") !=-1) {
        exports["VENDER_ID"] = queries["venderId"]
    }
    //微订制
    if (ret.raw.indexOf("microDz") != -1) {
        exports["jd_cjhy_activityId60"] = queries["activityId"]
    }
    //分享有礼
    if (ret.raw.indexOf("wxShareActivity") != -1 && ret.raw.indexOf("activityId") !=-1) {
        exports["jd_fxyl_activityId"] = queries["activityId"]
    }
    //转盘抽奖
    if ((ret.raw.indexOf("gameType=wxTurnTable") !=-1 || ret.raw.indexOf("gameType=wxNineGrid")) && ret.raw.indexOf("wxShareActivity") == -1&& ret.raw.indexOf("wxCollectCard") == -1 && ret.raw.indexOf("wxTeam") == -1) {
        exports["M_WX_LUCK_DRAW_URL"] = ret.raw.split("&")[0]
    }
    //加购有礼
    if (ret.raw.indexOf("wxCollectionActivity") != -1) {
        exports["M_WX_ADD_CART_URL"] = ret.raw.split("&")[0]
    }
    var text = []
    for (var key in exports) {
        text.push(fmt.Sprintf("export %s=\"%s\"", key, exports[key]))
    }
    if(text.length==0){
        sendText(ret.raw)
    }else{
        sendText(text.join("\n"))
    }
}

main()
