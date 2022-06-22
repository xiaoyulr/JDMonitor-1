// 京东口令
// [rule: raw [\s\S]*[(|)|#|@|$|%|¥|￥|!|！]([0-9a-zA-Z]{10,14})[#|@|$|%|¥|￥|!|！|)][\s\S]*]

var jcode = "(" + param(1) + ")";

function main() {
    var ret = call("jd_cmd")(jcode)
    sendText(JSON.stringify(ret))
    var exports = {}
    if (!ret) {
        return
    }
    queries = ret.queries
    if (ret.raw.indexOf("https://cjhydz-isv.isvjcloud.com/wxTeam/activity") != -1) {
        exports["jd_cjhy_activityId"] = queries["activityId"]
    }
    if (ret.raw.indexOf("wxCartKoi/cartkoi") != -1) {
        exports["jd_wxCartKoi_activityId"] = queries["activityId"]
    }
    if (ret.raw.indexOf("wxUnPackingActivity") != -1) {
        exports["T_WX_UNPACKING_URL"] = ret.raw.split("&")[0]
    }
    if (ret.raw.indexOf("wxFansInterActionActivity") != -1) {
        exports["T_FANS_INTER_ACTIVITY_ID"] = queries["activityId"]
    }
    if (ret.raw.indexOf("https://lzkjdz-isv.isvjcloud.com/wxTeam/activity2") != -1) {
        exports["jd_zdjr_activityId"] = queries["activityId"]
    }
    if (ret.raw.indexOf("wxCollectCard") != -1) {
        exports["jd_wxCollectCard_activityId"] = queries["activityId"]
    }
    if (ret.raw.indexOf("WxHbShareActivity") != -1) {
        exports["T_HB_SHARE_URL"] = ret.raw.split("&")[0]
    }
    if (ret.raw.indexOf("openCard") != -1 && ret.raw.indexOf("venderId=") != -1) {
        exports["VENDER_ID"] = queries["venderId"]
    }
    if (ret.raw.indexOf("microDz") != -1) {
        exports["jd_wdz_activityId"] = queries["activityId"]
    }
    if (ret.raw.indexOf("wxSecond") != -1) {
        exports["jd_wxSecond_activityId"] = queries["activityId"]
    }
    if (ret.raw.indexOf("https://lzkj-isv.isvjcloud.com/drawCenter/activity") != -1) {
        exports["jd_drawCenter_activityId"] = queries["activityId"]
    }
    if (ret.raw.indexOf("wxShareActivity") != -1 && ret.raw.indexOf("activityId") != -1) {
        exports["jd_fxyl_activityId"] = queries["activityId"]
    }
    if (ret.raw.indexOf("https://lzkj-isv.isvjcloud.com/lzclient") != -1) {
        exports["M_WX_LUCK_DRAW_URL"] = ret.raw.split("&")[0]
    }
    if (ret.raw.indexOf("wxCollectionActivity") != -1) {
        exports["M_WX_ADD_CART_URL"] = ret.raw.split("&")[0]
    }
    var text = []
    for (var key in exports) {
        text.push(fmt.Sprintf("export %s=\"%s\"", key, exports[key]))
    }
    if (text.length == 0) {
        sendText(ret.raw)
    } else {
        sendText(text.join("\n"))
    }
}

main()

