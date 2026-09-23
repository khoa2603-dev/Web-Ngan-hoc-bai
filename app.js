/**
 * Hệ thống Ôn tập Hóa học Phân tích - Chương 1 đến 4
 * Chuẩn 4 File PDF Bài giảng & Chuyên đề 100% Bài tập tính toán
 * Dành riêng cho bé Ngân
 * Tác giả: Khoa & AI Assistant
 */

// ==========================================
// 1. ÂM THANH HIỆU ỨNG (WEB AUDIO API SYNTHESIZER)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('chem_sound_muted') === 'true';
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type, duration, gainVal = 0.12) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  playCorrect() {
    if (this.muted) return;
    this.playTone(523.25, 'sine', 0.15, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.25, 0.18), 100); // E5
  }

  playWrong() {
    if (this.muted) return;
    this.playTone(311.13, 'triangle', 0.2, 0.14); // Eb4
    setTimeout(() => this.playTone(261.63, 'triangle', 0.25, 0.14), 110); // C4
  }

  playClick() {
    if (this.muted) return;
    this.playTone(800, 'sine', 0.05, 0.04);
  }

  playFanfare() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.35, 0.2), idx * 120);
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('chem_sound_muted', this.muted);
    return this.muted;
  }
}

const sound = new SoundFX();

// ==========================================
// 2. RENDER LATEX & CHEMICAL EQUATIONS (KATEX & MHCHEM)
// ==========================================
function renderMath(element) {
  const target = element || document.body;
  if (window.renderMathInElement) {
    try {
      window.renderMathInElement(target, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option']
      });
    } catch (e) {
      console.warn('KaTeX render error:', e);
    }
  } else {
    setTimeout(() => {
      if (window.renderMathInElement) {
        renderMath(target);
      }
    }, 250);
  }
}

window.addEventListener('load', () => {
  renderMath();
});

document.addEventListener('DOMContentLoaded', () => {
  renderMath();
});

