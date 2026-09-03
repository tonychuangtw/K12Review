#!/bin/bash
# depink.sh <in.png> <out.png>
# 去掉基測掃描題本上的粉紅色「新聞試題本」浮水印。
# 規則：M=最大通道、m=最小通道。若（M-m>20 且 M>140）或 M>205 → 白；否則輸出 M（灰階）。
set -e
M="max(max(r(X,Y),g(X,Y)),b(X,Y))"
N="min(min(r(X,Y),g(X,Y)),b(X,Y))"
E="if(gt(gt($M-$N,20)*gt($M,140)+gt($M,205),0),255,$M)"
ffmpeg -y -loglevel error -i "$1" -vf "format=rgb24,geq=r='$E':g='$E':b='$E'" "$2"
