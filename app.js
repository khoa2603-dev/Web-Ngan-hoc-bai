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
const chLabelsHS = {
  1: 'Cấu tạo & 20 Acid amin',
  2: 'Quang học & Điện di',
  3: 'Peptide, Insulin & HGH',
  4: '4 Bậc cấu trúc Protein',
  5: 'Biến tính & Phản ứng màu',
  6: 'Chức năng & Phân loại'
};

function getChapterLabel(q) {
  if (q.sub === 'hs' || currentSubject === 'hs') {
    return chLabelsHS[q.ch] || `Chuyên đề ${q.ch}`;
  }
  return chLabels[q.ch] || `Chương ${q.ch}`;
}
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
// 4.5. NGÂN HÀNG CÂU HỎI HÓA SINH ĐẠI CƯƠNG
// Chuẩn 100% File PDF Bài giảng: "Chương 3: Protein & 20 Acid amin"
// 100% Câu hỏi lý thuyết dạng Trắc nghiệm (MCQ) dành cho bé Ngân
// Bao gồm trọn bộ 22 câu hỏi đề thi cuối bài có đáp án chuẩn xác!
// ==========================================
const QB_HOASINH = [
  // --- 22 CÂU HỎI TRẮC NGHIỆM ĐỀ THI CUỐI BÀI (TRANG 56-59 PDF) ---
  {
    id: 'hsq01', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Protid thuần',
    prompt: 'Tập hợp nào sau đây thuộc loại <strong>protid thuần (protein đơn giản)</strong>?',
    opts: [
      'Casein, Fibrinogen, Feritin',
      'Fibrinogen, Feritin, globulin',
      'Feritin, globulin, collagen',
      'Fibrinogen, globulin, collagen'
    ],
    ans: 3,
    exp: '📚 Trắc nghiệm Câu 1 (Trang 56 & 59 PDF): Fibrinogen, globulin và collagen là các protid thuần (protein đơn giản chỉ cấu tạo từ amino acid). Trong khi Feritin (chứa Fe) và Casein (chứa phosphoric acid) là protid tạp (protein phức tạp).'
  },
  {
    id: 'hsq02', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Tủa protein bằng muối',
    prompt: 'Nguyên nhân nào sau đây làm cho protein <strong>tủa bởi muối trung tính có nồng độ cao</strong>?',
    opts: [
      'Do sự biến tính cấu trúc của protein',
      'Do có lớp áo nước bao quanh phân tử protein',
      'Do sự tích điện của các tiểu phân protein',
      'Do sự mất lớp áo nước và bị trung hoà điện tích của các tiểu phân protein'
    ],
    ans: 3,
    exp: '📚 Trắc nghiệm Câu 2 (Trang 56 & 59 PDF) & Mục f trang 50: Muối trung tính nồng độ cao vừa làm trung hòa điện tích vừa hút nước phá hủy lớp áo hydrate (lớp áo nước), khiến các phân tử protein kết tụ thành tủa.'
  },
  {
    id: 'hsq03', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Acid amin chứa lưu huỳnh',
    prompt: 'Acid amin nào sau đây <strong>chứa nguyên tố lưu huỳnh (S)</strong>?',
    opts: ['Lysin', 'Histidin', 'Tryptophan', 'Methionin'],
    ans: 3,
    exp: '📚 Trắc nghiệm Câu 3 (Trang 56 & 59 PDF): Methionine (Met) và Cysteine (Cys) là 2 amino acid chứa nguyên tố lưu huỳnh (S). Methionine có mạch nhánh chứa nhóm $-\\ce{S-CH3}$.'
  },
  {
    id: 'hsq04', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Điện di acid amin',
    prompt: 'Trong phương pháp điện di, acid amin nào có <strong>$pH$ điểm đẳng điện nhỏ hơn $pH$ dung dịch điện di</strong> ($pHi < pH_{\\text{dd}}$) thì sẽ:',
    opts: [
      'Tủa lại tại chỗ',
      'Di chuyển về cực âm (catot)',
      'Di chuyển về cực dương (anot)',
      'Không di chuyển trong điện trường'
    ],
    ans: 2,
    exp: '📚 Trắc nghiệm Câu 4 (Trang 56 & 59 PDF) & Trang 50: Khi $pH_{\\text{dd}} > pHi$, môi trường có tính kiềm hơn điểm đẳng điện nên acid amin nhường proton $\\ce{H+}$, trở thành anion mang điện tích âm ($-$). Trong điện trường, anion sẽ di chuyển về cực dương (anot).'
  },
  {
    id: 'hsq05', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Điện di protein',
    prompt: 'Trong phương pháp điện di protein, nếu <strong>$pH$ dung dịch điện ly nhỏ hơn $pH$ đẳng điện</strong> ($pH_{\\text{dd}} < pHi$) thì protein sẽ:',
    opts: [
      'Tủa lại tại chỗ',
      'Di chuyển về cực âm (catot)',
      'Di chuyển về cực dương (anot)',
      'Không di chuyển trong điện trường'
    ],
    ans: 1,
    exp: '📚 Trắc nghiệm Câu 5 (Trang 56 & 59 PDF) & Trang 50: Ở môi trường có $pH < pHi$, protein nhận proton $\\ce{H+}$ trở thành cation mang điện tích dương ($+$). Trong điện trường, cation di chuyển về cực âm (catot).'
  },
  {
    id: 'hsq06', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Nhóm chức thiol',
    prompt: 'Acid amin nào sau đây có chứa <strong>nhóm thiol ($-\\ce{SH}$)</strong> trong cấu trúc gốc R?',
    opts: ['Threonin', 'Cystein', 'Histidin', 'Methionin'],
    ans: 1,
    exp: '📚 Trắc nghiệm Câu 6 (Trang 56 & 59 PDF) & Hình 3.4 Trang 36: Cysteine (Cys) có gốc R là $-\\ce{CH2-SH}$ chứa nhóm sulfhydryl (thiol) hoạt tính cao, có khả năng tạo cầu disulfua $-\\ce{S-S}-$.'
  },
  {
    id: 'hsq07', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Phân loại protein',
    prompt: '<strong>Globulin và albumin</strong> trong huyết thanh được xem là loại protein nào?',
    opts: [
      'Protein dạng sợi',
      'Protein của tóc',
      'Protein không tan trong nước',
      'Protein thuần (protein đơn giản)'
    ],
    ans: 3,
    exp: '📚 Trắc nghiệm Câu 7 (Trang 57 & 59 PDF) & Trang 55: Albumin và Globulin là các protein đơn giản (protid thuần) hình cầu, phân tử chỉ gồm toàn các amino acid.'
  },
  {
    id: 'hsq08', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Mạch nhánh amino acid',
    prompt: 'Tập hợp nào sau đây chỉ gồm toàn các <strong>acid amin mạch thẳng</strong> (không chứa nhân thơm hay dị vòng)?',
    opts: [
      'Asp, Gly, Val, Tyr',
      'Ala, Gly, His, Tyr',
      'Ala, Asp, Arg, Leu',
      'Leu, Try, Met, Phe'
    ],
    ans: 2,
    exp: '📚 Trắc nghiệm Câu 8 (Trang 57 & 59 PDF): Ala, Asp, Arg, Leu đều là các amino acid mạch thẳng. Các lựa chọn khác chứa Tyr, Phe (nhân thơm) hoặc His, Try (dị vòng).'
  },
  {
    id: 'hsq09', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Công thức cấu tạo',
    prompt: 'Công thức cấu tạo sau đây là của amino acid nào: $\\ce{CH(CH3)2-CH2-CH(NH2)-COOH}$?',
    opts: ['Lys', 'Leu', 'Val', 'Arg'],
    ans: 1,
    exp: '📚 Trắc nghiệm Câu 9 (Trang 57 & 59 PDF) & Hình 3.2 Trang 35: Đây là công thức cấu tạo của Leucine (Leu), có gốc R là nhóm isobutyl $-\\ce{CH2-CH(CH3)2}$.'
  },
  {
    id: 'hsq10', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Acid amin dị vòng',
    prompt: 'Tập hợp nào sau đây chỉ gồm toàn các <strong>acid amin dị vòng</strong>?',
    opts: [
      'Pro, His, Try',
      'Try, Tyr, His',
      'Phe, His, Ile',
      'Tyr, Try, Pro'
    ],
    ans: 0,
    exp: '📚 Trắc nghiệm Câu 10 (Trang 57 & 59 PDF): Proline (vòng pyrrolidine), Histidine (vòng imidazol) và Tryptophan (vòng indol) là 3 amino acid dị vòng. Tyrosine và Phenylalanine là vòng đồng thể nhân benzen (đồng vòng).'
  },
  {
    id: 'hsq11', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Phản ứng Ninhydrin',
    prompt: 'Phản ứng <strong>Ninhydrin</strong> dùng để xác định chất nào sau đây?',
    opts: [
      'Acid amin có chứa nhóm $-\\ce{SH}$',
      'Acid amin $\\alpha$',
      'Tryptophan',
      'Liên kết glucosid'
    ],
    ans: 1,
    exp: '📚 Trắc nghiệm Câu 11 (Trang 57 & 59 PDF) & Trang 41: Tất cả các $\\alpha$-amino acid đều phản ứng với ninhydrin ở nhiệt độ cao tạo phức chất màu xanh tím (riêng Proline tạo màu vàng).'
  },
  {
    id: 'hsq12', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Cấu trúc bậc 2',
    prompt: 'Chọn câu đúng: <strong>Cấu trúc bậc 2 của protein</strong> là:',
    opts: [
      'Sự xoắn đều đặn của chuỗi nucleotid',
      'Sự xoắn cuộn gập khúc của chuỗi polypeptid',
      'Sự xoắn đều đặn của chuỗi polypeptid do liên kết hydro quyết định',
      'Do các liên kết disulfua quyết định'
    ],
    ans: 2,
    exp: '📚 Trắc nghiệm Câu 12 (Trang 57 & 59 PDF) & Trang 47: Cấu trúc bậc 2 biểu thị sự xoắn (xoắn $\\alpha$ hoặc phiến gấp $\\beta$) của chuỗi polypeptide, được làm bền nhờ các liên kết hydrogen giữa các liên kết peptide ở gần nhau.'
  },
  {
    id: 'hsq13', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Cấu trúc bậc 4',
    prompt: '<strong>Cấu trúc bậc 4 của hemoglobin</strong> được hình thành do:',
    opts: [
      'Do liên kết peptid quyết định',
      'Do liên kết disulfua quyết định',
      'Do 4 chuỗi polypeptid có cấu trúc bậc 3 sắp xếp tương hỗ với nhau',
      'Do sự xoắn của chuỗi polypeptid'
    ],
    ans: 2,
    exp: '📚 Trắc nghiệm Câu 13 (Trang 58 & 59 PDF) & Trang 48: Phân tử Hemoglobin gồm 4 tiểu đơn vị có cấu trúc bậc 3 ($2\\alpha$ và $2\\beta$) tương tác không gian với nhau tạo nên cấu trúc bậc 4.'
  },
  {
    id: 'hsq14', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Biến tính protein',
    prompt: 'Chọn câu SAI: Protein có thể bị <strong>biến tính</strong> bởi:',
    opts: [
      'Các chất khử',
      'Các chất bức xạ có năng lượng cao',
      'Việc đưa $pH$ môi trường về $pHi$ của protein',
      'Các cation kim loại nặng'
    ],
    ans: 2,
    exp: '📚 Trắc nghiệm Câu 14 (Trang 58 & 59 PDF): Đưa pH về pHi chỉ làm cho protein trung hòa điện tích và kết tủa đẳng điện THUẬN NGHỊCH (không phá vỡ cấu trúc không gian hay gây biến tính). Khi đổi pH, protein tan lại bình thường.'
  },
  {
    id: 'hsq15', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Vị trí nhóm amin',
    prompt: 'Acid amin nào sau đây có <strong>nhóm $-\\ce{NH2}$ gắn vào carbon $\\beta$</strong>?',
    opts: ['Cystein', 'Glutathion', 'Lysin', 'Beta-alanin ($\\beta$-alanin)'],
    ans: 3,
    exp: '📚 Trắc nghiệm Câu 15 (Trang 58 & 59 PDF): Beta-alanin ($\\ce{H2N-CH2-CH2-COOH}$) có nhóm amin gắn ở vị trí carbon $\\beta$, khác với các $\\alpha$-amino acid trong protein.'
  },
  {
    id: 'hsq16', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Acid amin kiềm',
    prompt: 'Acid amin nào sau đây thuộc nhóm <strong>acid amin kiềm (tích điện dương)</strong>?',
    opts: ['Cystein', 'Glutathion', 'Lysin', 'Acid $\\gamma$-amino-butyric'],
    ans: 2,
    exp: '📚 Trắc nghiệm Câu 16 (Trang 58 & 59 PDF) & Nhóm IV Trang 36: Lysine (cùng với Arginine và Histidine) là acid amin kiềm, chứa thêm nhóm amin $-\\ce{NH2}$ ở mạch nhánh.'
  },
  {
    id: 'hsq17', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Phản ứng Biure',
    prompt: 'Hợp chất nào sau đây cho <strong>phản ứng Biure dương tính</strong> (tạo phức màu tím đỏ với $\\ce{CuSO4}$ trong kiềm)?',
    opts: ['Cystein', 'Glutathion', 'Lysin', 'Beta-alanin'],
    ans: 1,
    exp: '📚 Trắc nghiệm Câu 17 (Trang 58 & 59 PDF) & Trang 42: Phản ứng Biure chỉ xảy ra từ tripeptide trở lên. Glutathion là một TRIPEPTIDE ($\\gamma$-glutamyl-cysteyl-glycine) nên cho phản ứng Biure dương tính. Các amino acid tự do không phản ứng.'
  },
  {
    id: 'hsq18', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Cầu disulfua',
    prompt: 'Chất nào sau đây chứa <strong>1 cầu disulfua ($-\\ce{S-S}-$)</strong> trong phân tử?',
    opts: ['Methionin', 'Lysine', 'Homocystein', 'Cystin'],
    ans: 3,
    exp: '📚 Trắc nghiệm Câu 18 (Trang 58 & 59 PDF): Cystin được tạo thành do 2 phân tử Cysteine bị oxy hóa nối với nhau bằng 1 cầu disulfua ($-\\ce{S-S}-$).'
  },
  {
    id: 'hsq19', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Protein sợi',
    prompt: '<strong>Keratin</strong> (có nhiều trong tóc, móng, da) thuộc loại protein nào?',
    opts: ['Globulin', 'Tripeptid', 'Protein sợi', 'Histon'],
    ans: 2,
    exp: '📚 Trắc nghiệm Câu 19 (Trang 58 & 59 PDF) & Trang 54: Keratin là protein dạng sợi, bền vững, không tan trong nước, là thành phần cấu trúc chính của tóc, móng và lớp sừng ngoài da.'
  },
  {
    id: 'hsq20', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Công thức cấu tạo',
    prompt: 'Công thức cấu tạo $\\ce{NH2-CO-CH2-CH(NH2)-COOH}$ là của amino acid nào?',
    opts: ['Asparagin', 'Glutamin', 'Lysine', 'Arginin'],
    ans: 0,
    exp: '📚 Trắc nghiệm Câu 20 (Trang 59 PDF) & Hình 3.4 Trang 36: Đây là công thức của Asparagine (Asn), là amid của aspartic acid. Glutamine có mạch nhánh dài hơn 1 nhóm $-\\ce{CH2}-$.'
  },
  {
    id: 'hsq21', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Phản ứng Biure',
    prompt: 'Chọn tập hợp phát biểu đúng về phản ứng Biure:<br>1) Phản ứng Biure dương tính cho tất cả các acid amin.<br>2) Các dipeptid luôn dương tính với phản ứng Biure.<br>3) Glutathion chứa acid glutamic, glycin và histidin.<br>4) Các tripeptid, protein luôn dương tính với phản ứng Biure.',
    opts: [
      'Phát biểu 1, 2, 3 đúng',
      'Phát biểu 1, 3 đúng',
      'Phát biểu 2, 4 đúng',
      'Chỉ phát biểu 4 đúng'
    ],
    ans: 3,
    exp: '📚 Trắc nghiệm Câu 21 (Trang 59 PDF) & Trang 42: Chỉ có phát biểu 4 đúng. Phản ứng Biure KHÔNG xảy ra với amino acid tự do và dipeptide. Glutathion chứa Glu, Cys và Gly (không chứa His).'
  },
  {
    id: 'hsq22', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: true, topic: 'Nhóm hydroxyl',
    prompt: 'Acid amin nào sau đây chứa <strong>1 nhóm hydroxyl ($-\\ce{OH}$)</strong> trong phân tử?',
    opts: ['Alanin', 'Leucin', 'Serin', 'Prolin'],
    ans: 2,
    exp: '📚 Trắc nghiệm Câu 22 (Trang 59 PDF) & Hình 3.4 Trang 36: Serine (Ser) có gốc R là $-\\ce{CH2OH}$, chứa 1 nhóm hydroxyl rượu.'
  },

  // --- 40 CÂU HỎI LÝ THUYẾT MỞ RỘNG BÁM SÁT TOÀN BỘ GIÁO TRÌNH PDF ---
  {
    id: 'hsq23', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tỷ lệ N & Phương pháp Kjeldahl',
    prompt: 'Trong phân tử protein, tỷ lệ nguyên tố Nitơ (N) tương đối ổn định ở mức bao nhiêu, và hệ số chuyển đổi tương ứng trong phương pháp định lượng Kjeldahl là gì?',
    opts: [
      'N chiếm $\\approx 16\\%$; hệ số chuyển đổi là nhân lượng N với $6,25$',
      'N chiếm $\\approx 23\\%$; hệ số chuyển đổi là nhân lượng N với $4,35$',
      'N chiếm $\\approx 7\\%$; hệ số chuyển đổi là nhân lượng N với $14,28$',
      'N chiếm $\\approx 50\\%$; hệ số chuyển đổi là nhân lượng N với $2,00$'
    ],
    ans: 0,
    exp: '📚 Trang 34 PDF: Tỷ lệ N trong protein khá ổn định ở mức $\\approx 16\\%$. Lợi dụng tính chất này người ta định lượng protein bằng phương pháp Kjeldahl: tính lượng N rồi nhân với $6,25$ (vì $100 / 16 = 6,25$).'
  },
  {
    id: 'hsq24', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Vị trí gắn nhóm chức amino acid',
    prompt: 'Trong các phân tử amino acid cấu tạo nên protein, nhóm carboxyl ($-\\ce{COOH}$) và nhóm amine ($-\\ce{NH2}$) cùng gắn vào nguyên tử carbon ở vị trí nào?',
    opts: ['Vị trí carbon $\\beta$', 'Vị trí carbon $\\alpha$', 'Vị trí carbon $\\gamma$', 'Vị trí carbon $\\omega$'],
    ans: 1,
    exp: '📚 Trang 34 PDF: "Trong phân tử amino acid đều có các nhóm COOH và NH2 gắn với carbon ở vị trí $\\alpha$. Hầu hết các amino acid thu nhận được khi thủy phân protein đều ở dạng L-$\\alpha$ amino acid."'
  },
  {
    id: 'hsq25', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Đồng phân không gian L-alpha',
    prompt: 'Hầu hết các amino acid thu nhận được khi thủy phân protein tự nhiên đều thuộc dạng đồng phân không gian nào?',
    opts: [
      'D-$\\alpha$ amino acid',
      'L-$\\alpha$ amino acid',
      'D-$\\beta$ amino acid',
      'Hỗn hợp racemic 50% D và 50% L'
    ],
    ans: 1,
    exp: '📚 Trang 34 PDF: Hầu hết các amino acid thu nhận được khi thủy phân protein đều ở dạng L-$\\alpha$ amino acid.'
  },
  {
    id: 'hsq26', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cấu tạo đặc biệt của Proline',
    prompt: 'Amino acid nào sau đây có cấu tạo đặc biệt chứa nhóm $-\\ce{NH}-$ trong vòng khép kín và thực chất là một <strong>imino acid</strong>?',
    opts: ['Glycine', 'Alanine', 'Proline', 'Valine'],
    ans: 2,
    exp: '📚 Trang 34 PDF: Proline chỉ có nhóm $-\\ce{NH}-$ trong dị vòng pyrrolidine khép kín, thực chất là một imino acid.'
  },
  {
    id: 'hsq27', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Nhóm I - Không phân cực',
    prompt: 'Nhóm I theo phân loại gốc R gồm 7 amino acid không phân cực, kỵ nước. Nhóm này bao gồm những amino acid nào sau đây?',
    opts: [
      'Gly, Ala, Pro, Val, Leu, Ile, Met',
      'Phe, Tyr, Trp, His, Lys, Arg, Cys',
      'Ser, Thr, Cys, Asn, Gln, Asp, Glu',
      'Lys, His, Arg, Asp, Glu, Ala, Val'
    ],
    ans: 0,
    exp: '📚 Trang 35 PDF: Nhóm I gồm 7 amino acid có gốc R không phân cực, kỵ nước: Glycine, Alanine, Proline, Valine, Leucine, Isoleucine và Methionine.'
  },
  {
    id: 'hsq28', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Nhóm II - Nhân thơm',
    prompt: 'Nhóm II theo phân loại gốc R gồm 3 amino acid có <strong>chứa nhân thơm</strong>. Đó là 3 amino acid nào?',
    opts: [
      'Phenylalanine, Tyrosine và Tryptophan',
      'Histidine, Proline và Tryptophan',
      'Tyrosine, Threonine và Serine',
      'Phenylalanine, Proline và Valine'
    ],
    ans: 0,
    exp: '📚 Trang 35-36 PDF: Nhóm II gồm 3 amino acid có gốc R chứa nhân thơm: Phenylalanine (nhân benzen), Tyrosine (nhân phenol) và Tryptophan (nhân indol).'
  },
  {
    id: 'hsq29', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Nhóm III - Phân cực không tích điện',
    prompt: 'Nhóm III gồm 5 amino acid có gốc R phân cực nhưng không tích điện ở $pH$ trung tính. Nhóm này gồm:',
    opts: [
      'Serine, Threonine, Cysteine, Asparagine và Glutamine',
      'Aspartate, Glutamate, Lysine, Arginine và Histidine',
      'Glycine, Alanine, Valine, Leucine và Isoleucine',
      'Tyrosine, Tryptophan, Phenylalanine, Proline và Methionine'
    ],
    ans: 0,
    exp: '📚 Trang 36 PDF: Nhóm III gồm 5 amino acid: Serine, Threonine, Cysteine, Asparagine và Glutamine.'
  },
  {
    id: 'hsq30', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Nhóm V - Tích điện âm (Acid)',
    prompt: 'Gốc R tích điện âm (acid) ở $pH = 7$ do chứa 2 nhóm $-\\ce{COOH}$ thuộc về 2 amino acid nào?',
    opts: [
      'Lysine và Arginine',
      'Aspartate (Asp) và Glutamate (Glu)',
      'Asparagine và Glutamine',
      'Serine và Threonine'
    ],
    ans: 1,
    exp: '📚 Trang 37 PDF: Nhóm V gồm 2 amino acid có gốc R tích điện âm do chứa hai nhóm carboxyl: Aspartate (Asp) và Glutamate (Glu).'
  },
  {
    id: 'hsq31', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Amino acid thiết yếu',
    prompt: 'Các amino acid mà cơ thể người và động vật không tự tổng hợp được, bắt buộc phải đưa từ ngoài vào qua thức ăn được gọi là:',
    opts: [
      'Amino acid thay thế được',
      'Amino acid không thể thay thế (amino acid thiết yếu)',
      'Amino acid nhân tạo',
      'Amino acid bán dẫn xuất'
    ],
    ans: 1,
    exp: '📚 Trang 38 PDF: Các amino acid không thể thay thế gồm 8-10 loại: Met, Val, Leu, Ile, Thr, Phe, Trp, Lys, Arg, His (và Cys).'
  },
  {
    id: 'hsq32', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Thành phần bột ngọt (mì chính)',
    prompt: 'Gia vị bột ngọt (mì chính) dùng trong đời sống hàng ngày có bản chất hóa học là:',
    opts: [
      'Muối dinatri của acid aspartic',
      'Muối natri của glutamic acid (monosodium glutamate)',
      'Muối kali của alanin',
      'Dẫn xuất este của glycine'
    ],
    ans: 1,
    exp: '📚 Trang 38 PDF: Bột ngọt (mì chính) là muối của natri với glutamic acid (monosodium glutamate - MSG).'
  },
  {
    id: 'hsq33', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tính quang hoạt & Glycine',
    prompt: 'Amino acid duy nhất trong 20 amino acid tiêu chuẩn <strong>không có carbon bất đối</strong> và do đó <strong>không có tính quang hoạt</strong> là:',
    opts: ['Alanine', 'Glycine', 'Leucine', 'Valine'],
    ans: 1,
    exp: '📚 Trang 38 PDF: Các amino acid trong phân tử protein đều có ít nhất một carbon bất đối (TRỪ GLYCINE vì Cα gắn với 2 nguyên tử H đối xứng), vì thế Glycine không có tính quang hoạt.'
  },
  {
    id: 'hsq34', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Số đồng phân lập thể',
    prompt: 'Số đồng phân lập thể của một amino acid có $n$ nguyên tử carbon bất đối xứng trong phân tử được tính theo công thức nào?',
    opts: ['$n^2$', '$2n$', '$2^n$', '$n!$'],
    ans: 2,
    exp: '📚 Trang 38 PDF: Số đồng phân lập thể của amino acid được tính theo công thức $2^n$ (với $n$ là số carbon bất đối).'
  },
  {
    id: 'hsq35', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Hấp thụ cực tím UV ở 280 nm',
    prompt: 'Ở bước sóng tử ngoại $\\lambda = 280\\text{ nm}$, amino acid nào có khả năng <strong>hấp thụ ánh sáng cực tím mạnh nhất</strong> (gấp 4 lần Tyrosine)?',
    opts: ['Phenylalanine', 'Tyrosine', 'Tryptophan', 'Histidine'],
    ans: 2,
    exp: '📚 Trang 39 PDF: Ở cùng nồng độ $10^{-3}\\text{ M}$ và bước sóng $\\approx 280\\text{ nm}$, Tryptophan hấp thụ cực tím mạnh nhất, gấp 4 lần khả năng hấp thụ của Tyrosine, còn Phenylalanine là yếu nhất.'
  },
  {
    id: 'hsq36', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Hấp thụ của liên kết peptide',
    prompt: 'Vùng bước sóng tử ngoại nào sau đây là vùng hấp thụ đặc trưng của <strong>liên kết peptide</strong> trong phân tử protein (đạt cực đại ở $190\\text{ nm}$)?',
    opts: [
      '$180\\text{ nm} - 220\\text{ nm}$',
      '$250\\text{ nm} - 300\\text{ nm}$',
      '$350\\text{ nm} - 450\\text{ nm}$',
      '$540\\text{ nm} - 750\\text{ nm}$'
    ],
    ans: 0,
    exp: '📚 Trang 50-51 PDF: Ở bước sóng từ $180\\text{ nm} - 220\\text{ nm}$ là vùng hấp thụ của liên kết peptide trong protein, cực đại hấp thụ ở $190\\text{ nm}$.'
  },
  {
    id: 'hsq37', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tính lưỡng tính của amino acid',
    prompt: 'Vì sao amino acid lại có <strong>tính chất lưỡng tính</strong>?',
    opts: [
      'Vì có thể hòa tan được cả trong nước và trong dầu',
      'Vì chứa nhóm $-\\ce{COOH}$ có khả năng nhường proton và nhóm $-\\ce{NH2}$ có khả năng nhận proton',
      'Vì luôn luôn có số nguyên tử C bằng số nguyên tử H',
      'Vì có khả năng quay mặt phẳng ánh sáng sang cả bên phải và bên trái'
    ],
    ans: 1,
    exp: '📚 Trang 39 PDF: Nhóm $-\\ce{COOH}$ có khả năng nhường proton $(\\ce{H+})$ thể hiện tính acid; nhóm amin $-\\ce{NH2}$ có khả năng nhận proton thể hiện tính base $\\implies$ amino acid có tính chất lưỡng tính.'
  },
  {
    id: 'hsq38', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Điểm đẳng điện pHi',
    prompt: 'Tại giá trị điểm đẳng điện ($pH = pHi$), phân tử amino acid hoặc protein có trạng thái tích điện như thế nào?',
    opts: [
      'Mang điện tích dương cực đại',
      'Mang điện tích âm cực đại',
      'Tổng điện tích dương bằng tổng điện tích âm (dạng ion lưỡng cực trung hòa về điện)',
      'Mất hoàn toàn các nhóm chức $-\\ce{COOH}$ và $-\\ce{NH2}$'
    ],
    ans: 2,
    exp: '📚 Trang 39-40 & 49 PDF: Ở $pH = pHi$, tổng điện tích dương và điện tích âm của phân tử bằng 0 (dạng lưỡng cực trung hòa), không di chuyển trong điện trường, độ tan thấp nhất và dễ kết tụ nhất.'
  },
  {
    id: 'hsq39', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Điểm đẳng điện của Glycine',
    prompt: 'Glycine có $pK_1 = 2,34$ (nhóm $-\\ce{COOH}$) và $pK_2 = 9,60$ (nhóm $-\\ce{NH3+}$). Điểm đẳng điện $pHi$ của Glycine được tính bằng:',
    opts: [
      '$pHi = 2,34 + 9,60 = 11,94$',
      '$pHi = (2,34 + 9,60) / 2 = 5,97$',
      '$pHi = 9,60 - 2,34 = 7,26$',
      '$pHi = 7,00$'
    ],
    ans: 1,
    exp: '📚 Trang 40 PDF: $pHi = (pK_1 + pK_2) / 2 = (2,34 + 9,60) / 2 = 5,97$.'
  },
  {
    id: 'hsq40', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phản ứng Ninhydrin với Proline',
    prompt: 'Khi đun nóng với thuốc thử Ninhydrin, hầu hết các $\\alpha$-amino acid tạo phức chất màu xanh tím, riêng <strong>Proline</strong> tạo thành phức chất màu gì?',
    opts: ['Màu đỏ anh đào', 'Màu vàng', 'Màu xanh lá cây', 'Màu nâu đất'],
    ans: 1,
    exp: '📚 Trang 41 PDF: Tất cả các amino acid đều phản ứng với ninhydrin tạo phức màu xanh tím, riêng imino acid như Proline tạo thành màu vàng.'
  },
  {
    id: 'hsq41', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Xác định N-tận (Sanger & Edman)',
    prompt: 'Để xác định <strong>amino acid đầu N-tận cùng</strong> của chuỗi polypeptide, người ta có thể sử dụng phản ứng Sanger với thuốc thử nào sau đây?',
    opts: [
      '2,4-dinitrofluorobenzene (DNFB)',
      'Ninhydrin',
      'Thuốc thử Folin-Ciocalteau',
      'Đồng sulfat trong môi trường kiềm'
    ],
    ans: 0,
    exp: '📚 Trang 42 PDF: Để xác định amino acid đầu N-tận cùng người ta cho tác dụng với 2,4-dinitrofluorobenzene (phản ứng Sanger) hoặc phenylisothiocyanate (phản ứng Edman).'
  },
  {
    id: 'hsq42', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Xác định C-tận',
    prompt: 'Phương pháp nào sau đây thường được dùng để xác định <strong>amino acid đầu C-tận cùng</strong> của chuỗi peptide?',
    opts: [
      'Phản ứng Edman',
      'Dùng enzyme carboxypeptidase',
      'Phản ứng Sanger',
      'Phản ứng Biure'
    ],
    ans: 1,
    exp: '📚 Trang 43 PDF: Dùng enzyme carboxypeptidase thủy phân đặc hiệu để xác định amino acid đầu C-tận cùng của chuỗi peptide.'
  },
  {
    id: 'hsq43', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cực đại hấp thụ phản ứng Biure',
    prompt: 'Trong phản ứng Biure, phức chất màu tím đỏ giữa liên kết peptide và ion $\\ce{Cu^2+}$ trong môi trường kiềm mạnh có khả năng <strong>hấp thụ cực đại ở bước sóng</strong> nào?',
    opts: ['$280\\text{ nm}$', '$540\\text{ nm}$', '$750\\text{ nm}$', '$190\\text{ nm}$'],
    ans: 1,
    exp: '📚 Trang 42 PDF: Phức chất màu tím đỏ của phản ứng Biure có khả năng hấp thụ cực đại ở bước sóng $540\\text{ nm}$.'
  },
  {
    id: 'hsq44', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phương pháp Lowry',
    prompt: 'Phương pháp định lượng protein theo <strong>Lowry</strong> là sự kết hợp giữa phản ứng Biure với thuốc thử nào để tạo phức màu xanh da trời ($\\\\lambda = 750\\\\text{ nm}$)?',
    opts: [
      'Thuốc thử Fehling',
      'Thuốc thử Folin-Ciocalteau (chứa phosphomolybdic và phosphotungstic acid)',
      'Thuốc thử Millon',
      'Thuốc thử Ninhydrin'
    ],
    ans: 1,
    exp: '📚 Trang 42 & 52 PDF: Phương pháp Lowry thêm thuốc thử Folin-Ciocalteau vào sau phản ứng Biure, tạo phức màu xanh da trời hấp thụ ở bước sóng $750\\text{ nm}$ nhờ các gốc Tyr và Trp.'
  },
  {
    id: 'hsq45', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cấu tạo Glutathion',
    prompt: '<strong>Glutathion (GSH)</strong> là một tripeptide nội bào phổ biến, có cấu tạo từ 3 amino acid nào theo trình tự?',
    opts: [
      '$\\gamma$-glutamyl - cysteyl - glycine',
      'glycyl - alanyl - valine',
      'glutamyl - histidyl - lysine',
      'alanyl - cysteyl - serine'
    ],
    ans: 0,
    exp: '📚 Trang 44 PDF: Glutathion là tripeptide $\\gamma$-glutamyl-cysteyl-glycine, nhóm hoạt động là nhóm $-\\ce{SH}$ của Cysteine.'
  },
  {
    id: 'hsq46', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Vai trò của Glutathion',
    prompt: 'Vai trò sinh học chủ yếu của Glutathion trong tế bào (đặc biệt ở hồng cầu, gan, thận) là gì?',
    opts: [
      'Xúc tác quá trình đường phân tạo ATP',
      'Đóng vai trò một hệ thống oxy hóa khử nội bào bảo vệ tế bào và vận chuyển hydro',
      'Chỉ làm nhiệm vụ cấu tạo nên màng lipid kép',
      'Vận chuyển oxy từ phổi đến các mô'
    ],
    ans: 1,
    exp: '📚 Trang 44 PDF: Nhờ phản ứng $2\\text{GSH} \\rightleftharpoons \\text{G-S-S-G} + 2\\text{H}$, glutathion đóng vai trò của một hệ thống oxy hóa khử nội bào (vận chuyển hydrogen).'
  },
  {
    id: 'hsq47', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Hormone sinh trưởng HGH',
    prompt: 'Hormone sinh trưởng của người (HGH hay STH) là một chuỗi polypeptide gồm <strong>bao nhiêu amino acid</strong> và chứa <strong>mấy cầu disulfua</strong>?',
    opts: [
      '$51$ amino acid và $3$ cầu disulfua',
      '$191$ amino acid và $2$ cầu disulfua',
      '$124$ amino acid và $4$ cầu disulfua',
      '$229$ amino acid và $1$ cầu disulfua'
    ],
    ans: 1,
    exp: '📚 Trang 44 PDF: HGH (somatotropin hormone) là chuỗi polypeptide gồm 191 amino acid, khối lượng phân tử 20.000, có 2 cầu disulfua giữa aa 53-165 và 182-189.'
  },
  {
    id: 'hsq48', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Bệnh to cực (Acromegaly)',
    prompt: 'Sự dư thừa hormone sinh trưởng HGH nếu xảy ra <strong>sau tuổi dậy thì</strong> sẽ dẫn đến bệnh lý gì?',
    opts: [
      'Chứng người lùn',
      'Chứng người bị to cực (phát triển chiều dày xương đầu, mặt, bàn tay bàn chân)',
      'Hạ đường huyết nghiêm trọng',
      'Bệnh đái tháo nhạt'
    ],
    ans: 1,
    exp: '📚 Trang 45 PDF: Thiếu hụt HGH trước dậy thì dẫn đến chứng người lùn; dư thừa HGH sau dậy thì dẫn đến chứng người to cực (acromegaly).'
  },
  {
    id: 'hsq49', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cấu tạo phân tử Insulin',
    prompt: 'Phân tử hormone <strong>Insulin</strong> gồm 51 amino acid được chia thành 2 chuỗi polypeptide như thế nào?',
    opts: [
      'Chuỗi A có 21 amino acid, chuỗi B có 30 amino acid, nối bởi 2 cầu disulfua liên chuỗi',
      'Chuỗi A có 25 amino acid, chuỗi B có 26 amino acid, nối bởi 1 cầu disulfua',
      'Chuỗi A có 30 amino acid, chuỗi B có 21 amino acid, không có cầu disulfua',
      'Mỗi chuỗi đều có 25 amino acid và nối nhau bằng liên kết ester'
    ],
    ans: 0,
    exp: '📚 Trang 45 PDF: Insulin gồm 51 amino acid, chuỗi A có 21 amino acid, chuỗi B có 30 amino acid. Hai chuỗi được nối với nhau bằng 2 cầu disulfua (và chuỗi A có thêm 1 cầu disulfua nội chuỗi giữa aa 6 và 11).'
  },
  {
    id: 'hsq50', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Nhà khoa học Sanger giải mã Insulin',
    prompt: 'Nhà khoa học nào đã nghiên cứu tinh chế và xác định hoàn toàn cấu trúc bậc 1 của phân tử Insulin vào năm 1953 (nhận giải Nobel năm 1958)?',
    opts: ['Pauling', 'Corey', 'Frederick Sanger', 'Lowry'],
    ans: 2,
    exp: '📚 Trang 45 PDF: Từ năm 1953, Sanger (giải thưởng Nobel 1958) đã nghiên cứu, tinh chế và xác định hoàn toàn cấu trúc của phân tử insulin.'
  },
  {
    id: 'hsq51', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tác dụng sinh lý của Insulin',
    prompt: 'Tác dụng sinh học nổi bật nhất của hormone <strong>Insulin</strong> do tế bào đảo tụy tiết ra là gì?',
    opts: [
      'Làm tăng đường huyết và thoái hóa glycogen',
      'Hạ đường huyết bằng cách kích thích thâm nhập glucose vào tế bào cơ, mỡ và tăng tổng hợp glycogen',
      'Phân giải toàn bộ lipid và tăng thể ceton trong máu',
      'Ức chế quá trình tổng hợp protein và acid béo'
    ],
    ans: 1,
    exp: '📚 Trang 45 PDF: Insulin có tác dụng hạ đường huyết, kích thích sự thâm nhập glucose vào tế bào cơ và mỡ, tăng cường tổng hợp glycogen, acid béo và protein.'
  },
  {
    id: 'hsq52', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Liên kết làm bền cấu trúc bậc 1',
    prompt: 'Cấu trúc bậc 1 biểu thị trình tự sắp xếp các amino acid trong chuỗi polypeptide và được giữ vững chủ yếu bằng loại liên kết nào?',
    opts: [
      'Liên kết hydrogen',
      'Liên kết peptide (liên kết cộng hóa trị)',
      'Tương tác Van der Waals',
      'Liên kết kỵ nước'
    ],
    ans: 1,
    exp: '📚 Trang 46 PDF: Cấu trúc bậc 1 biểu thị trình tự các gốc amino acid trong chuỗi polypeptide, cấu trúc này được giữ vững bằng liên kết peptide (liên kết cộng hóa trị).'
  },
  {
    id: 'hsq53', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Liên kết làm bền cấu trúc bậc 2',
    prompt: 'Theo Pauling và Corey (1951), cấu trúc bậc 2 của protein gồm 2 dạng chính là xoắn $\\alpha$ và phiến gấp $\\beta$, được làm bền chủ yếu nhờ:',
    opts: [
      'Các liên kết hydrogen giữa các liên kết peptide ở gần nhau',
      'Cầu disulfua nối giữa các chuỗi',
      'Liên kết este nội phân tử',
      'Lực hút tĩnh điện giữa các cation kim loại'
    ],
    ans: 0,
    exp: '📚 Trang 47-48 PDF: Cấu trúc bậc 2 được làm bền nhờ các liên kết hydrogen được tạo thành giữa các liên kết peptide ở kề gần nhau.'
  },
  {
    id: 'hsq54', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cấu trúc phiến gấp beta của Fibroin',
    prompt: 'Loại protein nào sau đây là ví dụ điển hình có cấu trúc dạng <strong>phiến gấp $\\beta$</strong>?',
    opts: [
      'Fibroin của tơ tằm',
      'Myoglobin của cơ',
      'Hemoglobin của hồng cầu',
      'Ribonuclease'
    ],
    ans: 0,
    exp: '📚 Trang 48 PDF: Cấu trúc phiến gấp $\\beta$ tìm thấy trong Fibroin của tơ tằm; trong khi Keratin của tóc có cấu trúc dạng xoắn $\\alpha$.'
  },
  {
    id: 'hsq55', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cấu trúc bậc 3 của Myoglobin',
    prompt: '<strong>Myoglobin</strong> (protein dự trữ oxy ở cơ) là ví dụ tiêu biểu cho dạng cấu trúc nào của protein?',
    opts: [
      'Cấu trúc bậc 1 dạng sợi duỗi thẳng',
      'Cấu trúc bậc 3 dạng khối cầu cuộn khúc',
      'Cấu trúc bậc 4 gồm nhiều tiểu đơn vị',
      'Cấu trúc phiến gấp $\\beta$ không gian 2 chiều'
    ],
    ans: 1,
    exp: '📚 Trang 48 PDF & Hình 3.18: Myoglobin là protein hình cầu đặc trưng cho cấu trúc bậc 3, được giữ vững bởi cầu disulfua, tương tác Van der Waals, liên kết hydrogen và tĩnh điện.'
  },
  {
    id: 'hsq56', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Thành phần Hemoglobin',
    prompt: 'Phân tử <strong>Hemoglobin (Hb)</strong> của người trưởng thành gồm bao nhiêu chuỗi polypeptide?',
    opts: [
      '2 chuỗi: 1 chuỗi $\\alpha$ và 1 chuỗi $\\beta$',
      '4 chuỗi: 2 chuỗi $\\alpha$ (mỗi chuỗi 141 aa) và 2 chuỗi $\\beta$ (mỗi chuỗi 146 aa)',
      '3 chuỗi $\\alpha$ liên kết với nhau bằng cầu disulfua',
      '1 chuỗi đơn duy nhất gồm 574 amino acid'
    ],
    ans: 1,
    exp: '📚 Trang 47 & 48 PDF: Hemoglobin có 4 chuỗi polypeptide: 2 chuỗi $\\alpha$ (mỗi chuỗi 141 amino acid) và 2 chuỗi $\\beta$ (mỗi chuỗi 146 amino acid).'
  },
  {
    id: 'hsq57', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tính tan Albumin & Globulin',
    prompt: 'Đặc điểm phân biệt độ hòa tan giữa <strong>Albumin và Globulin</strong> trong huyết thanh là:',
    opts: [
      'Albumin tan trong nước, tủa ở $(NH_4)_2SO_4$ bão hòa; Globulin tan trong muối loãng, tủa ở $(NH_4)_2SO_4$ bán bão hòa',
      'Albumin không tan trong nước; Globulin dễ tan trong cồn $90^\\circ$',
      'Albumin chỉ tan trong dung dịch kiềm loãng; Globulin tan trong ether',
      'Cả hai đều không tan trong nước và dung dịch muối'
    ],
    ans: 0,
    exp: '📚 Trang 49, 50 & 55 PDF: Albumin dễ tan trong nước, bị tủa ở $(NH_4)_2SO_4$ bão hòa (70-100%). Globulin không tan trong nước, tan trong dung dịch muối loãng và bị tủa ở $(NH_4)_2SO_4$ bán bão hòa (50%).'
  },
  {
    id: 'hsq58', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tính tan Prolamin & Glutelin',
    prompt: 'Protein thực vật <strong>Prolamin</strong> (trong ngũ cốc) có đặc tính hòa tan đặc trưng nào sau đây?',
    opts: [
      'Tan trong nước cất tinh khiết',
      'Không tan trong nước, tan trong ethanol $70-80\\%$',
      'Chỉ tan trong acid sulfuric đậm đặc',
      'Không tan trong bất kỳ dung môi nào'
    ],
    ans: 1,
    exp: '📚 Trang 49 & 55 PDF: Prolamin không tan trong nước hoặc dung dịch muối loãng, tan trong ethanol, isopropanol $70-80\\%$. Glutelin chỉ tan trong dung dịch kiềm hoặc acid loãng.'
  },
  {
    id: 'hsq59', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phương pháp diêm tích (Salting out)',
    prompt: 'Phương pháp kết tủa protein bằng muối trung tính ở các nồng độ khác nhau nhằm chiết xuất và tinh sạch protein được gọi là:',
    opts: ['Phương pháp quang phổ', 'Phương pháp diêm tích (kết tủa bằng muối)', 'Phương pháp điện di mao quản', 'Phương pháp thẩm tích loại ion'],
    ans: 1,
    exp: '📚 Trang 50 PDF: Các protein khác nhau bị kết tủa ở những nồng độ muối trung tính khác nhau. Người ta sử dụng tính chất này để chiết xuất và tách riêng protein, gọi là phương pháp diêm tích.'
  },
  {
    id: 'hsq60', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phương pháp thẩm tích (Dialysis)',
    prompt: 'Sau khi kết tủa protein bằng muối trung tính, người ta thường dùng phương pháp nào để <strong>loại bỏ lượng muối dư</strong> ra khỏi chế phẩm protein?',
    opts: ['Phương pháp đun sôi', 'Phương pháp thẩm tích (Dialysis)', 'Phương pháp điện phân dung dịch', 'Phương pháp sấy ở nhiệt độ cao'],
    ans: 1,
    exp: '📚 Trang 51 PDF: Trong chế phẩm protein nhận được còn lẫn các muối đã dùng để kết tủa, người ta dùng phương pháp thẩm tích (cho qua màng bán thấm) để loại bỏ muối.'
  },
  {
    id: 'hsq61', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Biến tính không thuận nghịch',
    prompt: 'Yếu tố nào sau đây là nguyên nhân gây <strong>kết tủa không thuận nghịch (biến tính vĩnh viễn)</strong> đơn giản và phổ biến nhất của protein?',
    opts: [
      'Thêm dung dịch muối trung tính nồng độ thấp',
      'Đun sôi dung dịch protein',
      'Làm lạnh dung dịch protein ở $0^\\circ\\text{C}$',
      'Đưa $pH$ về đúng điểm đẳng điện $pHi$'
    ],
    ans: 1,
    exp: '📚 Trang 51 PDF: Kết tủa không thuận nghịch là protein sau khi bị kết tủa không thể phục hồi lại trạng thái ban đầu. Một trong những yếu tố gây kết tủa không thuận nghịch đơn giản nhất là đun sôi dung dịch protein.'
  },
  {
    id: 'hsq62', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phản ứng Xanthoproteic',
    prompt: 'Trong phản ứng <strong>Xanthoproteic</strong>, các gốc amino acid nhân thơm (Tyr, Trp, Phe) tác dụng với $\\ce{HNO3}$ đặc tạo thành màu vàng, và sau khi thêm kiềm sẽ chuyển sang màu gì?',
    opts: ['Màu da cam', 'Màu xanh lam', 'Màu tím đỏ', 'Màu đen khói'],
    ans: 0,
    exp: '📚 Trang 52 PDF: Phản ứng xanthoproteic: các gốc amino acid Tyr, Trp, Phe tác dụng với $\\ce{HNO3}$ đặc tạo thành màu vàng, sau khi thêm kiềm chuyển thành màu da cam.'
  },
  {
    id: 'hsq63', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phản ứng Millon',
    prompt: 'Phản ứng <strong>Millon</strong> (tác dụng với thủy ngân nitrate trong $\\ce{HNO3}$ đặc tạo kết tủa màu nâu đất) là phản ứng đặc trưng của amino acid nào?',
    opts: ['Cysteine (Cys)', 'Tyrosine (Tyr)', 'Arginine (Arg)', 'Histidine (His)'],
    ans: 1,
    exp: '📚 Trang 52 PDF: Phản ứng Millon: gốc Tyr tác dụng với thủy ngân nitrate trong $\\ce{HNO3}$ đặc tạo thành kết tủa màu nâu đất.'
  },
  {
    id: 'hsq64', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phản ứng Sakaguchi',
    prompt: 'Phản ứng <strong>Sakaguchi</strong> (tác dụng với $\\alpha$-naphtol và hypobromite trong kiềm cho màu đỏ anh đào) là phản ứng màu đặc trưng của gốc amino acid nào?',
    opts: ['Arginine (Arg)', 'Lysine (Lys)', 'Tryptophan (Trp)', 'Methionine (Met)'],
    ans: 0,
    exp: '📚 Trang 52 PDF: Phản ứng Sakaguchi: gốc Arg (nhờ nhóm guanidin) tác dụng với dung dịch kiềm của $\\alpha$-naphtol và hypobromite cho màu đỏ anh đào.'
  },
  {
    id: 'hsq65', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phản ứng Adamkiewicz',
    prompt: 'Phản ứng <strong>Adamkiewicz</strong> tạo vòng tím đỏ ở mặt phân cách giữa protein với acid glyoxylic và $\\ce{H2SO4}$ đặc là phản ứng đặc trưng của amino acid nào?',
    opts: ['Tryptophan (Trp)', 'Tyrosine (Tyr)', 'Phenylalanine (Phe)', 'Proline (Pro)'],
    ans: 0,
    exp: '📚 Trang 52 PDF: Phản ứng Adamkiewicz: gốc Trp (chứa nhân indol) tác dụng với glyoxylic acid và $\ce{H2SO4}$ đặc tạo thành vòng tím đỏ ở mặt phân cách.'
  },
  // --- 70 CÂU HỎI LÝ THUYẾT TRẮC NGHIỆM CHUYÊN SÂU BỔ SUNG (hsq66 - hsq135) ---
  {
    id: 'hsq66', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Thành phần nguyên tố protein',
    prompt: 'Theo bài giảng Hóa sinh, 4 nguyên tố chính cấu tạo nên protein là C, H, O, N với tỷ lệ xấp xỉ lần lượt là bao nhiêu?',
    opts: ['C ≈ 50%, H ≈ 7%, O ≈ 23%, N ≈ 16%', 'C ≈ 40%, H ≈ 12%, O ≈ 30%, N ≈ 18%', 'C ≈ 60%, H ≈ 5%, O ≈ 15%, N ≈ 20%', 'C ≈ 35%, H ≈ 10%, O ≈ 40%, N ≈ 15%'],
    ans: 0,
    exp: '📚 Trang 34 PDF: Protein được tạo thành từ 4 nguyên tố chính là C, H, O, N với tỷ lệ C ≈ 50%, H ≈ 7%, O ≈ 23% và N ≈ 16%. Tỷ lệ N rất ổn định được ứng dụng định lượng protein bằng phương pháp Kjeldahl (Protein = N × 6,25).'
  },
  {
    id: 'hsq67', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Carbon bất đối amino acid',
    prompt: 'Trong 20 amino acid tiêu chuẩn cấu tạo nên protein, hai amino acid nào có chứa <strong>hai nguyên tử carbon bất đối xứng ($C^*$)</strong> trong phân tử?',
    opts: ['Isoleucine và Threonine', 'Leucine và Valine', 'Serine và Cysteine', 'Lysine và Arginine'],
    ans: 0,
    exp: '📚 Trang 36 & 38 PDF: Isoleucine (Ile) và Threonine (Thr) là 2 amino acid đặc biệt sở hữu tới 2 carbon bất đối xứng (1 ở vị trí $C_\\alpha$ và 1 ở mạch nhánh $C_\\beta$), do đó chúng có tới 4 ($2^2$) đồng phân lập thể.'
  },
  {
    id: 'hsq68', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Độ tan của amino acid',
    prompt: 'Hầu hết các amino acid đều khó tan trong cồn (alcohol) và ether, <strong>NGOẠI TRỪ</strong> chất nào sau đây?',
    opts: ['Alanine và Glycine', 'Proline và Hydroxyproline', 'Leucine và Isoleucine', 'Valine và Methionine'],
    ans: 1,
    exp: '📚 Trang 38 PDF: Các amino acid thường dễ tan trong nước, khó tan trong alcohol và ether, NGOẠI TRỪ proline và hydroxyproline tan được trong các dung môi hữu cơ này nhờ cấu trúc imino acid đặc thù.'
  },
  {
    id: 'hsq69', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Độ tan của Tyrosine',
    prompt: 'Amino acid nào sau đây có tính tan đặc biệt: <strong>khó hòa tan trong acid và kiềm loãng</strong> so với các amino acid khác?',
    opts: ['Tyrosine (Tyr)', 'Glycine (Gly)', 'Alanine (Ala)', 'Aspartate (Asp)'],
    ans: 0,
    exp: '📚 Trang 38 PDF: Hầu hết các amino acid đều dễ tan trong acid và kiềm loãng, NGOẠI TRỪ Tyrosine (Tyr) rất khó hòa tan do gốc phenol kỵ nước gắn vòng thơm.'
  },
  {
    id: 'hsq70', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Công thức cấu tạo Valine',
    prompt: 'Công thức cấu tạo $\\ce{(CH3)2CH-CH(NH2)-COOH}$ là của amino acid nào sau đây?',
    opts: ['Valine (Val)', 'Leucine (Leu)', 'Isoleucine (Ile)', 'Alanine (Ala)'],
    ans: 0,
    exp: '📚 Trang 35 PDF (Hình 3.2): $\\ce{(CH3)2CH-CH(NH2)-COOH}$ là công thức cấu tạo của Valine (Val), amino acid có gốc R phân nhánh isopropyl $-\\ce{CH(CH3)2}$.'
  },
  {
    id: 'hsq71', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Gốc R Phenylalanine',
    prompt: 'Gốc R của amino acid <strong>Phenylalanine (Phe)</strong> có cấu tạo hóa học là gì?',
    opts: ['Nhân benzen gắn với nhóm $-\\ce{CH2}-$', 'Nhân phenol gắn với nhóm $-\\ce{CH2}-$', 'Nhân indol gắn với nhóm $-\\ce{CH2}-$', 'Nhân imidazole gắn với nhóm $-\\ce{CH2}-$'],
    ans: 0,
    exp: '📚 Trang 36 PDF (Hình 3.3): Phenylalanine có gốc R gồm một vòng benzen thơm liên kết với nhóm methylen: $-\\ce{CH2-C6H5}$.'
  },
  {
    id: 'hsq72', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Dị vòng Imidazole',
    prompt: 'Dị vòng <strong>imidazole</strong> là cấu trúc đặc trưng có mặt trong gốc R của amino acid nào?',
    opts: ['Histidine (His)', 'Tryptophan (Trp)', 'Proline (Pro)', 'Tyrosine (Tyr)'],
    ans: 0,
    exp: '📚 Trang 37 PDF (Hình 3.5): Histidine chứa dị vòng imidazole 5 cạnh có 2 nguyên tử Nitơ, giúp Histidine tham gia nhận/nhường proton rất linh hoạt quanh pH sinh lý.'
  },
  {
    id: 'hsq73', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Nhóm Guanidino của Arginine',
    prompt: 'Nhóm chức <strong>guanidino</strong> mang tính kiềm rất mạnh là thành phần cấu tạo gốc R của amino acid nào?',
    opts: ['Arginine (Arg)', 'Lysine (Lys)', 'Histidine (His)', 'Methionine (Met)'],
    ans: 0,
    exp: '📚 Trang 37 PDF (Hình 3.5): Arginine (Arg) chứa nhóm guanidino $-\\ce{NH-C(=NH)-NH2}$ ở đầu mạch nhánh, là một trong những nhóm chức hữu cơ có tính base mạnh nhất trong sinh học ($pK_R \\approx 12,5$).'
  },
  {
    id: 'hsq74', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phân loại Nhóm III',
    prompt: 'Hai amino acid <strong>Glutamine (Gln)</strong> và <strong>Asparagine (Asn)</strong> thuộc nhóm nào sau đây theo cách phân loại gốc R?',
    opts: ['Nhóm III: Gốc R phân cực nhưng không tích điện ở $pH = 7$', 'Nhóm I: Gốc R không phân cực, kỵ nước', 'Nhóm IV: Gốc R mang điện tích dương', 'Nhóm V: Gốc R mang điện tích âm'],
    ans: 0,
    exp: '📚 Trang 36 PDF: Nhóm III gồm 5 amino acid có gốc R phân cực nhưng không tích điện: Serine, Threonine, Cysteine, Asparagine và Glutamine (2 chất sau mang nhóm amid $-\\ce{CONH2}$).'
  },
  {
    id: 'hsq75', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Góc quay quang học',
    prompt: 'Góc quay đặc hiệu và chiều làm quay mặt phẳng ánh sáng phân cực ($+$ hoặc $-$) của dung dịch amino acid phụ thuộc chặt chẽ vào:',
    opts: ['$pH$ của môi trường dung dịch', 'Áp suất khí quyển', 'Hình dạng ống nghiệm đựng mẫu', 'Cường độ dòng điện xung quanh'],
    ans: 0,
    exp: '📚 Trang 38 PDF: Hoạt tính quang học (quay mặt phẳng ánh sáng phân cực sang phải (+) hay sang trái (-)) và góc quay đặc hiệu của amino acid phụ thuộc vào $pH$ của môi trường, do pH làm biến đổi trạng thái ion hóa của phân tử.'
  },
  {
    id: 'hsq76', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Đồng phân L-alpha',
    prompt: 'Hầu hết các amino acid thu nhận được từ quá trình thủy phân hoàn toàn protein trong tự nhiên đều có cấu hình lập thể dạng nào?',
    opts: ['Dạng $\\text{L-}\\alpha$ amino acid', 'Dạng $\\text{D-}\\alpha$ amino acid', 'Hỗn hợp racemic 50% D và 50% L', 'Dạng $\\text{L-}\\beta$ amino acid'],
    ans: 0,
    exp: '📚 Trang 34 PDF: Hầu hết các amino acid thu nhận được khi thủy phân protein tự nhiên đều ở dạng $\\text{L-}\\alpha$ amino acid (nhóm amine $-\\ce{NH2}$ nằm ở vị trí carbon $\\alpha$ và ở phía bên trái theo công thức chiếu Fischer).'
  },
  {
    id: 'hsq77', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Độ hấp thụ tử ngoại Trp và Tyr',
    prompt: 'Ở cùng nồng độ $10^{-3}\\text{ M}$ và bước sóng khoảng $280\\text{ nm}$, khả năng hấp thụ ánh sáng cực tím của <strong>Tryptophan (Trp)</strong> mạnh gấp bao nhiêu lần <strong>Tyrosine (Tyr)</strong>?',
    opts: ['Gấp 4 lần', 'Gấp 2 lần', 'Gấp 10 lần', 'Bằng nhau'],
    ans: 0,
    exp: '📚 Trang 39 PDF (Hình 3.8): Cùng nồng độ $10^{-3}\\text{ M}$, ở bước sóng 280 nm, tryptophan hấp thụ ánh sáng cực tím mạnh nhất, gấp 4 lần khả năng hấp thụ của tyrosine, trong khi phenylalanine hấp thụ yếu nhất.'
  },
  {
    id: 'hsq78', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Khử nhóm carboxyl bằng NaBH4',
    prompt: 'Dưới sự xúc tác của chất khử $\\ce{NaBH4}$, nhóm carboxyl ($-\\ce{COOH}$) của amino acid bị khử thành hợp chất nào sau đây?',
    opts: ['Rượu amino (amino alcohol: $-\\ce{CH2OH}$)', 'Aldehyde', 'Acid cacboxylic ngắn hơn', 'Hydrocarbon tương ứng'],
    ans: 0,
    exp: '📚 Trang 41 PDF (Mục 3.2.6.3): Nhóm carboxyl của amino acid có thể bị khử thành hợp chất rượu amino ($-\\ce{CH(NH2)-CH2OH}$) dưới sự xúc tác của chất khử $\\ce{NaBH4}$.'
  },
  {
    id: 'hsq79', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phương pháp Van Slyke',
    prompt: 'Để định lượng nitrogen của nhóm amine tự do trong amino acid theo phương pháp Van Slyke, người ta cho amino acid phản ứng với hóa chất nào để giải phóng khí $\\ce{N2}$?',
    opts: ['$\\ce{HNO2}$ (Acid nitrous)', '$\\ce{HNO3}$ đặc', '$\\ce{HCl}$ đặc', '$\\ce{H2SO4}$ đặc'],
    ans: 0,
    exp: '📚 Trang 41 PDF: Để định lượng nitrogen của amino acid người ta cho phản ứng với $\\ce{HNO2}$ để giải phóng khí $\\ce{N2}$: $\\ce{R-NH2 + HNO2 -> R-OH + N2 ^ + H2O}$.'
  },
  {
    id: 'hsq80', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phản ứng tạo base Schiff',
    prompt: 'Nhóm $\\alpha\\text{-NH}_2$ của amino acid phản ứng với formaldehyde hoặc aldehyde tạo thành hợp chất <strong>base Schiff</strong> ($-\\ce{N=CH-R}$), phản ứng này được ứng dụng để làm gì?',
    opts: ['Định lượng amino acid bằng phương pháp chuẩn độ formol (Sørensen)', 'Thủy phân hoàn toàn chuỗi polypeptide', 'Kết tủa không thuận nghịch protein', 'Xác định nguyên tố lưu huỳnh trong protein'],
    ans: 0,
    exp: '📚 Trang 41 PDF: Để định lượng amino acid người ta cho phản ứng với aldehyde tạo thành base Schiff, khóa nhóm $-\\ce{NH2}$ để có thể chuẩn độ nhóm carboxyl $-\\ce{COOH}$ bằng kiềm tiêu chuẩn.'
  },
  {
    id: 'hsq81', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Thuốc thử Sanger',
    prompt: 'Thuốc thử Sanger dùng để xác định amino acid đầu N-tận cùng của chuỗi polypeptide có công thức hóa học là chất nào sau đây?',
    opts: ['2,4-dinitrofluorobenzene (DNFB)', 'Phenylisothiocyanate (PITC)', 'Ninhydrin', '$\\alpha$-naphtol'],
    ans: 0,
    exp: '📚 Trang 42 PDF: Để xác định amino acid đầu N-tận cùng người ta cho tác dụng với 2,4-dinitrofluorobenzene (phương pháp Sanger) tạo dẫn xuất DNP-amino acid có màu vàng.'
  },
  {
    id: 'hsq82', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Thuốc thử Edman',
    prompt: 'Trong phản ứng Edman dùng để giải trình tự chuỗi peptide từ đầu N-tận cùng, hóa chất được sử dụng là gì?',
    opts: ['Phenylisothiocyanate (PITC)', '2,4-dinitrofluorobenzene', 'Thuốc thử Biure', 'Acid picric'],
    ans: 0,
    exp: '📚 Trang 42 PDF: Phản ứng Edman sử dụng phenylisothiocyanate (PITC) tác dụng chọn lọc với amino acid đầu N-tận cùng tạo dẫn xuất PTH-amino acid mà không làm đứt gãy các liên kết peptide còn lại.'
  },
  {
    id: 'hsq83', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tính toán điểm đẳng điện pHi',
    prompt: 'Một amino acid trung tính có trị số $pK_1 = 2,19$ (nhóm $-\\ce{COOH}$) và $pK_2 = 9,67$ (nhóm $-\\ce{NH3+}$). Điểm đẳng điện $pHi$ của amino acid này là:',
    opts: ['5,93', '7,00', '11,86', '3,74'],
    ans: 0,
    exp: '📚 Trang 40 PDF: Công thức tính điểm đẳng điện đối với amino acid trung tính: $pHi = \\frac{pK_1 + pK_2}{2} = \\frac{2,19 + 9,67}{2} = 5,93$.'
  },
  {
    id: 'hsq84', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Bản chất liên kết peptide',
    prompt: 'Liên kết peptide trong phân tử protein được hình thành do sự kết hợp giữa hai nhóm chức nào?',
    opts: ['Nhóm $\\alpha\\text{-COOH}$ của amino acid này với nhóm $\\alpha\\text{-NH}_2$ của amino acid kế tiếp (loại $1\\text{ H}_2\\text{O}$)', 'Hai nhóm carboxyl $-\\ce{COOH}$ của 2 amino acid kề nhau', 'Hai nhóm amine $-\\ce{NH2}$ của 2 amino acid kề nhau', 'Nhóm $-\\ce{SH}$ của 2 amino acid Cysteine'],
    ans: 0,
    exp: '📚 Trang 42 PDF (Hình 3.12): Liên kết peptide ($-\\ce{CO-NH}-$) được tạo thành do phản ứng ngưng tụ giữa nhóm $\\alpha\\text{-COOH}$ của amino acid này với nhóm $\\alpha\\text{-NH2}$ của amino acid kia kèm theo sự giải phóng một phân tử nước.'
  },
  {
    id: 'hsq85', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cấu tạo liên kết của Glutathione',
    prompt: 'Trong cấu trúc của tripeptide Glutathion, liên kết peptide giữa Glutamate và Cysteine có điểm gì đặc biệt so với liên kết thông thường?',
    opts: ['Sử dụng nhóm carboxyl ở vị trí $\\gamma$ (gamma) của Glutamate', 'Sử dụng nhóm carboxyl ở vị trí $\\beta$ của Glutamate', 'Là liên kết este hóa thay vì amid hóa', 'Sử dụng nhóm amin của Glutamate nối với nhóm carboxyl của Cysteine'],
    ans: 0,
    exp: '📚 Trang 44 PDF (Mục 3.3.3.1): Glutathion là tripeptide có tên hóa học là $\\gamma\\text{-glutamyl-cysteyl-glycine}$, trong đó liên kết peptide được tạo bởi nhóm carboxyl ở carbon $\\gamma$ (mạch nhánh) của Glutamate chứ không phải vị trí $\\alpha$.'
  },
  {
    id: 'hsq86', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Hệ thống oxy hóa khử Glutathione',
    prompt: 'Khi đóng vai trò là hệ thống vận chuyển hydrogen trong tế bào, 2 phân tử Glutathion dạng khử (G-SH) chuyển thành dạng oxy hóa (GSSG) bằng cách:',
    opts: ['Nhường 2 nguyên tử H và hình thành 1 cầu disulfua ($-\\ce{S-S}-$)', 'Nhận 2 proton $\\ce{H+}$ từ môi trường', 'Phân cắt thành 3 amino acid tự do', 'Mất đi nhóm glycine ở đầu C-tận cùng'],
    ans: 0,
    exp: '📚 Trang 44 PDF: Phản ứng: $2\\ce{G-SH} \\rightleftharpoons \\ce{GSSG} + 2[\\ce{H}]$. Khi nhường hydrogen, 2 phân tử GSH liên kết với nhau bằng cầu disulfua $-\\ce{S-S}-$ tạo thành dạng oxy hóa GSSG.'
  },
  {
    id: 'hsq87', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Đoạn hoạt tính của HGH',
    prompt: 'Hormone sinh trưởng người (HGH) gồm 191 amino acid. Hoạt động sinh học của hormone này nằm ở đoạn chuỗi gồm bao nhiêu amino acid?',
    opts: ['134 amino acid', '51 amino acid', '191 amino acid', '85 amino acid'],
    ans: 0,
    exp: '📚 Trang 44 PDF: Hormone HGH gồm 191 amino acid, khối lượng phân tử 20.000; tuy nhiên hoạt động sinh học của HGH chỉ tập trung ở chuỗi gồm 134 amino acid.'
  },
  {
    id: 'hsq88', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cầu disulfua của HGH',
    prompt: 'Trong cấu trúc của hormone sinh trưởng HGH, hai cầu disulfua được tạo thành giữa các gốc amino acid ở vị trí nào?',
    opts: ['Giữa vị trí 53 - 165 và giữa vị trí 182 - 189', 'Giữa vị trí 6 - 11 và giữa vị trí 7 - 20', 'Giữa vị trí 1 - 50 và giữa vị trí 100 - 150', 'Giữa vị trí 20 - 30 và giữa vị trí 40 - 60'],
    ans: 0,
    exp: '📚 Trang 44 PDF: Trong cấu trúc của HGH có hai cầu disulfua được tạo thành giữa amino acid 53 - 165 và giữa amino acid 182 - 189.'
  },
  {
    id: 'hsq89', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Độ tương đồng cấu trúc của HGH',
    prompt: 'Hormone sinh trưởng của người (HGH) có cấu tạo rất giống với <strong>hormone lactogen của nhau thai</strong> với tỷ lệ amino acid giống nhau lên tới bao nhiêu?',
    opts: ['85% amino acid giống nhau', '32% amino acid giống nhau', '50% amino acid giống nhau', '99% amino acid giống nhau'],
    ans: 0,
    exp: '📚 Trang 44 PDF: HGH có cấu tạo rất giống với hormone lactogen của nhau thai (85% amino acid giống nhau) và gần giống prolactin của người (32% amino acid giống nhau).'
  },
  {
    id: 'hsq90', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tác dụng chuyển hóa lipid của HGH',
    prompt: 'Hormone sinh trưởng (HGH) tác động lên quá trình chuyển hóa lipid như thế nào để đảm bảo năng lượng cho cơ thể?',
    opts: ['Kích thích thoái hóa lipid, làm tăng acid béo tự do trong huyết tương', 'Ức chế phân giải lipid, làm giảm mỡ máu', 'Chuyển hóa hoàn toàn lipid thành glycogen tích trữ', 'Không ảnh hưởng đến chuyển hóa chất béo'],
    ans: 0,
    exp: '📚 Trang 44 - 45 PDF: HGH kích thích sự thoái hóa lipid để đảm bảo nhu cầu về năng lượng cho cơ thể, gây tăng acid béo tự do trong huyết tương, đồng thời kích thích sự tạo sụn và tổng hợp protein.'
  },
  {
    id: 'hsq91', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cầu disulfua nội chuỗi Insulin',
    prompt: 'Trong phân tử hormone Insulin, cầu disulfua nội chuỗi (intrachain) nằm ở <strong>chuỗi A</strong> được hình thành giữa hai amino acid Cysteine ở vị trí nào?',
    opts: ['Giữa amino acid thứ 6 và thứ 11 của chuỗi A', 'Giữa amino acid thứ 7 và thứ 20 của chuỗi A', 'Giữa amino acid thứ 1 và thứ 21 của chuỗi A', 'Giữa amino acid thứ 19 và thứ 30 của chuỗi B'],
    ans: 0,
    exp: '📚 Trang 45 PDF: Trong chuỗi A của Insulin hình thành 1 cầu disulfua nội chuỗi giữa amino acid thứ 6 và amino acid thứ 11. Hai chuỗi A và B nối với nhau bằng 2 cầu disulfua liên chuỗi (A7-B7 và A20-B19).'
  },
  {
    id: 'hsq92', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Vùng đặc hiệu loài của Insulin',
    prompt: 'Phần cấu trúc đặc hiệu phân biệt giữa các loài động vật trong phân tử Insulin tập trung chủ yếu ở các vị trí amino acid nào?',
    opts: ['Vị trí 8 - 9 - 10, 12 - 14 của chuỗi A và vị trí 30 của chuỗi B', 'Vị trí 1 - 2 - 3 của chuỗi A và vị trí 1 - 2 của chuỗi B', 'Vị trí 6 và 11 của chuỗi A', 'Vị trí 20 của chuỗi A và vị trí 19 của chuỗi B'],
    ans: 0,
    exp: '📚 Trang 45 PDF: Phần đặc hiệu (đặc trưng của một loài) chỉ tập trung vào các amino acid thứ 8-9-10, 12-14 của chuỗi A và đặc biệt là amino acid thứ 30 của chuỗi B.'
  },
  {
    id: 'hsq93', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Insulin và enzyme tân tạo đường',
    prompt: 'Insulin làm giảm sự tân tạo glucose ở gan bằng cách làm giảm nồng độ của các enzyme nào sau đây?',
    opts: ['Pyruvate carboxylase và Fructose 1,6-diphosphatase', 'Hexokinase và Glucokinase', 'Phosphofructokinase và Pyruvate kinase', 'Amylase và Pepsin'],
    ans: 0,
    exp: '📚 Trang 45 PDF: Insulin làm giảm sự tân tạo glucose do làm giảm nồng độ các enzyme chủ chốt tham gia con đường tân tạo đường như pyruvate carboxylase và fructose 1-6 diphosphatase.'
  },
  {
    id: 'hsq94', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Enzyme Carboxypeptidase',
    prompt: 'Trong các phương pháp phân tích giải trình tự peptide, enzyme <strong>carboxypeptidase</strong> được sử dụng để xác định thành phần nào?',
    opts: ['Amino acid ở đầu C-tận cùng', 'Amino acid ở đầu N-tận cùng', 'Cầu liên kết disulfua $-\\ce{S-S}-$-', 'Số lượng liên kết hydro trong chuỗi'],
    ans: 0,
    exp: '📚 Trang 43 PDF: Phương pháp Sanger hoặc Edman dùng để xác định amino acid đầu N-tận cùng, trong khi enzyme carboxypeptidase thủy phân đặc hiệu liên kết peptide ở đầu carboxyl tự do để xác định amino acid đầu C-tận cùng.'
  },
  {
    id: 'hsq95', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tính chất liên kết peptide',
    prompt: 'Đặc điểm hóa học nổi bật của liên kết peptide trong cấu trúc bậc 1 của protein là gì?',
    opts: ['Có đặc tính một phần của liên kết đôi, đồng phẳng và không quay tự do quanh trục $\\ce{C-N}$', 'Là liên kết ion yếu dễ dàng bị đứt khi thay đổi nhiệt độ nhẹ', 'Có thể quay tự do 360 độ quanh trục liên kết $\\ce{C-N}$', 'Là liên kết hydro yếu nối giữa các gốc R của amino acid'],
    ans: 0,
    exp: '📚 Trang 42 & 46 PDF: Liên kết peptide có tính chất cộng hưởng làm cho liên kết $\\ce{C-N}$ mang một phần tính chất liên kết đôi, 6 nguyên tử của nhóm peptide cùng nằm trên một mặt phẳng cứng nhắc và không thể quay tự do.'
  },
  {
    id: 'hsq96', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cấu trúc Ribonuclease',
    prompt: 'Enzyme Ribonuclease của bò là một protein đơn gồm một chuỗi polypeptide chứa bao nhiêu amino acid và bao nhiêu cầu disulfua?',
    opts: ['124 amino acid và 4 cầu disulfua', '229 amino acid và 2 cầu disulfua', '51 amino acid và 3 cầu disulfua', '500 amino acid và 8 cầu disulfua'],
    ans: 0,
    exp: '📚 Trang 47 PDF (Hình 3.16): Ribonuclease là một protein có 124 amino acid được nối với nhau thành một chuỗi duy nhất, trong cấu trúc bậc 1 có 4 cầu disulfua làm bền chuỗi.'
  },
  {
    id: 'hsq97', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Thành phần chuỗi Hemoglobin',
    prompt: 'Phân tử Hemoglobin (Hb) của người trưởng thành gồm 4 chuỗi polypeptide với số lượng amino acid cụ thể là:',
    opts: ['2 chuỗi $\\alpha$ (mỗi chuỗi 141 aa) và 2 chuỗi $\\beta$ (mỗi chuỗi 146 aa)', '2 chuỗi $\\alpha$ (mỗi chuỗi 146 aa) và 2 chuỗi $\\beta$ (mỗi chuỗi 141 aa)', '4 chuỗi $\\alpha$ giống hệt nhau (mỗi chuỗi 124 aa)', '1 chuỗi $\\alpha$ (141 aa) và 3 chuỗi $\\beta$ (146 aa)'],
    ans: 0,
    exp: '📚 Trang 47 PDF: Hemoglobin là protein có cấu trúc bậc 4 gồm 4 chuỗi polypeptide: 2 chuỗi $\\alpha$ (mỗi chuỗi 141 amino acid) và 2 chuỗi $\\beta$ (mỗi chuỗi 146 amino acid), tổng cộng gồm 574 amino acid.'
  },
  {
    id: 'hsq98', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tỷ lệ xoắn alpha trong protein',
    prompt: 'Theo bài giảng Hóa sinh, loại protein nào sau đây có tỷ lệ cấu trúc xoắn $\\alpha$ chiếm tới <strong>75%</strong>?',
    opts: ['Hemoglobin và Myoglobin', 'Lysozyme', 'Ribonuclease', 'Fibroin của tơ'],
    ans: 0,
    exp: '📚 Trang 48 PDF: Tỷ lệ % xoắn $\\alpha$ trong các protein: Hemoglobin và Myoglobin là 75%; Lysozyme là 35%; Ribonuclease là 17%.'
  },
  {
    id: 'hsq99', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Bản chất cấu trúc bậc 3',
    prompt: 'Cấu trúc bậc 3 của protein biểu thị điều gì và được duy trì nhờ các loại liên kết nào?',
    opts: ['Sự cuộn khúc không gian 3 chiều của chuỗi polypeptide thành khối cầu; duy trì nhờ liên kết disulfua, hydro, Van der Waals và liên kết tĩnh điện', 'Trình tự sắp xếp các amino acid; duy trì nhờ liên kết peptide', 'Sự xoắn cục bộ đều đặn; duy trì duy nhất bằng liên kết peptide', 'Sự tương tác giữa protein với acid nucleic của nhân tế bào'],
    ans: 0,
    exp: '📚 Trang 48 PDF: Cấu trúc bậc III biểu thị sự xoắn và cuộn khúc của chuỗi polypeptide thành khối cầu (tương tác giữa các gốc amino acid ở xa nhau). Được giữ vững bởi cầu disulfua, liên kết Van der Waals, liên kết hydro, liên kết tĩnh điện.'
  },
  {
    id: 'hsq100', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Liên kết trong cấu trúc bậc 4',
    prompt: 'Các tiểu đơn vị (subunit) trong cấu trúc bậc 4 của protein liên kết với nhau bằng loại lực nào là chủ yếu?',
    opts: ['Liên kết hydrogen, tương tác Van der Waals và lực tĩnh điện giữa bề mặt các tiểu đơn vị', 'Liên kết peptide cộng hóa trị nối liền các đầu C và N', 'Cầu disulfua cộng hóa trị dày đặc giữa các lõi kỵ nước', 'Liên kết phosphodiester giữa các gốc đường'],
    ans: 0,
    exp: '📚 Trang 48 PDF: Trong cấu trúc bậc IV, các tiểu đơn vị gắn với nhau nhờ các liên kết hydrogen, tương tác Van der Waals giữa các nhóm phân bố trên bề mặt của các tiểu đơn vị để làm bền cấu trúc bậc IV.'
  },
  {
    id: 'hsq101', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Lớp vỏ hydrate hóa',
    prompt: 'Hai yếu tố quan trọng nhất giúp cho các phân tử protein trong dung dịch keo không bị dính vào nhau để tạo tủa là:',
    opts: ['Lớp áo nước (vỏ hydrate hóa) và điện tích cùng dấu của các phân tử protein', 'Kích thước phân tử lớn và tỷ lệ carbon cao', 'Sự có mặt của enzyme xúc tác và nồng độ đường trong máu', 'Áp suất thẩm thấu và lượng lipid bao quanh'],
    ans: 0,
    exp: '📚 Trang 49 & 56 PDF: Độ bền của dung dịch keo protein được duy trì bởi 2 yếu tố: (1) Lớp áo nước bao quanh các nhóm ưa nước và (2) Sự tích điện cùng dấu ngăn cản các phân tử va chạm kết tụ lại với nhau.'
  },
  {
    id: 'hsq102', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tác dụng của ethanol và acetone',
    prompt: 'Khi thêm các dung môi hữu cơ trung tính háo nước như ethanol hoặc acetone vào dung dịch protein trong nước, protein bị kết tủa là do:',
    opts: ['Làm giảm hằng số điện môi của dung môi và phá hủy lớp áo nước (vỏ hydrate) của protein', 'Phá vỡ liên kết peptide trong chuỗi polypeptide', 'Oxy hóa phá hủy hoàn toàn các amino acid nhân thơm', 'Tăng cường khả năng ngậm nước của phân tử protein'],
    ans: 0,
    exp: '📚 Trang 49 PDF: Khi thêm dung môi hữu cơ háo nước (ethanol, acetone), độ tan của protein giảm và bị kết tủa do giảm mức độ hydrate hóa (mất lớp áo nước) và giảm hằng số điện môi ngăn cản lực tương tác giữa các phân tử.'
  },
  {
    id: 'hsq103', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Độ nhớt của dung dịch protein',
    prompt: 'Người ta có thể lợi dụng tính chất nào sau đây của dung dịch protein để ước tính khối lượng phân tử của nó?',
    opts: ['Độ nhớt của dung dịch (độ nhớt càng cao thì khối lượng phân tử càng lớn)', 'Độ dẫn điện của dung dịch', 'Độ pH của dung dịch', 'Nhiệt độ sôi của dung dịch'],
    ans: 0,
    exp: '📚 Trang 49 PDF: Mỗi loại dung dịch của những protein khác nhau có độ nhớt khác nhau. Người ta có thể lợi dụng tính chất này để xác định khối lượng phân tử của protein (độ nhớt càng cao thì khối lượng phân tử càng cao).'
  },
  {
    id: 'hsq104', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Hiện tượng Salting in',
    prompt: 'Hiện tượng muối trung tính ở <strong>nồng độ thấp</strong> làm tăng độ hòa tan của các protein hình cầu (hiện tượng Salting in) phụ thuộc chủ yếu vào:',
    opts: ['Nồng độ muối và lực ion $\\mu$ của dung dịch', 'Nhiệt độ sôi của dung môi hữu cơ', 'Khối lượng riêng của protein sợi', 'Độ dài của chuỗi polypeptide'],
    ans: 0,
    exp: '📚 Trang 50 PDF: Tác dụng hòa tan protein của muối trung tính nồng độ thấp không phụ thuộc vào bản chất muối mà phụ thuộc vào nồng độ muối và số điện tích của mỗi ion, tức là phụ thuộc vào lực ion $\\mu$ của dung dịch (ion hóa trị 2 làm tăng độ tan mạnh hơn ion hóa trị 1).'
  },
  {
    id: 'hsq105', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Nồng độ muối kết tủa Albumin và Globulin',
    prompt: 'Để phân tách Globulin và Albumin ra khỏi huyết thanh bằng phương pháp diêm tích, người ta sử dụng muối amonium sulfate với các nồng độ lần lượt là:',
    opts: ['Dung dịch 50% bão hòa kết tủa Globulin; dung dịch bão hòa 100% kết tủa Albumin', 'Dung dịch 10% kết tủa Albumin; dung dịch 90% kết tủa Globulin', 'Dung dịch 100% bão hòa kết tủa cả hai cùng một lúc', 'Dung dịch 25% kết tủa Globulin; dung dịch 50% kết tủa Albumin'],
    ans: 0,
    exp: '📚 Trang 50 & 55 PDF: Globulin phân tử lớn hơn bị kết tủa ở nồng độ muối $(\\ce{NH4})_2\\ce{SO4}$ bán bão hòa (50%), trong khi Albumin nhỏ và ưa nước hơn chỉ kết tủa ở nồng độ $(\\ce{NH4})_2\\ce{SO4}$ bão hòa hoàn toàn (70 - 100%).'
  },
  {
    id: 'hsq106', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phương pháp loại muối thẩm tích',
    prompt: 'Sau khi kết tủa protein bằng muối trung tính (kết tủa thuận nghịch), người ta thường dùng phương pháp nào để loại bỏ lượng muối dư ra khỏi chế phẩm protein?',
    opts: ['Thẩm tích (dialysis) qua túi màng bán thấm', 'Đun sôi ở $100^\\circ\\text{C}$', 'Cho tác dụng với acid vô cơ đậm đặc', 'Chiếu xạ tia tử ngoại năng lượng cao'],
    ans: 0,
    exp: '📚 Trang 51 PDF: Trong chế phẩm protein nhận được còn lẫn các chất đã dùng để kết tủa (muối), cần sử dụng phương pháp thích hợp để loại bỏ, ví dụ có thể dùng phương pháp thẩm tích (dialysis) qua màng bán thấm để muối khuếch tán ra ngoài.'
  },
  {
    id: 'hsq107', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cực đại hấp thụ peptide 190 nm',
    prompt: 'Dung dịch protein có khả năng hấp thụ ánh sáng tử ngoại cực đại ở bước sóng <strong>$190\\text{ nm}$</strong> (vùng 180 - 220 nm) là do sự hiện diện của thành phần nào?',
    opts: ['Liên kết peptide trong mạch protein', 'Nhân thơm của Tryptophan', 'Gốc thiol của Cysteine', 'Nhóm guanidino của Arginine'],
    ans: 0,
    exp: '📚 Trang 50 - 51 PDF: Ở bước sóng từ 180 nm - 220 nm là vùng hấp thụ của các liên kết peptide trong protein, có cực đại hấp thụ ở 190 nm.'
  },
  {
    id: 'hsq108', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Đo độ hấp thụ ở 220-240 nm',
    prompt: 'Trong thực tế định lượng protein, người ta thường đo độ hấp thụ của liên kết peptide ở bước sóng <strong>220 nm - 240 nm</strong> thay vì bước sóng cực đại 190 nm vì lý do gì?',
    opts: ['Vì các tạp chất trong dung dịch cũng hấp thụ mạnh ở 180 - 220 nm và làm dịch bước sóng hấp thụ', 'Vì ở 190 nm protein bị biến tính hoàn toàn', 'Vì máy quang phổ không thể phát hiện được bước sóng dưới 300 nm', 'Vì liên kết peptide chỉ hình thành ở bước sóng trên 220 nm'],
    ans: 0,
    exp: '📚 Trang 51 PDF: Vùng hấp thụ 180-220 nm của liên kết peptide dễ bị dịch về phía bước sóng dài hơn khi có tạp chất, và chính các tạp chất này cũng hấp thụ mạnh ở vùng này. Vì thế thực tế thường đo ở 220 nm - 240 nm.'
  },
  {
    id: 'hsq109', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Thành phần thuốc thử Folin-Ciocalteu',
    prompt: 'Thuốc thử <strong>Folin-Ciocalteu</strong> trong phương pháp định lượng protein theo Lowry có chứa các acid vô cơ phức tạp nào?',
    opts: ['Phosphomolybdic acid và phosphotungstic (phosphovolframic) acid', 'Acid sulfuric và acid nitric đậm đặc', 'Acid clohydric và acid acetic', 'Acid picric và acid citric'],
    ans: 0,
    exp: '📚 Trang 52 PDF: Thuốc thử Folin-Ciocalteu chứa phosphomolybdic acid và phosphovolframic acid; các chất này phản ứng với gốc Tyr và Trp trong protein tạo phức màu xanh da trời đậm hấp thụ ở 750 nm.'
  },
  {
    id: 'hsq110', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phản ứng Pauli',
    prompt: 'Phản ứng <strong>Pauli</strong> (tác dụng với acid diazobenzenesulfonic tạo màu đỏ anh đào) là phản ứng đặc trưng dùng để phát hiện hai amino acid nào trong protein?',
    opts: ['Tyrosine (Tyr) và Histidine (His)', 'Tryptophan (Trp) và Phenylalanine (Phe)', 'Arginine (Arg) và Lysine (Lys)', 'Cysteine (Cys) và Methionine (Met)'],
    ans: 0,
    exp: '📚 Trang 52 PDF: Phản ứng Pauli: các gốc amino acid Tyr (nhân phenol) và His (nhân imidazole) trong protein tác dụng với diazobenzosulfonic acid tạo phức hợp màu đỏ anh đào.'
  },
  {
    id: 'hsq111', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phản ứng Ninhydrin với Proline',
    prompt: 'Khi thực hiện phản ứng với thuốc thử Ninhydrin ở nhiệt độ cao, amino acid nào sau đây tạo dung dịch có <strong>màu vàng</strong> thay vì màu tím xanh?',
    opts: ['Proline (imino acid)', 'Glycine', 'Alanine', 'Glutamate'],
    ans: 0,
    exp: '📚 Trang 41 PDF (Hình 3.11): Tất cả các amino acid tự do trong protein đều phản ứng với ninhydrin tạo phức chất màu xanh tím, RIÊNG imino acid như proline và hydroxyproline tạo thành màu vàng.'
  },
  {
    id: 'hsq112', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Protein vỏ côn trùng Sclerotin',
    prompt: 'Protein dạng sợi nào sau đây là thành phần cấu trúc cơ bản tạo nên lớp vỏ ngoài cứng cáp của các loài sâu bọ, côn trùng?',
    opts: ['Sclerotin', 'Fibroin', 'Collagen', 'Myosin'],
    ans: 0,
    exp: '📚 Trang 52 PDF: Các protein dạng sợi làm nhiệm vụ cấu trúc bao gồm: Sclerotin có trong lớp vỏ ngoài của sâu bọ côn trùng; fibroin của tơ tằm, nhện; collagen, elastin của mô liên kết, mô xương.'
  },
  {
    id: 'hsq113', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Protein dạng trung gian Myosin',
    prompt: 'Loại protein nào sau đây thuộc nhóm <strong>protein dạng trung gian</strong> (vừa có cấu trúc hình que dài của protein sợi, vừa có khả năng tan trong dung dịch muối của protein cầu)?',
    opts: ['Myosin và Fibrinogen', 'Albumin và Globulin', 'Collagen và Keratin', 'Histone và Protamine'],
    ans: 0,
    exp: '📚 Trang 54 - 55 PDF: Protein trung gian: Myosin (yếu tố cấu trúc và co cơ quan trọng) có cấu trúc hình que dài là đặc điểm của protein sợi, nhưng lại tan trong dung dịch muối là đặc điểm của protein cầu; ngoài ra còn có tiền thân của fibrin là fibrinogen.'
  },
  {
    id: 'hsq114', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Chức năng của Collagen',
    prompt: 'Protein sợi Collagen đóng vai trò sinh học chủ yếu nào trong cơ thể động vật bậc cao?',
    opts: ['Đảm bảo độ bền chắc và tính mềm dẻo cho mô liên kết, gân và mô xương', 'Xúc tác phân giải carbohydrate trong dịch tiêu hóa', 'Vận chuyển oxy từ phổi đến các mô', 'Tiết kháng thể bảo vệ cơ thể chống nhiễm trùng'],
    ans: 0,
    exp: '📚 Trang 52 PDF: Collagen là thành phần protein chính của mô liên kết, gân và xương, đảm bảo cho độ bền cơ học và tính mềm dẻo đàn hồi của mô liên kết.'
  },
  {
    id: 'hsq115', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Protein dự trữ sắt Ferritin',
    prompt: 'Protein nào sau đây có chức năng <strong>dự trữ nguyên tố sắt (Fe)</strong> quan trọng tại lách và gan của cơ thể?',
    opts: ['Ferritin (Feritin)', 'Hemoglobin', 'Ceruloplasmin', 'Casein'],
    ans: 0,
    exp: '📚 Trang 53 PDF: Các protein làm nhiệm vụ dự trữ dinh dưỡng và khoáng chất: Casein của sữa, ovalbumin của trứng, Feritin của lách và gan (dự trữ nguyên tố sắt Fe).'
  },
  {
    id: 'hsq116', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Sắc tố Rhodopsin',
    prompt: 'Sắc tố thị giác <strong>Rhodopsin</strong> ở màng lưới của mắt là đại diện điển hình cho chức năng sinh học nào của protein?',
    opts: ['Chức năng thụ cảm và dẫn truyền tín hiệu thần kinh thị giác', 'Chức năng co rút vận động', 'Chức năng dự trữ năng lượng', 'Chức năng chống đông máu'],
    ans: 0,
    exp: '📚 Trang 53 - 54 PDF: Chức năng dẫn truyền tín hiệu thần kinh: Nhiều loại protein tham gia vào việc dẫn truyền tín hiệu thần kinh đối với các kích thích đặc hiệu như sắc tố thị giác rhodopsin ở màng lưới mắt.'
  },
  {
    id: 'hsq117', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Đặc điểm của Histone',
    prompt: 'Protein <strong>Histone</strong> có những đặc tính hóa lý nổi bật nào sau đây?',
    opts: ['Là protein có tính kiềm, dễ tan trong nước, không tan trong dung dịch amoniac loãng', 'Là protein có tính acid mạnh, không tan trong nước', 'Là protein dạng sợi bền vững chỉ tan trong cồn $70^\\circ$', 'Là một loại kháng thể miễn dịch dịch thể'],
    ans: 0,
    exp: '📚 Trang 55 PDF: Histon là protein có tính kiềm (chứa nhiều amino acid kiềm Arg, Lys), dễ tan trong nước, không tan trong dung dịch amoniac loãng, có vai trò liên kết đóng gói phân tử ADN trong nhân tế bào.'
  },
  {
    id: 'hsq118', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Độ tan của Glutelin',
    prompt: 'Loại protein thuần nào sau đây không tan trong nước, không tan trong cồn nhưng <strong>chỉ hòa tan trong dung dịch kiềm hoặc acid loãng</strong>?',
    opts: ['Glutelin (Glutein)', 'Albumin', 'Globulin', 'Prolamin'],
    ans: 0,
    exp: '📚 Trang 55 PDF: So sánh độ tan của các protid thuần: Albumin tan trong nước; Globulin tan trong muối loãng; Prolamin tan trong cồn 70-80%; Glutein chỉ tan trong dung dịch kiềm hoặc acid loãng.'
  },
  {
    id: 'hsq119', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Bản chất xúc tác sinh học',
    prompt: 'Hầu hết các chất xúc tác sinh học (enzyme) đều có bản chất là protein. Tuy nhiên gần đây người ta phát hiện phân tử sinh học nào cũng có hoạt tính xúc tác?',
    opts: ['RNA (Ribozyme)', 'Phospholipid màng', 'Cholesterol este', 'Glycogen cơ'],
    ans: 0,
    exp: '📚 Trang 53 PDF: Hầu hết các phản ứng đều do enzyme (protein) xúc tác. Tuy nhiên gần đây người ta đã phát hiện một loại RNA có khả năng xúc tác quá trình hoàn thiện pre-mRNA thành mRNA (gọi là ribozyme).'
  },
  {
    id: 'hsq120', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Chromoprotein',
    prompt: 'Trong các loại protein phức tạp (protid tạp), nhóm <strong>Chromoprotein</strong> có đặc điểm nhận diện nào sau đây?',
    opts: ['Có nhóm ngoại là hợp chất mang màu (ví dụ nhóm heme màu đỏ ở Hemoglobin, flavin màu vàng ở Flavoprotein)', 'Có nhóm ngoại là phân tử lipid trung tính', 'Có nhóm ngoại là chuỗi polysaccharide', 'Có nhóm ngoại là acid phosphoric'],
    ans: 0,
    exp: '📚 Trang 55 - 56 PDF: Chromoprotein là protein phức tạp có nhóm ngoại là hợp chất có màu, ví dụ sắc tố đỏ ở hemoglobin (chứa nhân heme), màu vàng ở flavoprotein.'
  },
  {
    id: 'hsq121', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Tỷ lệ protein trong tế bào',
    prompt: 'Về mặt số lượng trong tế bào sống, protein chiếm tỷ lệ bao nhiêu trong <strong>trọng lượng khô</strong> của tế bào?',
    opts: ['Không dưới 50% trọng lượng khô của tế bào', 'Khoảng 10% đến 15% trọng lượng khô', 'Khoảng 25% trọng lượng khô', 'Gần như 95% trọng lượng khô'],
    ans: 0,
    exp: '📚 Trang 34 & 52 PDF: Về mặt số lượng, protein chiếm không dưới 50% trọng lượng khô của tế bào; là hợp chất hữu cơ có ý nghĩa quan trọng bậc nhất trong cơ thể sống.'
  },
  {
    id: 'hsq122', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phosphoprotein và Casein',
    prompt: 'Protein tạp <strong>Phosphoprotein</strong> có nhóm ngoại là gì và ví dụ tiêu biểu có trong sữa động vật là chất nào?',
    opts: ['Nhóm ngoại là phosphoric acid; ví dụ là Casein của sữa', 'Nhóm ngoại là lipid; ví dụ là Chylomicron', 'Nhóm ngoại là acid nucleic; ví dụ là Ribosome', 'Nhóm ngoại là đường hexose; ví dụ là Mucin'],
    ans: 0,
    exp: '📚 Trang 55 - 56 PDF: Phosphoprotein có nhóm ngoại là phosphoric acid, đại diện tiêu biểu là Casein của sữa (protein dự trữ dinh dưỡng chứa phosphate).'
  },
  {
    id: 'hsq123', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Ceruloplasmin vận chuyển đồng',
    prompt: 'Loại protein huyết tương nào làm nhiệm vụ chuyên biệt là <strong>vận chuyển nguyên tố Đồng ($\\ce{Cu}$)</strong> trong máu?',
    opts: ['Ceruloplasmin', 'Transferrin', 'Hemoglobin', 'Ferritin'],
    ans: 0,
    exp: '📚 Trang 53 PDF: Trong cơ thể có những protein làm nhiệm vụ vận chuyển như lipoprotein vận chuyển lipid, ceruloplasmin vận chuyển đồng (Cu) trong máu, hemoglobin vận chuyển khí máu.'
  },
  {
    id: 'hsq124', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Khối lượng phân tử Insulin',
    prompt: 'Khối lượng phân tử xấp xỉ của hormone Insulin gồm 51 amino acid theo bài giảng là:',
    opts: ['5.700 Da', '20.000 Da', '64.500 Da', '12.640 Da'],
    ans: 0,
    exp: '📚 Trang 45 PDF: Phân tử insulin bao gồm 51 amino acid, có cấu trúc gồm 2 chuỗi polypeptide, với khối lượng phân tử khoảng 5.700 Da.'
  },
  {
    id: 'hsq125', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Khối lượng phân tử HGH',
    prompt: 'Hormone sinh trưởng người (HGH hay STH) gồm 191 amino acid có khối lượng phân tử xấp xỉ là bao nhiêu?',
    opts: ['20.000 Da', '5.700 Da', '12.640 Da', '68.000 Da'],
    ans: 0,
    exp: '📚 Trang 44 PDF: Hormone sinh trưởng của người (HGH - human growth hormone) là một chuỗi polypeptide bao gồm 191 amino acid có khối lượng phân tử 20.000.'
  },
  {
    id: 'hsq126', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Bệnh lý thiếu HGH',
    prompt: 'Sự <strong>thiếu hụt hormone sinh trưởng HGH</strong> nếu xảy ra trước tuổi dậy thì sẽ dẫn đến hậu quả bệnh lý nào?',
    opts: ['Chứng người lùn tuyến yên (dwarfism)', 'Bệnh to cực (acromegaly)', 'Bệnh đái tháo đường typ 1', 'Bệnh bướu cổ phù niêm'],
    ans: 0,
    exp: '📚 Trang 45 PDF: Sự thiếu hụt HGH nếu xảy ra trước tuổi dậy thì sẽ dẫn đến chứng người lùn tuyến yên (cơ thể phát triển cân đối nhưng tầm vóc rất nhỏ bé).'
  },
  {
    id: 'hsq127', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Bệnh lý thừa HGH',
    prompt: 'Sự <strong>dư thừa hormone sinh trưởng HGH</strong> nếu xảy ra sau tuổi dậy thì (khi các đầu xương dài đã đóng khớp) sẽ dẫn đến tình trạng gì?',
    opts: ['Bệnh to cực (acromegaly: phát triển bề dày xương bàn tay, chân, hàm và mặt)', 'Chứng người khổng lồ đồng đều toàn thân', 'Chứng loãng xương toàn thân', 'Suy tuyến thượng thận mạn tính'],
    ans: 0,
    exp: '📚 Trang 45 PDF: Sự dư thừa HGH nếu xảy ra sau tuổi dậy thì sẽ dẫn đến chứng người bị to cực (acromegaly: phát triển chiều dày của đầu, xương và mặt, các chi to bè).'
  },
  {
    id: 'hsq128', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Cấu trúc phiến gấp beta ở Fibroin',
    prompt: 'Cấu trúc bậc 2 dạng <strong>phiến gấp $\\beta$ (phiến gấp beta)</strong> được tìm thấy điển hình trong loại protein tự nhiên nào?',
    opts: ['Fibroin của sợi tơ tằm và tơ nhện', 'Hemoglobin trong hồng cầu', 'Myoglobin trong mô cơ tim', 'Albumin trong huyết thanh'],
    ans: 0,
    exp: '📚 Trang 48 PDF: Theo Pauling và Corey (1951), cấu trúc phiến gấp $\\beta$ tìm thấy điển hình trong protein fibroin của tơ tằm và mạng nhện (chuỗi polypeptide duỗi thẳng xếp song song tạo độ dai bền).'
  },
  {
    id: 'hsq129', ch: 4, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Biến đổi cấu trúc Keratin',
    prompt: 'Trong sợi tóc người, protein Keratin bình thường tồn tại ở dạng cấu trúc nào và khi bị duỗi thẳng kéo căng sẽ chuyển sang dạng nào?',
    opts: ['Bình thường ở dạng xoắn $\\alpha$, khi kéo căng chuyển sang dạng $\\beta$ duỗi thẳng', 'Bình thường ở dạng phiến gấp $\\beta$, khi kéo căng chuyển sang xoắn $\\alpha$', 'Bình thường ở cấu trúc bậc 4, khi kéo căng thành bậc 1', 'Luôn luôn cố định ở dạng hình cầu không thay đổi'],
    ans: 0,
    exp: '📚 Trang 48 PDF: Ở trong tóc người ta tìm thấy keratin là loại protein có hai dạng cấu trúc: dạng $\\alpha$ bình thường và dạng $\\beta$ duỗi thẳng khi bị kéo căng cơ học.'
  },
  {
    id: 'hsq130', ch: 6, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Protein Repressor điều hòa',
    prompt: 'Chức năng điều hòa biểu hiện gen của protein được thể hiện rõ nét qua hoạt động của <strong>protein ức chế (repressor)</strong> ở vi khuẩn như thế nào?',
    opts: ['Gắn vào vùng vận hành (operator) làm ngừng quá trình phiên mã và sinh tổng hợp enzyme', 'Thủy phân trực tiếp phân tử ADN của vi khuẩn', 'Oxy hóa acid amin tạo năng lượng cho vi khuẩn', 'Xúc tác tạo màng tế bào mới'],
    ans: 0,
    exp: '📚 Trang 54 PDF: Các protein làm nhiệm vụ điều hòa: Chẳng hạn các protein repressor (chất ức chế) ở vi khuẩn có thể liên kết với ADN làm ngừng quá trình sinh tổng hợp enzyme từ các gen tương ứng.'
  },
  {
    id: 'hsq131', ch: 5, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Muối hóa trị 2 và Salting in',
    prompt: 'Trong hiện tượng hòa tan protein bằng muối nồng độ thấp (Salting in), các muối chứa ion hóa trị 2 (như $\\ce{MgCl2}, \\ce{MgSO4}$) có tác dụng hòa tan protein so với các muối ion hóa trị 1 (như $\\ce{NaCl}, \\ce{KCl}$) như thế nào?',
    opts: ['Làm tăng đáng kể độ tan của protein hơn các muối có ion hóa trị 1 (do lực ion $\\mu$ lớn hơn)', 'Làm giảm độ tan nhiều hơn muối hóa trị 1', 'Hoàn toàn không có tác dụng hòa tan', 'Tác dụng ngang nhau vì không phụ thuộc hóa trị ion'],
    ans: 0,
    exp: '📚 Trang 50 PDF: Các muối có ion hóa trị 2 ($\\ce{MgCl2}, \\ce{MgSO4}...$) làm tăng đáng kể độ tan của protein hơn các muối có ion hóa trị 1 ($\\ce{NaCl}, \\ce{NH4Cl}, \\ce{KCl}...$) do lực ion $\\mu$ của dung dịch muối hóa trị 2 cao hơn nhiều.'
  },
  {
    id: 'hsq132', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Thí nghiệm Puppy và Bodo đầu tận cùng',
    prompt: 'Trong thí nghiệm của Puppy và Bodo khi phân tích một peptide từ phân giải Cytochrome C, amino acid đầu N-tận cùng và C-tận cùng lần lượt được xác định là:',
    opts: ['Đầu N-tận cùng là Cys (bằng pp Sanger) và đầu C-tận cùng là Lys (bằng carboxypeptidase)', 'Đầu N-tận cùng là Ala và đầu C-tận cùng là Val', 'Đầu N-tận cùng là Glu và đầu C-tận cùng là His', 'Đầu N-tận cùng là Lys và đầu C-tận cùng là Cys'],
    ans: 0,
    exp: '📚 Trang 43 PDF: Puppy và Bodo dùng phương pháp Sanger xác định được amino acid đầu N-tận cùng là Cys và phương pháp carboxypeptidase xác định được amino acid đầu C-tận cùng là Lys.'
  },
  {
    id: 'hsq133', ch: 3, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Trình tự peptide Cytochrome C',
    prompt: 'Trình tự đầy đủ của đoạn peptide trong nghiên cứu phân tích Cytochrome C của Puppy và Bodo (gồm 2 Cys, 1 Ala, 2 Glu, 1 His, 1 Thr, 1 Val, 1 Lys) là:',
    opts: ['$\\ce{H2N-Cys-Ala-Glu-Cys-His-Thr-Val-Glu-Lys-COOH}$', '$\\ce{H2N-Lys-Glu-Val-Thr-His-Cys-Glu-Ala-Cys-COOH}$', '$\\ce{H2N-Ala-Cys-Glu-His-Thr-Val-Glu-Lys-Cys-COOH}$', '$\\ce{H2N-Cys-Cys-Ala-Glu-Glu-His-Thr-Val-Lys-COOH}$'],
    ans: 0,
    exp: '📚 Trang 43 PDF: Tổng hợp các dữ kiện giải trình tự, Puppy và Bodo đã xác định được trình tự của peptide nghiên cứu là: $\\ce{H2N-Cys-Ala-Glu-Cys-His-Thr-Val-Glu-Lys-COOH}$.'
  },
  {
    id: 'hsq134', ch: 1, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Amino acid đồng vòng',
    prompt: 'Tập hợp amino acid nào sau đây chỉ gồm toàn các amino acid thuộc nhóm <strong>mạch vòng đồng vòng (homocyclic)</strong>?',
    opts: ['Phenylalanine (Phe) và Tyrosine (Tyr)', 'Tryptophan (Trp) và Histidine (His)', 'Proline (Pro) và Tryptophan (Trp)', 'Alanine (Ala) và Valine (Val)'],
    ans: 0,
    exp: '📚 Trang 35 PDF: Trong nhóm mạch vòng: Nhóm đồng vòng (vòng chỉ gồm các nguyên tử Carbon thuần túy) gồm Phenylalanine và Tyrosine (nhân benzen/phenol). Còn Tryptophan (nhân indol), Histidine (nhân imidazole), Proline (vòng pyrrolidine) thuộc nhóm dị vòng (chứa nguyên tử Nitơ trong vòng).'
  },
  {
    id: 'hsq135', ch: 2, type: 'mcq', isCalc: false, sub: 'hs', isExam22: false, topic: 'Phức aminoacyl-adenylate',
    prompt: 'Phản ứng của nhóm $-\\ce{COOH}$ với hợp chất ATP tạo thành phức chất <strong>aminoacyl-adenylate</strong> có vai trò thiết yếu trong quá trình sinh học nào?',
    opts: ['Quá trình hoạt hóa amino acid để sinh tổng hợp protein tại ribosome', 'Quá trình khử amin oxy hóa tại ty thể', 'Quá trình kết tủa protein bằng cồn', 'Quá trình tạo liên kết hydro trong chuỗi polypeptide'],
    ans: 0,
    exp: '📚 Trang 41 PDF (Mục 3.2.6.3): Nhóm $-\\ce{COOH}$ của amino acid có thể tạo thành phức aminoacyl-adenylate dưới tác dụng của enzyme aminoacyl-tRNA synthetase và ATP trong phản ứng hoạt hóa amino acid để sinh tổng hợp protein.'
  }
];
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

