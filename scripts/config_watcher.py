#!/usr/bin/env python3
import json
import os
import time
import sys

config_path = "/root/private_data/openclaw/.openclaw/openclaw.json"
target = {
    "channels": {
        "telegram": {"token": "8751974098:AAFQalc8hNS6pkGYW9VLNR9JiwxwD5CCojc", "enabled": True},
        "wecom": {"botId": "aibLTKNW7wbhChezbB8q3IpPiiDG7xJhacG", "secret": "CdtQ6G866xweeaW4Pnsm9pwiea7twWXbGPlFmmgkYiH", "enabled": True}
    },
    "plugins": {"allow": ["feishu", "openclaw-wechat", "wecom-openclaw-plugin"]}
}

while True:
    try:
        with open(config_path) as f:
            current = json.load(f)
        
        modified = False
        if "channels" not in current:
            current["channels"] = {}
            modified = True
        
        for k, v in target["channels"].items():
            if k not in current["channels"]:
                current["channels"][k] = v
                modified = True
        
        if "plugins" not in current:
            current["plugins"] = target["plugins"]
            modified = True
        
        if modified:
            with open(config_path, "w") as f:
                json.dump(current, f, indent=2)
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] 配置已恢复")
    except Exception as e:
        print(f"Error: {e}")
    
    time.sleep(30)