// ==========================================
// 3. HIỆU ỨNG PHÁO HOA CONFETTI (CANVAS)
// ==========================================
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#6366f1', '#ec4899', '#38bdf8', '#10b981', '#f59e0b', '#a855f7'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.35,
      r: Math.random() * 6 + 4,
      d: Math.random() * 90,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleInc: (Math.random() * 0.07) + 0.05,
      tiltAngle: 0,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      gravity: 0.35,
      alpha: 1
    });
  }

  let animationFrame;
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let remaining = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.tiltAngle += p.tiltAngleInc;
      p.alpha -= 0.007;

      if (p.alpha > 0) {
        remaining++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
        ctx.restore();
      }
    });

    if (remaining > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

// ==========================================
// 4. THƯ VIỆN CÂU HỎI CHUẨN (QUESTION BANK)
// Bao gồm: Lý thuyết + Chuyên đề 100% Bài tập tính toán chuẩn PDF
// ==========================================
const chLabels = { 1: 'Chương 1', 2: 'Chương 2', 3: 'Chương 3', 4: 'Chương 4' };
const typeLabels = {
  mcq: 'Trắc nghiệm',
  tf: 'Đúng / Sai',
  fill: 'Điền kết quả',
  drag: 'Kéo thả ghép nối',
  color: 'Nhận diện màu',
  short: 'Tự luận'
};
const typeIcons = {
  mcq: 'bx-radio-circle-marked',
  tf: 'bx-check-square',
  fill: 'bx-edit-alt',
  drag: 'bx-move',
  color: 'bx-palette',
  short: 'bx-notepad'
};

const QB = [
  // ==========================================
  // --- CHƯƠNG 1: ĐẠI CƯƠNG VỀ HÓA PHÂN TÍCH (PDF 1) ---
  // ==========================================
  {
    id: 'c1q01', ch: 1, type: 'mcq', isCalc: false, topic: 'Đối tượng nghiên cứu',
    prompt: 'Đối tượng nghiên cứu trọng tâm của <strong>Hóa học Phân tích</strong> (theo giáo trình) là phương pháp xác định:',
    opts: [
      'Chỉ cấu trúc không gian ba chiều của phân tử vô cơ',
      'Thành phần định tính và định lượng của các cấu tử trong đối tượng phân tích',
      'Nhiệt lượng tỏa ra hoặc thu vào trong các phản ứng tổng hợp',
      'Động học và vận tốc biến đổi của các chất khí'
    ],
    ans: 1,
    exp: 'Theo trang 2 PDF Chương 1: "Đối tượng: nghiên cứu phương pháp xác định thành phần định tính và định lượng của các cấu tử trong đối tượng phân tích".'
  },
  {
    id: 'c1q02', ch: 1, type: 'mcq', isCalc: false, topic: 'Phân tích định tính',
    prompt: 'Mục đích chính của <strong>Phân tích định tính (Qualitative analysis)</strong> là:',
    opts: [
      'Xác định chính xác hàm lượng phần trăm của từng chất trong mẫu',
      'Nhận biết sự có mặt của các cấu tử nào đó trong mẫu dựa vào tính chất hóa học hoặc vật lý đặc trưng',
      'Đo tỉ trọng và khối lượng riêng của dung dịch ở $20^\\circ\\text{C}$',
      'Tính toán sai số ngẫu nhiên của các phép đo thể tích'
    ],
    ans: 1,
    exp: 'Theo PDF Chương 1: Định tính nhằm nhận biết sự có mặt của cấu tử dựa vào tính chất hóa học hay vật lý đặc trưng (màu, mùi, dạng tinh thể, hiệu ứng vật lý...).'
  },
  {
    id: 'c1q03', ch: 1, type: 'mcq', isCalc: false, topic: 'Phân tích định lượng',
    prompt: 'Mục đích chính của <strong>Phân tích định lượng (Quantitative analysis)</strong> là:',
    opts: [
      'Xác định hàm lượng cấu tử nghiên cứu trong mẫu phân tích',
      'Chỉ nhận diện màu sắc đặc trưng của kết tủa sinh ra',
      'Khảo sát độ phân giải của máy quang phổ hấp thụ nguyên tử',
      'Xác định mùi và trạng thái tinh thể thô của hợp chất'
    ],
    ans: 0,
    exp: 'Theo PDF Chương 1: "Định lượng: xác định hàm lượng cấu tử nghiên cứu trong mẫu phân tích".'
  },
  {
    id: 'c1q04', ch: 1, type: 'tf', isCalc: false, topic: 'Vai trò ứng dụng',
    prompt: 'Hóa học phân tích chỉ có vai trò trong phòng thí nghiệm hóa học cơ bản, không có ứng dụng thiết thực trong y học, kiểm nghiệm dược phẩm hay môi trường.',
    ans: false,
    exp: 'Sai. PDF Chương 1 nhấn mạnh vai trò rộng lớn trong khoa học kỹ thuật (dược phẩm, y học, môi trường, sinh học...) và sản xuất công nghiệp.'
  },
  {
    id: 'c1q05', ch: 1, type: 'fill', isCalc: false, topic: 'Cấu tử đa lượng',
    prompt: '<strong>Cấu tử đa lượng</strong> có khoảng hàm lượng trong mẫu là: <strong>$\\%X = $ ______ đến $100\\%$</strong>. (Phương pháp áp dụng là phân tích hóa học)',
    ans: ['0.1', '0,1', '0.1%', '0,1%'],
    ansD: '0,1%',
    exp: 'Theo mục 1.2 PDF Chương 1: Cấu tử đa lượng có hàm lượng %X = 0,1 – 100% → Dùng phương pháp phân tích hóa học.'
  },
  {
    id: 'c1q06', ch: 1, type: 'fill', isCalc: false, topic: 'Cấu tử vết',
    prompt: '<strong>Cấu tử vết</strong> có khoảng hàm lượng trong mẫu là: <strong>$\\%X = $ ______ đến $0,01\\%$</strong>. (Phương pháp áp dụng là công cụ độ nhạy cao)',
    ans: ['10^-7', '10^-7%', '10^(-7)', '10^-7 %', '1e-7'],
    ansD: '$10^{-7}\\%$',
    exp: 'Theo mục 1.2 PDF Chương 1: Cấu tử vết có %X = 10^-7 – 0,01% → Dùng phương pháp công cụ độ nhạy cao.'
  },
  {
    id: 'c1q07', ch: 1, type: 'mcq', isCalc: false, topic: 'Hóa chất PA/AR',
    prompt: 'Hóa chất tinh khiết phân tích loại <strong>PA (Pro Analysi)</strong> hoặc <strong>AR (Analytical Reagent)</strong> có độ tinh khiết là:',
    opts: [
      '$90,0\\% \\le X \\le 95,0\\%$',
      '$95,0\\% \\le X \\le 98,5\\%$',
      '$99,90\\% \\le X \\le 99,99\\%$',
      '$99,9990\\% \\le X \\le 99,9999\\%$'
    ],
    ans: 2,
    exp: 'Theo mục 1.2 PDF Chương 1: Tinh khiết phân tích (PA; AR) quy định: 99,90% ≤ X ≤ 99,99%.'
  },
  {
    id: 'c1q08', ch: 1, type: 'tf', isCalc: false, topic: 'Hóa chất kỹ thuật',
    prompt: 'Không được dùng hóa chất kỹ thuật ($X \\le 99\\%$) trong hóa học phân tích vì:',
    ans: true,
    exp: 'Đúng. Theo trang 3 PDF Chương 1: "Chú ý: không dùng hóa chất kỹ thuật (X ≤ 99%)".'
  },
  {
    id: 'c1q09', ch: 1, type: 'drag', dk: 'order', isCalc: false, topic: 'Quy trình phân tích',
    prompt: 'Sắp xếp đúng thứ tự <strong>6 giai đoạn của một quy trình phân tích</strong>:',
    items: [
      'Xác định vấn đề',
      'Chọn phương pháp phân tích',
      'Lấy mẫu',
      'Xử lý mẫu',
      'Đo / định lượng',
      'Xử lý số liệu và trình bày kết quả'
    ],
    order: [
      'Xác định vấn đề',
      'Chọn phương pháp phân tích',
      'Lấy mẫu',
      'Xử lý mẫu',
      'Đo / định lượng',
      'Xử lý số liệu và trình bày kết quả'
    ],
    exp: 'Theo mục 1.2 PDF Chương 1: Xác định vấn đề → Chọn phương pháp phân tích → Lấy mẫu → Xử lý mẫu → Đo / định lượng → Xử lý số liệu và trình bày kết quả.'
  },
  {
    id: 'c1q10', ch: 1, type: 'drag', dk: 'match', isCalc: false, topic: 'Phân loại hàm lượng cấu tử',
    prompt: 'Ghép từng nhóm cấu tử với khoảng hàm lượng và phương pháp phân tích tương ứng:',
    pairs: [
      { l: 'Cấu tử đa lượng (%X = 0,1 – 100%)', r: 'Phương pháp phân tích hóa học' },
      { l: 'Cấu tử vi lượng (%X = 0,01 – 0,1%)', r: 'Phương pháp phân tích công cụ' },
      { l: 'Cấu tử vết (%X = 10⁻⁷ – 0,01%)', r: 'PP công cụ độ nhạy cao' },
      { l: 'Cấu tử siêu vết (%X < 10⁻⁷%)', r: 'PP công cụ độ nhạy rất cao' }
    ],
    exp: 'Theo bảng phân loại cấu tử ở trang 3 PDF Chương 1.'
  },
  {
    id: 'c1q11', ch: 1, type: 'short', isCalc: false, topic: 'Tóm tắt quy trình phân tích',
    prompt: 'Liệt kê 6 giai đoạn chuẩn của một quy trình phân tích theo giáo trình Hóa học Phân tích.',
    model: '1. Xác định vấn đề\n2. Chọn phương pháp phân tích\n3. Lấy mẫu\n4. Xử lý mẫu\n5. Đo / định lượng\n6. Xử lý số liệu và trình bày kết quả',
    exp: '6 giai đoạn quy trình phân tích chuẩn trang 3 PDF Chương 1.'
  },
  {
    id: 'c1calc01', ch: 1, type: 'mcq', isCalc: true, topic: 'Phân loại cấu tử theo hàm lượng (Slide)',
    prompt: 'Phân tích $5,0000\\text{ g}$ mẫu hợp kim thấy có chứa $0,0025\\text{ g}$ chì ($\\ce{Pb}$). Hàm lượng $\\%\\ce{Pb}$ trong mẫu là bao nhiêu và thuộc nhóm cấu tử nào?',
    opts: [
      '$0,050\\%$ – Cấu tử vi lượng (khoảng $0,01\\% - 0,1\\%$)',
      '$0,50\\%$ – Cấu tử đa lượng (khoảng $0,1\\% - 100\\%$)',
      '$0,005\\%$ – Cấu tử vết (khoảng $10^{-7}\\% - 0,01\\%$)',
      '$0,0005\\%$ – Cấu tử siêu vết ($< 10^{-7}\\%$)'
    ],
    ans: 0,
    exp: '$$\\%\\ce{Pb} = \\frac{0,0025}{5,0000} \\times 100\\% = 0,050\\%.$$ Đối chiếu bảng mục 1.2 slide PDF Chương 1: $\%X = 0,01 - 0,1\\%$ thuộc <strong>cấu tử vi lượng</strong> (áp dụng phương pháp phân tích công cụ).'
  },

  // ==========================================
  // --- CHƯƠNG 2: TÍNH TOÁN TRONG HÓA PHÂN TÍCH (PDF 2) ---
  // Lý thuyết + BÀI TẬP TÍNH TOÁN NỒNG ĐỘ
  // ==========================================
  {
    id: 'c2calc01', ch: 2, type: 'fill', isCalc: true, topic: 'Pha chế H2C2O4 (Ví dụ Slide)',
    prompt: 'Cần lấy bao nhiêu gam $\\ce{H2C2O4.2H2O}$ ($M = 126,06\\text{ g/mol}$) để điều chế $250\\text{ mL}$ dung dịch $\\ce{H2C2O4}$ nồng độ $0,025\\text{ M}$? (nhập kết quả lấy 4 chữ số thập phân)',
    ans: ['0.7879', '0,7879', '0.7879g', '0,7879g'],
    ansD: '$0,7879\\text{ g}$',
    exp: '$$m = C_M \\cdot M \\cdot V = 0,025\\text{ mol/L} \\times 126,06\\text{ g/mol} \\times 0,250\\text{ L} = 0,7879\\text{ g}.$$'
  },
  {
    id: 'c2calc02', ch: 2, type: 'fill', isCalc: true, topic: 'Khối lượng NaOH (Ví dụ Slide)',
    prompt: 'Khối lượng $\\ce{NaOH}$ khan ($M = 40\\text{ g/mol}$) có trong $1\\text{ lít}$ dung dịch $\\ce{NaOH}$ $0,1\\text{ M}$ là: ______ gam.',
    ans: ['4', '4.0', '4,0', '4g', '4 g'],
    ansD: '$4\\text{ g}$',
    exp: '$$m = n \\cdot M = 0,1 \\times 40 = 4\\text{ g}.$$'
  },
  {
    id: 'c2calc03', ch: 2, type: 'mcq', isCalc: true, topic: 'Đổi % (w/w) sang CM (Slide)',
    prompt: 'Dung dịch acid $\\ce{H2SO4}$ $98\\% (w/w)$ có khối lượng riêng $d = 1,84\\text{ g/mL}$ ($M_{\\ce{H2SO4}} = 98\\text{ g/mol}$). Nồng độ mol $C_M$ của dung dịch là:',
    opts: [
      '$C_M = 9,80\\text{ M}$',
      '$C_M = 18,40\\text{ M}$',
      '$C_M = 36,80\\text{ M}$',
      '$C_M = 1,84\\text{ M}$'
    ],
    ans: 1,
    exp: '$$C_M = \\frac{10 \\cdot C\\% \\cdot d}{M} = \\frac{10 \\times 98 \\times 1,84}{98} = 18,40\\text{ M}.$$'
  },
  {
    id: 'c2calc04', ch: 2, type: 'mcq', isCalc: true, topic: 'Đổi sang CN (Slide)',
    prompt: 'Dung dịch $\\ce{H2SO4}$ $18,4\\text{ M}$ tham gia phản ứng trung hòa hoàn toàn 2 nấc proton. Nồng độ đương lượng $C_N$ của dung dịch là:',
    opts: [
      '$C_N = 18,40\\text{ N}$',
      '$C_N = 36,80\\text{ N}$',
      '$C_N = 9,20\\text{ N}$',
      '$C_N = 49,00\\text{ N}$'
    ],
    ans: 1,
    exp: '$$C_N = z \\cdot C_M = 2 \\times 18,40 = 36,80\\text{ N}.$$'
  },
  {
    id: 'c2calc05', ch: 2, type: 'fill', isCalc: true, topic: 'Đổi CM sang ppm (Slide)',
    prompt: 'Một mẫu nước có nồng độ ion $\\ce{Ca^2+}$ là $0,0015\\text{ M}$ ($M_{\\ce{Ca}} = 40,08\\text{ g/mol}$). Nồng độ của $\\ce{Ca^2+}$ tính theo ppm (w/v) là: ______ ppm. (lấy 1 chữ số thập phân)',
    ans: ['60.1', '60,1', '60.12', '60,12'],
    ansD: '$60,1\\text{ ppm}$',
    exp: '$$\\text{ppm} = C_M \\cdot M \\cdot 10^3 = 0,0015 \\times 40,08 \\times 1000 = 60,12\\text{ ppm}.$$'
  },
  {
    id: 'c2calc06', ch: 2, type: 'mcq', isCalc: true, topic: 'Tính đương lượng gam Đ (Slide)',
    prompt: 'Trong phản ứng oxi hóa khử: $\\ce{MnO4- + 5e- + 8H+ -> Mn^2+ + 4H2O}$, cho $M_{\\ce{KMnO4}} = 158,04\\text{ g/mol}$. Đương lượng gam $Đ$ của $\\ce{KMnO4}$ là:',
    opts: [
      '$Đ = 158,04\\text{ g/eq}$',
      '$Đ = 79,02\\text{ g/eq}$',
      '$Đ = 52,68\\text{ g/eq}$',
      '$Đ = 31,61\\text{ g/eq}$'
    ],
    ans: 3,
    exp: 'Chất oxi hóa nhận $5e^- \\implies z = 5 \\implies Đ = \\frac{158,04}{5} = 31,61\\text{ g/eq}$.'
  },
  {
    id: 'c2calc07', ch: 2, type: 'fill', isCalc: true, topic: 'Lực ion của dung dịch',
    prompt: 'Tính lực ion $I$ của dung dịch muối $\\ce{CaCl2}$ $0,01\\text{ M}$: ______ M. (nhập số thập phân)',
    ans: ['0.03', '0,03', '0.03M', '0,03M'],
    ansD: '$0,03\\text{ M}$',
    exp: '$$I = \\frac{1}{2} [C_{\\ce{Ca^2+}} \\cdot (+2)^2 + C_{\\ce{Cl-}} \\cdot (-1)^2] = \\frac{1}{2} [0,01 \\cdot 4 + 0,02 \\cdot 1] = \\frac{0,06}{2} = 0,03\\text{ M}.$$'
  },
  {
    id: 'c2calc08', ch: 2, type: 'fill', isCalc: true, topic: 'Khối lượng từ CN (Slide)',
    prompt: 'Để pha $500\\text{ mL}$ dung dịch $\\ce{NaOH}$ $0,1\\text{ N}$ (với $Đ_{\\ce{NaOH}} = 40\\text{ g/eq}$), khối lượng $\\ce{NaOH}$ cần lấy là: ______ gam.',
    ans: ['2', '2.0', '2,0', '2g', '2 g'],
    ansD: '$2\\text{ g}$',
    exp: '$$m = C_N \\cdot Đ \\cdot V = 0,1 \\times 40 \\times 0,5 = 2,0\\text{ g}.$$'
  },
  {
    id: 'c2calc09', ch: 2, type: 'fill', isCalc: true, topic: 'Nồng độ phần trăm %(w/w)',
    prompt: 'Hòa tan $10,0\\text{ g } \\ce{NaCl}$ vào $90,0\\text{ g}$ nước. Nồng độ phần trăm $\\%(w/w)$ của dung dịch là: ______ %. (nhập số)',
    ans: ['10', '10%', '10.0', '10,0'],
    ansD: '$10\\%$',
    exp: '$$\\%(w/w) = \\frac{10,0}{10,0 + 90,0} \\times 100\\% = 10,0\\%.$$'
  },
  {
    id: 'c2calc10', ch: 2, type: 'mcq', isCalc: true, topic: 'Nồng độ phần mol (Slide)',
    prompt: 'Hỗn hợp gồm $1\\text{ mol } \\ce{CH3OH}$ và $4\\text{ mol } \\ce{H2O}$. Phần mol của $\\ce{CH3OH}$ là:',
    opts: [
      '$N_A = 0,25$',
      '$N_A = 0,20$',
      '$N_A = 0,80$',
      '$N_A = 0,50$'
    ],
    ans: 1,
    exp: '$$N_{\\ce{CH3OH}} = \\frac{1}{1 + 4} = 0,20 \\quad (\\text{và } N_{\\ce{H2O}} = 0,80; N_A + N_B = 1).$$'
  },
  {
    id: 'c2calc11', ch: 2, type: 'fill', isCalc: true, topic: 'Nồng độ % (w/v) (Slide)',
    prompt: 'Hòa tan $5,0\\text{ g } \\ce{CuSO4}$ vào nước rồi định mức vừa đủ thành $250\\text{ mL}$ dung dịch. Nồng độ $\\% (w/v)$ của dung dịch là: ______ %. (nhập số thập phân)',
    ans: ['2', '2.0', '2,0', '2%', '2,0%'],
    ansD: '$2,0\\%$',
    exp: 'Theo công thức slide trang 2 PDF Chương 2: $$\\%(w/v) = \\frac{5,0\\text{ g}}{250\\text{ mL}} \\times 100\\% = 2,0\\%.$$'
  },
  {
    id: 'c2calc12', ch: 2, type: 'mcq', isCalc: true, topic: 'Đổi ppm sang CM (Slide)',
    prompt: 'Một mẫu nước có nồng độ ion $\\ce{Ca^2+}$ là $40,08\\text{ ppm}$ ($M_{\\ce{Ca}} = 40,08\\text{ g/mol}$). Nồng độ mol $C_M$ của $\\ce{Ca^2+}$ trong mẫu nước là:',
    opts: [
      '$C_M = 1,0 \\times 10^{-3}\\text{ M}$',
      '$C_M = 1,0 \\times 10^{-2}\\text{ M}$',
      '$C_M = 4,0 \\times 10^{-4}\\text{ M}$',
      '$C_M = 2,5 \\times 10^{-3}\\text{ M}$'
    ],
    ans: 0,
    exp: '$$C_M = \\frac{\\text{ppm}}{M \\times 10^3} = \\frac{40,08}{40,08 \\times 1000} = 1,0 \\times 10^{-3}\\text{ M}.$$'
  },
  {
    id: 'c2q01', ch: 2, type: 'mcq', isCalc: false, topic: 'Định nghĩa nồng độ',
    prompt: '<strong>Nồng độ đương lượng ($C_N$)</strong> được định nghĩa là:',
    opts: [
      'Số gam chất tan trong $100\\text{ g}$ dung dịch',
      'Số mol chất tan trong $1\\text{ lít}$ dung môi',
      'Số mol đương lượng chất tan có trong $1\\text{ lít}$ dung dịch',
      'Số gam chất tan có trong $1\\text{ kg}$ dung dịch'
    ],
    ans: 2,
    exp: 'Theo trang 1 PDF Chương 2: Nồng độ đương lượng (N, N = đlg/l) là số mol đương lượng chất tan có trong 1 lít dung dịch.'
  },
  {
    id: 'c2q02', ch: 2, type: 'mcq', isCalc: false, topic: 'Quy tắc xác định z',
    prompt: 'Hệ số đương lượng $z$ trong phản ứng trao đổi ion (tạo kết tủa muối) được xác định bằng:',
    opts: [
      'Điện tích ion (cation hay anion) tham gia phản ứng',
      'Số phân tử nước kết tinh',
      'Số electron mà chất nhận',
      'Khối lượng phân tử của muối'
    ],
    ans: 0,
    exp: 'Theo trang 1 PDF Chương 2: Trong phản ứng trao đổi ion: z = điện tích ion (cation hay anion) tham gia phản ứng.'
  },
  {
    id: 'c2q03', ch: 2, type: 'tf', isCalc: false, topic: 'Đơn vị ppm mẫu lỏng',
    prompt: 'Đối với mẫu lỏng loãng, $1\\text{ ppm} = 1\\text{ mg/L} = 1\\ \\mu\\text{g/mL}$.',
    ans: true,
    exp: 'Đúng. Theo trang 2 PDF Chương 2: Mẫu lỏng: 1 ppm = 1 mg/l = 1 µg/ml.'
  },
  {
    id: 'c2q04', ch: 2, type: 'tf', isCalc: false, topic: 'Đơn vị ppb mẫu lỏng',
    prompt: 'Đối với mẫu lỏng loãng, $1\\text{ ppb} = 1\\ \\mu\\text{g/L} = 1\\text{ ng/mL} = 10^{-3}\\text{ ppm}$.',
    ans: true,
    exp: 'Đúng. Theo trang 2 PDF Chương 2: Mẫu lỏng: 1 ppb = 1 µg/l = 1 ng/ml (= 1/1000 ppm).'
  },
  {
    id: 'c2q05', ch: 2, type: 'mcq', isCalc: false, topic: 'Định luật tác dụng khối lượng',
    prompt: 'Khi các tiểu phân là ion, biểu thức định luật tác dụng khối lượng cần được biểu diễn theo đại lượng nào do có tương tác tĩnh điện giữa các ion?',
    opts: [
      'Nồng độ phần trăm khối lượng',
      'Hoạt độ ion $a = f \\cdot C$',
      'Áp suất riêng phần',
      'Nồng độ molan'
    ],
    ans: 1,
    exp: 'Theo trang 3 PDF Chương 2: Nếu các phần tử mang điện (ion) có tương tác → thay nồng độ bằng hoạt độ $a = f \\cdot C$.'
  },

  // ==========================================
  // --- CHƯƠNG 3: PT KHỐI LƯỢNG & PT THỂ TÍCH (PDF 3) ---
  // Lý thuyết + BÀI TẬP TÍNH TOÁN (XÔĐA, SI, PHA LOÃNG)
  // ==========================================
  {
    id: 'c3calc01', ch: 3, type: 'fill', isCalc: true, topic: 'Bài toán xác định Si (Ví dụ Slide)',
    prompt: 'Xác định $\\ce{Si}$ ($M = 28,08$) bằng PP khối lượng dưới dạng cân $\\ce{SiO2}$ ($M = 60,08$). Nếu dạng cân thu được là $0,1245\\text{ g}$ thì khối lượng $\\ce{Si}$ trong mẫu là: ______ gam. (lấy 4 chữ số thập phân)',
    ans: ['0.0582', '0,0582', '0.0582g', '0,0582g'],
    ansD: '$0,0582\\text{ g}$',
    exp: 'Theo đúng slide trang 2 PDF Chương 3: $$m = 0,1245 \\times K = 0,1245 \\times 0,4674 = 0,0582\\text{ g}.$$'
  },
  {
    id: 'c3calc02', ch: 3, type: 'fill', isCalc: true, topic: 'Bài toán độ ẩm (Công thức Slide)',
    prompt: 'Lấy $2,500\\text{ g}$ mẫu dược liệu, sau khi sấy khô ở $105^\\circ\\text{C}$ đến khối lượng không đổi còn lại $2,275\\text{ g}$. Độ ẩm của mẫu là: ______ %. (nhập số thập phân)',
    ans: ['9', '9%', '9.0', '9,0'],
    ansD: '$9,0\\%$',
    exp: '$$\\text{Độ ẩm} = \\frac{(2,500 - 2,275) \\times 100}{2,500} = \\frac{0,225 \\times 100}{2,500} = 9,0\\%.$$'
  },
  {
    id: 'c3calc03', ch: 3, type: 'mcq', isCalc: true, topic: 'Bài toán Xôđa kỹ thuật (Ví dụ Slide)',
    prompt: 'Để xác định hàm lượng $\\ce{Na2CO3}$ ($Đ = 53\\text{ g/eq}$) trong xôđa, lấy $0,2110\\text{ g}$ mẫu cho tác dụng với $25\\text{ mL } \\ce{HCl}$ $0,2022\\text{ N}$, chuẩn độ lượng dư $\\ce{HCl}$ tốn hết $5,50\\text{ mL } \\ce{NaOH}$ $0,2089\\text{ N}$. Hàm lượng $\\% \\ce{Na2CO3}$ trong mẫu là:',
    opts: [
      '$92,50\\%$',
      '$95,45\\%$',
      '$98,11\\%$',
      '$99,50\\%$'
    ],
    ans: 2,
    exp: 'Giải chi tiết theo slide Chương 3:\n- Số mmol đương lượng HCl ban đầu = $25 \\times 0,2022 = 5,055\\text{ meq}$.\n- Số meq HCl dư = $5,50 \\times 0,2089 = 1,14895\\text{ meq}$.\n- Số meq HCl phản ứng = $5,055 - 1,14895 = 3,90605\\text{ meq}$.\n- $m_{\\ce{Na2CO3}} = 3,90605 \\times 53 \\times 10^{-3} = 0,20702\\text{ g}$.\n- $\\% \\ce{Na2CO3} = \\frac{0,20702}{0,2110} \\times 100\\% = 98,11\\%$.'
  },
  {
    id: 'c3calc04', ch: 3, type: 'fill', isCalc: true, topic: 'Bài toán pha loãng NaOH (Ví dụ Slide)',
    prompt: 'Phải lấy bao nhiêu $\\text{mL}$ dung dịch $\\ce{NaOH}$ $0,200\\text{ M}$ để pha thành $1000\\text{ mL}$ dung dịch $\\ce{NaOH}$ $0,050\\text{ M}$? (nhập số nguyên)',
    ans: ['250', '250ml', '250 ml'],
    ansD: '$250\\text{ mL}$',
    exp: 'Theo công thức pha loãng trong slide $C_1 V_1 = C_2 V_2$:\n$$0,200 \\times V_1 = 0,05 \\times 1000 \\implies V_1 = \\frac{50}{0,200} = 250\\text{ mL}.$$'
  },
  {
    id: 'c3calc05', ch: 3, type: 'fill', isCalc: true, topic: 'Pha dung dịch từ chất gốc (Ví dụ Slide)',
    prompt: 'Để pha $100,0\\text{ mL}$ dung dịch chuẩn $\\ce{H2C2O4}$ $0,100\\text{ M}$ từ chất gốc $\\ce{H2C2O4.2H2O}$ ($M = 126,06\\text{ g/mol}$), khối lượng chất gốc cần cân là: ______ gam.',
    ans: ['1.2606', '1,2606', '1.2606g', '1,2606g'],
    ansD: '$1,2606\\text{ g}$',
    exp: '$$m = C_M \\cdot M \\cdot V = 0,100 \\times 126,06 \\times 0,1000 = 1,2606\\text{ g}.$$'
  },
  {
    id: 'c3calc06', ch: 3, type: 'mcq', isCalc: true, topic: 'Chuẩn độ trực tiếp (Định luật đương lượng)',
    prompt: 'Chuẩn độ $10,00\\text{ mL}$ dung dịch $\\ce{H2SO4}$ tốn hết $12,50\\text{ mL}$ dung dịch chuẩn $\\ce{NaOH}$ $0,0800\\text{ N}$. Nồng độ đương lượng $C_N$ của dung dịch $\\ce{H2SO4}$ là:',
    opts: [
      '$C_N = 0,1000\\text{ N}$',
      '$C_N = 0,0800\\text{ N}$',
      '$C_N = 0,0500\\text{ N}$',
      '$C_N = 0,0640\\text{ N}$'
    ],
    ans: 0,
    exp: '$$C_{N\\ce{H2SO4}} = \\frac{C_{N\\ce{NaOH}} \\cdot V_{\\ce{NaOH}}}{V_{\\ce{H2SO4}}} = \\frac{0,0800 \\times 12,50}{10,00} = 0,1000\\text{ N}.$$'
  },
  {
    id: 'c3calc07', ch: 3, type: 'fill', isCalc: true, topic: 'Hàm lượng % (w/w) phân tích khối lượng',
    prompt: 'Hòa tan $0,6000\\text{ g}$ quặng sắt, kết tủa $\\ce{Fe^3+}$ và nung thành dạng cân $\\ce{Fe2O3}$ thu được $0,2400\\text{ g}$ ($M_{\\ce{Fe}} = 55,85; M_{\\ce{Fe2O3}} = 159,7$). Hàm lượng $\\% \\ce{Fe}$ trong quặng là: ______ %. (lấy 2 chữ số thập phân)',
    ans: ['27.98', '27,98', '27.97', '27,97'],
    ansD: '$27,98\\%$',
    exp: '$$\\% \\ce{Fe} = \\frac{0,6994 \\times 0,2400 \\times 100}{0,6000} = 27,98\\%.$$'
  },
  {
    id: 'c3calc08', ch: 3, type: 'mcq', isCalc: true, topic: 'Pha loãng dung dịch HCl',
    prompt: 'Cần lấy bao nhiêu $\\text{mL}$ dung dịch $\\ce{HCl}$ $2,00\\text{ M}$ để pha được $500\\text{ mL}$ dung dịch $\\ce{HCl}$ $0,10\\text{ M}$?',
    opts: [
      '$15\\text{ mL}$',
      '$25\\text{ mL}$',
      '$50\\text{ mL}$',
      '$100\\text{ mL}$'
    ],
    ans: 1,
    exp: '$$V_1 = \\frac{C_2 V_2}{C_1} = \\frac{0,10 \\times 500}{2,00} = 25\\text{ mL}.$$'
  },
  {
    id: 'c3calc09', ch: 3, type: 'fill', isCalc: true, topic: 'Hệ số chuyển K của BaSO4 (Slide)',
    prompt: 'Xác định $\\ce{Ba}$ dưới dạng cân $\\ce{BaSO4}$ ($M_{\\ce{Ba}} = 137,33$; $M_{\\ce{BaSO4}} = 233,39$). Hệ số chuyển hóa $K$ là: ______ (lấy 4 chữ số thập phân).',
    ans: ['0.5884', '0,5884'],
    ansD: '0,5884',
    exp: '$$K = \\frac{137,33}{233,39} \\approx 0,5884.$$'
  },
  {
    id: 'c3calc10', ch: 3, type: 'fill', isCalc: true, topic: 'Pha loãng dung dịch NaOH (Ví dụ Slide)',
    prompt: 'Cần lấy chính xác bao nhiêu $\\text{mL}$ dung dịch $\\ce{NaOH}$ $0,200\\text{ M}$ để pha thành $1000\\text{ mL}$ dung dịch $\\ce{NaOH}$ $0,050\\text{ M}$? Nhập số thể tích (mL): ______',
    ans: ['250', '250.0', '250,0', '250ml', '250 ml'],
    ansD: '$250\\text{ mL}$',
    exp: 'Theo công thức pha loãng ở slide trang 5: $$C_1 V_1 = C_2 V_2 \\implies V_1 = \\frac{C_2 V_2}{C_1} = \\frac{0,050 \\times 1000}{0,200} = 250\\text{ mL}.$$'
  },
  {
    id: 'c3q01', ch: 3, type: 'mcq', isCalc: false, topic: 'Phân loại PT khối lượng',
    prompt: 'Phương pháp phân tích khối lượng gồm 3 nhóm phân loại chính là:',
    opts: [
      'Phương pháp tách, phương pháp kết tủa và phương pháp chưng cất',
      'Phương pháp chuẩn độ trực tiếp, chuẩn độ ngược và chuẩn độ thay thế',
      'Phương pháp đo điện thế, cực phổ và độ dẫn',
      'Phương pháp acid-base, phức chất và oxy hóa khử'
    ],
    ans: 0,
    exp: 'Theo trang 1 PDF Chương 3: Phân loại: PP tách (tách Au ra khỏi hợp kim), PP kết tủa, PP chưng cất (trực tiếp CO2, gián tiếp H2O).'
  },
  {
    id: 'c3q02', ch: 3, type: 'drag', dk: 'match', isCalc: false, topic: 'Yêu cầu dạng kết tủa và dạng cân',
    prompt: 'Ghép đúng yêu cầu kỹ thuật với dạng tương ứng:',
    pairs: [
      { l: 'Dạng kết tủa', r: 'Kết tủa phải thực tế không tan, tinh khiết, dễ lọc và rửa' },
      { l: 'Dạng cân', r: 'Phải có công thức xác định, bền vững, khối lượng càng lớn càng tốt' }
    ],
    exp: 'Theo trang 2 PDF Chương 3: Yêu cầu của dạng kết tủa và dạng cân.'
  },
  {
    id: 'c3q03', ch: 3, type: 'drag', dk: 'match', isCalc: false, topic: '5 Phương pháp chuẩn độ thể tích',
    prompt: 'Ghép tên phương pháp chuẩn độ với nguyên tắc tương ứng:',
    pairs: [
      { l: 'Chuẩn độ trực tiếp', r: 'Thuốc thử tác dụng trực tiếp với chất định phân: X + R = XR' },
      { l: 'Chuẩn độ ngược', r: 'Thêm chính xác và dư TT, chuẩn độ lượng dư bằng TT khác' },
      { l: 'Chuẩn độ thay thế', r: 'X tác dụng với MY giải phóng Y, chuẩn độ Y bằng TT khác' },
      { l: 'Chuẩn độ phân đoạn', r: 'Chuẩn độ lần lượt các chất X, Y, Z... trong 1 dd bằng 1 hoặc 2 dd chuẩn' }
    ],
    exp: 'Theo mục 3.2.5 trang 4 PDF Chương 3.'
  },
  {
    id: 'c3q04', ch: 3, type: 'mcq', isCalc: false, topic: 'Chất gốc trong slide',
    prompt: 'Dãy chất nào sau đây được xếp vào nhóm <strong>CHẤT GỐC</strong> dùng để pha dung dịch chuẩn trực tiếp?',
    opts: [
      '$\\ce{K2Cr2O7}$, $\\ce{H2C2O4.2H2O}$, $\\ce{Au}$, $\\ce{Pt}$',
      '$\\ce{NaOH}$ khan, $\\ce{HCl}$ đặc, $\\ce{KMnO4}$',
      '$\\ce{H2SO4}$ đặc, $\\ce{Na2S2O3.5H2O}$',
      '$\\ce{NH4OH}$, $\\ce{FeSO4.7H2O}$'
    ],
    ans: 0,
    exp: 'Theo trang 4 PDF Chương 3: K2Cr2O7, H2C2O4.2H2O, Au, Pt... là các chất gốc. NaOH(khan), HCl đđ, H2SO4 đđ, KMnO4, Na2S2O3.5H2O... không phải là chất gốc.'
  },

  // ==========================================
  // --- CHƯƠNG 4: CHUẨN ĐỘ ACID - BASE (PDF 4) ---
  // Lý thuyết + BÀI TẬP TÍNH TOÁN PH CÁC THỜI ĐIỂM & ĐƯỜNG ĐỊNH PHÂN
  // ==========================================
  {
    id: 'c4calc01', ch: 4, type: 'fill', isCalc: true, topic: 'Tính pH acid mạnh (Slide)',
    prompt: 'Tính $pH$ của dung dịch acid mạnh $\\ce{HCl}$ $0,020\\text{ M}$ ở $25^\\circ\\text{C}$: ______ . (lấy 2 chữ số thập phân)',
    ans: ['1.70', '1,70', '1.7', '1,7'],
    ansD: '$1,70$',
    exp: '$$pH = -\\log(0,020) = 1,70.$$'
  },
  {
    id: 'c4calc02', ch: 4, type: 'fill', isCalc: true, topic: 'Tính pH base mạnh (Slide)',
    prompt: 'Tính $pH$ của dung dịch base mạnh $\\ce{NaOH}$ $0,050\\text{ M}$ ở $25^\\circ\\text{C}$: ______ . (lấy 2 chữ số thập phân)',
    ans: ['12.70', '12,70', '12.7', '12,7'],
    ansD: '$12,70$',
    exp: '$$pH = 14 + \\log(0,050) = 14 - 1,30 = 12,70.$$'
  },
  {
    id: 'c4calc03', ch: 4, type: 'fill', isCalc: true, topic: 'Tính pH acid yếu (Slide)',
    prompt: 'Tính $pH$ của dung dịch acid yếu $\\ce{CH3COOH}$ $0,10\\text{ M}$, biết hằng số acid $K_a = 1,75 \\times 10^{-5}$ ($pK_a = 4,76$): ______ . (lấy 2 chữ số thập phân)',
    ans: ['2.88', '2,88', '2.87', '2,87'],
    ansD: '$2,88$',
    exp: '$$pH = \\frac{1}{2} (4,76 - \\log 0,10) = \\frac{1}{2} (4,76 + 1) = \\frac{5,76}{2} = 2,88.$$'
  },
  {
    id: 'c4calc04', ch: 4, type: 'mcq', isCalc: true, topic: 'Tính pH dung dịch đệm (Slide)',
    prompt: 'Dung dịch đệm chứa $\\ce{CH3COOH}$ $0,10\\text{ M}$ ($pK_a = 4,75$) và $\\ce{CH3COONa}$ $0,20\\text{ M}$ có $pH$ bằng:',
    opts: [
      '$pH = 4,45$',
      '$pH = 4,75$',
      '$pH = 5,05$',
      '$pH = 5,35$'
    ],
    ans: 2,
    exp: '$$pH = 4,75 + \\log\\frac{0,20}{0,10} = 4,75 + \\log 2 = 4,75 + 0,301 = 5,05.$$'
  },
  {
    id: 'c4calc05', ch: 4, type: 'mcq', isCalc: true, topic: 'Chuẩn độ HCl bằng NaOH trước TĐ (Slide)',
    prompt: 'Chuẩn độ $100\\text{ mL}$ dung dịch $\\ce{HCl}$ $0,10\\text{ M}$ bằng $\\ce{NaOH}$ $0,10\\text{ M}$. Khi đã thêm $90,0\\text{ mL } \\ce{NaOH}$, giá trị $pH$ của dung dịch là:',
    opts: [
      '$pH = 1,48$',
      '$pH = 2,28$',
      '$pH = 3,30$',
      '$pH = 7,00$'
    ],
    ans: 1,
    exp: '$$[\\ce{H+}] = \\frac{100 \\times 0,1 - 90 \\times 0,1}{100 + 90} = \\frac{1,0}{190} = 5,263 \\times 10^{-3}\\text{ M} \\implies pH = -\\log(5,263 \\times 10^{-3}) = 2,28.$$'
  },
  {
    id: 'c4calc06', ch: 4, type: 'mcq', isCalc: true, topic: 'Chuẩn độ HCl bằng NaOH sau TĐ (Slide)',
    prompt: 'Chuẩn độ $100\\text{ mL } \\ce{HCl}$ $0,10\\text{ M}$ bằng $\\ce{NaOH}$ $0,10\\text{ M}$. Khi thêm dư đến $110,0\\text{ mL } \\ce{NaOH}$, giá trị $pH$ của dung dịch là:',
    opts: [
      '$pH = 9,70$',
      '$pH = 11,68$',
      '$pH = 12,30$',
      '$pH = 13,00$'
    ],
    ans: 1,
    exp: '$$[\\ce{OH-}] = \\frac{110 \\times 0,1 - 100 \\times 0,1}{100 + 110} = \\frac{1,0}{210} = 4,762 \\times 10^{-3}\\text{ M} \\implies pH = 14 + \\log(4,762 \\times 10^{-3}) = 14 - 2,32 = 11,68.$$'
  },
  {
    id: 'c4calc07', ch: 4, type: 'fill', isCalc: true, topic: 'Chuẩn độ CH3COOH tại ĐTĐ (Slide)',
    prompt: 'Chuẩn độ $100\\text{ mL } \\ce{CH3COOH}$ $0,10\\text{ M}$ ($pK_a = 4,75$) bằng $\\ce{NaOH}$ $0,10\\text{ M}$. Tại điểm tương đương ($V = 100\\text{ mL}$), giá trị $pH$ của dung dịch là: ______ . (lấy 2 chữ số thập phân)',
    ans: ['8.72', '8,72', '8.7', '8,7'],
    ansD: '$8,72$',
    exp: 'Tại ĐTĐ: $C = \\frac{100 \\times 0,1}{200} = 0,050\\text{ M}$.\n$$pH = 7 + \\frac{4,75}{2} + \\frac{1}{2}\\log(0,050) = 7 + 2,375 - 0,650 = 8,725 \\approx 8,72.$$'
  },
  {
    id: 'c4calc08', ch: 4, type: 'fill', isCalc: true, topic: 'Chuẩn độ H3PO4 tại ĐTĐ 1 (Slide)',
    prompt: 'Chuẩn độ $100\\text{ mL } \\ce{H3PO4}$ $0,1\\text{ M}$ bằng $\\ce{NaOH}$ $0,1\\text{ M}$ ($pK_1 = 2,12; pK_2 = 7,21; pK_3 = 12,36$). Tại điểm tương đương thứ nhất tạo $\\ce{NaH2PO4}$, giá trị $pH$ là: ______ . (lấy 2 chữ số thập phân)',
    ans: ['4.67', '4,67', '4.66', '4,66'],
    ansD: '$4,67$',
    exp: '$$pH = \\frac{1}{2}(pK_1 + pK_2) = \\frac{2,12 + 7,21}{2} = 4,665 \\approx 4,67.$$'
  },
  {
    id: 'c4calc09', ch: 4, type: 'fill', isCalc: true, topic: 'Chuẩn độ H3PO4 tại ĐTĐ 2 (Slide)',
    prompt: 'Chuẩn độ dung dịch $\\ce{H3PO4}$ bằng $\\ce{NaOH}$ ($pK_1 = 2,12; pK_2 = 7,21; pK_3 = 12,36$). Tại điểm tương đương thứ hai tạo $\\ce{Na2HPO4}$, giá trị $pH$ là: ______ . (lấy 2 chữ số thập phân)',
    ans: ['9.78', '9,78', '9.79', '9,79'],
    ansD: '$9,78$',
    exp: '$$pH = \\frac{1}{2}(pK_2 + pK_3) = \\frac{7,21 + 12,36}{2} = 9,785 \\approx 9,78.$$'
  },
  {
    id: 'c4calc10', ch: 4, type: 'mcq', isCalc: true, topic: 'Chuẩn độ hỗn hợp HCl + H3PO4 (Slide)',
    prompt: 'Chuẩn độ hỗn hợp gồm $\\ce{HCl}$ và $\\ce{H3PO4}$ bằng $\\ce{NaOH}$. Với chỉ thị metyl da cam tốn $V_1 = 20,0\\text{ mL } \\ce{NaOH}$. Chuẩn độ tiếp với phenolphtalein tốn thêm $V_2 = 7,0\\text{ mL } \\ce{NaOH}$. Thể tích $\\ce{NaOH}$ đã dùng để trung hòa riêng $\\ce{HCl}$ là:',
    opts: [
      '$V_{\\ce{HCl}} = 7,0\\text{ mL}$',
      '$V_{\\ce{HCl}} = 13,0\\text{ mL}$',
      '$V_{\\ce{HCl}} = 20,0\\text{ mL}$',
      '$V_{\\ce{HCl}} = 27,0\\text{ mL}$'
    ],
    ans: 1,
    exp: 'Theo slide trang 10 PDF Chương 4: $V_1 = V_{\\ce{HCl}} + V_{\\ce{H3PO4(nấc 1)}}$; $V_2 = V_{\\ce{H3PO4(nấc 2)}} = V_{\\ce{H3PO4(nấc 1)}}$. Do đó: $$V_{\\ce{HCl}} = V_1 - V_2 = 20,0 - 7,0 = 13,0\\text{ mL}.$$'
  },
  {
    id: 'c4calc11', ch: 4, type: 'mcq', isCalc: true, topic: 'Chuẩn độ hỗn hợp NaOH + Na2CO3 (Slide)',
    prompt: 'Chuẩn độ hỗn hợp gồm $\\ce{NaOH}$ và $\\ce{Na2CO3}$ bằng $\\ce{HCl}$. Khi phenolphtalein đổi màu tốn $V_1 = 18,0\\text{ mL } \\ce{HCl}$. Chuẩn độ tiếp với metyl da cam tốn thêm $V_2 = 5,0\\text{ mL } \\ce{HCl}$. Thể tích $\\ce{HCl}$ đã dùng để trung hòa riêng $\\ce{NaOH}$ là:',
    opts: [
      '$V_{\\ce{NaOH}} = 5,0\\text{ mL}$',
      '$V_{\\ce{NaOH}} = 10,0\\text{ mL}$',
      '$V_{\\ce{NaOH}} = 13,0\\text{ mL}$',
      '$V_{\\ce{NaOH}} = 23,0\\text{ mL}$'
    ],
    ans: 2,
    exp: 'Theo slide trang 10 PDF Chương 4: $V_1 = V_{\\ce{NaOH}} + V_{1/2 \\ce{Na2CO3}}$; $V_2 = V_{1/2 \\ce{Na2CO3}}$. Do đó: $$V_{\\ce{NaOH}} = V_1 - V_2 = 18,0 - 5,0 = 13,0\\text{ mL}.$$'
  },
  {
    id: 'c4calc12', ch: 4, type: 'fill', isCalc: true, topic: 'Tính pH đơn base yếu (Slide)',
    prompt: 'Dung dịch đơn base yếu $\\ce{NH3}$ có nồng độ $C_b = 0,10\\text{ M}$ và hằng số base $K_b = 1,75 \\times 10^{-5}$. Giá trị $pH$ của dung dịch xấp xỉ bằng: ______ (lấy 2 chữ số thập phân).',
    ans: ['11.12', '11,12'],
    ansD: '11,12',
    exp: '$$[\\ce{OH-}] = \\sqrt{0,10 \\times 1,75 \\times 10^{-5}} = \\sqrt{1,75 \\times 10^{-6}} = 1,323 \\times 10^{-3}\\text{ M}.$$ $$pOH = -\\log(1,323 \\times 10^{-3}) = 2,88 \\implies pH = 14 - 2,88 = 11,12.$$'
  },
  {
    id: 'c4calc13', ch: 4, type: 'mcq', isCalc: true, topic: 'Chuẩn độ hỗn hợp NaHCO3 + Na2CO3 (Slide)',
    prompt: 'Chuẩn độ hỗn hợp gồm $\\ce{Na2CO3}$ và $\\ce{NaHCO3}$ bằng $\\ce{HCl}$. Với chỉ thị Phenolphtalein tiêu tốn $V_1 = 12,0\\text{ mL } \\ce{HCl}$. Chuẩn độ tiếp với Metyl da cam tiêu tốn thêm $V_2 = 20,0\\text{ mL } \\ce{HCl}$. Thể tích $\\ce{HCl}$ tiêu tốn để trung hòa riêng $\\ce{NaHCO3}$ ban đầu là:',
    opts: [
      '$V_{\\ce{NaHCO3}} = V_2 - V_1 = 8,0\\text{ mL}$',
      '$V_{\\ce{NaHCO3}} = V_1 = 12,0\\text{ mL}$',
      '$V_{\\ce{NaHCO3}} = V_2 - 2V_1 = 4,0\\text{ mL}$',
      '$V_{\\ce{NaHCO3}} = V_1 + V_2 = 32,0\\text{ mL}$'
    ],
    ans: 0,
    exp: 'Theo sơ đồ slide trang 11 PDF Chương 4: $V_1$ trung hòa $\\frac{1}{2} \\ce{Na2CO3}$. Khi sang nấc 2 (metyl da cam), thể tích $V_2$ dùng để trung hòa lượng $\\ce{NaHCO3}$ sinh ra từ $\\ce{Na2CO3}$ (bằng $V_1$) và lượng $\\ce{NaHCO3}$ ban đầu trong mẫu. Do đó: $$V_{\\ce{NaHCO3 (mẫu)}} = V_2 - V_1 = 20,0 - 12,0 = 8,0\\text{ mL}.$$'
  },
  {
    id: 'c4calc14', ch: 4, type: 'fill', isCalc: true, topic: 'Khoảng pH đổi màu của Chỉ thị (Slide)',
    prompt: 'Một chất chỉ thị acid-base có $pK_a = 4,2$. Khoảng pH đổi màu của chất chỉ thị này là từ ______ đến 5,2.',
    ans: ['3.2', '3,2'],
    ansD: '3,2',
    exp: 'Theo công thức slide trang 4 PDF Chương 4: Khoảng pH đổi màu là $pH = pK_a \\pm 1 = 4,2 \\pm 1$, tức là từ $3,2$ đến $5,2$.'
  },
  {
    id: 'c4q01', ch: 4, type: 'mcq', isCalc: false, topic: 'Định nghĩa Acid - Base Bronsted',
    prompt: 'Theo <strong>thuyết Brønsted</strong>, acid và base được định nghĩa là:',
    opts: [
      'Acid là chất có khả năng nhận $\\ce{H+}$, Base là chất có khả năng cho $\\ce{H+}$',
      'Acid là chất có khả năng cho $\\ce{H+}$, Base là chất có khả năng nhận $\\ce{H+}$',
      'Acid và Base đều phải phân ly hoàn toàn trong mọi dung môi',
      'Acid là chất tạo $\\ce{OH-}$, Base là chất tạo $\\ce{H+}$'
    ],
    ans: 1,
    exp: 'Theo mục 4.1.1 trang 1 PDF Chương 4: "Acid là chất có khả năng cho H+; Base là chất có khả năng nhận H+".'
  },
  {
    id: 'c4q02', ch: 4, type: 'mcq', isCalc: false, topic: 'Chỉ số pT các chất chỉ thị',
    prompt: 'Chỉ số chuẩn độ $pT$ của phenolphtalein và metyl da cam lần lượt là:',
    opts: [
      'Metyl da cam ($pT = 4$), Metyl đỏ ($pT = 5$), Phenolphtalein ($pT = 9$)',
      'Metyl da cam ($pT = 7$), Metyl đỏ ($pT = 7$), Phenolphtalein ($pT = 7$)',
      'Metyl da cam ($pT = 9$), Metyl đỏ ($pT = 5$), Phenolphtalein ($pT = 4$)',
      'Metyl da cam ($pT = 2$), Metyl đỏ ($pT = 4$), Phenolphtalein ($pT = 8$)'
    ],
    ans: 0,
    exp: 'Theo trang 4 PDF Chương 4: "Ví dụ: metyl da cam có pT = 4, metyl đỏ có pT = 5, phenolphtalein có pT = 9...".'
  },
  {
    id: 'c4q03', ch: 4, type: 'color', isCalc: false, topic: 'Cơ chế đổi màu Quỳ tím',
    prompt: 'Trong cân bằng chỉ thị quỳ tím $\\ce{HInd <=> H+ + Ind-}$, ở môi trường acid dạng $\\ce{HInd}$ có màu gì?',
    choices: [
      { lbl: 'Màu đỏ', c: '#ef4444' },
      { lbl: 'Màu xanh', c: '#3b82f6' },
      { lbl: 'Màu vàng', c: '#f59e0b' },
      { lbl: 'Không màu', c: '#f8fafc' }
    ],
    ans: 0,
    exp: 'Theo trang 3 PDF Chương 4: "Môi trường acid → HInd có màu đỏ; Môi trường base → Ind- có màu xanh".'
  },
  {
    id: 'c4q04', ch: 4, type: 'color', isCalc: false, topic: 'Cơ chế đổi màu Quỳ tím trong base',
    prompt: 'Trong cân bằng chỉ thị quỳ tím $\\ce{HInd <=> H+ + Ind-}$, ở môi trường base dạng $\\ce{Ind-}$ có màu gì?',
    choices: [
      { lbl: 'Màu đỏ', c: '#ef4444' },
      { lbl: 'Màu xanh', c: '#3b82f6' },
      { lbl: 'Màu tím', c: '#8b5cf6' },
      { lbl: 'Màu hồng', c: '#ec4899' }
    ],
    ans: 1,
    exp: 'Theo trang 3 PDF Chương 4: "Môi trường base → Ind- có màu xanh".'
  },
  {
    id: 'c4q05', ch: 4, type: 'mcq', isCalc: false, topic: 'Chỉ thị cho Acid yếu bằng Base mạnh',
    prompt: 'Khi chuẩn độ acid yếu bằng base mạnh, điểm tương đương có môi trường kiềm ($pH > 7$), chất chỉ thị thích hợp là:',
    opts: [
      'Phenolphtalein',
      'Metyl da cam',
      'Metyl đỏ',
      'Không dùng được chỉ thị nào'
    ],
    ans: 0,
    exp: 'Theo trang 7 PDF Chương 4: "Điểm tương đương có môi trường kiềm (pH > 7). Chất chỉ thị thích hợp là phenolphtalein".'
  },
  {
    id: 'c4q06', ch: 4, type: 'mcq', isCalc: false, topic: 'Chỉ thị cho Base yếu bằng Acid mạnh',
    prompt: 'Khi chuẩn độ base yếu bằng acid mạnh, điểm tương đương có môi trường acid ($pH < 7$), chất chỉ thị thích hợp là:',
    opts: [
      'Phenolphtalein',
      'Metyl đỏ hoặc metyl da cam',
      'Hồ tinh bột',
      'Quỳ tím'
    ],
    ans: 1,
    exp: 'Theo trang 7 PDF Chương 4: "Điểm tương đương có môi trường acid (pH < 7). Chất chỉ thị thích hợp là metyl đỏ hoặc metyl da cam".'
  },
  {
    id: 'c4q07', ch: 4, type: 'drag', dk: 'order', isCalc: false, topic: 'Các nấc trung hòa H3PO4 (Slide)',
    prompt: 'Sắp xếp đúng thứ tự các dạng cấu tử phosphat tăng dần theo thể tích $\\ce{NaOH}$ khi chuẩn độ $\\ce{H3PO4}$:',
    items: [
      'Dung dịch ban đầu: H₃PO₄',
      'Điểm TĐ 1: NaH₂PO₄',
      'Điểm TĐ 2: Na₂HPO₄',
      'Điểm TĐ 3: Na₃PO₄'
    ],
    order: [
      'Dung dịch ban đầu: H₃PO₄',
      'Điểm TĐ 1: NaH₂PO₄',
      'Điểm TĐ 2: Na₂HPO₄',
      'Điểm TĐ 3: Na₃PO₄'
    ],
    exp: 'Theo đồ thị trang 8-9 PDF Chương 4: Bắt đầu từ H3PO4 → ĐTĐ 1 (NaH2PO4) → ĐTĐ 2 (Na2HPO4) → ĐTĐ 3 (Na3PO4).'
  }
];

// ==========================================
// 5. BIẾN TOÀN CỤC & TRẠNG THÁI ỨNG DỤNG
// ==========================================
let currentQuestions = [];
let dragSourceItem = null;
let touchSelectedItem = null;
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let isStarredOnlyFilter = false;

// DOM Elements
const elQuiz = document.getElementById('quiz');
const elStickyStats = document.getElementById('stickyStats');
const elQuizHeader = document.getElementById('quizHeader');
const elQuizInfo = document.getElementById('quizInfo');
const elEmptyBox = document.getElementById('emptyBox');
const elResultsCard = document.getElementById('resultsCard');

const elQuestionCount = document.getElementById('questionCount');
const elOrderMode = document.getElementById('orderMode');
const elExplainMode = document.getElementById('explainMode');
const elSearchInput = document.getElementById('searchInput');
const elCalcOnlyToggle = document.getElementById('calcOnlyToggle');

const elStatTotal = document.getElementById('statTotal');
const elStatChecked = document.getElementById('statChecked');
const elStatCorrect = document.getElementById('statCorrect');
const elStatScore = document.getElementById('statScore');
const elProgressBar = document.getElementById('progressBar');

const elResultCorrect = document.getElementById('resultCorrect');
const elResultWrong = document.getElementById('resultWrong');
const elResultPending = document.getElementById('resultPending');
const elResultScore = document.getElementById('resultScore');
const elResultMessage = document.getElementById('resultMessage');

// Helper Functions
function shuffleArray(arr) {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

function normalizeStr(val) {
  return String(val || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
    .replace(/,/g, '.') // Đồng nhất phẩy và chấm
    .replace(/\s+/g, '');
}

function isAnswerAccepted(userVal, acceptedArr) {
  const normUser = normalizeStr(userVal);
  if (!normUser) return false;
  return acceptedArr.some(acc => {
    const normAcc = normalizeStr(acc);
    return normUser === normAcc;
  });
}

function getStarredIds() {
  try {
    return JSON.parse(localStorage.getItem('chem_starred_questions') || '[]');
  } catch (e) {
    return [];
  }
}

function toggleStar(id) {
  let list = getStarredIds();
  if (list.includes(id)) {
    list = list.filter(x => x !== id);
  } else {
    list.push(id);
  }
  localStorage.setItem('chem_starred_questions', JSON.stringify(list));
  return list.includes(id);
}

// Timer Functions
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    timerSeconds++;
    const formatted = formatTime(timerSeconds);
    const disp = document.getElementById('timerDisplay');
    if (disp) disp.textContent = formatted;
    const sbDisp = document.getElementById('sidebarTimerDisplay');
    if (sbDisp) sbDisp.textContent = formatted;
    const islDisp = document.getElementById('islandTimer');
    if (islDisp) islDisp.textContent = formatted;
  }, 1000);
  const btn = document.getElementById('timerToggleBtn');
  if (btn) btn.innerHTML = "<i class='bx bx-pause'></i> Tạm dừng";
  const sbBtn = document.getElementById('sidebarTimerToggleBtn');
  if (sbBtn) sbBtn.innerHTML = "<i class='bx bx-pause'></i>";
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  const btn = document.getElementById('timerToggleBtn');
  if (btn) btn.innerHTML = "<i class='bx bx-play'></i> Tiếp tục";
  const sbBtn = document.getElementById('sidebarTimerToggleBtn');
  if (sbBtn) sbBtn.innerHTML = "<i class='bx bx-play'></i>";
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 0;
  const disp = document.getElementById('timerDisplay');
  if (disp) disp.textContent = '00:00';
  const sbDisp = document.getElementById('sidebarTimerDisplay');
  if (sbDisp) sbDisp.textContent = '00:00';
  const islDisp = document.getElementById('islandTimer');
  if (islDisp) islDisp.textContent = '00:00';
  const btn = document.getElementById('timerToggleBtn');
  if (btn) btn.innerHTML = "<i class='bx bx-play'></i> Bắt đầu";
  const sbBtn = document.getElementById('sidebarTimerToggleBtn');
  if (sbBtn) sbBtn.innerHTML = "<i class='bx bx-play'></i>";
}

