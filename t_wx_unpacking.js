/*
[task_local]
# 拆福袋
7 7 7 7 7  t_wx_unpacking.js, tag=拆福袋, enabled=true
 */
const $ = new Env('拆福袋');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = false;//是否关闭通知，false打开通知推送，true关闭通知推送
$.activityUrl = process.env.T_WX_UNPACKING_URL ? process.env.T_WX_UNPACKING_URL : "";
$.activityId = getQueryString($.activityUrl, 'activityId')
$.Token = "";
$.openCard = false
$.exportActivityIds = ""
$.friendUuid = ""
$.friendUuids = []
$.message = ""
$.helpTimes = -1
$.hasHelpedTimes = 0
$.restartNo = 1
$.friendUuidId = 0
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
let lz_jdpin_token_cookie = ''
let activityCookie = ''
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
    };
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {
    console.log('入口下拉：https://prodev.m.jd.com/mall/active/3z1Vesrhx3GCCcBn2HgbFR4Jq68o/index.html')
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }
            await jdmodule(false);
            if ($.helpTimes != 0 && $.helpTimes == $.hasHelpedTimes) {
                $.friendUuidId++
                $.friendUuid = $.friendUuids[$.friendUuidId]
                $.hasHelpedTimes = 0
                console.log(`上一个账号已助力完成，接下来都会助力${$.friendUuid}`)
            }
            if ($.index % 4 == 0) console.log('休息一下，别被黑ip了\n可持续发展')
            if ($.index % 4 == 0) await $.wait(parseInt(Math.random() * 5000 + 20000, 10))
        }
    }
    let restartTime = cookiesArr.length
    if ($.helpTimes != 0) {
        restartTime = Math.ceil(cookiesArr.length / $.helpTimes)
    }
    $.message += `------拆包奖励-------\n`
    console.log(`重新跑前${restartTime}个号`)
    for (let i = 0; i < restartTime; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            await jdmodule(true);
        }
        if (i + 1 % 4 == 0) console.log('休息一下，别被黑ip了\n可持续发展')
        if (i + 1 % 4 == 0) await $.wait(parseInt(Math.random() * 5000 + 20000, 10))
    }
    $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
    await jdmodule();
    if ($.isNode()) {
        if ($.message != '') {
            await notify.sendNotify("福袋拆包", `${$.message}\n跳转链接\n${$.activityUrl}`)
        }
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

function showMsg() {
    return new Promise(resolve => {
        $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n${message}`);
        resolve()
    })
}


async function jdmodule(retry) {
    $.domain = $.activityUrl.match(/https?:\/\/([^/]+)/) && $.activityUrl.match(
        /https?:\/\/([^/]+)/)[1] || ''
    $.UA = `jdapp;iPhone;10.2.2;13.1.2;${uuid()};M/5.0;network/wifi;ADID/;model/iPhone8,1;addressid/2308460611;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`

    await getCK();
    console.log("lzToken=" + activityCookie)
    await takePostRequest("isvObfuscator");
    console.log('Token:' + $.Token)
    if ($.Token == '') {
        $.putMsg(`获取Token失败`);
        return
    }

    await takePostRequest("getSimpleActInfoVo");

    await takePostRequest("getMyPing");

    await takePostRequest("accessLogWithAD")

    await takePostRequest("getUserInfo")

    await takePostRequest("activityContent")

    await takePostRequest("getActMemberInfo");

    // await takePostRequest("unpackingInfo")

    // await takePostRequest("getMyFriendInfo")

    if (!retry) {
        console.log("开始助力拆包")
        await takePostRequest("unPacking")
    }

    if (retry) {
        console.log("获取拆包奖励")
        await takePostRequest("hasPrize")
        if ($.hasDrawPrize) {
            $.message += `京东账号${$.UserName} 获得 ${$.prise}\n`
        }

    }
}

//运行


async function takePostRequest(type) {
    if ($.outFlag) return
    let domain = $.domain;
    let body = ``;
    let method = 'POST'
    let admJson = ''
    switch (type) {
        case 'isvObfuscator':
            url = `https://api.m.jd.com/client.action?functionId=isvObfuscator`;
            switch ($.domain) {
                case 'cjhy-isv.isvjcloud.com':
                    body = 'body=%7B%22url%22%3A%22https%3A//cjhy-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&uuid=920cd9b12a1e621d91ca2c066f6348bb5d4b586b&client=apple&clientVersion=10.1.4&st=1633916729623&sv=102&sign=9eee1d69b69daf9e66659a049ffe075b'
                    break
                case 'lzkj-isv.isvjcloud.com':
                    body = 'body=%7B%22url%22%3A%22https%3A//lzkj-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&uuid=925ce6441339525429252488722251fff6b10499&client=apple&clientVersion=10.1.4&st=1633777078141&sv=111&sign=00ed6b6f929625c69f367f1a0e5ad7c7'
                    break
                case 'cjhydz-isv.isvjcloud.com':
                    body = 'adid=7B411CD9-D62C-425B-B083-9AFC49B94228&area=16_1332_42932_43102&body=%7B%22url%22%3A%22https%3A%5C/%5C/cjhydz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167541&client=apple&clientVersion=9.4.0&d_brand=apple&d_model=iPhone8%2C1&eid=eidId10b812191seBCFGmtbeTX2vXF3lbgDAVwQhSA8wKqj6OA9J4foPQm3UzRwrrLdO23B3E2wCUY/bODH01VnxiEnAUvoM6SiEnmP3IPqRuO%2By/%2BZo&isBackground=N&joycious=48&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=2f7578cb634065f9beae94d013f172e197d62283&osVersion=13.1.2&partner=apple&rfs=0000&scope=11&screen=750%2A1334&sign=60bde51b4b7f7ff6e1bc1f473ecf3d41&st=1613720203903&sv=110&uts=0f31TVRjBStG9NoZJdXLGd939Wv4AlsWNAeL1nxafUsZqiV4NLsVElz6AjC4L7tsnZ1loeT2A8Z5/KfI/YoJAUfJzTd8kCedfnLG522ydI0p40oi8hT2p2sNZiIIRYCfjIr7IAL%2BFkLsrWdSiPZP5QLptc8Cy4Od6/cdYidClR0NwPMd58K5J9narz78y9ocGe8uTfyBIoA9aCd/X3Muxw%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D&wifiBssid=9cf90c586c4468e00678545b16176ed2'
                    break
                case 'lzkjdz-isv.isvjcloud.com':
                    body = 'body=%7B%22url%22%3A%22https%3A//lzkjdz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&uuid=9a79133855e4ed42e83cda6c58b51881c4519236&client=apple&clientVersion=10.1.4&st=1647263148203&sv=102&sign=53ee02a59dece3c480e3fcb067c49954'
                    break
                default:
                    body = '';
            };
            // console.log("body:" + body)
            break;
        case 'getSimpleActInfoVo':
            url = `https://${$.domain}/customer/getSimpleActInfoVo`;
            body = `activityId=${$.activityId}`;
            break;
        case 'getMyPing':
            url = `https://${$.domain}/customer/getMyPing`;
            body = `userId=${$.venderId}&token=${$.Token}&fromType=APP`;
            break;
        case 'accessLogWithAD':
            url = `https://${$.domain}/common/accessLogWithAD`;
            let pageurl = `${$.activityUrl}&friendUuid=${$.friendUuid}`
            body = `venderId=${$.venderId}&code=3&pin=${encodeURIComponent($.Pin)}&activityId=${$.activityId}&pageUrl=${encodeURIComponent(pageurl)}&subType=app&adSource=`
            break;
        case 'getUserInfo':
            url = `https://${$.domain}/wxActionCommon/getUserInfo`;
            body = `pin=${encodeURIComponent($.Pin)}`;
            break;
        case 'activityContent':
            url = `https://${$.domain}/wxUnPackingActivity/activityContent`;
            body = `activityId=${$.activityId}&buyerNick=${encodeURIComponent($.Pin)}&friendUuid=${$.friendUuid}`
            break;
        case 'unpackingInfo':
            url = `https://${$.domain}/wxUnPackingActivity/unpackingInfo`;
            body = `activityId=${$.activityId}&mySelfUuid=${$.uuid}&friendUuid=${$.friendUuid}`
            break;
        case 'getMyFriendInfo':
            url = `https://${$.domain}/wxUnPackingActivity/getMyFriendInfo`;
            body = `friendUuid=${$.friendUuid}`
            break;
        case 'unPacking':
            url = `https://${$.domain}/wxUnPackingActivity/unPacking`;
            body = `activityId=${$.activityId}&mySelfId=${$.uuid}&friendUuid=${$.friendUuid}`
            break;
        case 'hasPrize':
            url = `https://${$.domain}/wxActionPrizeResult/hasPrize`;
            body = `activityId=${$.activityId}&drawInfoId=${$.drawInfoId}`
            break;
        case 'getActMemberInfo':
            url = `https://${$.domain}/wxCommonInfo/getActMemberInfo`;
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&venderId=${$.venderId}`
            break;
        case 'info':
            url = `https://${$.domain}/drawCenter/myInfo`;
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
            break;
        case 'startDraw':
            url = `${domain}/joint/order/draw`;
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}&drawType=1`
            break;
        case 'followShop':
            url = `https://${$.domain}/wxActionCommon/followShop`;
            // url = `${domain}/dingzhi/dz/openCard/saveTask`;
            body = `activityId=${$.activityId}&buyerNick=${encodeURIComponent($.Pin)}&userId=${$.venderId}&activityType=${$.activityType}`
            break;
        case 'sign':
        case 'quickAddSku':
            url = `https://${$.domain}/wxCartKoi/cartkoi/quickAddCart`;
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&productIds=${encodeURIComponent(JSON.stringify($.productIds))}`
            break;
        case 'browseGoods':
            url = `${domain}/dingzhi/opencard/${type}`;
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
            if (type == 'browseGoods') body += `&value=${$.visitSkuValue}`
            break;
        case '邀请':
        case '助力':
            if (type == '助力') {
                url = `${domain}/dingzhi/linkgame/assist`;
            } else {
                url = `${domain}/dingzhi/linkgame/assist/status`;
            }
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&shareUuid=${$.shareUuid}`
            break;
        case 'viewVideo':
        case 'visitSku':
        case 'toShop':
        case 'addSku':
            url = `https://${$.domain}/drawCenter/doTask`;
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&taskId=${$.task.taskId}&param=${$.pro.skuId}`
            break;
        case 'getDrawRecordHasCoupon':
            url = `${domain}/dingzhi/linkgame/draw/record`;
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}&actorUuid=${$.actorUuid}`
            break;
        case 'getShareRecord':
            url = `${domain}/dingzhi/linkgame/help/list`;
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
            break;
        case '抽奖':
            url = `https://${$.domain}/drawCenter/draw/luckyDraw`;;
            body = `activityId=${$.activityId}&pin=${encodeURIComponent($.Pin)}`
            break;
        default:
            console.log(`错误${type}`);
    }
    // console.log("body-----:" + body)
    let myRequest = getPostRequest(url, body, method);
    // console.log(myRequest)
    return new Promise(async resolve => {
        $.post(myRequest, (err, resp, data) => {
            try {
                setActivityCookie(resp)
                if (err) {
                    if (resp && typeof resp.statusCode != 'undefined') {
                        if (resp.statusCode == 493) {
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err, err)}`)
                    console.log(`${type} API请求失败，请检查网路重试`)
                } else {
                    // console.log(data);
                    dealReturn(type, data);
                }
            } catch (e) {
                // console.log(data);
                console.log(e, resp)
            } finally {
                resolve();
            }
        })
    })
}


async function dealReturn(type, data) {
    let res = ''
    try {
        if (type != 'accessLogWithAD' || type != 'drawContent') {
            if (data) {
                res = JSON.parse(data);
            }
        }
    } catch (e) {
        console.log(`${type} 执行任务异常`);
        console.log(data);
        $.runFalag = false;
    }
    try {
        switch (type) {
            case 'isvObfuscator':
                if (typeof res == 'object') {
                    if (res.errcode == 0) {
                        if (typeof res.token != 'undefined') $.Token = res.token
                    } else if (res.message) {
                        console.log(`isvObfuscator ${res.message || ''}`)
                    } else {
                        console.log(data)
                    }
                } else {
                    console.log(data)
                }
                break;
            case 'getSimpleActInfoVo':
                if (typeof res == 'object') {
                    if (res.result && res.result === true) {
                        if (typeof res.data.shopId != 'undefined') $.shopId = res.data.shopId
                        if (typeof res.data.venderId != 'undefined') $.venderId = res.data.venderId
                    } else if (res.errorMessage) {
                        console.log(`${type} ${res.errorMessage || ''}`)
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case 'getMyPing':
                if (typeof res == 'object') {
                    if (res.result && res.result === true) {
                        console.log("MyPin" + res.data.secretPin)
                        if (res.data && typeof res.data.secretPin != 'undefined') $.Pin = res.data.secretPin
                        if (res.data && typeof res.data.nickname != 'undefined') $.nickname = res.data.nickname
                    } else if (res.errorMessage) {
                        console.log(`${type} ${res.errorMessage || ''}`)
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case 'getUserInfo':
                if (typeof res == 'object') {
                    if (res.result && res.result === true) {
                        if (res.data && typeof res.data.yunMidImageUrl != 'undefined') $.attrTouXiang = res.data.yunMidImageUrl || "https://img10.360buyimg.com/imgzone/jfs/t1/7020/27/13511/6142/5c5138d8E4df2e764/5a1216a3a5043c5d.png"
                    } else if (res.errorMessage) {
                        console.log(`${type} ${res.errorMessage || ''}`)
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case 'activityContent':
                if (typeof res == 'object') {
                    if (res.result && res.result === true) {
                        // console.log(JSON.stringify(res.data))
                        let wucvo = res.data.wucvo
                        if (typeof wucvo == 'object') {
                            $.uuid = wucvo.mySelfId
                            $.myFriendHelpOpenScanUrl = wucvo.myFriendHelpOpenScanUrl
                            $.friendUuids.push($.uuid)
                        }
                        let wuivo = res.data.wuivo
                        if (typeof wuivo == 'object') {
                            if ($.index == 1) {
                                $.helpTimes = wuivo.needUnpackingPeople
                                console.log(`每个账号需要助力的次数为${$.helpTimes}次`)
                            }
                            $.hasDrawPrize = wuivo.hasDrawPrize
                            // $.friendUuidArrays.push($.uuid)
                            // console.log("当前助力池为:" + JSON.stringify($.friendUuidArrays))
                        }
                        if ($.index == 1) {
                            $.friendUuid = $.friendUuids[0]
                            console.log(`接下来都会助力${$.friendUuid}`)
                        }
                        let wdifo = res.data.wdifo
                        if (typeof wdifo == 'object') {
                            if ($.index == 1) {
                                $.drawInfoId = wdifo.id
                                console.log(`拆包id为${$.drawInfoId}`)
                            }
                        }
                        $.hasFollow = res.data.hasFollow
                    } else if (res.errorMessage) {
                        console.log(`${type} ${res.errorMessage || ''}`)
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case 'unPacking':
                if (typeof res == 'object') {
                    if (res.result && res.result === true) {
                        if (res.errorMessage.indexOf("成功") != -1) {
                            console.log(JSON.stringify(res))
                            $.hasHelpedTimes++
                            $.message += `京东账号${$.UserName} ${res.errorMessage}\n`
                            $.prise = res.data.name
                        }
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case 'getActMemberInfo':
                if (typeof res == 'object') {
                    if (res.result && res.result === true) {
                        $.actMemberStatus = res.data.actMemberStatus
                        $.openCardStatus = res.data.openCard
                    } else if (res.errorMessage) {
                        console.log(`${type} ${res.errorMessage || ''}`)
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case 'hasPrize':
                if (typeof res == 'object') {
                    if (res.ok && res.ok === true) {
                        $.uuid = res.data.uuid
                        if ($.index == 1) {
                            $.friendUuid = $.uuid
                            console.log(`接下来都会助力${$.friendUuid}}`)
                        }
                    } else if (res.errorMessage) {
                        console.log(`${type} ${res.errorMessage || ''}`)
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case 'getCountByPin':
                if (typeof res == 'object') {
                    if (res.ok && res.ok === true) {
                        if (typeof res.data == 'object') {
                            $.hbSum = res.data.hbSum;
                            $.inviteeCount = res.data.inviteeCount;
                            // $.hbSum = res.data.hbSum;
                            // $.hbSum = res.data.hbSum;
                            console.log(`--------------`)
                            console.log(`邀请人数：${$.inviteeCount}`)
                        }
                    }
                }
                break;
            case 'followShop':
            case 'addShareOpen':
                if (typeof res == 'object') {
                    if (res.ok && res.ok === true) {
                        console.log(`助力成功！`)
                    }
                }
                break;
            case 'visitSku':
            case 'toShop':
            case 'addSku':
            case 'sign':
            case 'browseGoods':
            case '抽奖':
                if (typeof res == 'object') {
                    if (res.result && res.result === true) {
                        if (typeof res.data == 'object') {
                            let msg = ''
                            let title = '抽奖'
                            if (res.data.addBeanNum) {
                                msg = `${res.data.addBeanNum}京豆`
                            }
                            if (res.data.addPoint) {
                                msg += ` ${res.data.addPoint}游戏机会`
                            }
                            if (type == 'followShop') {
                                title = '关注'
                                if (res.data.beanNumMember && res.data.assistSendStatus) {
                                    msg += ` 额外获得:${res.data.beanNumMember}京豆`
                                }
                            } else if (type == 'addSku' || type == 'addCart') {
                                title = '加购'
                            } else if (type == 'viewVideo') {
                                title = '热门文章'
                            } else if (type == 'toShop') {
                                title = '浏览店铺'
                            } else if (type == 'visitSku' || type == 'browseGoods') {
                                title = '浏览商品'
                            } else if (type == 'sign') {
                                title = '签到'
                            } else {
                                let drawData = typeof res.data.drawOk === 'object' && res.data.drawOk || res.data
                                msg = drawData.drawOk == true && drawData.name || ''
                            }
                            if (title == "抽奖" && msg && msg.indexOf('京豆') == -1) {
                                if ($.isNode()) await notify.sendNotify(`${$.name}`, `【京东账号${$.index}】${$.nickName || $.UserName}\n${title}成功,获得 ${msg}\n活动地址: https://3.cn/-106MEjSh`);
                            }
                            if (!msg) {
                                msg = '空气💨'
                            }
                            console.log(`${title}获得:${msg || data}`)
                        } else {
                            console.log(`${type} ${data}`)
                        }
                    } else if (res.errorMessage) {
                        $.runFalag = false;
                        console.log(`${type} ${res.errorMessage || ''}`)
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case 'getDrawRecordHasCoupon':
                if (typeof res == 'object') {
                    if (res.result && res.result === true) {
                        console.log(`我的奖品：`)
                        let num = 0
                        let value = 0
                        let dayShareTime = 0
                        for (let i in res.data.recordList) {
                            let item = res.data.recordList[i]
                            if (item.infoName == '20京豆' && item.drawStatus == 0) {
                                num++
                                value = item.infoName.replace('京豆', '')
                                dayShareTime = dayShareTime < item.createTime ? item.createTime : dayShareTime;
                            } else {
                                console.log(`${item.infoType != 10 && item.value && item.value + ':' || ''}${item.infoName}`)
                            }
                        }
                        if (dayShareTime > 0) console.log("最新邀请奖励时间:" + $.time("yyyy-MM-dd HH:mm:ss", dayShareTime))
                        if (num > 0) console.log(`邀请好友(${num}):${num * parseInt(value, 10) || 30}京豆`)
                    } else if (res.errorMessage) {
                        console.log(`${type} ${res.errorMessage || ''}`)
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case 'getShareRecord':
                if (typeof res == 'object') {
                    if (res.result && res.result === true && res.data) {
                        $.ShareCount = res.data.shareList.length
                        $.log(`=========== 你邀请了:${$.ShareCount}个\n由于接口数据只有30个 故邀请大于30个的需要自行判断\n`)
                    } else if (res.errorMessage) {
                        console.log(`${type} ${res.errorMessage || ''}`)
                    } else {
                        console.log(`${type} ${data}`)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }
                break;
            case '邀请':
            case '助力':
                // console.log(data)
                if (typeof res == 'object') {
                    if (res.data.status == 200) {
                        if (type == '助力') {
                            console.log('助力成功')
                        } else {
                            $.yaoqing = true
                        }
                    } else if (res.data.status == 105) {
                        console.log('已经助力过')
                    } else if (res.data.status == 104) {
                        console.log('已经助力其他人')
                    } else if (res.data.status == 101) {
                        // console.log('已经助力过')
                    } else {
                        console.log(data)
                    }
                } else {
                    console.log(`${type} ${data}`)
                }

            case 'accessLogWithAD':
            case 'drawContent':
                break;
            default:
                console.log(`${type}-> ${data}`);
        }
        if (typeof res == 'object') {
            if (res.errorMessage) {
                if (res.errorMessage.indexOf('火爆') > -1) {
                    $.hotFlag = true
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}

function getCK() {
    return new Promise(resolve => {
        let get = {
            url: `${$.activityUrl}&friendUuid=${$.friendUuid}`,
            followRedirect: false,
            headers: {
                "User-Agent": $.UA,
            },
            timeout: 30000
        }
        $.get(get, async (err, resp, data) => {
            try {
                if (err) {
                    if (resp && typeof resp.statusCode != 'undefined') {
                        if (resp.statusCode == 493) {
                            console.log('此ip已被限制，请过10分钟后再执行脚本\n')
                            $.outFlag = true
                        }
                    }
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} cookie API请求失败，请检查网路重试`)
                } else {
                    // console.log(JSON.stringify(resp))
                    // let end = data.match(/(活动已经结束)/) && data.match(/(活动已经结束)/)[1] || ''
                    // if (end) {
                    //     $.activityEnd = true
                    //     console.log('活动已结束')
                    // }
                    setActivityCookie(resp)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function timeToTimestamp(time) {
    let timestamp = Date.parse(new Date(time).toString());
    //timestamp = timestamp / 1000; //时间戳为13位需除1000，时间戳为13位的话不需除1000
    console.log(time + "的时间戳为：" + timestamp);
    return timestamp;
    //2021-11-18 22:14:24的时间戳为：1637244864707
}

function getPostRequest(url, body, method = "POST") {
    let headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookie,
        "User-Agent": $.UA,
        "X-Requested-With": "XMLHttpRequest"
    }
    if (url.indexOf($.domain) > -1) {
        headers["Referer"] = `${$.activityUrl}&sid=&un_area=13_1007_4909_59742&friendUuid=${$.friendUuid}`
        headers["Origin"] = `https://${$.domain}`
        headers["Cookie"] = `${lz_jdpin_token_cookie && lz_jdpin_token_cookie || ''}${$.Pin && "AUTH_C_USER=" + $.Pin + ";" || ""}${activityCookie}`
        // headers["Cookie"] = `IsvToken=${$.Token};` + `${lz_jdpin_token_cookie && lz_jdpin_token_cookie || ''}${$.Pin && "AUTH_C_USER=" + $.Pin + ";" || ""}${activityCookie}`
    }
    // console.log(headers)
    // console.log(headers.Cookie)
    return { url: url, method: method, headers: headers, body: body, timeout: 30000 };
}

function setActivityCookie(resp) {
    let LZ_TOKEN_KEY = ''
    let LZ_TOKEN_VALUE = ''
    let lz_jdpin_token = ''
    let setcookies = resp && resp['headers'] && (resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || '') || ''
    let setcookie = ''
    if (setcookies) {
        if (typeof setcookies != 'object') {
            setcookie = setcookies.split(',')
        } else setcookie = setcookies
        for (let ck of setcookie) {
            let name = ck.split(";")[0].trim()
            if (name.split("=")[1]) {
                // console.log(name.replace(/ /g,''))
                if (name.indexOf('LZ_TOKEN_KEY=') > -1) LZ_TOKEN_KEY = name.replace(/ /g, '') + ';'
                if (name.indexOf('LZ_TOKEN_VALUE=') > -1) LZ_TOKEN_VALUE = name.replace(/ /g, '') + ';'
                if (name.indexOf('lz_jdpin_token=') > -1) lz_jdpin_token = '' + name.replace(/ /g, '') + ';'
            }
        }
    }
    if (LZ_TOKEN_KEY && LZ_TOKEN_VALUE) activityCookie = `${LZ_TOKEN_KEY} ${LZ_TOKEN_VALUE}`
    if (lz_jdpin_token) lz_jdpin_token_cookie = lz_jdpin_token
}

function getQueryString(url, name) {
    let reg = new RegExp("(^|[&?])" + name + "=([^&]*)(&|$)");
    let r = url.match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return '';
}

async function joinShop() {
    if (!$.joinVenderId) return
    return new Promise(async resolve => {
        $.errorJoinShop = '活动太火爆，请稍后再试'
        let activityId = ``
        if ($.shopactivityId) activityId = `,"activityId":${$.shopactivityId}`
        let body = `{"venderId":"${$.venderId}","shopId":"${$.shopId}","bindByVerifyCodeFlag":1,"registerExtend":{},"writeChildFlag":0${activityId},"channel":406}`
        let h5st = '20220412164634306%3Bf5299392a200d6d9ffced997e5790dcc%3B169f1%3Btk02wc0f91c8a18nvWVMGrQO1iFlpQre2Sh2mGtNro1l0UpZqGLRbHiyqfaUQaPy64WT7uz7E%2FgujGAB50kyO7hwByWK%3B77c8a05e6a66faeed00e4e280ad8c40fab60723b5b561230380eb407e19354f7%3B3.0%3B1649753194306'
        const options = {
            url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=${body}&clientVersion=9.2.0&client=H5&uuid=88888&h5st=${h5st}`,
            headers: {
                'accept': '*/*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                'cookie': cookie,
                'origin': 'https://shopmember.m.jd.com/',
                'user-agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                data = data && data.match(/jsonp_.*?\((.*?)\);/) && data.match(/jsonp_.*?\((.*?)\);/)[1] || data
                // console.log(data)
                let res = $.toObj(data, data);
                if (res && typeof res == 'object') {
                    if (res && res.success === true) {
                        console.log(res.message)
                        $.errorJoinShop = res.message
                        if (res.result && res.result.giftInfo) {
                            for (let i of res.result.giftInfo.giftList) {
                                console.log(`入会获得:${i.discountString}${i.prizeName}${i.secondLineDesc}`)
                            }
                        }
                    } else if (res && typeof res == 'object' && res.message) {
                        $.errorJoinShop = res.message
                        console.log(`${res.message || ''}`)
                    } else {
                        console.log(data)
                    }
                } else {
                    console.log(data)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}

function uuid(x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
    return x.replace(/[xy]/g, function (x) {
        const r = 16 * Math.random() | 0, n = "x" === x ? r : 3 & r | 8;
        return n.toString(36)
    })
}

function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}
// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
