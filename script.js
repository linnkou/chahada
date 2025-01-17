window.onload = function () {
    const form = document.getElementById('certificateForm');
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');

    // ملفات Base64
    const arabicFontBase64 = "BASE64_DATA_FOR_Amiri-Regular.ttf"; // استبدل ببيانات Base64 للخط
    const defaultBackgroundBase64 = "BASE64_DATA_FOR_default-background.jpg"; // استبدل ببيانات Base64 للخلفية
    const defaultLogoBase64 = "BASE64_DATA_FOR_default-logo.png"; // استبدل ببيانات Base64 للشعار
    const defaultSignatureBase64 = "BASE64_DATA_FOR_default-signature.png"; // استبدل ببيانات Base64 للتوقيع

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const course = document.getElementById('course').value;
        const fontColor = document.getElementById('fontColor').value;

        const backgroundFile = document.getElementById('background').files[0];
        const logoFile = document.getElementById('logo').files[0];
        const signatureFile = document.getElementById('signature').files[0];

        // إنشاء الشهادة
        await createCertificate(name, date, course, fontColor, backgroundFile, logoFile, signatureFile);
    });

    async function createCertificate(name, date, course, fontColor, backgroundFile, logoFile, signatureFile) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        // إضافة خط عربي
        doc.addFileToVFS("Amiri-Regular.ttf", arabicFontBase64);
        doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
        doc.setFont("Amiri"); // تعيين الخط العربي

        // إضافة خلفية (إذا تم رفعها أو استخدام افتراضية)
        const background = backgroundFile ? await loadImage(backgroundFile) : await loadBase64Image(defaultBackgroundBase64);
        doc.addImage(background, "JPEG", 0, 0, 297, 210);

        // إضافة شعار (إذا تم رفعه أو استخدام افتراضي)
        const logo = logoFile ? await loadImage(logoFile) : await loadBase64Image(defaultLogoBase64);
        doc.addImage(logo, "PNG", 20, 20, 50, 50);

        // إضافة نص الشهادة
        doc.setFontSize(28);
        doc.setTextColor(fontColor);
        doc.text("شهادة إتمام الدورة", 148, 50, { align: 'center' });

        doc.setFontSize(18);
        doc.setTextColor(fontColor);
        doc.text(`تم منح هذه الشهادة إلى: ${name}`, 40, 90);
        doc.text(`لإتمام دورة: ${course}`, 40, 110);
        doc.text(`بتاريخ: ${date}`, 40, 130);

        // إضافة توقيع (إذا تم رفعه أو استخدام افتراضي)
        const signature = signatureFile ? await loadImage(signatureFile) : await loadBase64Image(defaultSignatureBase64);
        doc.addImage(signature, "PNG", 200, 150, 70, 30);

        // إضافة رمز QR
        const qrCodeData = `الاسم: ${name}\nالدورة: ${course}\nالتاريخ: ${date}`;
        const qrCode = new QRCode(document.createElement("div"), {
            text: qrCodeData,
            width: 50,
            height: 50,
        });
        doc.addImage(qrCode._el.firstChild, "PNG", 240, 20, 30, 30);

        // إطار زخرفي
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(1);
        doc.rect(10, 10, 277, 190);

        // عرض معاينة
        const pdfData = doc.output('datauristring');
        const pdfImage = new Image();
        pdfImage.src = pdfData;
        pdfImage.onload = () => {
            canvas.width = pdfImage.width;
            canvas.height = pdfImage.height;
            ctx.drawImage(pdfImage, 0, 0);
        };

        // حفظ الملف
        doc.save(`شهادة_${name}.pdf`);
    }

    function loadImage(file) {
        return new Promise((resolve) => {
            const img = new Image();
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
                img.onload = () => resolve(img);
            };
            if (file) {
                reader.readAsDataURL(file);
            } else {
                img.src = file;
                img.onload = () => resolve(img);
            }
        });
    }

    function loadBase64Image(base64) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = `data:image/png;base64,${base64}`;
            img.onload = () => resolve(img);
        });
    }
};