// Filter Options
function getSelectedChapters() {
  return [...document.querySelectorAll('#chapterChecks input:checked')].map(e => +e.value);
}

function getSelectedTypes() {
  return [...document.querySelectorAll('#typeChecks input:checked')].map(e => e.value);
}

function setChapterChecks(arr) {
  document.querySelectorAll('#chapterChecks input').forEach(input => {
    input.checked = arr.includes(+input.value);
  });
}

function setTypeChecks(arr) {
  document.querySelectorAll('#typeChecks input').forEach(input => {
    input.checked = arr.includes(input.value);
  });
}

// Presets (Chỉ cấu hình lựa chọn, KHÔNG tự động cuộn màn hình hoặc tạo đề)
document.querySelectorAll('.preset').forEach(btn => {
  btn.addEventListener('click', () => {
    sound.playClick();
    document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const p = btn.dataset.preset;

    if (p === 'calc') {
      // Chuyên đề 100% Bài tập tính toán
      if (elCalcOnlyToggle) elCalcOnlyToggle.checked = true;
      setChapterChecks([1, 2, 3, 4]); // Toàn bộ 4 chương có bài tập tính toán
      setTypeChecks(['mcq', 'fill']);
    } else {
      if (elCalcOnlyToggle) elCalcOnlyToggle.checked = false;
      if (p === '1') setChapterChecks([1]);
      else if (p === '2') setChapterChecks([2]);
      else if (p === '3') setChapterChecks([3]);
      else if (p === '4') setChapterChecks([4]);
      else if (p === 'all') {
        setChapterChecks([1, 2, 3, 4]);
        setTypeChecks(['mcq', 'tf', 'fill', 'drag', 'color', 'short']);
      } else if (p === 'essay') {
        setChapterChecks([1, 2, 3, 4]);
        setTypeChecks(['fill', 'drag', 'short']);
      } else if (p === 'indicator') {
        setChapterChecks([3, 4]);
        setTypeChecks(['mcq', 'tf', 'color', 'drag']);
      }
    }
  });
});

