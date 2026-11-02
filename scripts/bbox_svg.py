import re, sys, xml.etree.ElementTree as ET
NUM=r'[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?'
def pts_path(d):
    toks=re.findall(r'[MmLlHhVvCcSsQqTtAaZz]|'+NUM, d); i=0; x=y=0; sx=sy=0; cmd=None; P=[]
    def nxt():
        nonlocal i; v=float(toks[i]); i+=1; return v
    while i<len(toks):
        t=toks[i]
        if re.match(r'[A-Za-z]',t): cmd=t; i+=1
        if cmd in 'Zz': x,y=sx,sy; continue
        rel=cmd.islower(); c=cmd.upper()
        if c=='M' or c=='L' or c=='T':
            a,b=nxt(),nxt(); x,y=(x+a,y+b) if rel else (a,b); P.append((x,y))
            if c=='M': sx,sy=x,y; cmd='l' if rel else 'L'
        elif c=='H': a=nxt(); x=x+a if rel else a; P.append((x,y))
        elif c=='V': b=nxt(); y=y+b if rel else b; P.append((x,y))
        elif c=='C':
            v=[nxt() for _ in range(6)]
            for k in range(0,6,2): P.append((x+v[k],y+v[k+1]) if rel else (v[k],v[k+1]))
            x,y=P[-1]
        elif c in 'SQ':
            v=[nxt() for _ in range(4)]
            for k in range(0,4,2): P.append((x+v[k],y+v[k+1]) if rel else (v[k],v[k+1]))
            x,y=P[-1]
        elif c=='A':
            v=[nxt() for _ in range(7)]; x,y=(x+v[5],y+v[6]) if rel else (v[5],v[6]); P.append((x,y))
        else: i+=1
    return P
def pts(e):
    t=e.tag.split('}')[1]
    if t=='path': return pts_path(e.get('d',''))
    if t in ('polygon','polyline'): v=[float(a) for a in re.findall(NUM,e.get('points',''))]; return list(zip(v[::2],v[1::2]))
    if t=='rect': x,y,w,h=[float(e.get(k,0)) for k in ('x','y','width','height')]; return [(x,y),(x+w,y+h)]
    if t in ('circle','ellipse'):
        cx,cy=float(e.get('cx',0)),float(e.get('cy',0)); rx=float(e.get('rx',e.get('r',0))); ry=float(e.get('ry',e.get('r',0))); return [(cx-rx,cy-ry),(cx+rx,cy+ry)]
    if t=='line': return [(float(e.get('x1')),float(e.get('y1'))),(float(e.get('x2')),float(e.get('y2')))]
    return []
def bbox(e):
    P=[]
    for c in e.iter(): P+=pts(c)
    if not P: return None
    xs=[p[0] for p in P]; ys=[p[1] for p in P]; return (min(xs),min(ys),max(xs),max(ys))
r=ET.parse(sys.argv[1]).getroot()
def walk(e,path,d,mx):
    for i,c in enumerate(list(e)):
        t=c.tag.split('}')[1]
        if t in ('defs','linearGradient','radialGradient','clipPath','mask'): continue
        b=bbox(c)
        if not b: continue
        n=sum(1 for _ in c.iter())
        fill=c.get('fill') or ''
        if (b[2]-b[0])>15: print('.'.join(map(str,path+[i])), t, 'n=%d'%n, 'x=%d-%d y=%d-%d'%(b[0],b[2],b[1],b[3]), fill)
        if t=='g' and d<mx: walk(c,path+[i],d+1,mx)
walk(r,[],0,int(sys.argv[2]) if len(sys.argv)>2 else 3)
