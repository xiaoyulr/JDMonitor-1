// 京东口令
// [rule: https://cjhy-isv.isvjcloud.com/?]

var jcode = param(1);

function main() {
    var exports = {}
    //转盘抽奖
    if (jcode.indexOf("wxShopFollowActivity") != -1) {
        exports["M_WX_FOLLOW_SHOP_URL"] = "https://cjhy-isv.isvjcloud.com/" + jcode.split("&")[0]
    }
    //加购有礼
    if (jcode.indexOf("wxCollectionActivity") != -1) {
        exports["M_WX_ADD_CART_URL"] = "https://cjhy-isv.isvjcloud.com/" + jcode.split("&")[0]
    }
    //转盘抽奖
    if (jcode.indexOf("/cjwx/common") != -1) {
        exports["M_WX_LUCK_DRAW_URL"] = "https://cjhy-isv.isvjcloud.com/" + jcode.split("&")[0]
    }
    if (jcode.indexOf("wxDrawActivity") != -1) {
        exports["M_WX_LUCK_DRAW_URL"] = "https://cjhy-isv.isvjcloud.com/" + jcode.split("&")[0]
    }
    if (jcode.indexOf("wxCollectionActivity") != -1) {
        exports["M_WX_ADD_CART_URL"] = "https://cjhy-isv.isvjcloud.com/" + jcode.split("&")[0]
    }
    if (jcode.indexOf("wxPointShopView") != -1) {
        let venderId = ""
        let giftId = ""
        let prefix = jcode.split("?")[0]
        let arrays = jcode.split("&")
        for (let it of arrays) {
            if (it.indexOf(`venderId`) != -1) {
                venderId = it.split("venderId=")[1]
            }
            if (it.indexOf(`giftId`) != -1) {
                giftId = it.split("giftId=")[1]
            }
        }
        exports["T_POINT_EXCHANGE_URL"] = `https://cjhy-isv.isvjcloud.com/${prefix}?venderId=${venderId}&giftId=${giftId}`
    }

    var text = []
    for (var key in exports) {
        text.push(fmt.Sprintf("export %s=\"%s\"", key, exports[key]))
    }
    if (text.length == 0) {
        sendText(jcode)
    } else {
        sendText(text.join("\n"))
    }
}

main()
