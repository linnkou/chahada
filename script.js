window.onload = function () {
    const form = document.getElementById('certificateForm');
    const previewName = document.getElementById('previewName');
    const previewCourse = document.getElementById('previewCourse');
    const previewDate = document.getElementById('previewDate');
    const previewBackground = document.getElementById('previewBackground');
    const previewDecoration = document.getElementById('previewDecoration');
    const downloadButton = document.getElementById('downloadButton');

    let currentCertificateData = null; // لتخزين بيانات الشهادة الحالية

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const course = document.getElementById('course').value;
        const backgroundType = document.getElementById('background').value;
        const decorationType = document.getElementById('decoration').value;

        // تحديث المعاينة
        previewName.textContent = name;
        previewCourse.textContent = course;
        previewDate.textContent = date;

        // تعيين الزخرفة
        switch (decorationType) {
            case "star":
                previewDecoration.className = "fas fa-star";
                break;
            case "trophy":
                previewDecoration.className = "fas fa-trophy";
                break;
            case "certificate":
                previewDecoration.className = "fas fa-certificate";
                break;
            case "medal":
                previewDecoration.className = "fas fa-medal";
                break;
            case "award":
                previewDecoration.className = "fas fa-award";
                break;
            case "ribbon":
                previewDecoration.className = "fas fa-ribbon";
                break;
        }

        // تعيين الخلفية
        let backgroundUrl;
        switch (backgroundType) {
            case "nature":
                backgroundUrl = "https://source.unsplash.com/800x600/?nature";
                break;
            case "gradient":
                backgroundUrl = "https://source.unsplash.com/800x600/?gradient";
                break;
            case "abstract":
                backgroundUrl = "https://source.unsplash.com/800x600/?abstract";
                break;
            case "architecture":
                backgroundUrl = "https://source.unsplash.com/800x600/?architecture";
                break;
            case "technology":
                backgroundUrl = "https://source.unsplash.com/800x600/?technology";
                break;
            case "art":
                backgroundUrl = "https://source.unsplash.com/800x600/?art";
                break;
        }
        previewBackground.src = backgroundUrl;

        // تخزين بيانات الشهادة الحالية
        currentCertificateData = { name, date, course, backgroundUrl, decorationType };

        // إظهار زر التحميل
        downloadButton.style.display = "block";
    });

    // حدث النقر على زر التحميل
    downloadButton.addEventListener('click', async function () {
        if (currentCertificateData) {
            const { name, date, course, backgroundUrl, decorationType } = currentCertificateData;
            await createCertificate(name, date, course, backgroundUrl, decorationType);
        }
    });

    async function createCertificate(name, date, course, backgroundUrl, decorationType) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        // إضافة خلفية
        const background = await loadImage(backgroundUrl);
        doc.addImage(background, "JPEG", 0, 0, 297, 210);

        // إضافة نص الشهادة
        doc.setFontSize(28);
        doc.setTextColor("#000000");
        doc.text("شهادة إتمام الدورة", 148, 50, { align: 'center' });

        doc.setFontSize(18);
        doc.text(`تم منح هذه الشهادة إلى: ${name}`, 40, 90);
        doc.text(`لإتمام دورة: ${course}`, 40, 110);
        doc.text(`بتاريخ: ${date}`, 40, 130);

        // إضافة الزخرفة
        const decorationIcon = await loadDecoration(decorationType);
        doc.addImage(decorationIcon, "PNG", 240, 20, 30, 30);

        // إطار زخرفي
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(1);
        doc.rect(10, 10, 277, 190);

        // حفظ الملف
        doc.save(`شهادة_${name}.pdf`);
    }

    function loadImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(img);
        });
    }

    function loadDecoration(decorationType) {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 100;
            canvas.height = 100;

            const icon = new Image();
            switch (decorationType) {
                case "star":
                    icon.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/star.svg";
                    break;
                case "trophy":
                    icon.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/trophy.svg";
                    break;
                case "certificate":
                    icon.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/certificate.svg";
                    break;
                case "medal":
                    icon.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/medal.svg";
                    break;
                case "award":
                    icon.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/award.svg";
                    break;
                case "ribbon":
                    icon.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/ribbon.svg";
                    break;
            }
            icon.onload = () => {
                ctx.drawImage(icon, 0, 0, 100, 100);
                resolve(canvas.toDataURL());
            };
        });
    }
};
