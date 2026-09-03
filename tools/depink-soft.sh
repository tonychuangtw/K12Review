#!/bin/bash
# depink-soft.sh <in.png> <out.png>
# 只洗掉「紅色明顯偏強」的粉紅浮水印，保留淺灰／淡紫網底（那是題目的答案）。
# 規則：r－g＞35 且 r＞170 → 白；否則原樣輸出（不轉灰階，網底才不會被吃掉）。
set -e
E="if(gt(gt(r(X,Y)-g(X,Y),35)*gt(r(X,Y),170),0),255,%CH%(X,Y))"
ffmpeg -y -loglevel error -i "$1" -vf "format=rgb24,geq=r='${E//%CH%/r}':g='${E//%CH%/g}':b='${E//%CH%/b}'" "$2"
