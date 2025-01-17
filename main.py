from flask import Flask, request, send_file, jsonify
import pdfkit
import arabic_reshaper
from bidi.algorithm import get_display
import os
import tempfile
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import io
import webbrowser

app = Flask(__name__)
app.static_folder = '.'
app.static_url_path = ''

# Register Arabic fonts
FONTS_DIR = os.path.join(os.path.dirname(__file__), 'fonts')
os.makedirs(FONTS_DIR, exist_ok=True)

# TODO: Download and register Arabic fonts (Amiri, Cairo, Tajawal)

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    try:
        data = request.json
        
        # Create PDF using ReportLab
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer)
        
        # Set up the canvas
        c.setPageSize((842, 595))  # A4 Landscape
        
        # Draw border
        c.setStrokeColorRGB(*hex_to_rgb(data['borderColor']))
        c.rect(50, 50, 742, 495)
        
        # Set font and color
        c.setFillColorRGB(*hex_to_rgb(data['textColor']))
        
        # Add title
        title = get_display(arabic_reshaper.reshape("شهادة إتمام"))
        c.drawCentredString(421, 500, title)
        
        # Add content
        name = get_display(arabic_reshaper.reshape(f"الاسم: {data['name']}"))
        course = get_display(arabic_reshaper.reshape(f"الدورة: {data['course']}"))
        date = get_display(arabic_reshaper.reshape(f"التاريخ: {data['date']}"))
        
        c.drawString(600, 400, name)
        c.drawString(600, 350, course)
        c.drawString(600, 300, date)
        
        # TODO: Add background image based on data['background']
        # TODO: Add decoration based on data['decoration']
        
        c.save()
        
        buffer.seek(0)
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"certificate_{data['name']}.pdf",
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16)/255 for i in (0, 2, 4))

def run_server(port=8080):
    webbrowser.open(f'http://localhost:{port}')
    app.run(port=port)

if __name__ == "__main__":
    run_server()
