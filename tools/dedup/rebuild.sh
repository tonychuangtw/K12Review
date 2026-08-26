#!/bin/bash
# 從該科 README 的重建 code block 抽出指令並執行（避免手抄漏檔）
set -e
cd ~/TelegramClaude/chinese
SUBJ=$1
python3 - "$SUBJ" <<'PY' > /tmp/rebuild-cmd.sh
import re, sys
subj = sys.argv[1]
src = open('tools/tikuconv/%s/README.md' % subj, encoding='utf-8').read()
blocks = re.findall(r'```bash\n(.*?)```', src, re.S)
cmd = [b for b in blocks if 'build-bank.js %s ' % subj in b]
assert cmd, '找不到 %s 的重建指令' % subj
print(cmd[0])
PY
bash /tmp/rebuild-cmd.sh
