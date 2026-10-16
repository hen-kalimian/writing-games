import asyncio, edge_tts
S={'i_bus':'הוֹבִילוּ אֶת הָאוֹטוֹבּוּס אֶל בֵּית הַסֵּפֶר','i_train':'הוֹבִילוּ אֶת הָרַכֶּבֶת אֶל תַּחֲנַת הָרַכֶּבֶת','i_firetruck':'הוֹבִילוּ אֶת הַכַּבָּאִית אֶל תַּחֲנַת הַכִּבּוּי'}
D=['אֶפֶס','אֶחָד','שְׁתַּיִם','שָׁלוֹשׁ','אַרְבַּע','חָמֵשׁ','שֵׁשׁ','שֶׁבַע','שְׁמוֹנֶה','תֵּשַׁע']
async def main():
    for k,t in S.items(): await edge_tts.Communicate(t,'he-IL-HilaNeural',rate='-14%',pitch='+10Hz').save(f'audio/{k}.mp3')
    for i,t in enumerate(D): await edge_tts.Communicate(t,'he-IL-HilaNeural',rate='-14%',pitch='+10Hz').save('audio/d%04x.mp3'%(48+i))
asyncio.run(main())
