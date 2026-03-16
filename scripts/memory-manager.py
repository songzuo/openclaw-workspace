#!/usr/bin/env python3
"""
记忆管理系统 - 借鉴 mem9 设计理念
"""
import os, sys, json, re
from datetime import datetime
from pathlib import Path

WORKSPACE = "/root/private_data/openclaw/workspace"
MEMORY_DIR = f"{WORKSPACE}/memory"
MEMORY_INDEX = f"{MEMORY_DIR}/index.json"
MAIN_MEMORY = f"{WORKSPACE}/MEMORY.md"

def load_index():
    if os.path.exists(MEMORY_INDEX):
        with open(MEMORY_INDEX) as f:
            return json.load(f)
    return {"memories": {}, "keywords": {}}

def save_index(index):
    with open(MEMORY_INDEX, 'w') as f:
        json.dump(index, f, indent=2, ensure_ascii=False)

def add_keyword(index, key, content):
    # 英文
    for w in re.findall(r'[a-zA-Z]{4,}', content.lower()):
        if w not in index["keywords"]: index["keywords"][w] = []
        if key not in index["keywords"][w]: index["keywords"][w].append(key)
    # 中文
    for w in re.findall(r'[\u4e00-\u9fa5]{2,}', content):
        if w not in index["keywords"]: index["keywords"][w] = []
        if key not in index["keywords"][w]: index["keywords"][w].append(key)

def cmd_store(content):
    index = load_index()
    # 生成key
    base = content[:30].strip()
    slug = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fa5]', '_', base)
    slug = re.sub(r'_+', '_', slug).strip('_')[:30]
    if not slug: slug = "memory_" + str(len(index["memories"]))
    
    memory = {
        "key": slug, "content": content, "tags": [],
        "created": datetime.now().isoformat(), "version": 1
    }
    if slug in index["memories"]:
        memory["version"] = index["memories"][slug].get("version", 0) + 1
    
    index["memories"][slug] = memory
    add_keyword(index, slug, content)
    save_index(index)
    print(f"✅ Stored: {slug}")

def cmd_search(query):
    index = load_index()
    # 提取查询词
    query_words = set(re.findall(r'[\u4e00-\u9fa5]{2,}', query))
    query_words.update(re.findall(r'[a-zA-Z]{4,}', query.lower()))
    
    matched = set()
    for word in query_words:
        for kw, keys in index["keywords"].items():
            if word in kw or kw in word:
                matched.update(keys)
    
    results = []
    for key in matched:
        mem = index["memories"].get(key, {})
        results.append({"key": key, "content": mem.get("content", ""), "tags": mem.get("tags", [])})
    
    print(f"🔍 找到 {len(results)} 条结果:")
    for r in results[:5]:
        print(f"  - {r['key']}: {r['content'][:60]}...")

def cmd_get(key):
    index = load_index()
    mem = index["memories"].get(key)
    if mem:
        print(f"📄 {key}:\n{mem['content']}")
    else:
        print(f"❌ 未找到: {key}")

def cmd_list():
    index = load_index()
    print(f"📚 共 {len(index['memories'])} 条记忆:")
    for k, v in list(index["memories"].items())[:10]:
        print(f"  - {k}: {v['content'][:40]}...")

def main():
    os.makedirs(MEMORY_DIR, exist_ok=True)
    if len(sys.argv) < 2:
        print("用法: memory-manager.py <store|search|get|list> [参数]")
        return
    cmd = sys.argv[1]
    if cmd == "store": cmd_store(" ".join(sys.argv[2:]))
    elif cmd == "search": cmd_search(" ".join(sys.argv[2:]))
    elif cmd == "get": cmd_get(sys.argv[2] if len>2 else "")
    elif cmd == "list": cmd_list()
    else: print(f"未知命令: {cmd}")

if __name__ == "__main__": main()