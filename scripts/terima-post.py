import http.server, sys, urllib.parse
OUT = sys.argv[1]
class H(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        n = int(self.headers.get('Content-Length', 0)); body = self.rfile.read(n)
        open(OUT, 'wb').write(body)
        self.send_response(200); self.send_header('Content-Type', 'text/plain'); self.end_headers(); self.wfile.write(b'ok ' + str(n).encode())
    def log_message(self, *a): pass
http.server.HTTPServer(('127.0.0.1', 8765), H).handle_request()
