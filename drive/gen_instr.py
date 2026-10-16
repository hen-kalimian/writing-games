import asyncio, edge_tts
S={'police':'הוֹבִילוּ אֶת נַיֶּידֶת הַמִּשְׁטָרָה אֶל תַּחֲנַת הַמִּשְׁטָרָה','ambulance':'הוֹבִילוּ אֶת הָאַמְבּוּלַנְס אֶל בֵּית הַחוֹלִים','fire':'הוֹבִילוּ אֶת הַכַּבָּאִית אֶל תַּחֲנַת הַכִּבּוּי'}
async def main():
    for k,t in S.items():
        await edge_tts.Communicate(t,'he-IL-HilaNeural',rate='-10%').save(f'audio/i_{k}.mp3')
asyncio.run(main())