if (elCalcOnlyToggle) {
  elCalcOnlyToggle.addEventListener('change', () => {
    sound.playClick();
  });
}

document.querySelectorAll('#chapterChecks input, #typeChecks input').forEach(input => {
  input.addEventListener('change', () => {
    sound.playClick();
    document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
  });
});

// Balance Selection
function balanceQuestions(pool, targetCount) {
  if (targetCount >= pool.length) return shuffleArray(pool);

  const groups = {};
  pool.forEach(q => {
    const key = `${q.ch}-${q.type}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(q);
  });

  Object.keys(groups).forEach(k => {
    groups[k] = shuffleArray(groups[k]);
  });

  let keys = shuffleArray(Object.keys(groups));
  const res = [];

  while (res.length < targetCount && keys.length > 0) {
    const nextKeys = [];
    keys.forEach(k => {
      if (res.length >= targetCount) return;
      if (groups[k].length > 0) {
        res.push(groups[k].shift());
      }
      if (groups[k].length > 0) {
        nextKeys.push(k);
      }
    });
    keys = shuffleArray(nextKeys);
  }

  return shuffleArray(res);
}

// ==========================================
// 6. TẠO VÀ HIỂN THỊ BỘ CÂU HỎI
// ==========================================
function generateQuiz(shouldScroll = false) {
  sound.playClick();
  const chapters = getSelectedChapters();
  const types = getSelectedTypes();
  const isCalcOnly = elCalcOnlyToggle && elCalcOnlyToggle.checked;

  if (!chapters.length) {
    alert('Vui lòng chọn ít nhất một chương để ôn tập.');
    return;
  }
  if (!types.length) {
    alert('Vui lòng chọn ít nhất một dạng câu hỏi.');
    return;
  }

  let pool = QB.filter(q => chapters.includes(q.ch) && types.includes(q.type));

  // CHẾ ĐỘ 100% BÀI TẬP TÍNH TOÁN
  if (isCalcOnly) {
    pool = pool.filter(q => q.isCalc);
  }

  // Lọc theo từ khóa tìm kiếm
  const kw = (elSearchInput?.value || '').trim().toLowerCase();
  if (kw) {
    pool = pool.filter(q =>
      q.prompt.toLowerCase().includes(kw) ||
      q.topic.toLowerCase().includes(kw) ||
      (q.exp && q.exp.toLowerCase().includes(kw))
    );
  }

  // Lọc chỉ câu khó đã gắn sao
  if (isStarredOnlyFilter) {
    const starredIds = getStarredIds();
    pool = pool.filter(q => starredIds.includes(q.id));
  }

  if (!pool.length) {
    currentQuestions = [];
    elQuiz.innerHTML = '';
    elEmptyBox.style.display = 'block';
    elStickyStats.style.display = 'none';
    elQuizHeader.style.display = 'none';
    elResultsCard.style.display = 'none';
    return;
  }

  elEmptyBox.style.display = 'none';
  const countVal = elQuestionCount.value;
  const count = countVal === 'all' ? pool.length : Math.min(+countVal, pool.length);

  currentQuestions = balanceQuestions(pool, count);

  if (elOrderMode.value === 'chapter') {
    currentQuestions.sort((a, b) => a.ch !== b.ch ? a.ch - b.ch : a.id.localeCompare(b.id));
  }

  renderQuiz();
  startTimer();

  // CHỈ CUỘN XUỐNG KHI NGƯỜI DÙNG BẤM "TẠO ĐỀ" (shouldScroll === true)
  if (shouldScroll) {
    const target = elQuizHeader || elStickyStats || elQuiz;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function renderQuiz() {
  elQuiz.innerHTML = '';
  touchSelectedItem = null;
  dragSourceItem = null;
  elResultsCard.style.display = 'none';

  const starredIds = getStarredIds();
  const isCalcOnly = elCalcOnlyToggle && elCalcOnlyToggle.checked;

  currentQuestions.forEach((q, index) => {
    const card = document.createElement('section');
    card.className = 'question-card';
    card.dataset.id = q.id;
    card.dataset.status = '';

    const isStarred = starredIds.includes(q.id);

    card.innerHTML = `
      <div class="q-layout">
        <div class="q-index">${index + 1}</div>
        <div class="q-body">
          <div class="q-top-row">
            <div class="q-badges">
              <span class="badge badge-ch"><i class='bx bx-book-open'></i> ${chLabels[q.ch]}</span>
              <span class="badge badge-type"><i class='bx ${typeIcons[q.type]}'></i> ${typeLabels[q.type]}</span>
              ${q.isCalc ? "<span class='badge' style='background:rgba(245,158,11,0.18); color:#b45309; border:1px solid rgba(245,158,11,0.4);'><i class='bx bx-calculator'></i> Bài tập tính toán</span>" : ""}
              <span class="badge badge-topic">${q.topic}</span>
            </div>
            <button type="button" class="star-btn ${isStarred ? 'starred' : ''}" title="Đánh dấu câu hỏi cần xem lại">
              <i class='bx ${isStarred ? 'bxs-star' : 'bx-star'}'></i>
            </button>
          </div>
          <div class="q-prompt">${q.prompt}</div>
          <div class="q-answer-area"></div>
          <div class="q-actions">
            <button type="button" class="q-sub-btn btn-check-q"><i class='bx bx-check-circle'></i> Kiểm tra</button>
            <button type="button" class="q-sub-btn btn-ans-q"><i class='bx bx-show'></i> Xem đáp án</button>
          </div>
          <div class="feedback-box"></div>
        </div>
      </div>
    `;

    elQuiz.appendChild(card);
    buildAnswerArea(card, q);

    // Star handler
    const starBtn = card.querySelector('.star-btn');
    starBtn.addEventListener('click', () => {
      const nowStarred = toggleStar(q.id);
      starBtn.classList.toggle('starred', nowStarred);
      starBtn.innerHTML = `<i class='bx ${nowStarred ? 'bxs-star' : 'bx-star'}'></i>`;
      sound.playClick();
      updatePaletteButtons();
    });

    // Check & Reveal handlers
    card.querySelector('.btn-check-q').addEventListener('click', () => checkQuestion(card));
    card.querySelector('.btn-ans-q').addEventListener('click', () => revealQuestion(card));
  });

  elStickyStats.style.display = 'block';
  elQuizHeader.style.display = 'flex';
  const modeTag = isCalcOnly ? ' [100% BÀI TẬP TÍNH TOÁN]' : '';
  elQuizInfo.textContent = `${currentQuestions.length} câu hỏi${modeTag} • ${[...new Set(currentQuestions.map(q => 'Chương ' + q.ch))].join(', ')}`;
  updateStats();

  // Render LaTeX & mhchem
  renderMath(elQuiz);
  renderQuestionPalette();
}

function buildAnswerArea(card, q) {
  const area = card.querySelector('.q-answer-area');

  if (q.type === 'mcq') {
    const div = document.createElement('div');
    div.className = 'mcq-options';
    q.opts.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mcq-option';
      btn.dataset.value = String(i);
      btn.innerHTML = `<span class="mcq-letter">${String.fromCharCode(65 + i)}</span><span>${optText}</span>`;
      btn.addEventListener('click', () => {
        sound.playClick();
        div.querySelectorAll('.mcq-option').forEach(o => o.classList.remove('selected'));
        btn.classList.add('selected');
        card.dataset.selected = String(i);
        updatePaletteButtons();
      });
      div.appendChild(btn);
    });
    area.appendChild(div);
  } else if (q.type === 'tf') {
    const div = document.createElement('div');
    div.className = 'mcq-options';
    [
      { label: 'Đúng (True)', val: 'true', letter: 'Đ' },
      { label: 'Sai (False)', val: 'false', letter: 'S' }
    ].forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mcq-option';
      btn.dataset.value = item.val;
      btn.innerHTML = `<span class="mcq-letter">${item.letter}</span><span>${item.label}</span>`;
      btn.addEventListener('click', () => {
        sound.playClick();
        div.querySelectorAll('.mcq-option').forEach(o => o.classList.remove('selected'));
        btn.classList.add('selected');
        card.dataset.selected = item.val;
        updatePaletteButtons();
      });
      div.appendChild(btn);
    });
    area.appendChild(div);
  } else if (q.type === 'fill') {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'fill-input';
    input.placeholder = q.isCalc ? 'Nhập kết quả số tính toán (VD: 0.0582 hoặc 250)...' : 'Gõ câu trả lời của bạn vào đây...';
    input.addEventListener('input', () => updatePaletteButtons());
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') checkQuestion(card);
    });
    area.appendChild(input);
  } else if (q.type === 'short') {
    const ta = document.createElement('textarea');
    ta.className = 'short-input';
    ta.placeholder = 'Trình bày lời giải chi tiết hoặc các bước tính toán của bạn...';
    ta.addEventListener('input', () => updatePaletteButtons());
    area.appendChild(ta);
  } else if (q.type === 'color') {
    const grid = document.createElement('div');
    grid.className = 'color-grid';
    q.choices.forEach((item, i) => {
      const d = document.createElement('div');
      d.className = 'color-choice';
      d.dataset.value = String(i);
      d.innerHTML = `
        <div class="color-preview" style="background:${item.c};"></div>
        <div class="color-label">${item.lbl}</div>
      `;
      d.addEventListener('click', () => {
        sound.playClick();
        grid.querySelectorAll('.color-choice').forEach(x => x.classList.remove('selected'));
        d.classList.add('selected');
        card.dataset.selected = String(i);
        updatePaletteButtons();
      });
      grid.appendChild(d);
    });
    area.appendChild(grid);
  } else if (q.type === 'drag') {
    if (q.dk === 'order') buildOrderDrag(card, q, area);
    else buildMatchDrag(card, q, area);
  }
}

// Order Drag & Drop (Touch Friendly)
function buildOrderDrag(card, q, area) {
  const hint = document.createElement('div');
  hint.className = 'drag-hint';
  hint.innerHTML = `<i class='bx bx-move'></i> Kéo thả để sắp xếp. Trên màn hình cảm ứng: Chạm 2 mục để đổi chỗ cho nhau.`;

  const container = document.createElement('div');
  container.className = 'order-container';

  shuffleArray(q.items).forEach(val => {
    const item = document.createElement('div');
    item.className = 'order-card';
    item.draggable = true;
    item.dataset.value = val;
    item.innerHTML = `<i class='bx bx-menu'></i> <span>${val}</span>`;

    item.addEventListener('dragstart', () => {
      card._dragItem = item;
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      card._dragItem = null;
    });
    item.addEventListener('dragover', e => e.preventDefault());
    item.addEventListener('drop', e => {
      e.preventDefault();
      const dragged = card._dragItem;
      if (!dragged || dragged === item) return;
      const rect = item.getBoundingClientRect();
      if (e.clientY > rect.top + rect.height / 2) {
        item.after(dragged);
      } else {
        item.before(dragged);
      }
    });

    item.addEventListener('click', () => {
      sound.playClick();
      if (!touchSelectedItem) {
        touchSelectedItem = item;
        item.classList.add('selected-touch');
        return;
      }
      if (touchSelectedItem === item) {
        item.classList.remove('selected-touch');
        touchSelectedItem = null;
        return;
      }

      if (touchSelectedItem.parentNode === item.parentNode) {
        const parent = item.parentNode;
        const markA = document.createComment('a');
        const markB = document.createComment('b');
        parent.replaceChild(markA, touchSelectedItem);
        parent.replaceChild(markB, item);
        parent.replaceChild(item, markA);
        parent.replaceChild(touchSelectedItem, markB);
      }
      touchSelectedItem.classList.remove('selected-touch');
      touchSelectedItem = null;
    });

    container.appendChild(item);
  });

  area.appendChild(hint);
  area.appendChild(container);
}

// Match Pairing Drag & Drop (Touch Friendly)
function buildMatchDrag(card, q, area) {
  const hint = document.createElement('div');
  hint.className = 'drag-hint';
  hint.innerHTML = `<i class='bx bx-shuffle'></i> Kéo đáp án vào ô tương ứng. Hoặc chạm chọn đáp án rồi chạm vào ô muốn gắn.`;

  const grid = document.createElement('div');
  grid.className = 'match-grid';

  const targets = document.createElement('div');
  targets.className = 'match-targets';

  q.pairs.forEach((pair, idx) => {
    const row = document.createElement('div');
    row.className = 'match-pair-row';

    const left = document.createElement('div');
    left.className = 'match-left-item';
    left.textContent = pair.l;

    const slot = document.createElement('div');
    slot.className = 'match-drop-target';
    slot.dataset.expected = pair.r;
    slot.dataset.index = String(idx);

    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('drop', e => {
      e.preventDefault();
      if (card._dragChip) placeChipInSlot(card, card._dragChip, slot);
    });

    slot.addEventListener('click', () => {
      if (card._touchSelectedChip) {
        placeChipInSlot(card, card._touchSelectedChip, slot);
        card._touchSelectedChip.classList.remove('selected-touch');
        card._touchSelectedChip = null;
        sound.playClick();
      }
    });

    row.appendChild(left);
    row.appendChild(slot);
    targets.appendChild(row);
  });

  const pool = document.createElement('div');
  pool.className = 'match-chips-pool';
  const header = document.createElement('div');
  header.className = 'pool-header';
  header.textContent = 'Danh sách đáp án lựa chọn';
  pool.appendChild(header);

  shuffleArray(q.pairs.map(p => p.r)).forEach(val => {
    const chip = document.createElement('div');
    chip.className = 'match-chip';
    chip.draggable = true;
    chip.dataset.value = val;
    chip.textContent = val;

    chip.addEventListener('dragstart', () => {
      card._dragChip = chip;
    });
    chip.addEventListener('dragend', () => {
      card._dragChip = null;
    });

    chip.addEventListener('click', e => {
      e.stopPropagation();
      sound.playClick();
      if (card._touchSelectedChip === chip) {
        chip.classList.remove('selected-touch');
        card._touchSelectedChip = null;
        return;
      }
      if (card._touchSelectedChip) card._touchSelectedChip.classList.remove('selected-touch');
      card._touchSelectedChip = chip;
      chip.classList.add('selected-touch');
    });

    pool.appendChild(chip);
  });

  pool.addEventListener('dragover', e => e.preventDefault());
  pool.addEventListener('drop', e => {
    e.preventDefault();
    if (card._dragChip) pool.appendChild(card._dragChip);
  });

  grid.appendChild(targets);
  grid.appendChild(pool);
  area.appendChild(hint);
  area.appendChild(grid);
}

function placeChipInSlot(card, chip, slot) {
  const existing = slot.querySelector('.match-chip');
  if (existing && existing !== chip) {
    card.querySelector('.match-chips-pool').appendChild(existing);
  }
  slot.appendChild(chip);
}

// ==========================================
// 7. CHẤM ĐIỂM & ĐÁNH GIÁ CÂU HỎI
// ==========================================
function getQuestionData(card) {
  return QB.find(q => q.id === card.dataset.id);
}

function setCardStatus(card, status) {
  card.dataset.status = status || '';
  card.classList.remove('correct', 'wrong', 'pending');
  if (status) card.classList.add(status);
  updateStats();
}

function getExplanationHtml(q) {
  if (elExplainMode.value === 'yes' && q.exp) {
    return `<div class="feedback-explanation"><strong>💡 Lời giải &amp; Công thức áp dụng:</strong><br>${q.exp}</div>`;
  }
  return '';
}

function getCorrectAnswerText(q) {
  if (q.type === 'mcq') return q.opts[q.ans];
  if (q.type === 'tf') return q.ans ? 'Đúng' : 'Sai';
  if (q.type === 'fill') return q.ansD || q.ans[0];
  if (q.type === 'color') return q.choices[q.ans].lbl;
  if (q.type === 'short') return q.model;
  if (q.type === 'drag') {
    if (q.dk === 'order') return q.order.join(' → ');
    if (q.dk === 'match') return q.pairs.map(p => `${p.l} → ${p.r}`).join('<br>');
  }
  return '';
}

function checkQuestion(card) {
  const q = getQuestionData(card);
  const fb = card.querySelector('.feedback-box');
  let isCorrect = false;
  let hasAnswered = true;

  if (q.type === 'mcq' || q.type === 'color') {
    const sel = card.dataset.selected;
    if (!sel && sel !== '0') hasAnswered = false;
    else isCorrect = +sel === q.ans;
  } else if (q.type === 'tf') {
    const sel = card.dataset.selected;
    if (!sel) hasAnswered = false;
    else isCorrect = (sel === 'true') === q.ans;
  } else if (q.type === 'fill') {
    const val = card.querySelector('.fill-input').value.trim();
    if (!val) hasAnswered = false;
    else isCorrect = isAnswerAccepted(val, q.ans);
  } else if (q.type === 'drag') {
    if (q.dk === 'order') {
      const currentValues = [...card.querySelectorAll('.order-container .order-card')].map(e => e.dataset.value);
      isCorrect = currentValues.length === q.order.length && currentValues.every((v, i) => v === q.order[i]);
    } else {
      const slots = [...card.querySelectorAll('.match-drop-target')];
      if (!slots.every(s => s.querySelector('.match-chip'))) {
        hasAnswered = false;
      } else {
        isCorrect = slots.every(s => s.querySelector('.match-chip').dataset.value === s.dataset.expected);
      }
    }
  } else if (q.type === 'short') {
    const val = card.querySelector('.short-input').value.trim();
    if (!val) {
      hasAnswered = false;
    } else {
      fb.className = 'feedback-box show pending';
      fb.innerHTML = `
        <strong>📝 Hướng dẫn giải &amp; Thang điểm:</strong><br>${q.model.replace(/\n/g, '<br>')}
        ${getExplanationHtml(q)}
        <div class="self-grade-row">
          <button type="button" class="btn btn-success self-good-btn"><i class='bx bx-check'></i> Tự chấm: Đúng / Đủ ý (+Điểm)</button>
          <button type="button" class="btn btn-danger self-bad-btn"><i class='bx bx-x'></i> Tự chấm: Chưa đủ / Sai</button>
        </div>
      `;
      setCardStatus(card, 'pending');
      renderMath(fb);

      fb.querySelector('.self-good-btn').onclick = () => {
        sound.playCorrect();
        setCardStatus(card, 'correct');
        fb.className = 'feedback-box show correct';
        fb.innerHTML = `Đã tự đánh giá: <strong>Chính xác / Đủ ý!</strong><br>${q.model.replace(/\n/g, '<br>')}`;
        renderMath(fb);
      };
      fb.querySelector('.self-bad-btn').onclick = () => {
        sound.playWrong();
        setCardStatus(card, 'wrong');
        fb.className = 'feedback-box show wrong';
        fb.innerHTML = `Đã tự đánh giá: <strong>Chưa đạt!</strong> Hãy xem lại hướng dẫn giải:<br>${q.model.replace(/\n/g, '<br>')}`;
        renderMath(fb);
      };
      return;
    }
  }

  if (!hasAnswered) {
    sound.playClick();
    fb.className = 'feedback-box show answer';
    fb.innerHTML = `<i class='bx bx-info-circle'></i> Bé Ngân ơi, hãy hoàn thành câu trả lời trước khi kiểm tra nhé!`;
    return;
  }

  if (isCorrect) {
    sound.playCorrect();
    setCardStatus(card, 'correct');
    fb.className = 'feedback-box show correct';
    fb.innerHTML = `
      <div><i class='bx bx-check-circle'></i> <strong>Rất giỏi! Bé Ngân đã giải đúng bài này.</strong></div>
      ${getExplanationHtml(q)}
    `;
  } else {
    sound.playWrong();
    setCardStatus(card, 'wrong');
    fb.className = 'feedback-box show wrong';
    fb.innerHTML = `
      <div><i class='bx bx-x-circle'></i> <strong>Chưa chính xác rồi.</strong> Đáp án đúng là: <strong>${getCorrectAnswerText(q)}</strong></div>
      ${getExplanationHtml(q)}
    `;
  }

  // Render LaTeX cho phần feedback
  renderMath(fb);
}

function revealQuestion(card) {
  sound.playClick();
  const q = getQuestionData(card);
  const fb = card.querySelector('.feedback-box');
  fb.className = 'feedback-box show answer';
  fb.innerHTML = `
    <div><i class='bx bx-bulb'></i> <strong>Đáp án đúng:</strong> ${getCorrectAnswerText(q)}</div>
    ${getExplanationHtml(q)}
  `;
  if (q.type === 'short') {
    setCardStatus(card, 'pending');
  }
  renderMath(fb);
}

function checkAllQuestions() {
  sound.playClick();
  document.querySelectorAll('.question-card').forEach(card => checkQuestion(card));
  showResultsCard();
}

function revealAllQuestions() {
  sound.playClick();
  document.querySelectorAll('.question-card').forEach(card => revealQuestion(card));
  showResultsCard();
}

function resetCurrentSet() {
  sound.playClick();
  renderQuiz();
  resetTimer();
  startTimer();
  window.scrollTo({
    top: elStickyStats.offsetTop - 20,
    behavior: 'smooth'
  });
}

function updateStats() {
  const cards = [...document.querySelectorAll('.question-card')];
  const total = cards.length;
  const correct = cards.filter(c => c.dataset.status === 'correct').length;
  const wrong = cards.filter(c => c.dataset.status === 'wrong').length;
  const pending = cards.filter(c => c.dataset.status === 'pending').length;
  const checked = correct + wrong + pending;
  const score = (correct + wrong) ? Math.round((correct / (correct + wrong)) * 100) : 0;

  if (elStatTotal) elStatTotal.textContent = total;
  if (elStatChecked) elStatChecked.textContent = checked;
  if (elStatCorrect) elStatCorrect.textContent = correct;
  if (elStatScore) elStatScore.textContent = `${score}%`;

  const percentProgress = total ? (checked / total) * 100 : 0;
  if (elProgressBar) elProgressBar.style.width = `${percentProgress}%`;

  // Đồng bộ sang thanh Sidebar của Laptop
  const sbTotal = document.getElementById('sidebarStatTotal');
  if (sbTotal) sbTotal.textContent = total;
  const sbChecked = document.getElementById('sidebarStatChecked');
  if (sbChecked) sbChecked.textContent = checked;
  const sbCorrect = document.getElementById('sidebarStatCorrect');
  if (sbCorrect) sbCorrect.textContent = correct;
  const sbScore = document.getElementById('sidebarStatScore');
  if (sbScore) sbScore.textContent = `${score}%`;
  const sbBar = document.getElementById('sidebarProgressBar');
  if (sbBar) sbBar.style.width = `${percentProgress}%`;
  const palBadge = document.getElementById('paletteBadge');
  if (palBadge) palBadge.textContent = `${checked}/${total}`;

  updatePaletteButtons();
}

function showResultsCard() {
  const cards = [...document.querySelectorAll('.question-card')];
  const correct = cards.filter(c => c.dataset.status === 'correct').length;
  const wrong = cards.filter(c => c.dataset.status === 'wrong').length;
  const pending = cards.filter(c => c.dataset.status === 'pending').length;
  const score = (correct + wrong) ? Math.round((correct / (correct + wrong)) * 100) : 0;

  pauseTimer();
  elResultsCard.style.display = 'block';

  elResultCorrect.textContent = correct;
  elResultWrong.textContent = wrong;
  elResultPending.textContent = pending;
  elResultScore.textContent = `${score}%`;

  let msg = `⏱️ Thời gian giải bài: <strong>${formatTime(timerSeconds)}</strong>. `;

  if (pending > 0) {
    msg += `Còn ${pending} câu tự luận đang chờ bé Ngân tự đối chiếu đáp án. `;
  }

  if (correct + wrong === 0) {
    msg += 'Bé Ngân hãy hoàn thành các câu hỏi để chấm điểm nhé!';
  } else if (score >= 90) {
    msg += '🎉 <strong>Xuất sắc tuyệt vời!</strong> Bé Ngân tính toán rất chuẩn xác, đạt điểm tuyệt đối môn Hóa Phân tích!';
    sound.playFanfare();
    launchConfetti();
  } else if (score >= 75) {
    msg += '🌟 <strong>Rất tốt!</strong> Kỹ năng áp dụng công thức của bé Ngân rất vững, chỉ cần xem lại các phép tính sai số nhỏ!';
    sound.playFanfare();
    launchConfetti();
  } else if (score >= 50) {
    msg += '💪 <strong>Cố gắng lên nhé!</strong> Bé Ngân hãy mở mục "Tra cứu công thức tính toán" để xem lại công thức trong slide rồi luyện tập tiếp!';
  } else {
    msg += '📖 Hãy mở tab "Công thức tính toán (PDF)" để xem kỹ các ví dụ mẫu rồi bấm "Luyện lại bộ đề" nhé!';
  }

  elResultMessage.innerHTML = msg;

  window.scrollTo({
    top: elResultsCard.offsetTop - 30,
    behavior: 'smooth'
  });
}

// ==========================================
// 8. GIAO DIỆN TÙY CHỌN, THEME & SỔ TAY CÔNG THỨC
// ==========================================

// Theme Dark/Light
const themeBtn = document.getElementById('themeToggleBtn');
if (themeBtn) {
  const savedTheme = localStorage.getItem('chem_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeBtn.innerHTML = `<i class='bx ${savedTheme === 'dark' ? 'bx-sun' : 'bx-moon'}'></i>`;

  themeBtn.addEventListener('click', () => {
    sound.playClick();
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('chem_theme', next);
    themeBtn.innerHTML = `<i class='bx ${next === 'dark' ? 'bx-sun' : 'bx-moon'}'></i>`;
  });
}

// Sound Mute Toggle
const soundBtn = document.getElementById('soundToggleBtn');
if (soundBtn) {
  soundBtn.innerHTML = `<i class='bx ${sound.muted ? 'bx-volume-mute' : 'bx-volume-full'}'></i>`;
  soundBtn.addEventListener('click', () => {
    const isMuted = sound.toggleMute();
    soundBtn.innerHTML = `<i class='bx ${isMuted ? 'bx-volume-mute' : 'bx-volume-full'}'></i>`;
  });
}

// Modal Sổ tay công thức & Bảng Fullscreen Không cuộn
const cheatModal = document.getElementById('cheatSheetModal');
const modalBox = document.getElementById('modalBox');
const cheatBtn = document.getElementById('cheatSheetBtn');
const cheatBoardBtn = document.getElementById('cheatBoardBtn');
const cheatCloseBtn = document.getElementById('cheatCloseBtn');
const calcHubBtn = document.getElementById('calcHubBtn');
const openCalcGuideBtn = document.getElementById('openCalcGuideBtn');
const btnViewTab = document.getElementById('btnViewTab');
const btnViewBoard = document.getElementById('btnViewBoard');
const modalExpandBtn = document.getElementById('modalExpandBtn');
const fullscreenBoardGrid = document.getElementById('fullscreenBoardGrid');
const boardZoomVal = document.getElementById('boardZoomVal');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnZoomReset = document.getElementById('btnZoomReset');

let currentCheatMode = 'tab';
let boardZoomLevel = 1.0;

function setCheatViewMode(mode) {
  currentCheatMode = mode;
  const isBoard = mode === 'board';
  if (modalBox) modalBox.classList.toggle('fullscreen-board-mode', isBoard);
  if (cheatModal) cheatModal.classList.toggle('fullscreen-active', isBoard);

  if (btnViewTab) btnViewTab.classList.toggle('active', !isBoard);
  if (btnViewBoard) btnViewBoard.classList.toggle('active', isBoard);

  if (modalExpandBtn) {
    modalExpandBtn.innerHTML = isBoard ? `<i class='bx bx-exit-fullscreen'></i>` : `<i class='bx bx-fullscreen'></i>`;
    modalExpandBtn.title = isBoard ? "Thu nhỏ về dạng Modal Tab" : "Mở rộng toàn màn hình (Bảng)";
  }

  if (isBoard) {
    if (fullscreenBoardGrid) renderMath(fullscreenBoardGrid);
  } else {
    const activeTabBtn = document.querySelector('.modal-tab-btn.active');
    const tabId = activeTabBtn ? activeTabBtn.dataset.tab : 'tab-calculations';
    const target = document.getElementById(tabId);
    if (target) {
      target.style.display = 'block';
      renderMath(target);
    }
  }
}

function openModalToTab(tabId) {
  sound.playClick();
  if (!cheatModal) return;
  cheatModal.classList.add('open');
  document.body.classList.add('modal-open');
  setCheatViewMode('tab');

  document.querySelectorAll('.modal-tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  document.querySelectorAll('.cheat-tab-content').forEach(c => {
    c.style.display = c.id === tabId ? 'block' : 'none';
  });

  const activeContent = document.getElementById(tabId);
  if (activeContent) renderMath(activeContent);
}

function openModalToBoard() {
  sound.playClick();
  if (!cheatModal) return;
  cheatModal.classList.add('open');
  document.body.classList.add('modal-open');
  setCheatViewMode('board');
}

function closeCheatModal() {
  sound.playClick();
  if (!cheatModal) return;
  cheatModal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

function updateBoardZoom() {
  if (fullscreenBoardGrid) {
    fullscreenBoardGrid.style.setProperty('--board-zoom', boardZoomLevel);
  }
  if (boardZoomVal) {
    boardZoomVal.textContent = Math.round(boardZoomLevel * 100) + '%';
  }
}

if (btnZoomIn) {
  btnZoomIn.addEventListener('click', () => {
    sound.playClick();
    boardZoomLevel = Math.min(1.3, +(boardZoomLevel + 0.05).toFixed(2));
    updateBoardZoom();
  });
}
if (btnZoomOut) {
  btnZoomOut.addEventListener('click', () => {
    sound.playClick();
    boardZoomLevel = Math.max(0.75, +(boardZoomLevel - 0.05).toFixed(2));
    updateBoardZoom();
  });
}
if (btnZoomReset) {
  btnZoomReset.addEventListener('click', () => {
    sound.playClick();
    boardZoomLevel = 1.0;
    updateBoardZoom();
  });
}

if (btnViewTab) {
  btnViewTab.addEventListener('click', () => {
    sound.playClick();
    setCheatViewMode('tab');
  });
}
if (btnViewBoard) {
  btnViewBoard.addEventListener('click', () => {
    sound.playClick();
    setCheatViewMode('board');
  });
}
if (modalExpandBtn) {
  modalExpandBtn.addEventListener('click', () => {
    sound.playClick();
    setCheatViewMode(currentCheatMode === 'board' ? 'tab' : 'board');
  });
}

if (cheatBtn) {
  cheatBtn.addEventListener('click', () => openModalToTab('tab-calculations'));
}
if (cheatBoardBtn) {
  cheatBoardBtn.addEventListener('click', openModalToBoard);
}
if (calcHubBtn) {
  calcHubBtn.addEventListener('click', () => openModalToTab('tab-calculations'));
}
if (openCalcGuideBtn) {
  openCalcGuideBtn.addEventListener('click', () => openModalToTab('tab-calculations'));
}
if (cheatCloseBtn) {
  cheatCloseBtn.addEventListener('click', closeCheatModal);
}
if (cheatModal) {
  cheatModal.addEventListener('click', e => {
    if (e.target === cheatModal) closeCheatModal();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (elFzOverlay && elFzOverlay.classList.contains('active')) {
      e.preventDefault();
      closeFormulaZoom();
      return;
    }
    if (cheatModal && cheatModal.classList.contains('open')) {
      closeCheatModal();
    }
  }
});

// ==========================================
// 8.5. BỘ ĐIỀU KHIỂN PHÓNG TO CÔNG THỨC (FORMULA ZOOM LIGHTBOX)
// ==========================================
let zoomFormulaList = [];
let currentZoomIndex = 0;

const elFzOverlay = document.getElementById('formulaZoomOverlay');
const elFzTitle = document.getElementById('fzTitle');
const elFzTag = document.getElementById('fzTag');
const elFzMath = document.getElementById('fzMath');
const elFzDesc = document.getElementById('fzDesc');
const elFzCounter = document.getElementById('fzCounter');
const elFzPrevBtn = document.getElementById('fzPrevBtn');
const elFzNextBtn = document.getElementById('fzNextBtn');
const elFzCloseBtn = document.getElementById('fzCloseBtn');
const elFzCard = document.getElementById('formulaZoomCard');

function collectBoardFormulas() {
  const items = [];
  const tiles = document.querySelectorAll('.fullscreen-board-grid .board-tile');
  tiles.forEach((tile, tileIdx) => {
    const tileTagEl = tile.querySelector('.tile-tag');
    const tileH4 = tile.querySelector('.tile-header h4');
    const categoryName = `${tileTagEl ? tileTagEl.textContent.trim() : `MỤC ${tileIdx + 1}`} • ${tileH4 ? tileH4.textContent.trim() : ''}`;

    const rows = tile.querySelectorAll('.tile-row');
    rows.forEach((row, rowIdx) => {
      const nameEl = row.querySelector('.t-name');
      const formulaEl = row.querySelector('.t-formula');
      const descEl = row.querySelector('.t-desc');

      const isNotInPdf = row.classList.contains('not-in-pdf') || row.dataset.notInPdf === 'true';
      const isExtended = row.classList.contains('formula-extended') || row.dataset.extended === 'true';

      if (!row.dataset.rawFormula && formulaEl) {
        row.dataset.rawFormula = formulaEl.innerHTML;
      }
      if (!row.dataset.rawDesc && descEl) {
        row.dataset.rawDesc = descEl.innerHTML;
      }
      if (!row.dataset.rawName && nameEl) {
        row.dataset.rawName = nameEl.innerHTML;
      }

      items.push({
        element: row,
        category: categoryName,
        title: row.dataset.rawName || (nameEl ? nameEl.innerHTML.trim() : `Công thức ${rowIdx + 1}`),
        formulaHtml: row.dataset.rawFormula || (formulaEl ? formulaEl.innerHTML.trim() : ''),
        descHtml: row.dataset.rawDesc || (descEl ? descEl.innerHTML.trim() : ''),
        notInPdf: isNotInPdf,
        extended: isExtended
      });
    });
  });
  return items;
}

function openFormulaZoom(index) {
  if (!zoomFormulaList.length) {
    zoomFormulaList = collectBoardFormulas();
  }
  if (!zoomFormulaList.length) return;

  if (index < 0) index = zoomFormulaList.length - 1;
  if (index >= zoomFormulaList.length) index = 0;
  currentZoomIndex = index;

  const item = zoomFormulaList[currentZoomIndex];
  if (!item) return;

  sound.playClick();

  // Tự động điều chỉnh kích thước cho công thức dài để luôn vừa vặn không cuộn ngang
  const rawMathContent = (item.formulaHtml || item.descHtml || '');
  if (elFzCard) {
    elFzCard.classList.toggle('fz-wide-formula', rawMathContent.length > 70);
    elFzCard.classList.toggle('is-not-in-pdf', !!item.notInPdf);
    elFzCard.classList.toggle('is-extended-pdf', !!item.extended);
  }

  if (elFzTag) {
    if (item.notInPdf) {
      elFzTag.innerHTML = `<i class='bx bx-x-circle'></i> KHÔNG CÓ TRONG SLIDE PDF • ${item.category}`;
    } else if (item.extended) {
      elFzTag.innerHTML = `<i class='bx bx-bolt-circle'></i> CÔNG THỨC GIẢI NHANH BỔ SUNG • ${item.category}`;
    } else {
      elFzTag.innerHTML = `<i class='bx bx-book-bookmark'></i> ${item.category}`;
    }
  }

  if (elFzTitle) {
    elFzTitle.innerHTML = item.title;
    renderMath(elFzTitle);
  }

  if (elFzMath) {
    if (item.formulaHtml) {
      elFzMath.style.display = 'flex';
      elFzMath.innerHTML = item.formulaHtml;
      renderMath(elFzMath);
    } else if (item.descHtml) {
      elFzMath.style.display = 'flex';
      elFzMath.innerHTML = item.descHtml;
      renderMath(elFzMath);
    } else {
      elFzMath.style.display = 'none';
    }
  }

  if (elFzDesc) {
    let alertHtml = '';
    if (item.notInPdf) {
      alertHtml = `<div class="fz-alert-not-pdf"><i class='bx bx-error-circle'></i> <strong>Lưu ý:</strong> Công thức này <strong>hoàn toàn không có trong 4 slide PDF</strong> bài giảng, đây là kiến thức mở rộng từ giáo trình Hóa Phân Tích (thường dùng trong ngành Dược).</div>`;
    } else if (item.extended) {
      alertHtml = `<div class="fz-alert-extended"><i class='bx bx-bulb'></i> <strong>Công thức giải nhanh:</strong> Slide PDF chỉ có bài toán ví dụ hoặc sơ đồ phản ứng từng nấc; đây là biểu thức rút gọn được đúc kết để tính nhanh kết quả khi làm bài thi.</div>`;
    }

    if (alertHtml || (item.descHtml && item.formulaHtml)) {
      elFzDesc.style.display = 'block';
      let content = alertHtml;
      if (item.descHtml && item.formulaHtml) {
        const descText = item.descHtml.startsWith('📚') ? item.descHtml : `<strong>💡 Ghi chú:</strong><br>${item.descHtml}`;
        content += (content ? '<div style="margin-top: 8px;">' : '') + descText + (content ? '</div>' : '');
      }
      elFzDesc.innerHTML = content;
      renderMath(elFzDesc);
    } else {
      elFzDesc.style.display = 'none';
    }
  }

  if (elFzCounter) {
    elFzCounter.textContent = `${currentZoomIndex + 1} / ${zoomFormulaList.length}`;
  }

  if (elFzOverlay) {
    elFzOverlay.classList.add('active');
    elFzOverlay.setAttribute('aria-hidden', 'false');
  }

  if (elFzCard) {
    renderMath(elFzCard);
  }
}

function closeFormulaZoom() {
  if (elFzOverlay && elFzOverlay.classList.contains('active')) {
    sound.playClick();
    elFzOverlay.classList.remove('active');
    elFzOverlay.setAttribute('aria-hidden', 'true');
  }
}

function initFormulaZoom() {
  zoomFormulaList = collectBoardFormulas();

  zoomFormulaList.forEach((item, idx) => {
    item.element.addEventListener('click', (e) => {
      e.stopPropagation();
      openFormulaZoom(idx);
    });
  });

  // Hỗ trợ cả công thức hay gặp ở thanh bên Desktop
  document.querySelectorAll('.quick-formula-item').forEach((item) => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      const nameEl = item.querySelector('.quick-formula-name');
      const mathEl = item.querySelector('.quick-formula-math');
      const mathContent = mathEl ? mathEl.innerHTML.trim() : '';

      if (elFzCard) {
        elFzCard.classList.toggle('fz-wide-formula', mathContent.length > 70);
      }

      if (elFzTag) elFzTag.innerHTML = `<i class='bx bx-calculator'></i> Công thức hay gặp (PDF)`;
      if (elFzTitle) {
        elFzTitle.innerHTML = nameEl ? nameEl.innerHTML.trim() : 'Công thức';
        renderMath(elFzTitle);
      }
      if (elFzMath) {
        elFzMath.style.display = 'flex';
        elFzMath.innerHTML = mathContent;
        renderMath(elFzMath);
      }
      if (elFzDesc) elFzDesc.style.display = 'none';
      if (elFzCounter) elFzCounter.textContent = `⭐ Hay gặp`;
      if (elFzOverlay) {
        elFzOverlay.classList.add('active');
        elFzOverlay.setAttribute('aria-hidden', 'false');
      }
      if (elFzCard) renderMath(elFzCard);
    });
  });

  // Nút đóng & điều hướng
  elFzCloseBtn?.addEventListener('click', closeFormulaZoom);
  elFzOverlay?.addEventListener('click', (e) => {
    if (e.target === elFzOverlay) closeFormulaZoom();
  });
  elFzPrevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openFormulaZoom(currentZoomIndex - 1);
  });
  elFzNextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    openFormulaZoom(currentZoomIndex + 1);
  });

  // Phím tắt bàn phím
  window.addEventListener('keydown', (e) => {
    if (elFzOverlay && elFzOverlay.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        openFormulaZoom(currentZoomIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        openFormulaZoom(currentZoomIndex + 1);
      }
    }
  });
}

// Modal Tabs
document.querySelectorAll('.modal-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    sound.playClick();
    document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.cheat-tab-content').forEach(c => c.style.display = 'none');
    btn.classList.add('active');
    const tabId = btn.dataset.tab;
    const target = document.getElementById(tabId);
    if (target) {
      target.style.display = 'block';
      renderMath(target);
    }
  });
});

// Timer Buttons
const timerToggleBtn = document.getElementById('timerToggleBtn');
if (timerToggleBtn) {
  timerToggleBtn.addEventListener('click', () => {
    sound.playClick();
    if (timerRunning) pauseTimer();
    else startTimer();
  });
}

// Starred Filter Toggle
const starFilterBtn = document.getElementById('bookmarkFilterBtn');
if (starFilterBtn) {
  starFilterBtn.addEventListener('click', () => {
    sound.playClick();
    isStarredOnlyFilter = !isStarredOnlyFilter;
    starFilterBtn.classList.toggle('active', isStarredOnlyFilter);
    if (isStarredOnlyFilter) {
      starFilterBtn.innerHTML = "<i class='bx bxs-star'></i> Đang xem câu khó";
    } else {
      starFilterBtn.innerHTML = "<i class='bx bx-star'></i> Chỉ xem câu khó";
    }
  });
}

// Search input: Tìm kiếm khi ấn Enter hoặc khi bấm nút "Tạo đề"
if (elSearchInput) {
  elSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      generateQuiz(true);
    }
  });
}

// Dropdown changes: Chỉ lưu tùy chọn, không tự ý cuộn màn hình
[elQuestionCount, elOrderMode, elExplainMode].forEach(sel => {
  sel?.addEventListener('change', () => {
    sound.playClick();
  });
});

// Buttons: CHỈ KHI ẤN NÚT NÀY MỚI TẠO ĐỀ VÀ CUỘN MÀN HÌNH XUỐNG
document.getElementById('generateBtn')?.addEventListener('click', () => {
  generateQuiz(true);
});
document.getElementById('newSetBtn')?.addEventListener('click', () => {
  generateQuiz(true);
});
document.getElementById('checkAllBtn')?.addEventListener('click', checkAllQuestions);
document.getElementById('showAllBtn')?.addEventListener('click', revealAllQuestions);
document.getElementById('resetBtn')?.addEventListener('click', resetCurrentSet);

// ==========================================
// 9. BẢNG ĐIỀU HƯỚNG CÂU HỎI (QUESTION PALETTE CHO LAPTOP)
// ==========================================
function renderQuestionPalette() {
  const grid = document.getElementById('questionPaletteGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const starredIds = getStarredIds();

  currentQuestions.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'palette-btn';
    btn.dataset.id = q.id;
    btn.dataset.idx = idx;
    btn.innerHTML = `<span>${idx + 1}</span>`;
    btn.title = `Câu ${idx + 1} (${chLabels[q.ch]} • ${q.topic})`;

    if (starredIds.includes(q.id)) {
      btn.classList.add('starred');
    }

    btn.addEventListener('click', () => {
      sound.playClick();
      const card = document.querySelector(`.question-card[data-id="${q.id}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.remove('card-jump-highlight');
        void card.offsetWidth; // Force reflow
        card.classList.add('card-jump-highlight');
        setTimeout(() => card.classList.remove('card-jump-highlight'), 1200);

        document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active-q'));
        btn.classList.add('active-q');
      }
    });

    grid.appendChild(btn);
  });

  updatePaletteButtons();
}