// Biến lưu môn học hiện tại ('pt' = Hóa Phân Tích, 'hs' = Hóa Sinh Đại Cương)
let currentSubject = localStorage.getItem('chem_subject') || 'pt';

// Filter Options
function getSelectedChapters() {
  const selector = currentSubject === 'hs' ? '#chapterChecksHS input:checked' : '#chapterChecksPT input:checked';
  return [...document.querySelectorAll(selector)].map(e => +e.value);
}

function getSelectedTypes() {
  if (currentSubject === 'hs') {
    return ['mcq']; // Hóa sinh 100% trắc nghiệm lý thuyết theo yêu cầu người dùng
  }
  return [...document.querySelectorAll('#typeChecks input:checked')].map(e => e.value);
}

function setChapterChecks(arr) {
  const selector = currentSubject === 'hs' ? '#chapterChecksHS input' : '#chapterChecksPT input';
  document.querySelectorAll(selector).forEach(input => {
    input.checked = arr.includes(+input.value);
  });
}

function setTypeChecks(arr) {
  document.querySelectorAll('#typeChecks input').forEach(input => {
    input.checked = arr.includes(input.value);
  });
}

// BỘ CHUYỂN ĐỔI MÔN HỌC (SUBJECT SWITCHER)
function switchSubject(sub) {
  currentSubject = sub;
  localStorage.setItem('chem_subject', sub);
  document.body.dataset.subject = sub;

  // Cập nhật nút active trên switcher
  document.querySelectorAll('.sub-tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sub === sub);
  });

  const heroBadge = document.getElementById('heroBadgeText');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  const heroChips = document.getElementById('heroChips');
  const presetRowPT = document.getElementById('presetRowPT');
  const presetRowHS = document.getElementById('presetRowHS');
  const chapterChecksPT = document.getElementById('chapterChecksPT');
  const chapterChecksHS = document.getElementById('chapterChecksHS');
  const propChapterLabel = document.getElementById('propChapterLabel');
  const calcToggleWrapper = document.getElementById('calcToggleWrapper');
  const calcNoticeHS = document.getElementById('calcNoticeHS');
  const searchInput = document.getElementById('searchInput');

  if (sub === 'hs') {
    // Giao diện Hóa sinh đại cương
    if (heroBadge) heroBadge.textContent = 'Hóa sinh đại cương — Protein';
    if (heroTitle) heroTitle.innerHTML = "Hệ thống Ôn tập <span class='highlight'>Hóa sinh Đại cương</span>";
    if (heroDesc) heroDesc.innerHTML = "Chuyên đề <strong>Chương 3: Protein &amp; 20 Acid amin</strong> chuẩn theo file PDF bài giảng Hóa sinh Đại cương. Ngân hàng hơn <strong>135 câu trắc nghiệm lý thuyết</strong> chuyên sâu, đầy đủ trọn bộ 22 câu đề thi có đáp án chuẩn xác!";
    if (heroChips) {
      heroChips.innerHTML = `
        <div class="hero-chip"><i class='bx bx-book-content'></i> Chuẩn PDF Hóa Sinh Đại Cương</div>
        <div class="hero-chip"><i class='bx bx-radio-circle-marked'></i> 100% Trắc nghiệm lý thuyết</div>
        <div class="hero-chip"><i class='bx bxs-award'></i> Trọn bộ 22 Câu chuẩn đề thi PDF</div>
        <div class="hero-chip"><i class='bx bx-collection'></i> 135 Câu hỏi phong phú</div>
        <div class="hero-chip"><i class='bx bx-timer'></i> Đồng hồ bấm giờ làm bài</div>
      `;
    }

    if (presetRowPT) presetRowPT.style.display = 'none';
    if (presetRowHS) presetRowHS.style.display = 'flex';
    if (chapterChecksPT) chapterChecksPT.style.display = 'none';
    if (chapterChecksHS) chapterChecksHS.style.display = 'flex';
    if (propChapterLabel) propChapterLabel.textContent = 'Chuyên đề Protein';
    if (calcToggleWrapper) calcToggleWrapper.style.display = 'none';
    if (calcNoticeHS) calcNoticeHS.style.display = 'inline-flex';
    if (searchInput) searchInput.placeholder = "Tìm kiếm lý thuyết protein (ninhydrin, biure, pHi, insulin, sanger, cấu trúc bậc 2, lowry...)";

    // Cập nhật sidebar widget 3 và iOS bottom bar
    const sbPT = document.getElementById('sidebarQuickFormulasPT');
    const sbHS = document.getElementById('sidebarQuickFormulasHS');
    const sbTitleText = document.getElementById('sidebarWidget3TitleText');
    const sbCheatText = document.getElementById('sidebarCheatBtnText');
    const tabNavCalc = document.getElementById('tabNavCalc');

    if (sbPT) sbPT.style.display = 'none';
    if (sbHS) sbHS.style.display = 'flex';
    if (sbTitleText) sbTitleText.textContent = 'Kiến thức hay gặp (PDF)';
    if (sbCheatText) sbCheatText.textContent = 'Mở Sổ tay Protein & 20 Acid amin';
    if (tabNavCalc) {
      tabNavCalc.innerHTML = "<i class='bx bx-test-tube'></i><span>Phân tích</span>";
      tabNavCalc.title = "Chuyển sang môn Hóa Phân Tích";
    }
    // Đổi nhãn nút "Tra cứu công thức" thành "Mindmap & Sổ tay"
    const calcGuideSpan = document.querySelector('#openCalcGuideBtn span');
    if (calcGuideSpan) calcGuideSpan.textContent = 'Mindmap & Sổ tay Hóa sinh';
    const calcGuideBtn = document.getElementById('openCalcGuideBtn');
    if (calcGuideBtn) calcGuideBtn.title = 'Mở Mindmap hệ thống kiến thức Hóa sinh';

    // Khóa các dạng câu khác, chỉ giữ trắc nghiệm mcq
    document.querySelectorAll('.type-optional-item').forEach(el => {
      el.style.opacity = '0.4';
      el.style.pointerEvents = 'none';
    });
    const mcqInput = document.getElementById('type-mcq');
    if (mcqInput) mcqInput.checked = true;

    // Kích hoạt tất cả 6 chuyên đề Hóa sinh
    setChapterChecks([1, 2, 3, 4, 5, 6]);
    document.querySelectorAll('.preset-hs').forEach(p => p.classList.remove('active'));
    document.querySelector('[data-preset-hs="hs-all"]')?.classList.add('active');

    // Cập nhật tiêu đề và tab của modal Sổ tay theo môn Hóa sinh
    const modalTitleHS = document.getElementById('modalTitleText');
    const modalBadgeHS = document.getElementById('modalBadgeText');
    if (modalTitleHS) modalTitleHS.innerHTML = "<i class='bx bx-dna'></i> Sổ tay Hóa Sinh Đại Cương — Protein";
    if (modalBadgeHS) modalBadgeHS.textContent = 'Chuẩn PDF Hóa Sinh';
    document.querySelectorAll('.modal-tab-pt').forEach(t => { t.style.display = 'none'; });
    document.querySelectorAll('.modal-tab-hs').forEach(t => { t.style.display = 'inline-flex'; });
    // Kích hoạt tab Sổ tay Protein làm tab mặc định
    document.querySelectorAll('.modal-tab-btn').forEach(t => t.classList.remove('active'));
    const defaultHSTab = document.querySelector('[data-tab="tab-biochem"]');
    if (defaultHSTab) defaultHSTab.classList.add('active');
    document.querySelectorAll('.cheat-tab-content').forEach(c => { c.style.display = 'none'; });
    const biochemContent = document.getElementById('tab-biochem');
    if (biochemContent) biochemContent.style.display = 'block';

  } else {
    // Giao diện Hóa phân tích
    if (heroBadge) heroBadge.textContent = 'Hóa học phân tích';
    if (heroTitle) heroTitle.innerHTML = "Hệ thống Ôn tập <span class='highlight'>Hóa Phân tích 1 đến 4</span>";
    if (heroDesc) heroDesc.innerHTML = "Hệ thống ôn luyện toàn diện chuẩn theo <strong>4 tập bài giảng PDF</strong>: Đại cương, Nồng độ &amp; Đương lượng, Phân tích Khối lượng - Thể tích và Cân bằng Chuẩn độ Acid-Base. Tích hợp chế độ <strong>chuyên đề 100% bài tập tính toán</strong>!";
    if (heroChips) {
      heroChips.innerHTML = `
        <div class="hero-chip"><i class='bx bx-book-content'></i> Chuẩn 4 File PDF Bài giảng</div>
        <div class="hero-chip"><i class='bx bx-calculator'></i> Chuyên đề 100% Bài tập tính toán</div>
        <div class="hero-chip"><i class='bx bx-math'></i> Công thức $\\text{\\LaTeX}$ &amp; $\\ce{Phản ứng}$</div>
        <div class="hero-chip"><i class='bx bx-collection'></i> Hơn 110 Câu hỏi phong phú</div>
        <div class="hero-chip"><i class='bx bx-timer'></i> Đồng hồ bấm giờ làm bài</div>
      `;
    }

    if (presetRowPT) presetRowPT.style.display = 'flex';
    if (presetRowHS) presetRowHS.style.display = 'none';
    if (chapterChecksPT) chapterChecksPT.style.display = 'flex';
    if (chapterChecksHS) chapterChecksHS.style.display = 'none';
    if (propChapterLabel) propChapterLabel.textContent = 'Chương học';
    if (calcToggleWrapper) calcToggleWrapper.style.display = 'inline-flex';
    if (calcNoticeHS) calcNoticeHS.style.display = 'none';
    if (searchInput) searchInput.placeholder = "Tìm kiếm câu hỏi theo từ khóa (soda, đương lượng, tính pH, pha loãng, hệ số chuyển, ppm...)";

    // Cập nhật sidebar widget 3 và iOS bottom bar
    const sbPT = document.getElementById('sidebarQuickFormulasPT');
    const sbHS = document.getElementById('sidebarQuickFormulasHS');
    const sbTitleText = document.getElementById('sidebarWidget3TitleText');
    const sbCheatText = document.getElementById('sidebarCheatBtnText');
    const tabNavCalc = document.getElementById('tabNavCalc');

    if (sbPT) sbPT.style.display = 'flex';
    if (sbHS) sbHS.style.display = 'none';
    if (sbTitleText) sbTitleText.textContent = 'Công thức hay gặp (PDF)';
    if (sbCheatText) sbCheatText.textContent = 'Mở Sổ tay đầy đủ 4 Chương';
    if (tabNavCalc) {
      tabNavCalc.innerHTML = "<i class='bx bx-calculator'></i><span>Bài tập</span>";
      tabNavCalc.title = "100% Bài tập tính toán";
    }

    // Mở lại toàn bộ các dạng câu hỏi
    document.querySelectorAll('.type-optional-item').forEach(el => {
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    });

    setChapterChecks([1, 2, 3, 4]);
    setTypeChecks(['mcq', 'tf', 'fill', 'drag', 'color', 'short']);
    document.querySelectorAll('#presetRowPT .preset').forEach(p => p.classList.remove('active'));
    document.querySelector('[data-preset="all"]')?.classList.add('active');

    // Cập nhật tiêu đề và tab của modal Sổ tay về Hóa Phân Tích
    const modalTitlePT = document.getElementById('modalTitleText');
    const modalBadgePT = document.getElementById('modalBadgeText');
    if (modalTitlePT) modalTitlePT.innerHTML = "<i class='bx bx-book-bookmark'></i> Sổ tay Công thức Hóa Phân tích";
    if (modalBadgePT) modalBadgePT.textContent = 'Chuẩn 4 PDF';
    document.querySelectorAll('.modal-tab-pt').forEach(t => { t.style.display = 'inline-flex'; });
    document.querySelectorAll('.modal-tab-hs').forEach(t => { t.style.display = 'none'; });
    document.querySelectorAll('.modal-tab-btn').forEach(t => t.classList.remove('active'));
    const defaultPTTab = document.querySelector('[data-tab="tab-calculations"]');
    if (defaultPTTab) defaultPTTab.classList.add('active');
    document.querySelectorAll('.cheat-tab-content').forEach(c => { c.style.display = 'none'; });
    const calcContent = document.getElementById('tab-calculations');
    if (calcContent) calcContent.style.display = 'block';
  }

  generateQuiz(false);
  renderMath();
}

