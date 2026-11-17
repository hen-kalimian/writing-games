import json,copy
names={'sh':'שווא','ch':'חיריק','ho':'חולם','tz':'צירה סגול','sk':'שורוק קובוץ'}
for c in names:
    f='scenes_%s.json'%c
    d=json.load(open(f,encoding='utf8'))
    if any(s['id']=='v%s2a'%c for s in d['scenes']): print(c,'already'); continue
    old=[s for s in d['scenes'] if s['stage']==2][0]
    st=old['steps']; cuts=[i for i,x in enumerate(st) if x.get('sentence')]
    new=[]; start=0
    for n,ci in enumerate(cuts):
        seg=st[start:ci]; sent=st[ci]; start=ci+1
        ly=seg[-1]['y0']; last=[x for x in seg if x['y0']==ly]
        d0=last[0]['t0']-1.0
        steps=[]
        for x in last:
            y=copy.deepcopy(x); y['t0']=round(x['t0']-d0,2); y['t1']=round(x['t1']-d0,2); steps.append(y)
        L='ab'[n]
        new.append({'id':'v%s2%s'%(c,L),'stage':2,'title':'שלב 2: פירמידה %d, המשפט האחרון הברה הברה'%(n+1),'img':old['img'],'dur':round(steps[-1]['t1']+1.5,2),'steps':steps,'hint':'קראי רק את המשפט האחרון של הפירמידה, הברה אחרי הברה, בקצב שהמלבן הירוק מראה. בין מילה למילה הפסקה קצרה','pauseAfter':0})
        s2=copy.deepcopy(sent); dur=sent['t1']-sent['t0']; s2['t0']=1.0; s2['t1']=round(1.0+dur,2)
        new.append({'id':'v%s3%s'%(c,L),'stage':3,'title':'פירמידה %d: הקראה רציפה של המשפט'%(n+1),'img':old['img'],'dur':round(s2['t1']+1.0,2),'steps':[s2],'hint':'קראי את כל המשפט בשלמותו, ברצף','pauseAfter':0})
        print(c,n+1,'syllables',len(steps),'row y',ly,'dur',new[-2]['dur'],'sent',new[-1]['dur'])
    old['hidden']=True
    i=d['scenes'].index(old); d['scenes'][i+1:i+1]=new
    json.dump(d,open(f,'w',encoding='utf8'),ensure_ascii=False)
