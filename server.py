import http.server
import socketserver
import json
import sqlite3
import os
import webbrowser
from threading import Timer

PORT = 8000
DB_FILE = "todos.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            desc TEXT,
            completed INTEGER NOT NULL,
            createdAt TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

class TodoRequestHandler(http.server.SimpleHTTPRequestHandler):
    
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/todos':
            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute('SELECT * FROM todos ORDER BY createdAt DESC')
            rows = c.fetchall()
            conn.close()

            todos = []
            for row in rows:
                todos.append({
                    "id": row[0],
                    "title": row[1],
                    "date": row[2],
                    "desc": row[3],
                    "completed": bool(row[4]),
                    "createdAt": row[5]
                })
            
            self._set_headers()
            self.wfile.write(json.dumps(todos).encode('utf-8'))
        else:
            # Fallback to serving static files (index.html, style.css, script.js)
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/todos':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            todo = json.loads(post_data.decode('utf-8'))

            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute('''
                INSERT INTO todos (id, title, date, desc, completed, createdAt) 
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (todo['id'], todo['title'], todo['date'], todo.get('desc', ''), int(todo.get('completed', False)), todo['createdAt']))
            conn.commit()
            conn.close()

            self._set_headers(201)
            self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
        else:
            self.send_error(404, "Endpoint not found")

    def do_PUT(self):
        if self.path == '/api/todos':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            todo = json.loads(post_data.decode('utf-8'))

            conn = sqlite3.connect(DB_FILE)
            c = conn.cursor()
            c.execute('''
                UPDATE todos 
                SET title = ?, date = ?, desc = ?, completed = ?
                WHERE id = ?
            ''', (todo['title'], todo['date'], todo.get('desc', ''), int(todo['completed']), todo['id']))
            conn.commit()
            conn.close()

            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
        else:
            self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        if self.path.startswith('/api/todos'):
            # Basic parsing of query parameter like /api/todos?id=123
            if '?id=' in self.path:
                todo_id = self.path.split('?id=')[1]
                
                conn = sqlite3.connect(DB_FILE)
                c = conn.cursor()
                c.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
                conn.commit()
                conn.close()

                self._set_headers(200)
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            else:
                self.send_error(400, "Missing ID")
        else:
            self.send_error(404, "Endpoint not found")

def open_browser():
    webbrowser.open_new(f'http://localhost:{PORT}/')

if __name__ == "__main__":
    init_db()
    with socketserver.TCPServer(("", PORT), TodoRequestHandler) as httpd:
        print(f"Serving at port {PORT}")
        # Open browser automatically after 1 second
        Timer(1.0, open_browser).start()
        httpd.serve_forever()
