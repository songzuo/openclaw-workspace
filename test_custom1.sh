#!/bin/bash
URL="https://code.coolyeah.net/v1/chat/completions"
KEY="sk-0LNe1uYzhRRlivkafdn9vSnpl873SVPqXAVUdQU5CyvVmQib"

echo "===== custom1 端点测试 (glm-5) - 10次连续请求 ====="
echo "URL: $URL"
echo "Model: glm-5"
echo ""

SUCCESS=0
FAIL=0
TOTAL_TIME=0

for i in {1..10}; do
  echo "--- 请求 #$i ---"
  START=$(date +%s%3N)
  
  RESPONSE=$(curl -s -X POST "$URL" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "glm-5",
      "messages": [{"role": "user", "content": "如果1+1=2，那么2+2等于多少？请简洁回答。"}],
      "max_tokens": 100
    }' \
    --connect-timeout 10 --max-time 30)
  
  END=$(date +%s%3N)
  DURATION=$((END - START))
  TOTAL_TIME=$((TOTAL_TIME + DURATION))
  
  # 解析响应
  if echo "$RESPONSE" | grep -q '"content"'; then
    SUCCESS=$((SUCCESS + 1))
    CONTENT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['choices'][0]['message']['content'])")
    REASONING=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['choices'][0].get('reasoning_content',''))")
    
    echo "✅ 状态: 成功 | 耗时: ${DURATION}ms"
    echo "📝 回答: ${CONTENT:0:100}"
    if [ -n "$REASONING" ]; then
      echo "🧠 推理: ${REASONING:0:150]}..."
    fi
  else
    FAIL=$((FAIL + 1))
    ERROR=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('error',{}).get('message',str(d)[:50]))" 2>/dev/null)
    echo "❌ 状态: 失败 | 耗时: ${DURATION}ms"
    echo "🚨 错误: $ERROR"
  fi
  
  echo ""
  # 间隔 2.5 秒避免 rate limit
  if [ $i -lt 10 ]; then
    sleep 2.5
  fi
done

echo "===== 📊 统计结果 ====="
echo "✅ 成功: $SUCCESS/10"
echo "❌ 失败: $FAIL/10"
echo "⏱️  平均耗时: $((TOTAL_TIME / 10))ms"
echo "🟢 可用率: $((SUCCESS * 100 / 10))%"