function updatePaletteButtons() {
  const cards = document.querySelectorAll('.question-card');
  const starredIds = getStarredIds();

  cards.forEach(card => {
    const qid = card.dataset.id;
    const palBtn = document.querySelector(`.palette-btn[data-id="${qid}"]`);
    if (!palBtn) return;

    const status = card.dataset.status;
    const isSelected = card.dataset.selected !== undefined ||
      (card.querySelector('.fill-input') && card.querySelector('.fill-input').value.trim() !== '') ||
      (card.querySelector('.short-input') && card.querySelector('.short-input').value.trim() !== '');

    palBtn.classList.remove('correct', 'wrong', 'answered', 'starred');
    if (starredIds.includes(qid)) {
      palBtn.classList.add('starred');
    }

    if (status === 'correct') {
      palBtn.classList.add('correct');
    } else if (status === 'wrong') {
      palBtn.classList.add('wrong');
    } else if (isSelected) {
      palBtn.classList.add('answered');
    }
  });
}

// ==========================================
// 10. BỘ CHUYỂN ĐỔI THIẾT BỊ (AUTO / LAPTOP / IPHONE)
// ==========================================
let currentDeviceMode = localStorage.getItem('chem_device_view_mode') || 'auto';

function setDeviceMode(mode) {
  currentDeviceMode = mode;
  localStorage.setItem('chem_device_view_mode', mode);

  document.querySelectorAll('.device-switcher .dev-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  document.body.dataset.deviceMode = mode;
  handleAutoResponsive();
  updateIosClock();
}

function handleAutoResponsive() {
  const mode = document.body.dataset.deviceMode || 'auto';
  const isMobile = window.innerWidth <= 900;

  if (mode === 'auto') {
    document.body.dataset.effectiveMode = isMobile ? 'iphone' : 'laptop';
  } else {
    document.body.dataset.effectiveMode = mode;
  }
}

function updateIosClock() {
  const timeEl = document.getElementById('iosTime');
  if (!timeEl) return;
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  timeEl.textContent = `${h}:${m}`;
}

function initDeviceMode() {
  setDeviceMode(currentDeviceMode);

  document.querySelectorAll('.device-switcher .dev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      setDeviceMode(btn.dataset.mode);
    });
  });

  const exitBtn = document.getElementById('exitIphoneBtn');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      sound.playClick();
      setDeviceMode('laptop');
    });
  }

  window.addEventListener('resize', () => {
    if (document.body.dataset.deviceMode === 'auto') {
      handleAutoResponsive();
    }
  });

  // Dynamic Island click interaction
  const island = document.getElementById('dynamicIsland');
  if (island) {
    island.addEventListener('click', () => {
      sound.playClick();
      if (timerRunning) pauseTimer();
      else startTimer();
    });
  }

  updateIosClock();
  setInterval(updateIosClock, 30000);
}

