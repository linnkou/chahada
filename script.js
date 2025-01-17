window.onload = function () {
    const form = document.getElementById('certificateForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const course = document.getElementById('course').value;

        const backgroundFile = document.getElementById('background').files[0];
        const logoFile = document.getElementById('logo').files[0];
        const signatureFile = document.getElementById('signature').files[0];

        createCertificate(name, date, course, backgroundFile, logoFile, signatureFile);
    });
};

async function createCertificate(name, date, course, backgroundFile, logoFile, signatureFile) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    // إضافة خلفية (إذا تم رفعها)
    if (backgroundFile) {
        const background = await loadImage(backgroundFile);
        doc.addImage(background, "JPEG", 0, 0, 297, 210); // A4 size in mm (landscape)
    }

    // إضافة شعار (إذا تم رفعه)
    if (logoFile) {
        const logo = await loadImage(logoFile);
        doc.addImage(logo, "PNG", 20, 20, 50, 50);
    }

    // إضافة نص الشهادة
    doc.setFontSize(28);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("شهادة إتمام الدورة", 148, 50, { align: 'center' });

    doc.setFontSize(18);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`تم منح هذه الشهادة إلى: ${name}`, 40, 90);
    doc.text(`لإتمام دورة: ${course}`, 40, 110);
    doc.text(`بتاريخ: ${date}`, 40, 130);

    // إضافة توقيع (إذا تم رفعه)
    if (signatureFile) {
        const signature = await loadImage(signatureFile);
        doc.addImage(signature, "PNG", 200, 150, 70, 30);
    }

    // إطار زخرفي
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(1);
    doc.rect(10, 10, 277, 190); // إطار خارجي

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
        reader.readAsDataURL(file);
    });
}
