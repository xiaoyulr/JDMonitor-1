#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import datetime
import os
import re
import sys
import time
import requests
import json
from telethon import events

from .login import user
from .. import chat_id, jdbot, logger, JD_DIR, TOKEN
from ..bot.utils import cmd
from ..diy.utils import my_chat_id

bot_id = int(TOKEN.split(":")[0])
client = user
@client.on(events.NewMessage(chats=-1001708496854, pattern=r'.*(\#|\!|\$|\%|\@|\#|\￥|\%|\@|\！|\().*(\)|\#|\$|\%|\@|\#|\￥|\%|\!|\！|\@).*(瓜分|好友|豆|人|分|组队|车|抽|大牌|联合|开卡|入|捡漏|会|r|100|试|微订制|数量).*'))
async def myzdjr(event):
    try:
        jApp = event.message.text
        msg = await jdbot.send_message(my_chat_id, f"监控到消息\n\n{jApp}")
        api= "https://api.jds.codes/jd/jcommand"
        data = {'code': event.message.text}
        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg0MTA4Mzg4MiwiaWF0IjoxNjQ5MDY0Nzc4LCJleHAiOjE2ODA2MDA3Nzh9.N9HirxnU2DrTmv5fwCrDDWiOe3TSM0kZiiz2WvcxY_w"       
        headers= {"Authorization": "Bearer "+token}
        msg = await jdbot.edit_message(msg, f'消息：\n{jApp}\n\n获取链接...')
        r = requests.post(api, data, headers = headers)
        msg = await jdbot.edit_message(msg, f'消息：\n{jApp}\n\n变量获取成功\n\n{r.text}')
        r = requests.post(api, data, headers = headers)
        if "pool" in r.text :
            url = re.findall(r"jumpUrl\"\:\"(.+?)/pool", r.text) 
       #组队    
        elif "wxTeam" in r.text :
            url = re.findall(r"jumpUrl\"\:\"(.+?)/wxTeam", r.text) 
            url = re.sub('\[\'|\'\]', '', f"{url}")
            id1 = re.findall(r"activityId=(.+?)&signUuid", r.text)
            id1 = re.sub('\[\'|\'\]', '',f"{id1}")
            if "lzkjdz" in url :
             msg = await jdbot.edit_message(msg, f'监听并解析到组队瓜分变量：\n{jApp}\nexport jd_zdjr_activityId="{id1}"\n解析大师祝您薅豆愉快！！')
            elif "cjhydz" in url :
             msg = await jdbot.edit_message(msg, f'监听并解析到cj组队瓜分变量：\n{jApp}\nexport jd_cjhy_activityId="{id1}"\n解析大师祝您薅豆愉快！！')
            else:
             msg = await jdbot.edit_message(msg,'未检测到相关变量信息')
       #集卡     
        elif "wxCollectCard" in r.text :
            url2 = re.findall(r"jumpUrl\"\:\"(.+?)&shareUuid", r.text) 
            url2 = re.sub('\[\'|\'\]', '', f"{url2}")
            id2 = re.findall(r"jumpUrl\"\:\"(.+?)&shareUuid", r.text)
            id2 = re.sub('\[\'|\'\]', '',f"{id2}")
            if "wxCollectCard" in url2 :
             msg = await jdbot.edit_message(msg, f'监听并解析到集卡变量：\n{jApp}\nM_WX_COLLECT_CARD_UR="{id2}"\n解析大师祝您薅豆愉快！！') 
            else:
             msg = await jdbot.edit_message(msg,'未检测到相关变量信息')
       #开卡     
        elif "wxInviteActivity" in r.text :
            url3= re.findall(r"jumpUrl\"\:\"(.+?)&invite", r.text) 
            url3 = re.sub('\[\'|\'\]', '', f"{url3}")
            id3 = re.findall(r"venderId=(.+?)&activityId", r.text)
            id3 = re.sub('\[\'|\'\]', '',f"{id3}")
            if "venderId=" in url3 :
             msg = await jdbot.edit_message(msg, f'监听并解析到开卡入会变量：\n{jApp}\nexport VENDER_ID="{id3}"\n解析大师祝您薅豆愉快！！')
            else:
             msg = await jdbot.edit_message(msg,'未检测到相关变量信息')
       #微订制     
        elif "microDz" in r.text :
            url4 = re.findall(r"jumpUrl\"\:\"(.+?)/index", r.text) 
            url4 = re.sub('\[\'|\'\]', '', f"{url4}")
            id4 = re.findall(r"activityId=(.+?)&inviter=", r.text)
            id4 = re.sub('\[\'|\'\]', '',f"{id4}")
            if "/wx/view" in url4 :
             msg = await jdbot.edit_message(msg, f'监听并解析到微订制变量：\n{jApp}\nexport jd_cjhy_activityId60="{id4}"\n解析大师祝您薅豆愉快！！')
            else:
             msg = await jdbot.edit_message(msg,'未检测到相关变量信息')

       #分享有礼     
        elif "wxShareActivity" in r.text :
            url5 = re.findall(r"jumpUrl\"\:\"(.+?)&friendUuid", r.text) 
            url5 = re.sub('\[\'|\'\]', '', f"{url5}")
            id5 = re.findall(r"activityId=(.+?)&friendUuid=", r.text)
            id5 = re.sub('\[\'|\'\]', '',f"{id5}")
            if "wxShareActivity" in url5 :
             msg = await jdbot.edit_message(msg, f'监听并解析到分享有礼变量：\n{jApp}\nexport jd_fxyl_activityId="{id5}"\n解析大师祝您薅豆愉快！！')
            else:
             msg = await jdbot.edit_message(msg,'未检测到相关变量信息')
       #M幸运抽奖     
        elif "lzclient" in r.text :
            url6 = re.findall(r"jumpUrl\"\:\"(.+?)&shareuserid", r.text) 
            url6 = re.sub('\[\'|\'\]', '', f"{url6}")
            id6 = re.findall(r"activityId=(.+?)&shareuserid", r.text)
            id6 = re.sub('\[\'|\'\]', '',f"{id6}")
            if "lzclient" in url6 :
             msg = await jdbot.edit_message(msg, f'监听并解析到M幸运抽奖变量：\n{jApp}\nexport  M_WX_LUCK_DRAW_URL="{url6}"\n解析大师祝您薅豆愉快！！')
            else:
             msg = await jdbot.edit_message(msg,'未检测到相关变量信息')  
        #转盘抽奖     
        #elif "gameType" in r.text :
        #    url7 = re.findall(r"jumpUrl\"\:\"(.+?)&gameType=", r.text) 
        #    url7 = re.sub('\[\'|\'\]', '', f"{url7}")
        #    id7 = re.findall(r"activityId=(.+?)&gameType", r.text)
        #    id7 = re.sub('\[\'|\'\]', '',f"{id7}")
        #    if "activityId" in url7 :
        #     msg = await jdbot.edit_message(msg, f'监听并解析到转盘抽奖变量：\n{jApp}\nexport M_WX_LUCK_DRAW_URL="{url7}"\n解析大师祝您薅豆愉快！！')
        #    else:
        #     msg = await jdbot.edit_message(msg,'未检测到相关变量信息')           
        else:
            msg = await jdbot.edit_message(msg,f'\n{jApp}\n解析大师未检测到认识的变量信息，有知道这条口令或者链接对应的活动名可以联系管理员或者留言~\n管理员会添加，解析大师祝您薅豆愉快！！~')

    except Exception as e:
        title = "【💥错误💥】"
        name = "文件名：" + os.path.split(file)[-1].split(".")[0]
        function = "函数名：" + e.traceback.tb_frame.f_code.co_name
        details = "错误详情：第 " + str(e.traceback.tb_lineno) + " 行"
        tip = '建议百度/谷歌进行查询'
        await jdbot.send_message(chat_id, f"{title}\n\n{name}\n{function}\n错误原因：{str(e)}\n{details}\n{tip}")
        logger.error(f"错误--->{str(e)}")