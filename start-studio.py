#!/usr/bin/env python3
"""Launch Remotion Studio on port 3001, daemonised via double-fork so it
survives the parent shell exiting (macOS has no `setsid`). Port 3000 is held by
the Concept Sector (investing-video) studio.

  python3 start-studio.py        # start
  cat studio.log                 # watch output
  kill $(cat studio.pid)         # stop
"""
import os
import sys
import subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = sys.argv[1] if len(sys.argv) > 1 else "3001"

# First fork
if os.fork() > 0:
    sys.exit(0)
os.chdir(ROOT)
os.setsid()
# Second fork → PPID becomes 1 (init), fully detached
if os.fork() > 0:
    sys.exit(0)

log = open(os.path.join(ROOT, "studio.log"), "ab", buffering=0)
proc = subprocess.Popen(
    ["npx", "remotion", "studio", "--port", PORT],
    cwd=ROOT,
    stdout=log,
    stderr=log,
    stdin=subprocess.DEVNULL,
)
with open(os.path.join(ROOT, "studio.pid"), "w") as f:
    f.write(str(proc.pid))
proc.wait()
