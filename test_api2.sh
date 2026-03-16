#!/bin/bash
URL="https://code.coolyeah.net/v1/chat/completions"
KEY="sk-0LNe1uYzhRRlivkafdn9vSnpl873SVPqXAVUdQU5CyvVmQib"

echo "===== API 测试 (glm-5) 连续10次 ====="
echo ""

SUCCESS=0
FAIL=0
TOTAL_TIME=0

for i in {1..10}; do
  START=$(date +%s%3N)
  
  RESPONSE=$(curl -s -X POST "$URL" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d '{"model": "glm-5", "messages": [{"role": "user", "content": "说一个字"}], "max_tokens": 20}' \
    --connect-timeout 10 --max-time 30)
  
  END=$(date +%s%3N)
  DURATION=$((END - START))
  TOTAL_TIME=$((TOTAL_TIME + DURATION))
  
  # 检查是否有 content 字段
  if echo "$RESPONSE" | grep -q '"content"'; then
    SUCCESS=$((SUCCESS + 1))
    CONTENT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['choices'][0]['message']['content'][:40])" 2>/dev/null || echo "解析失败")
    echo "✅ #$i | ${DURATION}ms | $CONTENT"
  else
    FAIL=$((FAIL + 1))
    ERROR=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('error',{}).get('message','未知')[:50])" 2>/dev/null || echo "$RESPONSE" | head -c 30)
    echo "❌ #$i | ${DURATION}ms | $ERROR"
  fi
done

echo ""
echo "===== 统计结果 ====="
echo "成功: $SUCCESS/10"
echo "失败: $FAIL/10"
if [ $SUCCESS -gt 0 ]; then
  echo "平均耗时: $((TOTAL_TIME / 10))ms"
fi
