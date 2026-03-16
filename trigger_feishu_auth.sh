#!/bin/bash
# 尝试触发飞书OAuth认证，使用FORCE_QR_URL环境变量
FORCE_QR_URL=1 \
OPENCLAW_LARK_VERBOSE=1 \
npm exec -y @larksuite/openclaw-lark-tools install 2>&1 | tee /tmp/feishu_auth.log
