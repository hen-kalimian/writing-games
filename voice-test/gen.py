import asyncio, edge_tts
S={'letter':'הֵא','ask':'שַׁאֲלוּ אֶת הַיְלָדִים: מִי יוֹתֵר גָּדוֹל?','word':'אֱמוֹר, זֶה הַחִלָּזוֹן הַגָּדוֹל, וְהַקָּטָן.'}
V={'A':dict(rate='-10%',pitch='+0Hz'),'B':dict(rate='-20%',pitch='+4Hz'),'C':dict(rate='-14%',pitch='+10Hz'),'D':dict(rate='-6%',pitch='-4Hz')}
async def main():
    for v,o in V.items():
        for k,t in S.items():
            txt=t if k=='letter' else t.replace(', ',', , ')
            await edge_tts.Communicate(txt,'he-IL-HilaNeural',rate=o['rate'],pitch=o['pitch']).save(f'{v}_{k}.mp3')
asyncio.run(main())