// ==========================================
// 11. SIDEBAR LAPTOP & iOS TAB BAR LISTENERS
// ==========================================
document.getElementById('sidebarTimerToggleBtn')?.addEventListener('click', () => {
  sound.playClick();
  if (timerRunning) pauseTimer();
  else startTimer();
});
document.getElementById('sidebarCheckAllBtn')?.addEventListener('click', checkAllQuestions);
document.getElementById('sidebarShowAllBtn')?.addEventListener('click', revealAllQuestions);
document.getElementById('sidebarScrollTopBtn')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.getElementById('sidebarOpenCheatBtn')?.addEventListener('click', () => {
  openModalToTab('tab-calculations');
});
document.getElementById('sidebarOpenBoardBtn')?.addEventListener('click', () => {
  openModalToBoard();
});

// iOS Bottom Navigation Bar
document.getElementById('tabNavQuiz')?.addEventListener('click', () => {
  sound.playClick();
  document.querySelectorAll('.ios-tab-bar .tab-item').forEach(t => t.classList.remove('active'));
  document.getElementById('tabNavQuiz')?.classList.add('active');
  const qEl = document.getElementById('quizHeader') || document.getElementById('quiz');
  if (qEl) qEl.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('tabNavCalc')?.addEventListener('click', () => {
  sound.playClick();
  document.querySelector('[data-preset="calc"]')?.click();
  generateQuiz(true);
});

document.getElementById('tabNavFormulas')?.addEventListener('click', () => {
  sound.playClick();
  openModalToTab('tab-calculations');
});

document.getElementById('tabNavStarred')?.addEventListener('click', () => {
  sound.playClick();
  document.getElementById('bookmarkFilterBtn')?.click();
});

document.getElementById('tabNavTheme')?.addEventListener('click', () => {
  sound.playClick();
  document.getElementById('themeToggleBtn')?.click();
});

// ==========================================
// 12. BỘ ĐIỀU CHỈNH CỠ CHỮ CÂU HỎI (A- / A / A+)
// ==========================================
function initFontSize() {
  const savedSize = localStorage.getItem('chem_font_size') || 'md';
  setFontSize(savedSize);

  document.querySelectorAll('.btn-font-size').forEach(btn => {
    btn.addEventListener('click', (e) => {
      sound.playClick();
      const size = e.currentTarget.dataset.size;
      setFontSize(size);
    });
  });
}

function setFontSize(size) {
  document.body.dataset.fontSize = size;
  localStorage.setItem('chem_font_size', size);
  document.querySelectorAll('.btn-font-size').forEach(b => {
    b.classList.toggle('active', b.dataset.size === size);
  });
}

// Khởi chạy ban đầu
generateQuiz();
initDeviceMode();
initFontSize();
initFormulaZoom();

