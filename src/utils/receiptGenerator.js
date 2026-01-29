import { jsPDF } from "jspdf";

const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
};

export const generateReceipt = async (donation, user) => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a5" // A5 size is good for receipts
    });

    // Load Logo
    try {
        const logo = await loadImage("/images/logo/logo.png");
        // Add logo at top left, adjust dimensions as needed
        // x=10, y=5, width=25, height=auto (maintain aspect ratio)
        const logoWidth = 25;
        const logoHeight = (logo.height * logoWidth) / logo.width;
        doc.addImage(logo, "PNG", 15, 10, logoWidth, logoHeight);
    } catch (err) {
        console.warn("Failed to load logo:", err);
        // Continue without logo if fails
    }

    // Colors
    const primaryColor = "#3B82F6"; // Blue-500
    const secondaryColor = "#1E40AF"; // Blue-800
    const grayColor = "#6B7280";

    // Organization Details
    doc.setFontSize(22);
    doc.setTextColor(secondaryColor);
    doc.setFont("helvetica", "bold");
    // Shift title slightly right if needed, but center align at 115 might balance with logo
    doc.text("HARUM CARE INDONESIA", 115, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(grayColor);
    doc.setFont("helvetica", "normal");
    doc.text("Jl. Pakuncen No. 1, Desa Sukaharja, Telukjambe Timur, Kabupaten Karawang", 115, 26, { align: "center" });
    doc.text("Email: harumcare@gmail.com | Website: www.harumcare.com", 115, 30, { align: "center" });

    // Line Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 35, 200, 35);

    // Receipt Title
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("KWITANSI DONASI", 105, 45, { align: "center" });

    // Receipt Details Box
    doc.setFillColor(243, 244, 246); // Gray-100
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(10, 50, 190, 80, 3, 3, 'FD');

    // Details Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const leftX = 20;
    const valueX = 70;
    let currentY = 65;
    const lineHeight = 10;

    // No. Transaksi
    doc.text("No. Referensi", leftX, currentY);
    doc.text(":", 65, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(donation.transactionId || "-", valueX, currentY);
    doc.setFont("helvetica", "normal");
    currentY += lineHeight;

    // Tanggal
    doc.text("Tanggal", leftX, currentY);
    doc.text(":", 65, currentY);
    const date = new Date(donation.createdAt || new Date()).toLocaleDateString("id-ID", {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    doc.text(date, valueX, currentY);
    currentY += lineHeight;

    // Donatur
    doc.text("Diterima Dari", leftX, currentY);
    doc.text(":", 65, currentY);
    doc.text(donation.donorName || (donation.isAnonymous ? "Hamba Allah" : user?.nama || "-"), valueX, currentY);
    currentY += lineHeight;

    // Metode Pembayaran
    doc.text("Metode Pembayaran", leftX, currentY);
    doc.text(":", 65, currentY);
    const paymentMethodMap = {
        "bank_transfer": "Transfer Bank",
        "e_wallet": "E-Wallet",
        "credit_card": "Kartu Kredit",
        "qris": "QRIS"
    };
    const paymentMethodText = paymentMethodMap[donation.paymentMethod] || donation.paymentMethod || "-";
    doc.text(paymentMethodText, valueX, currentY);
    currentY += lineHeight;

    // Campaign
    doc.text("Untuk Program", leftX, currentY);
    doc.text(":", 65, currentY);

    // Handle long campaign titles
    const campaignTitle = donation.campaignId?.title || donation.campaign?.title || "-";
    const splitTitle = doc.splitTextToSize(campaignTitle, 120);
    doc.text(splitTitle, valueX, currentY);
    currentY += (splitTitle.length * 6) + 4; // Adjust spacing based on lines

    // Jumlah Donasi
    doc.text("Jumlah Donasi", leftX, currentY);
    doc.text(":", 65, currentY);

    const formattedAmount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(donation.amount);

    doc.setFontSize(14);
    doc.setTextColor(secondaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(formattedAmount, valueX, currentY);

    // Status Stamp
    const status = donation.paymentStatus === "completed" ? "LUNAS" : "PENDING";
    const stampColor = donation.paymentStatus === "completed" ? "#10B981" : "#F59E0B"; // Green or Amber

    doc.setDrawColor(stampColor);
    doc.setTextColor(stampColor);
    doc.setLineWidth(1);
    doc.setFontSize(20);

    // Simplified stamp (just text, rotated)
    doc.text(status, 170, 90, { align: "center", angle: -15 });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(grayColor);
    doc.setFont("helvetica", "normal");
    doc.text("Terima kasih atas kepedulian dan donasi Anda.", 105, 138, { align: "center" });
    doc.text("Bukti donasi ini adalah sah dan diterbitkan secara otomatis oleh sistem.", 105, 142, { align: "center" });

    // Save PDF
    doc.save(`Kwitansi-${donation.transactionId || 'donation'}.pdf`);
};
