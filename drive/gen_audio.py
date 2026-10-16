import asyncio, json, edge_tts
L=json.load(open('C:/Users/USER/.claude/skills/digital-games/letters.json',encoding='utf8'))
L=L.get('letters',L)
async def main():
    for ch,v in L.items():
        out='audio/l%04x.mp3'%ord(ch[0])
        await edge_tts.Communicate(v['say'],'he-IL-HilaNeural',rate='-14%',pitch='+10Hz').save(out)
        print(ch,v['say'],out)
asyncio.run(main())
