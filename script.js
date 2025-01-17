window.onload = function () {
    const form = document.getElementById('certificateForm');
    const canvas = document.getElementById('certificatePreview');
    const ctx = canvas.getContext('2d');

    // Load Arabic fonts
    const fontFaces = [
        new FontFace('Amiri', 'url(https://fonts.gstatic.com/s/amiri/v17/J7aRnpd8CGxBHpUrtLMA7w.woff2)'),
        new FontFace('Cairo', 'url(https://fonts.gstatic.com/s/cairo/v10/SLXLc1nY6Hkvalrub46O.woff2)'),
        new FontFace('Tajawal', 'url(https://fonts.gstatic.com/s/tajawal/v3/Iura6YBj_oCad4k1l8KiHrFHDQ.woff2)')
    ];

    Promise.all(fontFaces.map(font => font.load())).then(fonts => {
        fonts.forEach(font => document.fonts.add(font));
    });

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Function to update preview
    function updatePreview() {
        const name = document.getElementById('name').value || 'اسم المتدرب';
        const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
        const course = document.getElementById('course').value || 'اسم الدورة';
        const background = document.getElementById('background').value;
        const decoration = document.getElementById('decoration').value;
        const fontFamily = document.getElementById('fontFamily').value;
        const textColor = document.getElementById('textColor').value;
        const borderColor = document.getElementById('borderColor').value;

        // Clear canvas
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        // Add title
        ctx.font = `bold 36px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = textColor;
        ctx.fillText('شهادة إتمام', canvas.width / 2, 100);

        // Add content
        ctx.font = `24px ${fontFamily}`;
        ctx.textAlign = 'right';
        ctx.fillText(`الاسم: ${name}`, canvas.width - 100, 200);
        ctx.fillText(`الدورة: ${course}`, canvas.width - 100, 250);
        ctx.fillText(`التاريخ: ${date}`, canvas.width - 100, 300);
    }

    // Update preview on form changes
    form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Initial preview
    updatePreview();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const course = document.getElementById('course').value;
        const background = document.getElementById('background').value;
        const decoration = document.getElementById('decoration').value;

        console.log("جارٍ إنشاء الشهادة...");

        try {
            await createCertificate(name, date, course, background, decoration);
            console.log("تم إنشاء الشهادة بنجاح!");
        } catch (error) {
            console.error("حدث خطأ أثناء إنشاء الشهادة:", error);
        }
    });

    async function createCertificate(name, date, course, background, decoration) {
        try {
            const response = await fetch('/generate_pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    date,
                    course,
                    background,
                    decoration,
                    fontFamily: document.getElementById('fontFamily').value,
                    textColor: document.getElementById('textColor').value,
                    borderColor: document.getElementById('borderColor').value
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `شهادة_${name}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ أثناء إنشاء الشهادة');
        }
    }
};
