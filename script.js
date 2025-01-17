window.onload = function () {
    const form = document.getElementById('certificateForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const course = document.getElementById('course').value;
        const fontColor = document.getElementById('fontColor').value;

        const backgroundFile = document.getElementById('background').files[0];
        const logoFile = document.getElementById('logo').files[0];
        const signatureFile = document.getElementById('signature').files[0];

        console.log("جارٍ إنشاء الشهادة...");

        try {
            await createCertificate(name, date, course, fontColor, backgroundFile, logoFile, signatureFile);
            console.log("تم إنشاء الشهادة بنجاح!");
        } catch (error) {
            console.error("حدث خطأ أثناء إنشاء الشهادة:", error);
        }
    });

    async function createCertificate(name, date, course, fontColor, backgroundFile, logoFile, signatureFile) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        console.log("جارٍ تحميل الصور...");

        // إضافة خلفية (إذا تم رفعها أو استخدام افتراضية)
        const background = backgroundFile ? await loadImage(backgroundFile) : await loadImage("default-background.jpg");
        console.log("الخلفية:", background);
        doc.addImage(background, "JPEG", 0, 0, 297, 210);

        // إضافة شعار (إذا تم رفعه أو استخدام افتراضي)
        const logo = logoFile ? await loadImage(logoFile) : await loadImage("default-logo.png");
        console.log("الشعار:", logo);
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
        const signature = signatureFile ? await loadImage(signatureFile) : await loadImage("default-signature.png");
        console.log("التوقيع:", signature);
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

        console.log("جارٍ حفظ الملف...");
        doc.save(`شهادة_${name}.pdf`);
    }

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
                img.onload = () => resolve(img);
                img.onerror = (error) => reject(error);
            };
            if (file) {
                reader.readAsDataURL(file);
            } else {
                img.src = file;
                img.onload = () => resolve(img);
                img.onerror = (error) => reject(error);
            }
        });
    }
};
