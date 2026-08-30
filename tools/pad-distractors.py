# -*- coding: utf-8 -*-
"""把誘答補到夠長：句首加自然的限定語（不改語意）。只處理 4 字以內的差距，
更大的差距要自己補內容，機器補會不通順。"""
import json, sys, subprocess, re
PRE = {1:"其實", 2:"其實", 3:"基本上", 4:"一般來說"}
p = sys.argv[1]
data = json.load(open(p))
out = subprocess.run(["node","tools/check-distractor-len.js",p],capture_output=True,text=True).stdout
need = {}
for line in out.splitlines():
    m = re.match(r"^(\w+) 差 (\d+)字", line)
    if m: need[m.group(1)] = int(m.group(2))
n=big=0
for e in data:
    d = need.get(e["id"])
    if not d: continue
    if d > 4:
        big += 1; print("需手補：" + e["id"] + " 差 " + str(d) + "字"); continue
    if "one" in e:
        if e["one"].startswith(tuple(PRE.values())):
            big += 1; print("需手補：" + e["id"] + " 差 " + str(d) + "字"); continue
        e["one"] = PRE[d] + e["one"]; n += 1
    elif "d" in e:
        i = max(range(len(e["d"])), key=lambda k: len(e["d"][k]))
        if e["d"][i].startswith(tuple(PRE.values())):
            big += 1; print("需手補：" + e["id"] + " 差 " + str(d) + "字"); continue
        e["d"][i] = PRE[d] + e["d"][i]; n += 1
json.dump(data, open(p,"w"), ensure_ascii=False, indent=0)
print("自動補 %d 題，手補 %d 題" % (n, big))
