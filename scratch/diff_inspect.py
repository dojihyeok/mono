import subprocess
import json
import re

def get_file_content_from_commit(commit, filepath):
    cmd = f'git show {commit}:"{filepath}"'
    proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate()
    if proc.returncode != 0:
        raise Exception(f"Failed to get file from git: {stderr.decode('utf-8', errors='ignore')}")
    return stdout.decode('utf-8', errors='ignore')

def extract_template(html):
    match = re.search(r'<script[^>]*type="__bundler/template"[^>]*>([\s\S]*?)</script>', html, re.IGNORECASE)
    if not match:
        raise Exception("Template not found")
    return match.group(1).strip()

filepath = "new mono/MoNo 사용자 앱.html"
try:
    content_old = get_file_content_from_commit("9ca32d8", filepath)
    content_new = get_file_content_from_commit("81f5e9d", filepath)
    
    t_old_raw = extract_template(content_old)
    t_new_raw = extract_template(content_new)
    
    # Search for "12.3" in the raw template string
    idx_old = t_old_raw.find("12.3")
    idx_new = t_new_raw.find("12.3")
    
    print("--- RAW TEMPLATE STRINGS ---")
    if idx_old != -1:
        print("Old raw around 12.3:", repr(t_old_raw[idx_old-30:idx_old+30]))
    else:
        print("12.3 not found in old raw")
        
    if idx_new != -1:
        print("New raw around 12.3:", repr(t_new_raw[idx_new-30:idx_new+30]))
    else:
        print("12.3 not found in new raw")
        
    # Now parse both and search in the parsed string
    parsed_old = json.loads(t_old_raw)
    parsed_new = json.loads(t_new_raw)
    
    idx_old_p = parsed_old.find("12.3")
    idx_new_p = parsed_new.find("12.3")
    
    print("\n--- PARSED TEMPLATE STRINGS ---")
    if idx_old_p != -1:
        print("Old parsed around 12.3:", repr(parsed_old[idx_old_p-30:idx_old_p+30]))
    else:
        print("12.3 not found in old parsed")
        
    if idx_new_p != -1:
        print("New parsed around 12.3:", repr(parsed_new[idx_new_p-30:idx_new_p+30]))
    else:
        print("12.3 not found in new parsed")
        
except Exception as e:
    print("Error:", e)