// Bắt sự kiện chuyển môn học
document.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    sound.playClick();
    const targetSub = e.currentTarget.dataset.sub;
    if (targetSub !== currentSubject) {
      switchSubject(targetSub);
    }
  });
});

// Presets Hóa Phân Tích
document.querySelectorAll('#presetRowPT .preset').forEach(btn => {
  btn.addEventListener('click', () => {
    sound.playClick();
    document.querySelectorAll('#presetRowPT .preset').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const p = btn.dataset.preset;

    if (p === 'calc') {
      if (elCalcOnlyToggle) elCalcOnlyToggle.checked = true;
      setChapterChecks([1, 2, 3, 4]);
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

// Presets Hóa Sinh Đại Cương
document.querySelectorAll('.preset-hs').forEach(btn => {
  btn.addEventListener('click', () => {
    sound.playClick();
    document.querySelectorAll('.preset-hs').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const p = btn.dataset.presetHs;

    if (p === 'hs-all') {
      setChapterChecks([1, 2, 3, 4, 5, 6]);
    } else if (p === 'hs-exam22') {
      setChapterChecks([1, 2, 3, 4, 5, 6]);
    } else if (p === 'hs-1') {
      setChapterChecks([1]);
    } else if (p === 'hs-2') {
      setChapterChecks([2]);
    } else if (p === 'hs-3') {
      setChapterChecks([3]);
    } else if (p === 'hs-4') {
      setChapterChecks([4]);
    } else if (p === 'hs-5') {
      setChapterChecks([5]);
    } else if (p === 'hs-6') {
      setChapterChecks([6]);
    }
  });
});

if (elCalcOnlyToggle) {
  elCalcOnlyToggle.addEventListener('change', () => {
    sound.playClick();
  });
}

document.querySelectorAll('#chapterChecksPT input, #chapterChecksHS input, #typeChecks input').forEach(input => {
  input.addEventListener('change', () => {
    sound.playClick();
    document.querySelectorAll('.preset, .preset-hs').forEach(p => p.classList.remove('active'));
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
  const isCalcOnly = elCalcOnlyToggle && elCalcOnlyToggle.checked && currentSubject === 'pt';

  if (!chapters.length) {
    alert(currentSubject === 'hs' ? 'Vui lòng chọn ít nhất một chuyên đề Hóa sinh để ôn tập.' : 'Vui lòng chọn ít nhất một chương để ôn tập.');
    return;
  }
  if (!types.length) {
    alert('Vui lòng chọn ít nhất một dạng câu hỏi.');
    return;
  }

  const baseSource = currentSubject === 'hs' ? QB_HOASINH : QB;
  let pool = baseSource.filter(q => chapters.includes(q.ch));

  // Phân luồng môn học
  if (currentSubject === 'pt') {
    pool = pool.filter(q => types.includes(q.type));
    if (isCalcOnly) {
      pool = pool.filter(q => q.isCalc);
    }
  } else {
    // Môn Hóa sinh: 100% Trắc nghiệm lý thuyết
    pool = pool.filter(q => q.type === 'mcq');
    const activeHSPreset = document.querySelector('.preset-hs.active')?.dataset.presetHs;
    if (activeHSPreset === 'hs-exam22') {
      pool = pool.filter(q => q.isExam22);
    }
  }

  // Lọc theo từ khóa tìm kiếm
  const kw = (elSearchInput?.value || '').trim().toLowerCase();
  if (kw) {
    pool = pool.filter(q =>
      q.prompt.toLowerCase().includes(kw) ||
      (q.topic && q.topic.toLowerCase().includes(kw)) ||
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
              <span class="badge badge-ch"><i class='bx bx-book-open'></i> ${getChapterLabel(q)}</span>
              <span class="badge badge-type"><i class='bx ${typeIcons[q.type]}'></i> ${typeLabels[q.type]}</span>
              ${q.isExam22 ? "<span class='badge' style='background:rgba(16,185,129,0.18); color:#047857; border:1px solid rgba(16,185,129,0.4); font-weight:700;'><i class='bx bxs-award'></i> 22 Câu chuẩn đề thi PDF</span>" : ""}
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
  const qid = card.dataset.id;
  return (currentSubject === 'hs' ? QB_HOASINH : QB).find(q => q.id === qid) ||
         QB_HOASINH.find(q => q.id === qid) ||
         QB.find(q => q.id === qid);
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
  cheatBtn.addEventListener('click', () => openModalToTab(currentSubject === 'hs' ? 'tab-biochem' : 'tab-calculations'));
}
if (cheatBoardBtn) {
  cheatBoardBtn.addEventListener('click', openModalToBoard);
}
if (calcHubBtn) {
  calcHubBtn.addEventListener('click', () => openModalToTab(currentSubject === 'hs' ? 'tab-biochem' : 'tab-calculations'));
}
if (openCalcGuideBtn) {
  openCalcGuideBtn.addEventListener('click', () => openModalToTab(currentSubject === 'hs' ? 'tab-mindmap' : 'tab-calculations'));
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
    btn.title = `Câu ${idx + 1} (${getChapterLabel(q)} • ${q.topic})`;

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
  openModalToTab(currentSubject === 'hs' ? 'tab-biochem' : 'tab-calculations');
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
  if (currentSubject === 'hs') {
    switchSubject('pt');
  }
  document.querySelector('[data-preset="calc"]')?.click();
  generateQuiz(true);
});

document.getElementById('tabNavFormulas')?.addEventListener('click', () => {
  sound.playClick();
  openModalToTab(currentSubject === 'hs' ? 'tab-biochem' : 'tab-calculations');
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
switchSubject(currentSubject);
initDeviceMode();
initFontSize();
initFormulaZoom();

