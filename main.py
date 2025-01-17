from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import webbrowser

class CertificateHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, CertificateHandler)
    print(f"Server running on port {port}")
    try:
        webbrowser.open(f'http://localhost:{port}/index.html')
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
