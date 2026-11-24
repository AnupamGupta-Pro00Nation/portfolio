from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import sys
import socket

class NoCacheHTTPRequestHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
    }

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    lan_ip = get_lan_ip()
    httpd = ThreadingHTTPServer(('0.0.0.0', port), NoCacheHTTPRequestHandler)
    httpd.daemon_threads = True
    print("=" * 60)
    print(f" MULTITHREADED PORTFOLIO SERVER RUNNING")
    print(f" * Local:   http://localhost:{port}")
    print(f" * Network: http://{lan_ip}:{port} (friends on same Wi-Fi/LAN)")
    print("=" * 60)
    httpd.serve_forever()
