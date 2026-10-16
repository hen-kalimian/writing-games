import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
im = Image.open('C:/Users/USER/yy/drive_sheet.jpg').convert('RGB')
a = np.asarray(im).astype(int)
fg = a.min(axis=2) < 238
d = ndi.binary_dilation(fg, iterations=14)
lab, n = ndi.label(d)
objs = ndi.find_objects(lab)
items = []
for s in objs:
    h = s[0].stop - s[0].start
    w = s[1].stop - s[1].start
    if h * w > 8000:
        items.append((s[0].start, s[1].start, s))
print(len(items))
items.sort(key=lambda t: (round(t[0] / 400), t[1]))
names = ['police', 'policest', 'cone', 'ambulance', 'hospital', 'firetruck']
for nm, (y, x, s) in zip(names, items):
    y0 = max(0, s[0].start - 6); y1 = min(a.shape[0], s[0].stop + 6)
    x0 = max(0, s[1].start - 6); x1 = min(a.shape[1], s[1].stop + 6)
    c = a[y0:y1, x0:x1]
    white = c.min(axis=2) > 236
    l2, n2 = ndi.label(white)
    b = set(np.unique(np.concatenate([l2[0], l2[-1], l2[:, 0], l2[:, -1]]))) - {0}
    bg = np.isin(l2, list(b))
    alpha = (~bg).astype(np.uint8) * 255
    alpha = np.asarray(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(1)))
    rgba = np.dstack([c.astype(np.uint8), alpha])
    im2 = Image.fromarray(rgba, 'RGBA')
    im2 = im2.crop(im2.getbbox())
    im2.thumbnail((520, 520))
    im2.save('C:/Users/USER/yy/wg/drive/img/' + nm + '.png')
    print(nm, im2.size, (x0, y0, x1, y1))
names2 = ['police', 'policest', 'ambulance', 'hospital', 'firetruck', 'cone']
ims = [Image.open('C:/Users/USER/yy/wg/drive/img/' + f + '.png') for f in names2]
W = sum(i.width for i in ims); H = max(i.height for i in ims)
s = Image.new('RGB', (W, H), (255, 230, 240)); x = 0
for i in ims:
    s.paste(i, (x, 0), i); x += i.width
s.save('C:/Users/USER/yy/drive_check.png')
