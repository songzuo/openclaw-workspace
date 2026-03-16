#!/bin/bash
URL="https://code.coolyeah.net/v1/chat/completions"
KEY="sk-0LNe1uYzhRRlivkafdn9vSnpl873SVPqXAVUdQU5CyvVmQib"

echo "===== custom1 端点测试 v2 - reasoning_content 字段验证 ====="
echo "URL: $URL"
echo "Model: glm-5"
echo ""

SUCCESS=0
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
      "max_tokens": 200
    }' \
    --connect-timeout 10 --max-time 30)
  
  END=$(date +%s%3N)
  DURATION=$((END - START))
  TOTAL_TIME=$((TOTAL_TIME + DURATION))
  
  # 解析响应 - 检查 content 和 reasoning_content
  CONTENT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['choices'][0]['message'].get('content',''))")
  REASONING=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['choices'][0].get('reasoning_content',''))")
  
  if [ -n "$CONTENT" ] || [ -n "$REASONING" ]; then
    SUCCESS=$((SUCCESS + 1))
    echo "✅ 状态: 成功 | 耗时: ${DURATION}ms"
    
    if [ -n "$CONTENT" ]; then
      echo "📝 content: ${CONTENT:0:100}"
    fi
    if [ -n "$REASONING" ]; then
      echo "🧠 reasoning_content: ${REASONING:0:150]}..."
    fi
  else
    echo "❌ 状态: 失败 | 耗时: ${DURATION}ms"
  fi
  
  echo ""
  # 间隔 2.5 秒避免 rate limit
  [ $i -lt 10 ] && sleep 2.5
done

echo "===== 📊 统计结果 ====="
echo "✅ 有效响应: $SUCCESS/10"
echo "⏱️  平均耗时: $((TOTAL_TIME / 10))ms"
echo "🟢 可用率: $((SUCCESS * 100 / 10))%"
