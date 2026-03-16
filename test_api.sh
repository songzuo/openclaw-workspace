#!/bin/bash
URL="https://code.coolyeah.net/v1/chat/completions"
KEY="sk-0LNe1uYzhRRlivkafdn9vSnpl873SVPqXAVUdQU5CyvVmQib"

echo "===== API 测试 (glm-5) ====="
echo ""

for i in {1..10}; do
  echo "--- 第 $i 次 ---"
  START=$(date +%s%3N)
  
  RESPONSE=$(curl -s -X POST "$URL" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d '{"model": "glm-5", "messages": [{"role": "user", "content": "你好"}], "max_tokens": 20}' \
    --connect-timeout 10 --max-time 30 2>&1)
  
  END=$(date +%s%3N)
  DURATION=$((END - START))
  
  if echo "$RESPONSE" | jq -e '.choices[0].message.content' > /dev/null 2>&1; then
    CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content' 2>/dev/null)
    REASONING=$(echo "$RESPONSE" | jq -r '.choices[0].message.reasoning_content' 2>/dev/null | head -c 100)
    echo "✅ 成功 | 耗时: ${DURATION}ms | 内容: ${CONTENT:0:30}"
    if [ -n "$REASONING" ]; then
      echo "   推理: ${REASONING}..."
    fi
  else
    ERROR=$(echo "$RESPONSE" | jq -r '.error.message // .error // "未知错误"' 2>/dev/null)
    echo "❌ 失败 | 耗时: ${DURATION}ms | 错误: ${ERROR:0:50}"
  fi
  echo ""
done

echo "===== 统计 ====="
