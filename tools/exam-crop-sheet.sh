#!/bin/bash
# 用法: montage.sh <輸出png> <圖...>  最多 12 張，4 欄 3 列，每格 400x300，紅框分隔
out=$1; shift
args=(); filt=""; n=0
for f in "$@"; do
  args+=(-i "$f")
  filt="$filt[$n:v]scale=400:300:force_original_aspect_ratio=decrease,pad=400:300:(ow-iw)/2:(oh-ih)/2:color=white,drawbox=x=0:y=0:w=400:h=300:color=red:t=2[v$n];"
  n=$((n+1))
done
if [ "$n" -eq 1 ]; then
  ffmpeg -y -loglevel error "${args[@]}" -filter_complex "${filt}[v0]null[out]" -map "[out]" -frames:v 1 "$out"; exit
fi
ins=""; for ((i=0;i<n;i++)); do ins="$ins[v$i]"; done
ffmpeg -y -loglevel error "${args[@]}" -filter_complex "${filt}${ins}xstack=inputs=$n:layout=0_0|400_0|800_0|1200_0|0_300|400_300|800_300|1200_300|0_600|400_600|800_600|1200_600[out]" -map "[out]" -frames:v 1 "$out"
