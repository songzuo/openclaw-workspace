#!/bin/bash
URL="https://code.coolyeah.net/v1/chat/completions"
KEY="sk-0LNe1uYzhRRlivkafdn9vSnpl873SVPqXAVUdQU5CyvVmQib"

echo "===== custom1 端点测试 v3 - 增强错误处理 ====="
echo ""

SUCCESS=0
FAIL=0
TOTAL_TIME=0

for i in {1..10}; do
  START=$(date +%s%3N)
  
  RESPONSE=$(curl -s -X POST "$URL" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "glm-5",
      "messages": [{"role": "user", "content": "如果1+1=2，那么2+2等于多少？请简洁回答。"}],
      "max_tokens": 200
    }' \
    --connect-timeout 10 --max-time 30)
  
  END=$(date +%s%3N)
  DURATION=$((END - START))
  TOTAL_TIME=$((TOTAL_TIME + DURATION))
  
  # 增强解析：错误处理
  if echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print('ok' if 'choices' in d else 'fail')" 2>/dev/null | grep -q "ok"; then
    CONTENT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['choices'][0]['message'].get('content',''))")
    REASONING=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['choices'][0].get('reasoning_content',''))")
    
    if [ -n "$CONTENT" ] || [ -n "$REASONING" ]; then
      SUCCESS=$((SUCCESS + 1))
      echo "✅ #$i | ${DURATION}ms | content: ${CONTENT:0:30:- } | reasoning: ${REASONING:0:50}..."
    else
      FAIL=$((FAIL + 1))
      echo "⚠️ #$i | ${DURATION}ms | 空响应 (无 content/reasoning)"
    fi
  else
    FAIL=$((FAIL + 1))
    ERROR=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('error',{}).get('message',str(d)[:40]))" 2>/dev/null)
    echo "❌ #$i | ${DURATION}ms | $ERROR"
  fi
  
  [ $i -lt 10 ] && sleep 3
done

echo ""
echo "===== 📊 统计 ====="
echo "✅ 成功: $SUCCESS/10"
echo "❌ 失败: $FAIL/10"
echo "⏱️  平均: $((TOTAL_TIME / 10))ms"
echo "🟢 可用率: $((SUCCESS * 100 / 10))%"
