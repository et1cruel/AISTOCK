/* =====================================================================
   AI STOCK RESEARCH TERMINAL — single-file SPA
   DATA FIRST. ANALYSIS SECOND. DESIGN THIRD.
   - All seed figures are DEMO / illustrative until a live provider connects.
   - Layers: SeedDB -> DataService (adapter) -> Views. Swap DataService
     fetchers with a real API (see .env.example / Settings) without UI rewrite.
   ===================================================================== */
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt$ = (n, d) => (n == null || isNaN(n) ? 'N/A' : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: d != null ? d : 2, maximumFractionDigits: d != null ? d : 2 }));
const fmtN = (n, d) => (n == null || isNaN(n) ? 'N/A' : Number(n).toLocaleString('en-US', { minimumFractionDigits: d != null ? d : 1, maximumFractionDigits: d != null ? d : 1 }));
const fmtPct = (n, d) => (n == null || isNaN(n) ? 'N/A' : (n >= 0 ? '+' : '') + Number(n).toFixed(d != null ? d : 1) + '%');
const fmtB = (n) => (n == null || isNaN(n) ? 'N/A' : '$' + Number(n).toFixed(1) + 'B');
const DEMO = '<span class="badge b-yellow" title="Illustrative demo figure — connect a live provider for verified data">DEMO DATA</span>';
const NA = '<span class="muted">ข้อมูลยังไม่พอ</span>';

/* ---------------- SEED DATASET (DEMO, illustrative — NOT live) -------- */
function mkHist(base, growth, n, vol) {
  // deterministic pseudo-random walk for sparklines / technical charts
  let out = [], v = base, seed = base * 7919 % 997;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - 0.5; };
  for (let i = 0; i < n; i++) { v = v * (1 + growth / n + rnd() * vol); out.push(+v.toFixed(2)); }
  return out;
}
const SEED = {
  NVDA: { name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors', price: 187.42, mcap: 4580, revGrowth: 65.2, epsGrowth: 72.4, grossM: 71.1, opM: 58.3, fcf: 58.4, fcfM: 44.8, pe: 52.4, fwdPE: 31.2, peg: 1.1, ps: 24.5, evEbitda: 38.2, pFCF: 78.4, fcfYield: 1.3, hi52: 212.5, lo52: 86.2, divY: 0.0, roe: 68.2, roic: 52.1, netM: 53.4, cash: 38.5, debt: 12.8, vol: 42, cagr5: 78.4,
    desc: 'Designs GPUs and AI computing platforms (CUDA + data-center systems) sold to cloud providers, enterprises and developers.',
    segments: [['Data Center', 78], ['Gaming', 11], ['Professional Visualization', 3], ['Automotive & Other', 8]],
    geo: [['United States', 42], ['Taiwan', 24], ['China/HK', 18], ['Other', 16]],
    bizModel: 'Fabless chip design + full-stack software (CUDA, networking, DGX Cloud). High switching costs via developer ecosystem.',
    customers: 'Microsoft Azure, AWS, Google Cloud, Meta, CoreWeave, OEMs',
    rev5y: [27.0, 44.9, 60.9, 96.3, 130.5], eps5y: [1.1, 1.7, 2.9, 5.2, 8.9], fcf5y: [8.2, 12.5, 18.4, 32.1, 58.4],
    moat: [['Technology / CUDA Ecosystem', 'แข็งแกร่งมาก', 'Millions of developers; libraries (cuDNN, TensorRT) optimized for NVIDIA hardware.'], ['Scale', 'แข็งแกร่งมาก', 'Dominant AI-GPU share; volume drives R&D and supply leverage with TSMC.'], ['Switching Cost', 'แข็งแกร่ง', 'Rewriting CUDA pipelines to alternatives is costly and slow.'], ['IP', 'แข็งแกร่ง', 'Large GPU/interconnect patent portfolio; NVLink, Mellanox networking.'], ['Brand', 'ปานกลาง-แข็งแกร่ง', 'Default choice for AI infrastructure buyers.']],
    risks: [['Customer concentration', 'สูง', 'ผลกระทบสูง', 'Hyperscalers ~large share of data-center revenue.'], ['Export control', 'กลาง', 'ผลกระทบสูง', 'US restrictions on advanced chips to China.'], ['AI CapEx slowdown', 'กลาง', 'ผลกระทบสูง', 'Cloud capex digestion could delay orders.'], ['Competition (AMD, custom ASIC)', 'กลาง', 'ผลกระทบกลาง', 'Alternative accelerators gaining niche share.'], ['Valuation risk', 'กลาง', 'ผลกระทบกลาง', 'High multiples compress on any growth miss.']],
    catalysts: ['Next-gen GPU ramp (Blackwell/vera)', 'Sovereign AI deals', 'Earnings beats on data-center demand', 'Networking revenue growth'],
    scen: { bull: { rev: '+45% CAGR 3Y', margin: 'OPM ~60%', note: 'AI capex stays strong; supply expands.' }, base: { rev: '+28% CAGR 3Y', margin: 'OPM ~55%', note: 'Moderate growth, stable margins.' }, bear: { rev: '+8% CAGR 3Y', margin: 'OPM ~45%', note: 'Demand digestion + pricing pressure.' } },
    status: { g: ['🔥 แข็งแกร่ง', 'b-green'], f: ['🟢 แข็งแรง', 'b-green'], v: ['🟡 ค่อนข้างแพง', 'b-yellow'], r: ['🟠 กลาง-สูง', 'b-orange'], q: ['🟢 สูง', 'b-green'] },
    src: 'NVIDIA Investor Relations (ตัวเลข demo)' },
  AVGO: { name: 'Broadcom Inc.', sector: 'Technology', industry: 'Semiconductors', price: 312.8, mcap: 1458, revGrowth: 21.4, epsGrowth: 18.2, grossM: 74.5, opM: 44.1, fcf: 21.5, fcfM: 42.0, pe: 34.8, fwdPE: 26.4, peg: 1.4, ps: 15.2, evEbitda: 22.1, pFCF: 42.0, fcfYield: 2.4, hi52: 342.0, lo52: 198.4, divY: 1.4, roe: 38.5, roic: 18.2, netM: 32.1, cash: 14.2, debt: 68.5, vol: 28, cagr5: 34.2,
    desc: 'Semiconductor + infrastructure software (post-VMware). Custom AI accelerators (XPU), networking, and recurring software.',
    segments: [['Semiconductor Solutions', 58], ['Infrastructure Software', 42]],
    geo: [['Americas', 38], ['Asia-Pacific', 52], ['EMEA', 10]],
    bizModel: 'Fabless chips + enterprise software subscriptions; disciplined M&A and cost synergy playbook.',
    customers: 'Hyperscalers, telcos, large enterprises (via VMware)',
    rev5y: [27.5, 33.2, 35.8, 42.2, 51.6], eps5y: [3.1, 3.6, 4.0, 4.8, 5.7], fcf5y: [11.2, 13.5, 15.2, 17.8, 21.5],
    moat: [['Scale / Custom silicon', 'แข็งแกร่ง', 'Co-designed XPUs with hyperscalers; Jericho networking.'], ['Switching Cost', 'แข็งแกร่งมาก', 'VMware virtualization deeply embedded in enterprises.'], ['Cost Advantage', 'แข็งแกร่ง', 'Broadcom operating model: high margins post-acquisition.'], ['Distribution', 'แข็งแกร่ง', 'Direct enterprise + OEM channels.']],
    risks: [['Debt from VMware deal', 'กลาง', 'ผลกระทบกลาง', 'Leverage must amortize via FCF.'], ['Semiconductor cyclicality', 'กลาง', 'ผลกระทบกลาง', 'Non-AI segments cyclical.'], ['Integration execution', 'กลาง', 'ผลกระทบกลาง', 'Large software integration complexity.']],
    catalysts: ['Custom AI XPU ramps', 'VMware subscription conversion', 'ปันผล growth + buybacks'],
    scen: { bull: { rev: '+18% CAGR 3Y', margin: 'OPM ~46%', note: 'XPU + software cross-sell.' }, base: { rev: '+12% CAGR 3Y', margin: 'OPM ~43%', note: 'Steady mix.' }, bear: { rev: '+4% CAGR 3Y', margin: 'OPM ~38%', note: 'Cyclical drag.' } },
    status: { g: ['🔥 แข็งแกร่ง', 'b-green'], f: ['🟢 แข็งแรง', 'b-green'], v: ['🟡 ค่อนข้างแพง', 'b-yellow'], r: ['🟡 กลาง', 'b-yellow'], q: ['🟢 สูง', 'b-green'] },
    src: 'Broadcom Investor Relations (ตัวเลข demo)' },
  MU: { name: 'Micron Technology, Inc.', sector: 'Technology', industry: 'Memory (DRAM/NAND)', price: 148.6, mcap: 164.2, revGrowth: 38.5, epsGrowth: 112.0, grossM: 38.2, opM: 28.4, fcf: 3.8, fcfM: 10.2, pe: 18.4, fwdPE: 11.2, peg: 0.6, ps: 4.4, evEbitda: 9.8, pFCF: 43.2, fcfYield: 2.3, hi52: 168.9, lo52: 84.5, divY: 0.3, roe: 12.4, roic: 9.8, netM: 18.2, cash: 12.4, debt: 14.8, vol: 38, cagr5: 12.8,
    desc: 'Makes DRAM and NAND memory; key beneficiary of HBM demand for AI servers.',
    segments: [['DRAM', 68], ['NAND', 30], ['Other', 2]],
    geo: [['US', 18], ['Asia', 62], ['Other', 20]],
    bizModel: 'Capital-intensive memory fabs; pricing driven by supply/demand cycles; HBM adds premium mix.',
    customers: 'Server OEMs, hyperscalers, PC/mobile makers, auto/industrial',
    rev5y: [27.7, 30.8, 15.5, 25.6, 37.4], eps5y: [5.6, 4.9, -2.1, 1.8, 6.2], fcf5y: [2.1, 1.2, -3.4, 0.8, 3.8],
    moat: [['Scale / Process', 'แข็งแกร่ง', 'Top-3 memory maker; 1γ DRAM and 232L NAND ramps.'], ['Cost Advantage', 'ปานกลาง', 'Capex scale but cyclical pricing limits pricing power.'], ['Switching Cost', 'ต่ำ-ปานกลาง', 'Qualified HBM creates stickiness with GPU platforms.']],
    risks: [['Cyclicality', 'สูง', 'ผลกระทบสูง', 'Memory prices swing sharply.'], ['Capex intensity', 'สูง', 'ผลกระทบกลาง', 'Fabs require sustained capex.'], ['China exposure', 'กลาง', 'ผลกระทบกลาง', 'Trade and demand sensitivity.']],
    catalysts: ['HBM3E/HBM4 qualification', 'DRAM price recovery', 'Capacity discipline industry-wide'],
    scen: { bull: { rev: '+30% CAGR 3Y', margin: 'OPM ~38%', note: 'HBM supercycle.' }, base: { rev: '+15% CAGR 3Y', margin: 'OPM ~26%', note: 'Normal cycle.' }, bear: { rev: '-5% CAGR 3Y', margin: 'OPM ~12%', note: 'Oversupply.' } },
    status: { g: ['🔥 แข็งแกร่ง', 'b-green'], f: ['🟡 วัฏจักร', 'b-yellow'], v: ['🟢 เหมาะสม', 'b-green'], r: ['🟠 กลาง-สูง', 'b-orange'], q: ['🟢 สูง', 'b-green'] },
    src: 'Micron Investor Relations (ตัวเลข demo)' },
  ASML: { name: 'ASML Holding N.V.', sector: 'Technology', industry: 'Semiconductor Equipment', price: 985.4, mcap: 388.5, revGrowth: 14.2, epsGrowth: 12.8, grossM: 52.4, opM: 34.2, fcf: 8.4, fcfM: 28.5, pe: 38.2, fwdPE: 32.5, peg: 1.8, ps: 13.2, evEbitda: 28.4, pFCF: 46.2, fcfYield: 2.2, hi52: 1108.0, lo52: 645.2, divY: 0.7, roe: 62.4, roic: 38.5, netM: 28.4, cash: 7.2, debt: 4.5, vol: 30, cagr5: 22.4,
    desc: 'Sole supplier of EUV lithography machines that print the world\'s most advanced chips.',
    segments: [['Lithography Systems', 82], ['Services / Field Options', 18]],
    geo: [['Taiwan', 38], ['South Korea', 24], ['China', 18], ['US/EU', 20]],
    bizModel: 'High-R&D monopoly equipment + long-life service contracts; deep co-development with TSMC/Intel/Samsung.',
    customers: 'TSMC, Samsung, Intel, Micron, SK Hynix',
    rev5y: [18.6, 21.2, 27.5, 30.2, 34.2], eps5y: [14.2, 16.8, 19.2, 20.5, 23.4], fcf5y: [5.2, 8.5, 4.2, 3.5, 8.4],
    moat: [['Technology monopoly', 'แข็งแกร่งมาก', 'Only EUV supplier; decades of optics/mechatronics lead.'], ['Switching Cost', 'แข็งแกร่งมาก', 'Fabs standardize processes around ASML tools.'], ['IP', 'แข็งแกร่งมาก', 'Thousands of patents; Zeiss partnership.']],
    risks: [['Customer concentration', 'สูง', 'ผลกระทบสูง', 'Top-3 foundries dominate backlog.'], ['Export control', 'สูง', 'ผลกระทบสูง', 'China shipment restrictions.'], ['Cyclical orders', 'กลาง', 'ผลกระทบกลาง', 'Logic/memory capex cycles.']],
    catalysts: ['High-NA EUV adoption', '2nm fab ramps', 'China service demand (allowed tools)'],
    scen: { bull: { rev: '+20% CAGR 3Y', margin: 'OPM ~38%', note: 'High-NA supercycle.' }, base: { rev: '+12% CAGR 3Y', margin: 'OPM ~34%', note: 'Steady backlog.' }, bear: { rev: '+3% CAGR 3Y', margin: 'OPM ~28%', note: 'Order pushouts.' } },
    status: { g: ['📈 มั่นคง', 'b-blue'], f: ['🟢 แข็งแรง', 'b-green'], v: ['🟡 ค่อนข้างแพง', 'b-yellow'], r: ['🟠 กลาง-สูง', 'b-orange'], q: ['🟢 สูง', 'b-green'] },
    src: 'ASML Investor Relations (ตัวเลข demo)' },
  AMD: { name: 'Advanced Micro Devices, Inc.', sector: 'Technology', industry: 'Semiconductors', price: 168.2, mcap: 272.4, revGrowth: 18.4, epsGrowth: 24.2, grossM: 51.2, opM: 12.4, fcf: 3.2, fcfM: 12.4, pe: 48.5, fwdPE: 28.4, peg: 1.2, ps: 10.6, evEbitda: 32.4, pFCF: 85.1, fcfYield: 1.2, hi52: 227.3, lo52: 93.5, divY: 0.0, roe: 8.4, roic: 6.2, netM: 8.5, cash: 6.8, debt: 2.4, vol: 44, cagr5: 38.5,
    desc: 'CPUs (EPYC/Ryzen), GPUs (Instinct/Radeon) and adaptive chips (Xilinx) for data center, client and embedded.',
    segments: [['Data Center', 48], ['Client', 26], ['Gaming', 12], ['Embedded', 14]],
    geo: [['US', 34], ['Asia', 48], ['Other', 18]],
    bizModel: 'Fabless design leveraging TSMC; share-gain story in server CPUs + AI GPU ramp.',
    customers: 'Hyperscalers, OEMs (Dell, HPE, Lenovo), enterprises',
    rev5y: [16.4, 19.2, 23.6, 22.7, 25.8], eps5y: [1.8, 2.1, 0.8, 1.1, 1.9], fcf5y: [2.8, 3.2, 1.8, 1.1, 3.2],
    moat: [['Technology', 'แข็งแกร่ง', 'Zen CPU architecture competitive with Intel; chiplet leadership.'], ['Ecosystem', 'ปานกลาง', 'ROCm improving but behind CUDA.'], ['Scale', 'ปานกลาง-แข็งแกร่ง', 'Growing data-center share funds R&D.']],
    risks: [['AI GPU execution', 'กลาง', 'ผลกระทบสูง', 'MI-series adoption vs NVIDIA.'], ['PC cyclicality', 'กลาง', 'ผลกระทบกลาง', 'Client/gaming swings.'], ['Competition', 'สูง', 'ผลกระทบกลาง', 'Intel + NVIDIA + custom silicon.']],
    catalysts: ['MI400 AI GPU ramp', 'EPYC share gains', 'Xilinx embedded recovery'],
    scen: { bull: { rev: '+28% CAGR 3Y', margin: 'OPM ~22%', note: 'AI GPU share + EPYC.' }, base: { rev: '+16% CAGR 3Y', margin: 'OPM ~15%', note: 'Gradual mix.' }, bear: { rev: '+5% CAGR 3Y', margin: 'OPM ~9%', note: 'Share stalls.' } },
    status: { g: ['📈 มั่นคง', 'b-blue'], f: ['🟡 ดีขึ้น', 'b-yellow'], v: ['🔴 แพง', 'b-red'], r: ['🟡 กลาง', 'b-yellow'], q: ['🟢 สูง', 'b-green'] },
    src: 'AMD Investor Relations (ตัวเลข demo)' },
  GOOGL: { name: 'Alphabet Inc. (Class A)', sector: 'Technology', industry: 'Internet / Cloud', price: 242.5, mcap: 2960, revGrowth: 13.8, epsGrowth: 22.4, grossM: 57.2, opM: 30.8, fcf: 72.4, fcfM: 22.4, pe: 24.2, fwdPE: 21.5, peg: 1.2, ps: 7.2, evEbitda: 16.4, pFCF: 40.9, fcfYield: 2.4, hi52: 256.2, lo52: 164.8, divY: 0.4, roe: 28.4, roic: 22.1, netM: 26.4, cash: 110.2, debt: 12.4, vol: 24, cagr5: 18.2,
    desc: 'Google Search/YouTube ads + Google Cloud + subscriptions; funds AI (Gemini, TPU) from ads cash flow.',
    segments: [['Search & Ads', 56], ['YouTube', 12], ['Google Cloud', 13], ['Subscriptions/Devices', 12], ['Other Bets', 7]],
    geo: [['US', 48], ['EMEA', 30], ['APAC', 17], ['Other', 5]],
    bizModel: 'Ad auction + cloud consumption + subscriptions; massive FCF reinvested into AI infra.',
    customers: 'Advertisers, enterprises (GCP), billions of users',
    rev5y: [257.6, 282.8, 307.4, 318.2, 350.2], eps5y: [5.6, 5.9, 4.8, 6.2, 8.4], fcf5y: [60.2, 62.8, 55.4, 64.2, 72.4],
    moat: [['Network Effect', 'แข็งแกร่งมาก', 'Search/distribution defaults; YouTube creator flywheel.'], ['Scale', 'แข็งแกร่งมาก', 'Global infra + TPU + data advantages.'], ['Brand', 'แข็งแกร่งมาก', 'Google = search verb.'], ['Switching Cost', 'ปานกลาง', 'Workspace/GCP enterprise stickiness.']],
    risks: [['Regulation / antitrust', 'สูง', 'ผลกระทบสูง', 'DOJ remedies; default-payment scrutiny.'], ['AI search disruption', 'กลาง', 'ผลกระทบกลาง', 'Chat answers could pressure ad clicks.'], ['Cloud competition', 'กลาง', 'ผลกระทบกลาง', 'AWS/Azure rivalry.']],
    catalysts: ['Gemini monetization', 'Cloud margin expansion', 'YouTube + subscriptions growth'],
    scen: { bull: { rev: '+15% CAGR 3Y', margin: 'OPM ~33%', note: 'Cloud + AI ads lift.' }, base: { rev: '+11% CAGR 3Y', margin: 'OPM ~30%', note: 'Steady.' }, bear: { rev: '+5% CAGR 3Y', margin: 'OPM ~26%', note: 'Ad slowdown + fines.' } },
    status: { g: ['📈 มั่นคง', 'b-blue'], f: ['🟢 แข็งแรง', 'b-green'], v: ['🟢 เหมาะสม', 'b-green'], r: ['🟡 กลาง', 'b-yellow'], q: ['🟢 สูง', 'b-green'] },
    src: 'Alphabet Investor Relations (ตัวเลข demo)' },
  AMZN: { name: 'Amazon.com, Inc.', sector: 'Consumer Cyclical', industry: 'E-commerce / Cloud', price: 228.4, mcap: 2410, revGrowth: 11.2, epsGrowth: 28.4, grossM: 48.2, opM: 10.8, fcf: 48.2, fcfM: 7.8, pe: 42.4, fwdPE: 32.8, peg: 1.5, ps: 3.8, evEbitda: 24.2, pFCF: 50.0, fcfYield: 2.0, hi52: 242.8, lo52: 151.2, divY: 0.0, roe: 22.4, roic: 12.8, netM: 7.4, cash: 88.4, debt: 52.2, vol: 26, cagr5: 16.4,
    desc: 'AWS cloud + North America/International retail + advertising; flywheel of Prime, logistics and compute.',
    segments: [['AWS', 17], ['North America Retail', 60], ['International', 15], ['Advertising/Other', 8]],
    geo: [['North America', 72], ['International', 28]],
    bizModel: 'Retail scale + high-margin AWS/ads subsidize logistics and AI capex.',
    customers: 'Consumers (Prime), sellers, AWS enterprises/startups',
    rev5y: [469.8, 513.9, 574.8, 604.2, 638.2], eps5y: [2.1, -0.3, 2.8, 4.2, 5.8], fcf5y: [12.2, -4.2, 18.4, 32.2, 48.2],
    moat: [['Scale / Logistics', 'แข็งแกร่งมาก', 'Fulfillment network + Prime density.'], ['Network Effect', 'แข็งแกร่ง', 'Marketplace buyer/seller flywheel; AWS ecosystem.'], ['Cost Advantage', 'แข็งแกร่ง', 'AWS scale economics.']],
    risks: [['Consumer slowdown', 'กลาง', 'ผลกระทบกลาง', 'Retail margins sensitive.'], ['AWS competition', 'กลาง', 'ผลกระทบกลาง', 'Azure/GCP price pressure.'], ['Regulation', 'กลาง', 'ผลกระทบกลาง', 'Antitrust scrutiny.']],
    catalysts: ['AWS reacceleration', 'Ad margin expansion', 'Robotics/logistics efficiency'],
    scen: { bull: { rev: '+14% CAGR 3Y', margin: 'OPM ~14%', note: 'AWS + ads mix.' }, base: { rev: '+10% CAGR 3Y', margin: 'OPM ~11%', note: 'Steady.' }, bear: { rev: '+5% CAGR 3Y', margin: 'OPM ~8%', note: 'Consumer drag.' } },
    status: { g: ['📈 มั่นคง', 'b-blue'], f: ['🟢 แข็งแรง', 'b-green'], v: ['🟡 ค่อนข้างแพง', 'b-yellow'], r: ['🟢 ต่ำ-กลาง', 'b-green'], q: ['🟢 สูง', 'b-green'] },
    src: 'Amazon Investor Relations (ตัวเลข demo)' },
};
const TICKERS = Object.keys(SEED);

/* ---------------- LIVE DATA: Stooq (delayed quotes) + SEC EDGAR (real
   fundamentals). No API key needed. Both are CORS-open for browsers.
   Rule: live figures show Source + Period + Filed date; on failure the UI
   falls back to DEMO-labeled seed and says so (never silent). ----------- */
const LiveCache = {
  get(k, maxAge) { try { const c = JSON.parse(localStorage.getItem('asrt_cache_' + k)); if (c && Date.now() - c.ts < maxAge) return c.v; } catch (_) {} return null; },
  set(k, v) { try { localStorage.setItem('asrt_cache_' + k, JSON.stringify({ ts: Date.now(), v })); } catch (_) {} },
};
async function fetchJSON(url, ms) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms || 12000);
  try { const r = await fetch(url, { signal: c.signal }); if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url); return await r.json(); }
  finally { clearTimeout(t); }
}
async function fetchText(url, ms) {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms || 12000);
  try { const r = await fetch(url, { signal: c.signal }); if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url); return await r.text(); }
  finally { clearTimeout(t); }
}
const STOOQ_SYM = { NVDA: 'nvda.us', AVGO: 'avgo.us', MU: 'mu.us', ASML: 'asml.us', AMD: 'amd.us', GOOGL: 'googl.us', AMZN: 'amzn.us', COST: 'cost.us', VOO: 'voo.us', BTC: 'btcusd' };
const CIK_FALLBACK = { NVDA: 1045810, AVGO: 1730168, MU: 723125, ASML: 937966, AMD: 2488, GOOGL: 1652044, AMZN: 1018724 };
async function getCIK(t) {
  let map = LiveCache.get('cikmap', 30 * 864e5);
  if (!map) {
    try {
      const j = await fetchJSON('https://www.sec.gov/files/company_tickers.json', 12000);
      map = {}; Object.values(j).forEach((e) => { map[e.ticker] = e.cik_str; });
      LiveCache.set('cikmap', map);
    } catch (_) { map = null; }
  }
  return (map && map[t]) || CIK_FALLBACK[t] || null;
}
const padCIK = (c) => String(c).padStart(10, '0');
async function getFacts(t) {
  const cached = LiveCache.get('facts_' + t, 7 * 864e5);
  if (cached) return cached;
  const cik = await getCIK(t);
  if (!cik) throw new Error('No CIK for ' + t);
  let lastErr = new Error('SEC unreachable');
  for (let a = 0; a < 3; a++) {
    try {
      const f = await fetchJSON('https://data.sec.gov/api/xbrl/companyfacts/CIK' + padCIK(cik) + '.json', 25000);
      if (!f || !f.facts || !Object.keys(f.facts).length) throw new Error('Empty facts payload (throttled?)');
      LiveCache.set('facts_' + t, f);
      return f;
    } catch (e) { lastErr = e; await new Promise((r) => setTimeout(r, 1200 * (a + 1))); }
  }
  throw lastErr;
}
function conceptObs(facts, names, unit) {
  const spaces = [facts && facts.facts && facts.facts['us-gaap'], facts && facts.facts && facts.facts['ifrs-full'], facts && facts.facts && facts.facts['dei']];
  for (const n of names) {
    for (const sp of spaces) {
      const c = sp && sp[n];
      if (c && c.units) {
        if (unit && c.units[unit]) return c.units[unit];
        const k = Object.keys(c.units)[0];
        if (k) return c.units[k];
      }
    }
  }
  return null;
}
function annualFY(obs) {
  if (!obs) return [];
  const seen = {};
  obs.forEach((o) => {
    if (/^FY\d{4}$/.test(o.frame || '') && o.val != null) {
      if (!seen[o.frame] || new Date(o.filed) > new Date(seen[o.frame].filed)) seen[o.frame] = o;
    }
  });
  return Object.values(seen).sort((a, b) => String(a.frame).localeCompare(String(b.frame)));
}
function ttmFromQ(obs) {
  if (!obs) return null;
  const q = obs.filter((o) => o.start && /Q[1-4]/.test(o.fp || '') && o.val != null)
    .sort((a, b) => new Date(a.end) - new Date(b.end)).slice(-4);
  if (q.length < 4) return null;
  return { val: q.reduce((a, o) => a + o.val, 0), end: q[3].end, filed: q[3].filed, frames: q.map((o) => o.frame || o.fp) };
}
function latestInst(obs) {
  if (!obs) return null;
  const inst = obs.filter((o) => !o.start && o.val != null).sort((a, b) => new Date(a.end) - new Date(b.end));
  return inst.length ? inst[inst.length - 1] : null;
}
/* Full quarterly series (for trend tables), oldest → newest. */
function qtrSeries(obs) {
  if (!obs) return [];
  return obs.filter((o) => o.start && /Q[1-4]/.test(o.fp || '') && o.val != null)
    .sort((a, b) => new Date(a.end) - new Date(b.end));
}
/* Instant observations sampled yearly (share-count / buyback trend). */
function yearlyInst(obs, maxN) {
  if (!obs) return [];
  const byYear = {};
  obs.filter((o) => !o.start && o.val != null && o.end).forEach((o) => {
    const y = String(o.end).slice(0, 4);
    if (!byYear[y] || new Date(o.end) > new Date(byYear[y].end)) byYear[y] = o;
  });
  return Object.keys(byYear).sort().slice(-(maxN || 8)).map((y) => ({ year: y, val: byYear[y].val, end: byYear[y].end }));
}
/* SEC submissions feed: recent 10-K / 10-Q / 8-K / insider Form 4. */
async function getSubmissions(t) {
  const cached = LiveCache.get('subs_' + t, 24 * 36e5);
  if (cached) return cached;
  const cik = await getCIK(t);
  if (!cik) throw new Error('No CIK for ' + t);
  const s = await fetchJSON('https://data.sec.gov/submissions/CIK' + padCIK(cik) + '.json', 15000);
  LiveCache.set('subs_' + t, s);
  return s;
}
const filingDocURL = (cik, acc, doc) => 'https://www.sec.gov/Archives/edgar/data/' + cik + '/' + String(acc).replace(/-/g, '') + '/' + doc;
const REV_NAMES = ['RevenueFromContractWithCustomerExcludingAssessedTax', 'Revenues', 'SalesRevenueNet', 'TotalRevenuesAndOtherIncome'];
async function getFundamentals(t) {
  const cached = LiveCache.get('fun_' + t, 24 * 36e5);
  if (cached) return cached;
  const facts = await getFacts(t);
  const cik = await getCIK(t);
  const revObs = conceptObs(facts, REV_NAMES, 'USD');
  const niObs = conceptObs(facts, ['NetIncomeLoss'], 'USD');
  const epsObs = conceptObs(facts, ['EarningsPerShareDiluted'], 'USD/shares');
  const gpObs = conceptObs(facts, ['GrossProfit'], 'USD');
  const opObs = conceptObs(facts, ['OperatingIncomeLoss'], 'USD');
  const ocfObs = conceptObs(facts, ['NetCashProvidedByUsedInOperatingActivities'], 'USD');
  const capeObs = conceptObs(facts, ['PaymentsToAcquirePropertyPlantAndEquipment'], 'USD');
  const revA = annualFY(revObs);
  const cogsA = annualFY(conceptObs(facts, ['CostOfGoodsAndServicesSold', 'CostOfRevenue', 'CostOfGoodsSold'], 'USD'));
  let gpA = annualFY(gpObs);
  if (!gpA.length && revA.length && cogsA.length) {
    // Filers like GOOGL that don't tag GrossProfit: revenue − cost of revenue.
    gpA = revA.map((o) => { const c = cogsA.find((x) => x.frame === o.frame); return c ? Object.assign({}, o, { val: o.val - c.val }) : null; }).filter(Boolean);
  }
  const out = {
    cik,
    revA,
    revQ: qtrSeries(revObs),
    revTTM: ttmFromQ(revObs),
    niA: annualFY(niObs),
    niQ: qtrSeries(niObs),
    niTTM: ttmFromQ(niObs),
    epsA: annualFY(epsObs),
    epsQ: qtrSeries(epsObs),
    epsTTM: ttmFromQ(epsObs),
    gpA,
    gpQ: qtrSeries(gpObs),
    opA: annualFY(opObs),
    opQ: qtrSeries(opObs),
    ocfA: annualFY(ocfObs),
    ocfQ: qtrSeries(ocfObs),
    capeA: annualFY(capeObs),
    assets: latestInst(conceptObs(facts, ['Assets'], 'USD')),
    liab: latestInst(conceptObs(facts, ['Liabilities'], 'USD')),
    cash: latestInst(conceptObs(facts, ['CashAndCashEquivalentsAtCarryingValue'], 'USD')),
    debtLT: latestInst(conceptObs(facts, ['LongTermDebtNoncurrent', 'LongTermDebt'], 'USD')),
    debtST: latestInst(conceptObs(facts, ['DebtCurrent'], 'USD')),
    curA: latestInst(conceptObs(facts, ['AssetsCurrent'], 'USD')),
    curL: latestInst(conceptObs(facts, ['LiabilitiesCurrent'], 'USD')),
    equity: latestInst(conceptObs(facts, ['StockholdersEquity'], 'USD')),
    dpsA: annualFY(conceptObs(facts, ['CommonStockปันผลsPerShareDeclared', 'ปันผลsPerShareDeclared'], 'USD/shares')),
    shares: latestInst(conceptObs(facts, ['EntityCommonStockSharesOutstanding', 'CommonStockSharesOutstanding'], 'shares')),
    sharesTrend: yearlyInst(conceptObs(facts, ['EntityCommonStockSharesOutstanding', 'CommonStockSharesOutstanding'], 'shares'), 8),
  };
  LiveCache.set('fun_' + t, out);
  return out;
}
async function getQuotesLive(tickers, force) {
  const key = 'quotes_' + tickers.slice().sort().join(',');
  if (!force) {
    const cached = LiveCache.get(key, 15 * 60e3);
    if (cached) return cached;
  }
  const syms = tickers.map((t) => STOOQ_SYM[t]).filter(Boolean).join(',');
  if (!syms) throw new Error('No Stooq symbols');
  const txt = await fetchText('https://stooq.com/q/l/?s=' + syms + '&f=sd2t2ohlcv&h&e=csv', 12000);
  const out = {};
  txt.trim().split('\n').slice(1).forEach((ln) => {
    const p = ln.split(',');
    const sym = (p[0] || '').toLowerCase().replace('.us', '').toUpperCase();
    if (p.length >= 8 && p[6] !== 'N/D' && !isNaN(+p[6])) {
      out[sym] = { date: p[1], time: p[2], open: +p[3], high: +p[4], low: +p[5], close: +p[6], vol: +p[7] };
    }
  });
  if (!Object.keys(out).length) throw new Error('Empty quote response');
  LiveCache.set(key, out);
  return out;
}
async function getHistoryLive(t, interval) {
  const iv = interval || 'd';
  const cached = LiveCache.get('hist_' + t + '_' + iv, 36e5);
  if (cached) return cached;
  const txt = await fetchText('https://stooq.com/q/d/l/?s=' + STOOQ_SYM[t] + '&i=' + iv, 15000);
  const rows = txt.trim().split('\n').slice(1)
    .map((ln) => { const p = ln.split(','); return { d: p[0], o: +p[1], h: +p[2], l: +p[3], c: +p[4], v: +p[5] }; })
    .filter((r) => r.c > 0 && /^\d{4}-/.test(r.d || ''));
  if (rows.length < 10) throw new Error('History too short for ' + t);
  LiveCache.set('hist_' + t + '_' + iv, rows);
  return rows;
}

/* ---------------- MARKET OVERVIEW (indices / VIX / BTC / USDTHB) --------
   Stooq symbols are public + delayed. On failure: UI shows
   "Unable to retrieve current market data." — never fake numbers. ------- */
const MARKET_SYMS = [
  { id: 'SPX', label: 'S&P 500', sym: '^spx' },
  { id: 'NDQ', label: 'NASDAQ 100', sym: '^ndq' },
  { id: 'DJI', label: 'Dow Jones', sym: '^dji' },
  { id: 'VIX', label: 'VIX', sym: '^vix' },
  { id: 'BTC', label: 'Bitcoin', sym: 'btcusd' },
  { id: 'FX', label: 'USD/THB', sym: 'usdthb' },
];
async function getMarketOverview() {
  const cached = LiveCache.get('market_overview', 15 * 60e3);
  if (cached && cached.rows && cached.rows.length) return cached;
  /* 1) Stooq first (has session open + timestamp). Encode each symbol,
     keep literal commas — encoding commas breaks Stooq parsing. */
  try {
    const syms = MARKET_SYMS.map((m) => encodeURIComponent(m.sym)).join(',');
    const txt = await fetchText('https://stooq.com/q/l/?s=' + syms + '&f=sd2t2ohlcv&h&e=csv', 12000);
    const rows = [];
    txt.trim().split('\n').slice(1).forEach((ln) => {
      const p = ln.split(',');
      const sym = (p[0] || '').toLowerCase();
      if (p.length >= 8 && p[6] !== 'N/D' && !isNaN(+p[6])) {
        const m = MARKET_SYMS.find((x) => x.sym === sym);
        if (m) rows.push({ id: m.id, label: m.label, price: +p[6], chg: (p[3] && !isNaN(+p[3]) && +p[3] !== 0) ? (((+p[6] - +p[3]) / +p[3]) * 100) : null, stamp: (p[1] || '') + ' ' + (p[2] || ''), src: 'Stooq' });
      }
    });
    if (rows.length >= 4) {
      const out = { rows: MARKET_SYMS.map((m) => rows.find((r) => r.id === m.id)).filter(Boolean), mode: 'stooq' };
      LiveCache.set('market_overview', out);
      return out;
    }
    throw new Error('incomplete Stooq response');
  } catch (e1) {
    /* 2) Fallback: TradingView scanner (same engine as stock cards,
       which already works) — indices/crypto/fx symbols. */
    const TV_MKT = [
      { id: 'SPX', label: 'S&P 500', tv: 'SP:SPX' },
      { id: 'NDQ', label: 'NASDAQ 100', tv: 'NASDAQ:NDX' },
      { id: 'DJI', label: 'Dow Jones', tv: 'DJ:DJI' },
      { id: 'VIX', label: 'VIX', tv: 'TVC:VIX' },
      { id: 'BTC', label: 'Bitcoin', tv: 'BITSTAMP:BTCUSD' },
      { id: 'FX', label: 'USD/THB', tv: 'FX_IDC:USDTHB' },
    ];
    const rows = [];
    await Promise.all(TV_MKT.map(async (m) => {
      try {
        const j = await fetchJSON('https://scanner.tradingview.com/symbol?symbol=' + encodeURIComponent(m.tv) + '&fields=close,change', 10000);
        if (j && j.close != null) rows.push({ id: m.id, label: m.label, price: j.close, chg: j.change, stamp: new Date().toLocaleString('th-TH'), src: 'TradingView' });
      } catch (_) {}
    }));
    if (!rows.length) throw new Error('Failed to fetch');
    const out = { rows: TV_MKT.map((m) => rows.find((r) => r.id === m.id)).filter(Boolean), mode: 'tv' };
    LiveCache.set('market_overview', out);
    return out;
  }
}
function marketOverviewHTML() {
  return '<div class="card sec" id="mktCard"><div class="sec-head"><h3>ภาพรวมตลาด</h3><span class="muted small" id="mktTs">กำลังโหลด…</span></div>'
    + '<div class="kv" id="mktBody"><div class="muted">กำลังดึง S&P 500 · NASDAQ · Dow · VIX · BTC · USD/THB…</div></div></div>';
}
async function fillMarketOverview() {
  const body = $('#mktBody'), ts = $('#mktTs');
  if (!body) return;
  if (!DataService.liveOn()) { body.innerHTML = '<div class="muted small">ปิดโหมด live อยู่ (ตั้งค่า → Live เพื่อดูภาพรวมตลาด)</div>'; if (ts) ts.textContent = ''; return; }
  try {
    const mkt = await getMarketOverview();
    if (!$('#mktBody')) return;
    const rows = mkt.rows || [];
    if (!rows.length) throw new Error('Empty market response');
    body.innerHTML = rows.map((r) => {
      const dec = r.id === 'FX' ? 2 : (r.id === 'VIX' ? 2 : (r.price > 10000 ? 0 : 2));
      return '<div class="cell"><div class="k">' + esc(r.label) + '</div><div class="v" style="font-size:16px">' + Number(r.price).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + '</div>'
        + '<div class="small" style="color:' + ((r.chg || 0) >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (r.chg != null ? (r.chg >= 0 ? '▲ +' : '▼ ') + Math.abs(r.chg).toFixed(2) + '% วันนี้' : '') + '</div></div>';
    }).join('');
    const stamp = rows[0].stamp || '';
    const srcName = rows[0].src || 'Stooq';
    const partial = rows.length < MARKET_SYMS.length ? ' · ครบ ' + rows.length + '/' + MARKET_SYMS.length : '';
    if (ts) ts.innerHTML = '<span class="badge b-green fresh">● สด (ดีเลย์)</span> <span class="muted small">' + esc(srcName) + ' · Updated: ' + esc(stamp) + esc(partial) + '</span>';
  } catch (e) {
    if ($('#mktBody')) body.innerHTML = '<div style="color:var(--red);font-weight:700">Unable to retrieve current market data. (' + esc(e.message) + ')</div>';
    if (ts && $('#mktTs')) ts.innerHTML = '<span class="muted small">Data may be stale.</span>';
  }
}
/* ---------------- TRADINGVIEW snapshot (public scanner API, real data) -- */
const TV_COLS = ['close', 'change', 'open', 'high', 'low', 'volume', 'market_cap_basic', 'price_earnings_ttm', 'earnings_per_share_diluted_ttm', 'total_revenue_ttm', 'net_income_ttm', 'gross_margin_ttm', 'operating_margin_ttm', 'net_margin_ttm', 'dividends_yield_current', 'price_52_week_high', 'price_52_week_low', 'RSI', 'SMA20', 'SMA50', 'SMA200', 'MACD.macd', 'MACD.signal', 'Recommend.All', 'number_of_employees', 'description', 'logoid'];
const TV_EX = { NVDA: 'NASDAQ', AVGO: 'NASDAQ', MU: 'NASDAQ', ASML: 'NASDAQ', AMD: 'NASDAQ', GOOGL: 'NASDAQ', AMZN: 'NASDAQ', COST: 'NASDAQ' };
async function getTVSnapshot(t, force) {
  if (!force) {
    const cached = LiveCache.get('tv_' + t, 15 * 60e3);
    if (cached) return cached;
  }
  const j = await fetchJSON('https://scanner.tradingview.com/symbol?symbol=' + (TV_EX[t] || 'NASDAQ') + ':' + t + '&fields=' + TV_COLS.join(','), 12000);
  if (!j || j.close == null) throw new Error('Empty TradingView response');
  try {
    if (j.logoid) { const m = store.get('asrt_logos', {}); m[t] = j.logoid; store.set('asrt_logos', m); }
  } catch (_) {}
  LiveCache.set('tv_' + t, j);
  return j;
}
function tvRating(v) {
  if (v == null || isNaN(v)) return 'N/A';
  if (v <= -0.5) return 'ขายอย่างแรง';
  if (v <= -0.1) return 'ขาย';
  if (v < 0.1) return 'ถือ';
  if (v < 0.5) return 'ซื้อ';
  return 'ซื้ออย่างแรง';
}
const tvPageURL = (t) => 'https://th.tradingview.com/symbols/' + (TV_EX[t] || 'NASDAQ') + '-' + t + '/';

/* ---------------- TRADINGVIEW MARKET SCANNER (screener จริง) -----------
   จัดอันดับหุ้น US จากข้อมูลสด: sort/filter ผ่าน america/scan ได้เลย
   % ที่เห็นคืออดีต (YoY จริง) — ไม่ใช่การันตีอนาคต ---------------------- */
const RANK_COLS = ['description', 'logoid', 'close', 'change', 'volume', 'market_cap_basic', 'price_earnings_ttm', 'earnings_per_share_diluted_ttm', 'total_revenue_ttm', 'total_revenue_yoy_growth_ttm', 'earnings_per_share_diluted_yoy_growth_ttm', 'net_income_yoy_growth_ttm', 'gross_margin_ttm', 'operating_margin_ttm', 'net_margin_ttm', 'dividends_yield_current', 'RSI', 'SMA20', 'SMA50', 'SMA200', 'Recommend.All', 'price_52_week_high', 'price_52_week_low'];
const RANK_PRESETS = [
  { id: 'rev', name: '🚀 รายได้โตสูงสุด', sortBy: 'total_revenue_yoy_growth_ttm', sortOrder: 'desc', desc: 'เรียงรายได้ YoY (TTM เทียบปีก่อนหน้า)' },
  { id: 'eps', name: '💰 กำไรโตแรงสุด', sortBy: 'earnings_per_share_diluted_yoy_growth_ttm', sortOrder: 'desc', desc: 'เรียงกำไรต่อหุ้น YoY' },
  { id: 'margin', name: '🏰 มาร์จิ้นสูงสุด', sortBy: 'gross_margin_ttm', sortOrder: 'desc', desc: 'มาร์จิ้นขั้นต้นสูง = pricing power / คูเมือง' },
  { id: 'rec', name: '⭐ นักวิเคราะห์ชอบสุด', sortBy: 'Recommend.All', sortOrder: 'desc', desc: 'มติรวมนักวิเคราะห์ (TV composite)' },
  { id: 'value', name: '💎 P/E ต่ำกำไรบวก', sortBy: 'price_earnings_ttm', sortOrder: 'asc', desc: 'P/E ต่ำสุดในกลุ่มที่กำไรเป็นบวก', pePositive: true },
];
let rankPreset = 'rev', rankMcap = 10000000000, rankEx = ['NASDAQ', 'NYSE'];
/* สำรองเมื่อ POST โดนบล็อก: สแกนหุ้นใหญ่ ~50 ตัวด้วย GET ตรง (ไม่ preflight) */
const RANK_UNIVERSE = [
  ['NASDAQ', 'NVDA'], ['NASDAQ', 'AVGO'], ['NASDAQ', 'MU'], ['NASDAQ', 'ASML'], ['NASDAQ', 'AMD'], ['NASDAQ', 'GOOGL'], ['NASDAQ', 'AMZN'], ['NASDAQ', 'COST'], ['NASDAQ', 'AAPL'], ['NASDAQ', 'MSFT'], ['NASDAQ', 'META'], ['NASDAQ', 'TSLA'], ['NASDAQ', 'NFLX'], ['NASDAQ', 'ADBE'], ['NASDAQ', 'INTC'], ['NASDAQ', 'QCOM'], ['NASDAQ', 'AMAT'], ['NASDAQ', 'CSCO'], ['NASDAQ', 'ARM'], ['NASDAQ', 'PLTR'], ['NASDAQ', 'TXN'], ['NASDAQ', 'GILD'], ['NASDAQ', 'AMGN'], ['NASDAQ', 'PYPL'], ['NASDAQ', 'MELI'], ['NASDAQ', 'ABNB'], ['NASDAQ', 'CRWD'], ['NASDAQ', 'PANW'], ['NASDAQ', 'SNOW'], ['NASDAQ', 'DDOG'],
  ['NYSE', 'ORCL'], ['NYSE', 'CRM'], ['NYSE', 'JPM'], ['NYSE', 'V'], ['NYSE', 'MA'], ['NYSE', 'WMT'], ['NYSE', 'HD'], ['NYSE', 'PG'], ['NYSE', 'KO'], ['NYSE', 'PEP'], ['NYSE', 'DIS'], ['NYSE', 'NKE'], ['NYSE', 'MCD'], ['NYSE', 'JNJ'], ['NYSE', 'XOM'], ['NYSE', 'CVX'], ['NYSE', 'UNH'], ['NYSE', 'LLY'], ['NYSE', 'ABBV'], ['NYSE', 'MRK'], ['NYSE', 'TMO'], ['NYSE', 'CAT'], ['NYSE', 'GE'], ['NYSE', 'SHOP'], ['NYSE', 'UBER'], ['NYSE', 'LIN'],
];
async function tvScanUniverse(preset) {
  const out = [];
  const queue = RANK_UNIVERSE.filter(([ex]) => rankEx.includes(ex));
  const worker = async () => {
    while (queue.length) {
      const [ex, t] = queue.shift();
      try {
        const j = await fetchJSON('https://scanner.tradingview.com/symbol?symbol=' + ex + ':' + t + '&fields=' + RANK_COLS.join(','), 10000);
        if (j && j.close != null) {
          const o = { ex, t };
          RANK_COLS.forEach((col) => { o[col] = j[col]; });
          out.push(o);
        }
      } catch (_) {}
    }
  };
  await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
  let rows = out.filter((o) => (o.market_cap_basic || 0) >= rankMcap);
  if (preset.pePositive) rows = rows.filter((o) => o.price_earnings_ttm > 0);
  const k = preset.sortBy;
  rows.sort((a, b) => {
    const av = a[k], bv = b[k];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    return preset.sortOrder === 'asc' ? av - bv : bv - av;
  });
  return { rows: rows.slice(0, 20), total: rows.length, at: new Date().toLocaleString('th-TH'), mode: 'universe' };
}
async function tvScan() {
  const preset = RANK_PRESETS.find((x) => x.id === rankPreset) || RANK_PRESETS[0];
  const key = 'scan_' + preset.id + '_' + rankMcap + '_' + rankEx.slice().sort().join('');
  const cached = LiveCache.get(key, 30 * 60e3);
  if (cached) return cached;
  const filter = [{ left: 'market_cap_basic', operation: 'egreater', right: rankMcap }, { left: 'exchange', operation: 'in_range', right: rankEx }];
  if (preset.pePositive) filter.push({ left: 'price_earnings_ttm', operation: 'egreater', right: 0 });
  try {
    const c = new AbortController();
    const timer = setTimeout(() => c.abort(), 15000);
    let j = null;
    try {
      /* text/plain = simple request หลบ preflight ที่เบราว์เซอร์บล็อก */
      const r = await fetch('https://scanner.tradingview.com/america/scan', {
        method: 'POST', signal: c.signal, headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ symbols: { tickers: [], query: { types: [] } }, columns: RANK_COLS, filter, sort: { sortBy: preset.sortBy, sortOrder: preset.sortOrder }, range: [0, 20] }),
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      j = await r.json();
    } finally { clearTimeout(timer); }
    if (!j || !j.data) throw new Error('Empty scan response');
    const rows = j.data.map((it) => {
      const parts = String(it.s || '').split(':');
      const o = { ex: parts[0] || '', t: (parts[1] || '').toUpperCase() };
      RANK_COLS.forEach((col, i) => { o[col] = it.d ? it.d[i] : null; });
      return o;
    }).filter((o) => o.t && o.close != null);
    const out = { rows, total: j.totalCount || rows.length, at: new Date().toLocaleString('th-TH'), mode: 'scan' };
    LiveCache.set(key, out);
    return out;
  } catch (_) {
    const out = await tvScanUniverse(preset);
    out.mode = 'universe';
    LiveCache.set(key, out);
    return out;
  }
}
function rankWhy(r) {
  const out = [];
  if (r.total_revenue_yoy_growth_ttm != null && r.total_revenue_yoy_growth_ttm > 20) out.push('รายได้โต <b>+' + fmtN(r.total_revenue_yoy_growth_ttm, 0) + '% YoY</b>');
  if (r.earnings_per_share_diluted_yoy_growth_ttm != null && r.earnings_per_share_diluted_yoy_growth_ttm > 20) out.push('กำไร/หุ้นโต <b>+' + fmtN(r.earnings_per_share_diluted_yoy_growth_ttm, 0) + '%</b>');
  if (r.gross_margin_ttm != null && r.gross_margin_ttm > 60) out.push('มาร์จิ้นขั้นต้น <b>' + fmtN(r.gross_margin_ttm, 0) + '%</b> (pricing power สูง)');
  if (r['Recommend.All'] != null && r['Recommend.All'] >= 0.5) out.push('นักวิเคราะห์มติ <b>ซื้ออย่างแรง</b>');
  else if (r['Recommend.All'] != null && r['Recommend.All'] >= 0.1) out.push('นักวิเคราะห์มติ <b>ซื้อ</b>');
  if (r.RSI != null && r.RSI > 70) out.push('<span style="color:var(--yellow)">RSI ' + fmtN(r.RSI, 0) + ' — ร้อนแรง ระวังซื้อแพง</span>');
  else if (r.RSI != null && r.RSI >= 50) out.push('โมเมนตัมแข็งแกร่ง (RSI ' + fmtN(r.RSI, 0) + ')');
  if (r.price_earnings_ttm != null && r.price_earnings_ttm > 0 && r.price_earnings_ttm < 15) out.push('P/E แค่ <b>' + fmtN(r.price_earnings_ttm, 1) + '</b> (ไม่แพงเทียบกำไร)');
  if (!out.length) out.push('หุ้นใหญ่ สภาพคล่องสูง — เจาะงบก่อนตัดสินใจ');
  return out.slice(0, 4);
}

/* ---------------- DATA SERVICE (adapter) ------------------------------ */
const DataService = {
  provider: localStorage.getItem('asrt_provider') || 'live',
  baseURL: localStorage.getItem('asrt_base') || '',
  liveOn() { return this.provider === 'live'; },
  async getQuote(t) {
    if (this.liveOn() && STOOQ_SYM[t]) {
      try { const q = await getQuotesLive([t]); if (q[t]) return { price: q[t].close, prevOpen: q[t].open, asOf: q[t].date + ' ' + q[t].time, live: true }; } catch (_) {}
    }
    return { price: SEED[t].price, currency: 'USD', asOf: 'DEMO', live: false };
  },
  async getFinancials(t) { return SEED[t]; },
  async getHistoricalPrices(t, range) {
    if (this.liveOn() && STOOQ_SYM[t]) {
      try {
        const rows = await getHistoryLive(t, 'w');
        const n = range === '1Y' ? 52 : range === '3Y' ? 156 : 260;
        return rows.slice(-n).map((r) => r.c);
      } catch (_) {}
    }
    const s = SEED[t]; const n = range === '1Y' ? 52 : range === '3Y' ? 156 : 260;
    return mkHist(s.price * 0.45, s.cagr5 / 100, n, 0.035);
  },
  async getNews(t) { return NEWS.filter((x) => !t || x.tick.includes(t) || x.tick.includes('ALL')); },
};
const NEWS = [
  { tick: ['NVDA', 'ALL'], src: 'Reuters', date: 'Oct 2026', title: 'Hyperscaler capex plans in focus ahead of earnings season', body: 'Context: cloud capex guidance is the key demand signal for AI accelerators. Not a substitute for financials.' },
  { tick: ['MU', 'ALL'], src: 'Bloomberg', date: 'Sep 2026', title: 'Memory contract prices extend recovery on HBM tightness', body: 'Context: DRAM pricing trend matters more than a single spot-price headline.' },
  { tick: ['ASML', 'ALL'], src: 'Financial Times', date: 'Sep 2026', title: 'Lithography order intake watched as foundries commit to 2nm', body: 'Context: backlog and High-NA adoption are the leading indicators.' },
  { tick: ['GOOGL', 'AMZN'], src: 'CNBC', date: 'Sep 2026', title: 'Cloud growth and margin expansion remain the debate', body: 'Context: AWS vs GCP growth + AI workload monetization.' },
  { tick: ['AVGO', 'AMD'], src: 'WSJ', date: 'Aug 2026', title: 'Custom AI silicon programs expand at hyperscalers', body: 'Context: XPU/ASIC ramps complement, not replace, merchant GPUs.' },
];

/* ---------------- STORE (localStorage, Supabase-ready shape) ---------- */
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
};
let watchlist = store.get('asrt_watch', ['NVDA', 'AVGO', 'MU', 'ASML', 'AMD', 'GOOGL', 'AMZN']);
let journal = store.get('asrt_journal', []);
const getNotes = (t) => store.get('asrt_notes_' + t, { thesis: '', bull: '', bear: '', entry: '', risk: '', notes: '' });

/* ---------------- CHART PRIMITIVES (dependency-free canvas) ----------- */
function setupCanvas(cv, h) {
  const dpr = window.devicePixelRatio || 1, w = cv.clientWidth || cv.parentElement.clientWidth || 600;
  cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px';
  const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr); return [ctx, w, h];
}
function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
function lineChart(cv, series, opts) {
  opts = opts || {}; const h = opts.h || 180; const [ctx, w] = setupCanvas(cv, h);
  const all = series.flatMap((s) => s.data.filter((v) => v != null)); const min = Math.min(...all), max = Math.max(...all);
  const pad = (max - min) * 0.12 || 1, lo = min - pad, hi = max + pad;
  const X = (i) => 8 + (i / (series[0].data.length - 1)) * (w - 16);
  const Y = (v) => h - 14 - ((v - lo) / (hi - lo)) * (h - 30);
  ctx.strokeStyle = css('--line'); ctx.lineWidth = 1;
  for (let g = 0; g < 4; g++) { const y = 8 + (g / 3) * (h - 24); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  series.forEach((s) => {
    ctx.beginPath(); ctx.strokeStyle = s.color; ctx.lineWidth = s.dash ? 1.5 : 2;
    if (s.dash) ctx.setLineDash([5, 4]);
    s.data.forEach((v, i) => { if (v == null) return; const x = X(i), y = Y(v); i === 0 || s.data[i - 1] == null ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke(); ctx.setLineDash([]);
    if (s.fill) { ctx.lineTo(X(s.data.length - 1), h - 8); ctx.lineTo(X(0), h - 8); ctx.closePath(); ctx.globalAlpha = 0.12; ctx.fillStyle = s.color; ctx.fill(); ctx.globalAlpha = 1; }
  });
  if (opts.lastLabels) { ctx.fillStyle = css('--muted'); ctx.font = '10px Inter'; series.forEach((s, k) => { const v = s.data.filter((x) => x != null).pop(); ctx.fillStyle = s.color; ctx.fillText(s.label + ' ' + v, 10, 14 + k * 13); }); }
}
function bars(cv, labels, vals, color, h) {
  h = h || 190; const [ctx, w] = setupCanvas(cv, h);
  const rr = (x, y, bw2, bh) => { if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, bw2, Math.max(bh, 3), 4); ctx.fill(); } else ctx.fillRect(x, y, bw2, Math.max(bh, 3)); };
  const max = Math.max(...vals.map(Math.abs), 1); const bw = (w - 20) / vals.length;
  vals.forEach((v, i) => {
    const bh = Math.abs(v) / max * (h - 60); const x = 10 + i * bw + bw * 0.15, y0 = h - 30;
    const y = v >= 0 ? y0 - bh : y0;
    ctx.fillStyle = v >= 0 ? (color || '#22c55e') : '#ef4444';
    rr(x, y, bw * 0.7, bh);
    ctx.fillStyle = css('--muted'); ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText(String(labels[i]).slice(-2), x + bw * 0.35, h - 12); ctx.fillText((v >= 0 ? '+' : '') + v.toFixed(0) + '%', x + bw * 0.35, y - 5);
  });
  ctx.textAlign = 'left';
}
function donut(cv, parts, h) {
  h = h || 190; const [ctx, w] = setupCanvas(cv, h);
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 14, r = R * 0.58;
  const tot = parts.reduce((a, p) => a + p[1], 0); let a = -Math.PI / 2;
  const cols = ['#3b82f6', '#22d3ee', '#a78bfa', '#22c55e', '#eab308', '#f97316'];
  parts.forEach((p, i) => { const a2 = a + (p[1] / tot) * Math.PI * 2; ctx.beginPath(); ctx.arc(cx, cy, R, a, a2); ctx.arc(cx, cy, r, a2, a, true); ctx.closePath(); ctx.fillStyle = cols[i % cols.length]; ctx.fill(); a = a2; });
  ctx.fillStyle = css('--txt'); ctx.font = '800 13px Inter'; ctx.textAlign = 'center'; ctx.fillText(parts[0][0], cx, cy - 2);
  ctx.fillStyle = css('--muted'); ctx.font = '11px Inter'; ctx.fillText(parts[0][1] + '%', cx, cy + 14); ctx.textAlign = 'left';
}
function spark(cv, data, up) {
  const [ctx, w, h] = setupCanvas(cv, 56);
  const min = Math.min(...data), max = Math.max(...data);
  ctx.beginPath(); data.forEach((v, i) => { const x = (i / (data.length - 1)) * w, y = h - 6 - ((v - min) / (max - min || 1)) * (h - 12); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
  ctx.strokeStyle = up ? '#22c55e' : '#ef4444'; ctx.lineWidth = 1.8; ctx.stroke();
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.globalAlpha = 0.14; ctx.fillStyle = ctx.strokeStyle; ctx.fill();
}
function sma(arr, n) { return arr.map((_, i) => i < n - 1 ? null : +(arr.slice(i - n + 1, i + 1).reduce((a, b) => a + b, 0) / n).toFixed(2)); }
function rsi(arr, n) {
  n = n || 14; const out = new Array(arr.length).fill(null); let g = 0, l = 0;
  for (let i = 1; i < arr.length; i++) { const ch = arr[i] - arr[i - 1], up = Math.max(ch, 0), dn = Math.max(-ch, 0);
    if (i <= n) { g += up; l += dn; if (i === n) out[i] = l === 0 ? 100 : +(100 - 100 / (1 + g / l)).toFixed(1); }
    else { g = (g * (n - 1) + up) / n; l = (l * (n - 1) + dn) / n; out[i] = l === 0 ? 100 : +(100 - 100 / (1 + g / l)).toFixed(1); } }
  return out;
}

/* ---------------- SHARED SNIPPETS ----------------------------------- */
const freshness = (label) => '<span class="badge b-green fresh" title="ตัวชี้วัดความสดของข้อมูล">🟢 ข้อมูลสด</span> <span class="muted small">' + esc(label || '3 ต.ค. 2026') + '</span>';
const srcLine = (s) => '<div class="src-line"><span class="tag-fact">ข้อเท็จจริง</span>ที่มา: ' + esc(s.src) + ' · งวด: FY (จำลอง) · อัปเดต: 3 ต.ค. 2026 · <a href="#" onclick="return false" aria-label="ดูแหล่งข้อมูล (ตัวอย่าง)">ดูแหล่งข้อมูล</a> ' + DEMO + '</div>';
const statusBadges = (s) => '<div class="status-row"><span class="badge ' + s.status.g[1] + '">เติบโต ' + s.status.g[0] + '</span><span class="badge ' + s.status.f[1] + '">การเงิน ' + s.status.f[0] + '</span><span class="badge ' + s.status.v[1] + '">มูลค่า ' + s.status.v[0] + '</span><span class="badge ' + s.status.r[1] + '">ความเสี่ยง ' + s.status.r[0] + '</span></div>';
function sparkData(t, n) { return mkHist(SEED[t].price * (n === 1 ? 0.72 : n === 3 ? 0.4 : 0.22), SEED[t].cagr5 / 100 / 2, 40, 0.05); }
function inWatch(t) { return watchlist.includes(t); }
function toggleWatch(t) { watchlist = inWatch(t) ? watchlist.filter((x) => x !== t) : [...watchlist, t]; store.set('asrt_watch', watchlist); route(); }

/* ---------------- ROUTER -------------------------------------------- */
const view = () => $('#view');
function route() {
  stopPfAuto();
  const h = location.hash || '#/';
  $$('#mainNav a, .bottomnav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === h.split('/').slice(0, 2).join('/') || (h === '#/' && a.getAttribute('href') === '#/')));
  $('#menuBtn') && $('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0 });
  const parts = h.replace('#/', '').split('/');
  if (parts[0] === 'stock' && parts[1]) return renderStock(parts[1].toUpperCase());
  if (parts[0] === 'portfolio') return renderPortfolio();
  if (parts[0] === 'rankings') return renderRankings();  if (parts[0] === 'compare') return renderCompare();
  if (parts[0] === 'valuation') return renderValuation(parts[1]);
  if (parts[0] === 'industry') return renderIndustry();
  if (parts[0] === 'tools') return renderTools();
  if (parts[0] === 'backtest') return renderBacktest();
  if (parts[0] === 'journal') return renderJournal();
  if (parts[0] === 'news') return renderNews();
  if (parts[0] === 'settings') return renderSettings();
  return renderDashboard();
}
window.addEventListener('hashchange', route);

/* ---------------- DASHBOARD ----------------------------------------- */
function cardHTML(t) {
  const s = SEED[t]; const d = sparkData(t, 1); const up = d[d.length - 1] >= d[0];
  return '<a class="card stock-card" href="#/stock/' + t + '" aria-label="' + esc(s.name) + ' detail">'
    + '<div class="sc-head"><div style="display:flex;gap:11px;align-items:center">' + pfLogo(t) + '<div><div class="ticker">' + t + '</div><div class="cname">' + esc(s.name) + ' · ' + esc(s.sector) + ' / ' + esc(s.industry) + '</div></div></div>'
    + '<div style="text-align:right"><div class="price num" data-lp="' + t + '">' + fmt$(s.price) + '</div><div class="muted small" data-lp-src="' + t + '">มูลค่าตลาด ' + fmtB(s.mcap) + ' ' + DEMO + '</div></div></div>'
    + '<canvas class="chart spark" data-spark="' + t + '" aria-hidden="true"></canvas>'
    + '<div class="row small muted"><span>1Y</span><span>·</span><span>3Y</span><span>·</span><span>5Y</span><span style="margin-left:auto">52W ' + fmt$(s.lo52, 0) + '–' + fmt$(s.hi52, 0) + '</span></div>'
    + '<div class="metrics">'
    + '<div class="metric"><div class="k">รายได้โต</div><div class="v">' + fmtPct(s.revGrowth) + '</div><div class="d">5Y CAGR ' + fmtPct(s.cagr5) + '</div></div>'
    + '<div class="metric"><div class="k">กำไร/หุ้นโต</div><div class="v">' + fmtPct(s.epsGrowth) + '</div><div class="d">P/E ' + fmtN(s.pe) + '</div></div>'
    + '<div class="metric"><div class="k">FCF</div><div class="v">' + fmtB(s.fcf) + '</div><div class="d">ยีลด์ ' + fmtN(s.fcfYield) + '%</div></div>'
    + '<div class="metric"><div class="k">มาร์จิ้นขั้นต้น</div><div class="v">' + fmtN(s.grossM) + '%</div><div class="d">ดำเนินงาน ' + fmtN(s.opM) + '%</div></div>'
    + '<div class="metric"><div class="k">Fwd P/E · PEG</div><div class="v">' + fmtN(s.fwdPE) + ' · ' + fmtN(s.peg) + '</div><div class="d">ปันผล ' + fmtN(s.divY) + '%</div></div>'
    + '<div class="metric"><div class="k">ติดตาม</div><div class="v"><button class="btn ghost sm" data-watch="' + t + '" aria-label="สลับหุ้นติดตาม ' + t + '">' + (inWatch(t) ? '★' : '☆') + '</button></div><div class="d">ในเครื่อง</div></div>'
    + '</div>' + statusBadges(s) + '</a>';
}
function renderDashboard() {
  const rows = [...watchlist].filter((t) => SEED[t]);
  const avgRev = rows.reduce((a, t) => a + SEED[t].revGrowth, 0) / (rows.length || 1);
  view().innerHTML =
    '<div class="hero"><div><h1>AI Stock Research Terminal</h1><p>แดชบอร์ดผู้บริหารสำหรับนักลงทุนระยะยาว เปิดดูไม่กี่วินาทีก็รู้ว่า: ตัวไหนโต ตัวไหนผลิตเงินสด จ่ายแพงแค่ไหน อะไรจะทำให้สมมติฐานพัง ' + DEMO + ' — ราคาตลาดต้องต่อผู้ให้บริการข้อมูลสด</p></div>'
    + '<div class="toolbar"><label class="fl">เรียงหุ้นติดตาม<select id="sortSel" class="inline" aria-label="เรียงหุ้นติดตาม"><option value="ticker">ชื่อย่อ</option><option value="growth">การเติบโต</option><option value="valuation">มูลค่า (Fwd P/E)</option><option value="mcap">มูลค่าตลาด</option></select></label>'
    + '<button class="btn ghost sm" id="addBtn">+ เพิ่ม</button></div></div>'
    + marketOverviewHTML()
    + '<div class="grid g4" style="margin-bottom:14px;margin-top:14px">'
    + '<div class="card"><h3>หุ้นติดตาม</h3><div class="num" style="font-size:30px;font-weight:900">' + rows.length + ' <span class="muted small">ตัว</span></div><div class="muted small">รายได้โตเฉลี่ย ' + fmtPct(avgRev) + ' → มินิชาร์ต → กดดูรายละเอียด</div></div>'
    + '<div class="card"><h3>สัญญาณเติบโต</h3><div class="num" style="font-size:30px;font-weight:900">' + fmtPct(avgRev) + '</div><div class="muted small">ค่าเฉลี่ย YoY ทั้ง watchlist · <a href="#/compare">ดูรายได้</a></div></div>'
    + '<div class="card"><h3>เช็กเงินสดจริง</h3><div class="num" style="font-size:30px;font-weight:900">' + fmtB(rows.reduce((a, t) => a + SEED[t].fcf, 0)) + '</div><div class="muted small">FCF รวม (จำลอง) — ธุรกิจผลิตเงินสดจริงไหม?</div></div>'
    + '<div class="card"><h3>เทรนด์อุตสาหกรรม</h3><div style="font-weight:800">AI compute · HBM · EUV · Cloud</div><div class="muted small">อะไรต้องเป็นจริง การเติบโตถึงจะไปต่อ? <a href="#/industry">ดูอุตสาหกรรม →</a></div></div>'
    + '</div>'
    + '<div class="toolbar" style="margin-bottom:10px" id="quickChips">' + TICKERS.map((t) => '<button class="chip-sel" data-goto="#/stock/' + t + '">' + t + '</button>').join('') + '</div>'
    + '<div class="stock-grid">' + rows.map(cardHTML).join('') + '</div>'
    + '<div class="card sec"><div class="sec-head"><h3>ตารางหุ้นติดตาม</h3>' + freshness() + '</div><div class="table-wrap"><table aria-label="ตารางหุ้นติดตาม"><thead><tr><th>หุ้น</th><th>ราคา</th><th>รายได้โต</th><th>กำไรโต</th><th>มาร์จิ้นขั้นต้น</th><th>มาร์จิ้นดำเนินงาน</th><th>FCF</th><th>P/E</th><th>ความเสี่ยง</th><th></th></tr></thead><tbody>'
    + rows.map((t) => { const s = SEED[t]; return '<tr><td><b><a href="#/stock/' + t + '">' + t + '</a></b></td><td class="num">' + fmt$(s.price) + '</td><td class="num">' + fmtPct(s.revGrowth) + '</td><td class="num">' + fmtPct(s.epsGrowth) + '</td><td class="num">' + fmtN(s.grossM) + '%</td><td class="num">' + fmtN(s.opM) + '%</td><td class="num">' + fmtB(s.fcf) + '</td><td class="num">' + fmtN(s.pe) + '</td><td>' + s.status.r[0] + '</td><td><button class="btn ghost sm" data-watch="' + t + '">ลบออก</button></td></tr>'; }).join('')
    + '</tbody></table></div>' + srcLine({ src: 'ชุดข้อมูลตั้งต้น · โครง Tier 1/2 (ตัวเลข demo)' }) + '</div>'
    + '<div class="card sec"><h3>คำถามช่วยตัดสินใจ</h3><ul class="q-list"><li>อะไรต้องเป็นจริง บริษัทถึงจะเติบโตต่อ?</li><li>อะไรจะพิสูจน์ว่าสมมติฐานเราผิด?</li><li>ตลาดคาดหวังอะไรไว้ในราคานี้แล้ว?</li><li>ราคาปัจจุบันสะท้อนการเติบโตไปมากแค่ไหน?</li><li>บริษัทสร้างเงินสดได้จริงหรือไม่ — ดู มาร์จิ้น FCF และแนวโน้ม</li></ul></div>';
  paintSparks();
  fillLivePrices();
  fillMarketOverview();
  $('#sortSel').onchange = (e) => {
    const k = e.target.value;
    const sorted = [...watchlist].sort((a, b) => k === 'growth' ? SEED[b].revGrowth - SEED[a].revGrowth : k === 'valuation' ? SEED[a].fwdPE - SEED[b].fwdPE : k === 'mcap' ? SEED[b].mcap - SEED[a].mcap : a.localeCompare(b));
    watchlist = sorted; store.set('asrt_watch', watchlist); route();
  };
  $('#addBtn').onclick = () => {
    const missing = TICKERS.filter((t) => !watchlist.includes(t));
    if (!missing.length) return alert('หุ้นตั้งต้นอยู่ครบแล้ว สถาปัตยกรรมรองรับการเพิ่ม AAPL/MSFT/META/TSM/… ด้วยการ์ดแบบเดียวกันโดยไม่ต้องเขียน UI ใหม่');
    watchlist.push(missing[0]); store.set('asrt_watch', watchlist); route();
  };
  $$('#quickChips [data-goto]').forEach((b) => b.onclick = () => location.hash = b.dataset.goto);
  $$('[data-watch]').forEach((b) => b.onclick = (e) => { e.preventDefault(); e.stopPropagation(); toggleWatch(b.dataset.watch); });
}
function paintSparks() {
  $$('canvas[data-spark]').forEach((cv) => { const t = cv.dataset.spark; const d = sparkData(t, 1); spark(cv, d, d[d.length - 1] >= d[0]); });
}
/* Fill every [data-lp] price + [data-lp-src] caption with live Stooq
   quotes, and repaint sparklines from real weekly closes. Silent per-card
   fallback: keeps demo figure and says the feed is unavailable. */
async function fillLivePrices() {
  if (!DataService.liveOn()) return;
  const tickers = [...new Set($$('[data-lp]').map((el) => el.dataset.lp))];
  if (!tickers.length) return;
  let q = {};
  try { q = await getQuotesLive(tickers); } catch (_) {}
  let tvs = {};
  try {
    const arr = await Promise.all(tickers.map((x) => getTVSnapshot(x).catch(() => null)));
    tickers.forEach((x, i) => { if (arr[i]) tvs[x] = arr[i]; });
  } catch (_) {}
  const anyLive = Object.keys(q).length || Object.keys(tvs).length;
  if (!anyLive) {
    $$('[data-lp-src]').forEach((s) => { s.innerHTML = 'ดึงข้อมูลตลาดไม่ได้ชั่วคราว · โชว์ demo ' + DEMO; });
    const ms0 = $('#marketStatus');
    if (ms0) ms0.innerHTML = '<span class="pulse"></span> ข้อมูล DEMO';
    return;
  }
  try {
    tickers.forEach((t) => {
      const tv = tvs[t];
      const px = tv && tv.close != null ? tv.close : (q[t] ? q[t].close : null);
      const chg = tv && tv.change != null ? tv.change : (q[t] ? (((q[t].close - q[t].open) / q[t].open) * 100) : null);
      const srcName = tv ? 'TradingView' : 'Stooq';
      const srcDate = tv ? 'live' : (q[t] ? q[t].date : '');
      $$('[data-lp="' + t + '"]').forEach((el) => {
        if (px != null) el.innerHTML = fmt$(px) + (chg != null ? ' <span class="small" style="color:' + (chg >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (chg >= 0 ? '▲' : '▼') + Math.abs(chg).toFixed(2) + '%</span>' : '');
      });
      $$('[data-lp-src="' + t + '"]').forEach((src) => {
        src.innerHTML = px != null
          ? '<span class="badge b-green">● สด</span> <span class="muted small">' + srcName + ' ' + esc(srcDate) + '</span>'
          : 'ดึงข้อมูลตลาดไม่ได้ชั่วคราว · โชว์ demo ' + DEMO;
      });
    });
    const ms = $('#marketStatus');
    if (ms) ms.innerHTML = '<span class="pulse" style="background:var(--green)"></span> LIVE · ดีเลย์';
  } catch (_) {
    $$('[data-lp-src]').forEach((s) => { s.innerHTML = 'ดึงข้อมูลตลาดไม่ได้ชั่วคราว · โชว์ demo ' + DEMO; });
    const ms = $('#marketStatus');
    if (ms) ms.innerHTML = '<span class="pulse"></span> ข้อมูล DEMO';
  }
  $$('canvas[data-spark]').forEach(async (cv) => {
    try {
      const rows = await getHistoryLive(cv.dataset.spark, 'w');
      const data = rows.slice(-40).map((r) => r.c);
      if (data.length > 5) spark(cv, data, data[data.length - 1] >= data[0]);
    } catch (_) {}
  });
}

/* Fill the ★ LIVE SEC panel: real annual filing table, TTM figures, and
   live P/E + market cap computed from the live quote (formula shown). */
function secFilingURL(cik) { return 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=' + cik + '&type=10-K&count=10'; }
const secB = (v) => (v == null || isNaN(v) ? 'N/A' : '$' + (v / 1e9).toFixed(2) + 'B');
function secPanelHTML(t, f, q) {
  const last = (a) => (a && a.length ? a[a.length - 1] : null);
  const prevA = (a) => (a && a.length > 1 ? a[a.length - 2] : null);
  const revL = last(f.revA), revP = prevA(f.revA);
  const yoy = revL && revP ? (((revL.val - revP.val) / Math.abs(revP.val)) * 100) : null;
  const price = q ? q.close : null;
  const pe = price != null && f.epsTTM && f.epsTTM.val > 0 ? price / f.epsTTM.val : null;
  const mcap = price != null && f.shares ? price * f.shares.val : null;
  const eq = f.assets && f.liab ? f.assets.val - f.liab.val : null;
  const rows = f.revA.slice(-6).map((o) => {
    const gp = (f.gpA || []).find((x) => x.frame === o.frame);
    const op = (f.opA || []).find((x) => x.frame === o.frame);
    const ni = (f.niA || []).find((x) => x.frame === o.frame);
    const ep = (f.epsA || []).find((x) => x.frame === o.frame);
    return '<tr><td>' + esc(o.frame) + '</td><td class="num">' + secB(o.val) + '</td><td class="num">' + secB(gp && gp.val) + '</td><td class="num">' + secB(op && op.val) + '</td><td class="num">' + secB(ni && ni.val) + '</td><td class="num">' + (ep ? fmtN(ep.val, 2) : 'N/A') + '</td><td class="muted small">' + esc(o.form || '') + ' ' + esc((o.filed || '').slice(0, 10)) + '</td></tr>';
  }).join('');
  const qRows = (f.revQ || []).slice(-8).map((o) => {
    const ni = (f.niQ || []).find((x) => x.end === o.end);
    const ep = (f.epsQ || []).find((x) => x.end === o.end);
    return '<tr><td>' + esc(o.frame || ((o.fp || '') + ' ' + String(o.end).slice(0, 7))) + '</td><td class="num">' + secB(o.val) + '</td><td class="num">' + secB(ni && ni.val) + '</td><td class="num">' + (ep ? fmtN(ep.val, 2) : 'N/A') + '</td></tr>';
  }).join('');
  const debt = ((f.debtLT && f.debtLT.val) || 0) + ((f.debtST && f.debtST.val) || 0);
  const cashV = (f.cash && f.cash.val) || 0;
  const de = f.equity && f.equity.val ? debt / f.equity.val : null;
  const cr = f.curA && f.curL && f.curL.val ? f.curA.val / f.curL.val : null;
  const sh0 = f.sharesTrend.length ? f.sharesTrend[0] : null;
  const sh1 = f.sharesTrend.length ? f.sharesTrend[f.sharesTrend.length - 1] : null;
  const shChg = sh0 && sh1 && sh0.val ? (((sh1.val - sh0.val) / sh0.val) * 100) : null;
  const lastDPS = last(f.dpsA);
  const bbTxt = shChg == null ? 'ข้อมูลยังไม่พอ' : (shChg < 0 ? '↓ หุ้นหด — ซื้อหุ้นคืน (ดีต่อ EPS)' : '↑ หุ้นเพิ่ม — dilution / SBC (ระวัง)');
  return '<div class="kv">'
    + '<div class="cell"><div class="k">ราคาสด (Stooq ดีเลย์)</div><div class="v">' + (price != null ? fmt$(price) : 'N/A') + '</div><div class="muted small">' + (q ? esc(q.date) + ' ' + esc(q.time) : 'ไม่มีราคา') + '</div></div>'
    + '<div class="cell"><div class="k">รายได้ TTM (SEC)</div><div class="v">' + (f.revTTM ? secB(f.revTTM.val) : 'N/A') + '</div><div class="muted small">' + (f.revTTM ? 'สิ้นสุด ' + esc(f.revTTM.end) : 'ข้อมูลยังไม่พอ') + '</div></div>'
    + '<div class="cell"><div class="k">EPS ปรับลด TTM (SEC)</div><div class="v">' + (f.epsTTM ? fmtN(f.epsTTM.val, 2) : 'N/A') + '</div><div class="muted small">' + (f.epsTTM ? 'รวม 4 ไตรมาสล่าสุด' : 'ข้อมูลยังไม่พอ') + '</div></div>'
    + '<div class="cell"><div class="k">P/E ย้อนหลัง (คำนวณ)</div><div class="v">' + (pe != null ? fmtN(pe, 1) : 'N/A') + '</div><div class="muted small"><span class="tag-calc">การคำนวณ</span>ราคาสด ÷ EPS TTM</div></div>'
    + '<div class="cell"><div class="k">มูลค่าตลาด (คำนวณ)</div><div class="v">' + (mcap != null ? secB(mcap) : 'N/A') + '</div><div class="muted small">ราคา × ' + (f.shares ? (f.shares.val / 1e9).toFixed(2) + 'B หุ้น' : 'ไม่มีข้อมูลหุ้น') + '</div></div>'
    + '<div class="cell"><div class="k">รายได้ FY ล่าสุด YoY</div><div class="v">' + (yoy != null ? fmtPct(yoy) : 'N/A') + '</div><div class="muted small">' + (revL ? esc(revL.frame) + ' เทียบ FY ก่อน' : '') + '</div></div>'
    + '<div class="cell"><div class="k">FCF ปีงบล่าสุด (OCF − CapEx)</div><div class="v">' + secB((() => { const oc = last(f.ocfA), cx = last(f.capeA); return oc && cx && oc.frame === cx.frame ? oc.val - cx.val : null; })()) + '</div><div class="muted small"><span class="tag-calc">การคำนวณ</span>จากงบกระแสเงินสด</div></div>'
    + '<div class="cell"><div class="k">ปันผล/หุ้น (ประกาศจ่าย)</div><div class="v">' + (lastDPS ? '$' + fmtN(lastDPS.val, 2) : 'N/A') + '</div><div class="muted small">' + (lastDPS ? esc(lastDPS.frame) : 'ไม่มีจ่าย / N/A') + '</div></div>'
    + '</div>'
    + '<h4 class="muted small" style="margin:14px 0 6px">แนวโน้มรายไตรมาส — 8 ไตรมาสล่าสุด (10-Q/10-K จริง)</h4>'
    + '<div class="table-wrap"><table aria-label="งบไตรมาส SEC"><thead><tr><th>ไตรมาส</th><th>รายได้</th><th>กำไรสุทธิ</th><th>EPS ปรับลด</th></tr></thead><tbody>'
    + (qRows || '<tr><td colspan="4" class="muted">ข้อมูลยังไม่พอ</td></tr>')
    + '</tbody></table></div>'
    + '<div class="grid g2" style="margin-top:12px"><div><h4 class="muted small">แนวโน้มมาร์จิ้น % (งบปีจริง)</h4><canvas class="chart" id="secMarginC"></canvas></div>'
    + '<div><h4 class="muted small">มาร์จิ้น FCF % = (OCF − CapEx) ÷ รายได้</h4><canvas class="chart" id="secFcfC"></canvas></div></div>'
    + '<h4 class="muted small" style="margin:14px 0 6px">งบดุล + การจัดสรรทุน (งบล่าสุดที่ยื่น)</h4>'
    + '<div class="kv">'
    + '<div class="cell"><div class="k">เงินสด</div><div class="v">' + secB(cashV || null) + '</div></div>'
    + '<div class="cell"><div class="k">หนี้รวม</div><div class="v">' + secB(debt || null) + '</div></div>'
    + '<div class="cell"><div class="k">หนี้สุทธิ</div><div class="v">' + secB(debt - cashV) + '</div></div>'
    + '<div class="cell"><div class="k">หนี้ / ทุน</div><div class="v">' + (de != null ? fmtN(de, 2) + 'x' : 'N/A') + '</div></div>'
    + '<div class="cell"><div class="k">อัตราส่วนหมุนเวียน</div><div class="v">' + (cr != null ? fmtN(cr, 2) + 'x' : 'N/A') + '</div></div>'
    + '<div class="cell"><div class="k">จำนวนหุ้น: ' + (sh0 ? esc(sh0.year) : '?') + ' → ' + (sh1 ? esc(sh1.year) : '?') + '</div><div class="v" style="font-size:14px">' + (shChg != null ? fmtPct(shChg, 1) : 'N/A') + '</div><div class="muted small">' + bbTxt + '</div></div>'
    + '</div>'
    + '<div class="table-wrap"><table style="margin-top:12px" aria-label="งบปี SEC"><thead><tr><th>ปีงบ</th><th>รายได้</th><th>กำไรขั้นต้น</th><th>กำไรดำเนินงาน</th><th>กำไรสุทธิ</th><th>EPS ปรับลด</th><th>เอกสารยื่น</th></tr></thead><tbody>'
    + (rows || '<tr><td colspan="7" class="muted">ไม่มีข้อมูลงบปี</td></tr>')
    + '</tbody></table></div>'
    + '<div class="src-line"><span class="tag-fact">ข้อเท็จจริง</span>ที่มา: SEC EDGAR companyfacts, CIK' + padCIK(f.cik) + ' · งวด: FY + TTM 4 ไตรมาสล่าสุดตามที่ยื่น · <a href="' + secFilingURL(f.cik) + '" target="_blank" rel="noopener">ดูเอกสาร 10-K บน SEC</a> <span class="badge b-green">REAL DATA</span></div>';
}
function secDerived(f) {
  const yrs = (f.revA || []).slice(-6);
  const mLabels = yrs.map((o) => String(o.frame).replace('FY20', 'FY'));
  const pct = (a) => yrs.map((o) => { const x = (a || []).find((v) => v.frame === o.frame); return x && o.val ? +((x.val / o.val) * 100).toFixed(1) : null; });
  const fcfB = yrs.map((o) => {
    const oc = (f.ocfA || []).find((v) => v.frame === o.frame);
    const cx = (f.capeA || []).find((v) => v.frame === o.frame);
    return oc && cx ? +(((oc.val - cx.val) / 1e9)).toFixed(1) - 0 : null;
  });
  const fcfM = yrs.map((o, i) => (fcfB[i] != null && o.val ? +((fcfB[i] * 1e9 / o.val) * 100).toFixed(1) : null));
  const fi = yrs.map((_, i) => i).filter((i) => fcfB[i] != null);
  return {
    mLabels, gross: pct(f.gpA), op: pct(f.opA), net: pct(f.niA),
    fcfLabels: fi.map((i) => mLabels[i]), fcfM: fi.map((i) => fcfM[i]), fcfB: fi.map((i) => fcfB[i]),
  };
}
function maxDD(closes) {
  let peak = -Infinity, mdd = 0;
  closes.forEach((c) => { peak = Math.max(peak, c); mdd = Math.min(mdd, (c - peak) / peak); });
  return mdd * 100;
}
async function fillFilings(t) {
  const el = $('#filBody');
  if (!el) return;
  if (!DataService.liveOn()) { el.innerHTML = '<p class="muted">ปิดโหมด live อยู่</p>'; return; }
  try {
    const s = await getSubmissions(t);
    const cikNum = s.cik || await getCIK(t);
    const R = s.filings && s.filings.recent;
    if (!R || !R.form) throw new Error('ไม่มีข้อมูลเอกสาร');
    const items = R.form.map((fm, i) => ({ fm, fd: R.filingDate[i], rd: R.reportDate && R.reportDate[i], acc: R.accessionNumber[i], doc: R.primaryDocument[i] }));
    const keys = items.filter((x) => x.fm === '10-K' || x.fm === '10-Q').slice(0, 4);
    const eights = items.filter((x) => x.fm === '8-K').slice(0, 5);
    const insider = items.filter((x) => x.fm === '4' || x.fm === '4/A');
    const recent4 = insider.filter((x) => new Date(x.fd) >= Date.now() - 90 * 864e5);
    const link = (x) => '<a href="' + filingDocURL(cikNum, x.acc, x.doc) + '" target="_blank" rel="noopener">' + x.fm + '</a>';
    el.innerHTML = '<p><b>งบกำไรล่าสุดที่ยื่น:</b> ' + (keys.length ? link(keys[0]) + ' <span class="muted small">ยื่น ' + esc(keys[0].fd) + ' · งวดสิ้นสุด ' + esc(keys[0].rd || '?') + '</span>' : 'N/A') + '</p>'
      + '<p class="muted small">ประวัติงบ: ' + (keys.map((x) => link(x) + ' ' + esc(x.fd)).join(' · ') || 'N/A') + '</p>'
      + '<p><b>เหตุการณ์ 8-K ล่าสุด (จับตาตัวเร่ง):</b></p><ul class="small">' + (eights.map((x) => '<li>' + link(x) + ' — ยื่น ' + esc(x.fd) + ' (เหตุการณ์ ' + esc(x.rd || '?') + ')</li>').join('') || '<li class="muted">ไม่มีในฟีดล่าสุด</li>') + '</ul>'
      + '<p><b>Insider Form 4 (90 วัน):</b> ' + recent4.length + ' ฉบับ <span class="muted small">(แต่ละฉบับ = รายงานซื้อขาย 1 ครั้ง — เปิดดูว่า buy หรือ sell)</span></p>'
      + recent4.slice(0, 4).map((x) => '<div class="small">' + link(x) + ' <span class="muted">ยื่น ' + esc(x.fd) + '</span></div>').join('')
      + '<p class="muted small"><a href="' + secFilingURL(cikNum) + '" target="_blank" rel="noopener">เอกสารทั้งหมดบน SEC →</a></p>';
  } catch (e) { el.innerHTML = '<p style="color:var(--red)">ฟีดเอกสารใช้ไม่ได้ (' + esc(e.message) + ').</p>'; }
}
async function fillPerf(t) {
  const el = $('#perfBody');
  if (!el) return;
  if (!DataService.liveOn()) { el.innerHTML = '<p class="muted">ปิดโหมด live อยู่</p>'; return; }
  try {
    const rows = await getHistoryLive(t, 'd');
    if (rows.length < 60) throw new Error('ประวัติสั้นไป');
    const lastR = rows[rows.length - 1];
    const out = [[1, '1Y'], [3, '3Y'], [5, '5Y']].map(([y, lbl]) => {
      const target = new Date(lastR.d); target.setFullYear(target.getFullYear() - y);
      let best = rows[0];
      rows.forEach((r) => { if (Math.abs(new Date(r.d) - target) < Math.abs(new Date(best.d) - target)) best = r; });
      const yrs = Math.max((new Date(lastR.d) - new Date(best.d)) / 31557600000, 1 / 365);
      return { lbl, ret: (((lastR.c - best.c) / best.c) * 100), cagr: ((Math.pow(lastR.c / best.c, 1 / yrs) - 1) * 100), from: best.d };
    });
    const f = await getFundamentals(t).catch(() => null);
    let revCagr = null;
    if (f && f.revA.length > 1) {
      const a = f.revA[0], b = f.revA[f.revA.length - 1];
      const fy0 = +String(a.frame).replace('FY', ''), fy1 = +String(b.frame).replace('FY', '');
      if (fy1 > fy0 && a.val > 0) revCagr = (Math.pow(b.val / a.val, 1 / (fy1 - fy0)) - 1) * 100;
    }
    el.innerHTML = '<div class="table-wrap"><table><thead><tr><th>ช่วง</th><th>ผลตอบแทนราคา</th><th>CAGR</th><th>ตั้งแต่</th></tr></thead><tbody>'
      + out.map((o) => '<tr><td>' + o.lbl + '</td><td class="num">' + fmtPct(o.ret) + '</td><td class="num">' + fmtPct(o.cagr) + '</td><td class="muted small">' + esc(o.from) + '</td></tr>').join('')
      + '</tbody></table></div><p class="small">ขาดทุนสูงสุด (กรอบ 5Y): <b style="color:var(--red)">' + fmtN(maxDD(rows.slice(-1260).map((r) => r.c)), 1) + '%</b>'
      + (revCagr != null ? ' · รายได้ CAGR (ช่วง FY จาก SEC): <b>' + fmtPct(revCagr) + '</b>' : '') + '</p>';
  } catch (e) { el.innerHTML = '<p style="color:var(--red)">คำนวณผลตอบแทนไม่ได้ (' + esc(e.message) + ').</p>'; }
}
function tvSectionHTML(t, tv) {
  const chg = tv.change;
  const rsiTxt = tv.RSI == null ? 'N/A' : fmtN(tv.RSI, 1) + (tv.RSI < 30 ? ' (ขายมากไป)' : tv.RSI > 70 ? ' (ซื้อมากไป)' : ' (กลางๆ)');
  const trend = tv.SMA200 == null ? 'N/A' : (tv.close > tv.SMA200 ? '<span style="color:var(--green)">เหนือ SMA200 (ขาขึ้น)</span>' : '<span style="color:var(--red)">หลุด SMA200 (ขาลง)</span>');
  const macd = tv['MACD.macd'] != null && tv['MACD.signal'] != null
    ? (tv['MACD.macd'] > tv['MACD.signal'] ? '<span style="color:var(--green)">เป็นบวก</span>' : '<span style="color:var(--red)">เป็นลบ</span>') + ' <span class="muted small">(' + fmtN(tv['MACD.macd'], 2) + ' / ' + fmtN(tv['MACD.signal'], 2) + ')</span>' : 'N/A';
  const rec = tv['Recommend.All'];
  const recPct = rec == null ? 0 : Math.round(((rec + 1) / 2) * 100);
  return '<div class="kv">'
    + '<div class="cell"><div class="k">ราคา (TradingView)</div><div class="v">' + fmt$(tv.close) + '</div><div class="small" style="color:' + (chg >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (chg >= 0 ? '▲' : '▼') + ' ' + fmtN(Math.abs(chg), 2) + '% วันนี้</div></div>'
    + '<div class="cell"><div class="k">เปิด / สูง / ต่ำ วันนี้</div><div class="v" style="font-size:14px">' + fmt$(tv.open) + ' / ' + fmt$(tv.high) + ' / ' + fmt$(tv.low) + '</div><div class="muted small">วอล ' + (tv.volume != null ? (tv.volume / 1e6).toFixed(1) + 'M' : 'N/A') + '</div></div>'
    + '<div class="cell"><div class="k">ต่ำสุด / สูงสุด 52W</div><div class="v" style="font-size:14px">' + fmt$(tv.price_52_week_low, 0) + ' / ' + fmt$(tv.price_52_week_high, 0) + '</div></div>'
    + '<div class="cell"><div class="k">มูลค่าตลาด</div><div class="v">' + secB(tv.market_cap_basic) + '</div></div>'
    + '<div class="cell"><div class="k">รายได้ TTM</div><div class="v">' + secB(tv.total_revenue_ttm) + '</div></div>'
    + '<div class="cell"><div class="k">กำไรสุทธิ TTM</div><div class="v">' + secB(tv.net_income_ttm) + '</div></div>'
    + '<div class="cell"><div class="k">EPS ปรับลด TTM</div><div class="v">' + (tv.earnings_per_share_diluted_ttm != null ? fmtN(tv.earnings_per_share_diluted_ttm, 2) : 'N/A') + '</div></div>'
    + '<div class="cell"><div class="k">P/E TTM</div><div class="v">' + (tv.price_earnings_ttm != null ? fmtN(tv.price_earnings_ttm, 1) : 'N/A') + '</div></div>'
    + '<div class="cell"><div class="k">มาร์จิ้น ขั้นต้น / ดำเนินงาน / สุทธิ TTM</div><div class="v" style="font-size:14px">' + fmtN(tv.gross_margin_ttm, 1) + '% / ' + fmtN(tv.operating_margin_ttm, 1) + '% / ' + fmtN(tv.net_margin_ttm, 1) + '%</div></div>'
    + '<div class="cell"><div class="k">ยีลด์ปันผล</div><div class="v">' + (tv.dividends_yield_current != null ? fmtN(tv.dividends_yield_current, 2) + '%' : 'N/A') + '</div></div>'
    + '<div class="cell"><div class="k">พนักงาน</div><div class="v">' + (tv.number_of_employees != null ? Math.round(tv.number_of_employees).toLocaleString('en-US') : 'N/A') + '</div></div>'
    + '<div class="cell"><div class="k">RSI (14)</div><div class="v" style="font-size:15px">' + rsiTxt + '</div></div>'
    + '<div class="cell"><div class="k">SMA 20 / 50 / 200</div><div class="v" style="font-size:13px">' + [tv.SMA20, tv.SMA50, tv.SMA200].map((v) => v != null ? '$' + fmtN(v, 0) : '—').join(' / ') + '</div><div class="muted small">' + trend + '</div></div>'
    + '<div class="cell"><div class="k">MACD</div><div class="v" style="font-size:15px">' + macd + '</div></div>'
    + '<div class="cell"><div class="k">มตินักวิเคราะห์</div><div class="v" style="font-size:15px">' + tvRating(rec) + '</div><div class="muted small">คะแนนรวม TV ' + (rec != null ? fmtN(rec, 2) : 'N/A') + ' · <a href="' + tvPageURL(t) + '" target="_blank" rel="noopener">ดูรายละเอียด →</a></div></div>'
    + '</div>'
    + '<div style="margin-top:10px;background:linear-gradient(90deg,#ef4444,#eab308 45%,#22c55e);border-radius:8px;height:10px;position:relative" role="img" aria-label="เกจมตินักวิเคราะห์: ' + tvRating(rec) + '">'
    + '<div style="position:absolute;left:' + recPct + '%;top:-4px;width:3px;height:18px;background:#fff;border-radius:2px"></div></div>'
    + '<div class="row small muted" style="margin-top:4px"><span>ขายอย่างแรง</span><span style="margin-left:auto">ซื้ออย่างแรง</span></div>'
    + '<h4 class="muted small" style="margin:14px 0 6px">กราฟสด — วิดเจ็ตทางการของ TradingView (ข้อมูลเดียวกับหน้า ' + esc(tvPageURL(t)) + ')</h4>'
    + '<iframe title="กราฟ TradingView ของ ' + t + '" src="https://www.tradingview.com/widgetembed/?frameElementId=tv_' + t + '&symbol=' + (TV_EX[t] || 'NASDAQ') + '%3A' + t + '&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=1&toolbarbg=0e172e&studies=[]&theme=dark&style=1&timezone=Asia%2FBangkok&withdateranges=1&allow_symbol_change=0" style="width:100%;height:460px;border:1px solid var(--line);border-radius:12px" loading="lazy" allowfullscreen></iframe>'
    + '<div class="src-line"><span class="tag-fact">ข้อเท็จจริง</span>ที่มา: TradingView scanner (engine เดียวกับหน้าสัญลักษณ์) · กราฟ: วิดเจ็ตทางการของ TradingView · <a href="' + tvPageURL(t) + '" target="_blank" rel="noopener">เปิด ' + t + ' บน TradingView →</a> <span class="badge b-green">REAL DATA</span></div>';
}
async function fillTV(t) {
  const el = $('#tvBody');
  if (!el) return;
  if (!DataService.liveOn()) { el.innerHTML = '<p class="muted">ปิดโหมด live อยู่</p>'; return; }
  try {
    const tv = await getTVSnapshot(t);
    if (!$('#tvBody')) return;
    el.innerHTML = tvSectionHTML(t, tv);
  } catch (e) { if ($('#tvBody')) el.innerHTML = '<p style="color:var(--red)">ดึง TradingView ไม่ได้ (' + esc(e.message) + '). <a href="' + tvPageURL(t) + '" target="_blank" rel="noopener">เปิดบน TradingView →</a></p>'; }
}
async function fillStockLive(t, drawTech) {
  const body = $('#secBody');
  if (!DataService.liveOn()) {
    if (body) body.innerHTML = '<p class="muted">ปิดโหมด live อยู่ (ตั้งค่า → ผู้ให้บริการ → Live) ตัวเลขด้านบนเป็น demo</p>';
    return;
  }
  let secOK = false, quoteOK = false;
  try {
    const [f, qq] = await Promise.all([getFundamentals(t), getQuotesLive([t]).catch(() => ({}))]);
    secOK = !!(f && f.revA && f.revA.length);
    quoteOK = !!(qq && qq[t]);
    if (body) body.innerHTML = secPanelHTML(t, f, qq[t] || null);
    try {
      const dd = secDerived(f);
      if ($('#secMarginC') && dd.mLabels.length > 1) lineChart($('#secMarginC'), [{ label: 'Gross %', data: dd.gross, color: '#3b82f6', fill: true }, { label: 'Op %', data: dd.op, color: '#eab308' }, { label: 'Net %', data: dd.net, color: '#22c55e' }], { lastLabels: true });
      if ($('#secFcfC') && dd.fcfM.length) bars($('#secFcfC'), dd.fcfLabels, dd.fcfM, '#22c55e');
    } catch (_) {}
    const asof = $('#liveAsOf');
    if (asof && qq[t]) asof.innerHTML = '<span class="badge b-green fresh">● สด (ดีเลย์)</span> <span class="muted small">Stooq ' + esc(qq[t].date) + ' ' + esc(qq[t].time) + ' · งบยื่นจริง SEC EDGAR</span>';
  } catch (e) {
    if (body) body.innerHTML = '<p style="color:var(--red);font-weight:700">SEC EDGAR ใช้ไม่ได้ชั่วคราว (' + esc(e.message) + ').</p><p class="muted">ด้านบนเป็นตัวเลข demo — ไม่เอาข้อมูลเก่ามาหลอกว่าเป็นของสด</p>';
  }
  try {
    const rows = await getHistoryLive(t, 'd');
    const closes = rows.map((r) => r.c);
    if (closes.length > 60 && typeof redrawPchart === 'function' && pchartT === t) {
      setPchart(rows.map((r) => ({ c: r.c, v: r.v || 0 })), true);
    } else if (closes.length > 60 && drawTech) drawTech(closes, true);
  } catch (_) {}
  const cb = $('#confBadge');
  if (cb) {
    cb.innerHTML = secOK && quoteOK
      ? confidenceHTML('High', 'ราคาสด + งบ SEC จริง + TradingView')
      : (secOK || quoteOK)
        ? confidenceHTML('Medium', secOK ? 'งบ SEC จริง แต่ราคาสดใช้ไม่ได้' : 'ราคาสด แต่ดึงงบ SEC ไม่ได้')
        : confidenceHTML('Low', 'ดึงข้อมูลสดไม่ได้ — แสดง demo');
  }
  fillFilings(t);
  fillPerf(t);
  fillTV(t);
  fillWiki(t);
}

/* ---------------- FUNDAMENTAL SCORE (explainable, no AI guessing) -------
   Each pillar 0–100 from stated formulas over SEED demo figures.
   Displayed with formula + underlying values, always DEMO-labeled. ------ */
const clamp100 = (v) => Math.max(0, Math.min(100, v == null || isNaN(v) ? 0 : v));
function fundScore(t) {
  const s = SEED[t];
  const c = (v, cap) => clamp100((Math.max(v, 0) / cap) * 100);
  const pillars = [
    { k: 'Growth', v: Math.round(c(s.revGrowth, 60) * 0.4 + c(s.epsGrowth, 80) * 0.3 + c(s.cagr5, 60) * 0.3), f: 'RevYoY÷60×40 + EPSYoY÷80×30 + CAGR5Y÷60×30', d: 'Rev ' + fmtPct(s.revGrowth) + ' · EPS ' + fmtPct(s.epsGrowth) + ' · CAGR5Y ' + fmtPct(s.cagr5) },
    { k: 'Profitability', v: Math.round(c(s.grossM, 75) * 0.4 + c(s.opM, 55) * 0.3 + c(s.netM, 50) * 0.3), f: 'GrossM÷75×40 + OpM÷55×30 + NetM÷50×30', d: 'Gross ' + fmtN(s.grossM) + '% · Op ' + fmtN(s.opM) + '% · Net ' + fmtN(s.netM) + '%' },
    { k: 'Cash Flow', v: Math.round(c(s.fcfM, 45) * 0.5 + c(s.fcfYield, 4) * 0.25 + (s.fcf > 0 && s.debt <= s.fcf * 3 ? 25 : clamp100((s.fcf * 3 / Math.max(s.debt, 0.1)) * 25))), f: 'FCFm÷45×50 + FCFYield÷4×25 + Debt≤3×FCF→25', d: 'FCF ' + fmtB(s.fcf) + ' (' + fmtN(s.fcfM) + '%) · Yield ' + fmtN(s.fcfYield) + '% · Debt ' + fmtB(s.debt) },
    { k: 'Balance Sheet', v: Math.round(clamp100((s.cash / Math.max(s.debt, 0.1)) * 50) * 0.5 + (s.debt > 0 ? clamp100((s.fcf / s.debt) * 50) : 50) * 0.5), f: 'Cash÷Debt×50 (ครึ่ง) + FCF÷Debt×50 (ครึ่ง)', d: 'Cash ' + fmtB(s.cash) + ' · Debt ' + fmtB(s.debt) },
    { k: 'Efficiency', v: Math.round(c(s.roe, 60) * 0.5 + c(s.roic, 45) * 0.5), f: 'ROE÷60×50 + ROIC÷45×50', d: 'ROE ' + fmtN(s.roe) + '% · ROIC ' + fmtN(s.roic) + '%' },
    { k: 'Valuation', v: Math.round(clamp100(((40 - s.fwdPE) / 25) * 100) * 0.6 + clamp100(((2.5 - s.peg) / 2) * 100) * 0.4), f: '(40−FwdPE)÷25×60 + (2.5−PEG)÷2×40 — ยิ่งถูกยิ่งคะแนนสูง', d: 'Fwd P/E ' + fmtN(s.fwdPE) + ' · PEG ' + fmtN(s.peg) },
  ];
  const total = Math.round(pillars.reduce((a, p) => a + p.v, 0) / pillars.length);
  return { pillars, total };
}
function fundScoreHTML(t) {
  const { pillars, total } = fundScore(t);
  const bar = (v) => '<div style="background:var(--line);border-radius:6px;height:8px;margin-top:6px"><div style="width:' + v + '%;height:100%;border-radius:6px;background:' + (v >= 70 ? 'var(--green)' : v >= 45 ? 'var(--yellow)' : 'var(--red)') + '"></div></div>';
  return '<div class="kv"><div class="cell"><div class="k">คะแนนรวม (ค่าเฉลี่ย 6 หมวด)</div><div class="v" style="font-size:30px">' + total + '<span class="muted small">/100</span></div><div class="muted small">สูตร + ข้อมูลกำกับทุกหมวด · ไม่ใช่คำแนะนำซื้อขาย</div></div>'
    + pillars.map((p) => '<div class="cell"><div class="k">' + p.k + '</div><div class="v">' + p.v + '<span class="muted small">/100</span></div>' + bar(p.v) + '<div class="muted small" style="margin-top:6px"><span class="tag-calc">สูตร</span>' + esc(p.f) + '<br><span class="tag-fact">ข้อมูล</span>' + esc(p.d) + '</div></div>').join('') + '</div>';
}
/* Scenario targets: Target = Rev3Y × NetM(proxy) × P/E ÷ Shares.
   NetM proxy = OPM(scenario) × (1−15% tax). P/E multiples are stated
   assumptions (bull 1.2× / base 1.0× / bear 0.7× Fwd P/E). SCENARIO only. */
function parsePct(str) {
  const m = String(str || '').match(/([+-]?\d+(\.\d+)?)\s*%/);
  return m ? +m[1] : null;
}
function scenarioHTML(t) {
  const s = SEED[t];
  const rev0 = s.rev5y[4], shares = s.mcap / s.price;
  const rows = ['bull', 'base', 'bear'].map((k) => {
    const g = (parsePct(s.scen[k].rev) || 0) / 100;
    const opm = (parsePct(s.scen[k].margin) || s.opM) / 100;
    const netM = opm * 0.85;
    const mult = k === 'bull' ? s.fwdPE * 1.2 : k === 'base' ? s.fwdPE : s.fwdPE * 0.7;
    const rev3 = rev0 * Math.pow(1 + g, 3);
    const tgt = shares > 0 ? (rev3 * netM * mult) / shares : null;
    const vs = tgt != null ? (((tgt - s.price) / s.price) * 100) : null;
    return '<div class="cell"><div class="k">' + k.toUpperCase() + ' — เป้าหมาย (SCENARIO)</div>'
      + '<div class="v">' + (tgt != null ? fmt$(tgt, 0) : 'N/A') + ' <span class="small" style="color:' + (vs >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (vs != null ? fmtPct(vs, 0) + ' vs ปัจจุบัน' : '') + '</span></div>'
      + '<div class="muted small"><span class="tag-assump">ข้อสมมติ</span>' + esc(s.scen[k].rev) + ' · ' + esc(s.scen[k].margin) + ' · P/E ' + fmtN(mult, 1) + ' (' + (k === 'bull' ? '1.2×' : k === 'base' ? '1.0×' : '0.7×') + ' Fwd P/E)</div>'
      + '<div class="muted small">' + esc(s.scen[k].note) + '</div></div>';
  }).join('');
  return '<div class="kv">' + rows + '</div>'
    + '<p class="muted small"><span class="tag-calc">สูตร</span>เป้าหมาย = รายได้ปีที่ 3 × NetM โดยประมาณ (OPM×0.85) × P/E สมมติ ÷ จำนวนหุ้น (' + fmtN(shares, 2) + 'B) · รายได้ตั้งต้น ' + fmtB(rev0) + ' · ราคาปัจจุบัน ' + fmt$(s.price) + ' (demo) · <b>SCENARIO ไม่ใช่ PREDICTION</b></p>';
}
function thesisHTML(t) {
  const s = SEED[t];
  return '<div class="grid g2">'
    + '<div><h4>1 · บริษัทนี้ทำอะไร?</h4><p class="small">' + esc(s.desc) + '</p><p class="muted small"><span class="tag-interp">ตีความ</span>' + esc(s.bizModel) + '</p></div>'
    + '<div><h4>2 · โตจากอะไร? (Growth Drivers)</h4><ul class="small">' + s.catalysts.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul></div>'
    + '<div><h4>3 · ทำเงินดีแค่ไหน?</h4><p class="small">OpM ' + fmtN(s.opM) + '% · NetM ' + fmtN(s.netM) + '% · FCF ' + fmtB(s.fcf) + ' (' + fmtN(s.fcfM) + '%) · ROIC ' + fmtN(s.roic) + '%</p><p class="muted small">คูเมืองหลัก: ' + esc(s.moat[0][0]) + ' (' + esc(s.moat[0][1]) + ')</p></div>'
    + '<div><h4>4 · แพงหรือถูกเมื่อเทียบกับอะไร?</h4><p class="small">Fwd P/E ' + fmtN(s.fwdPE) + ' · PEG ' + fmtN(s.peg) + ' · P/S ' + fmtN(s.ps) + ' · EV/EBITDA ' + fmtN(s.evEbitda) + '</p><p class="muted small">เทียบค่าเฉลี่ย 5Y/10Y + sector: ข้อมูลยังไม่พอ (ต้องต่อ provider เสริม)</p></div>'
    + '<div><h4>5 · ความเสี่ยงที่ทำให้ thesis ผิดคืออะไร?</h4><ul class="small">' + s.risks.slice(0, 3).map((r) => '<li><b>' + esc(r[0]) + '</b> — โอกาส ' + esc(r[1]) + ' · ผลกระทบ ' + esc(r[2]) + '</li>').join('') + '</ul></div>'
    + '<div><h4>ตัวแปรสำคัญที่ต้องตาม (Key Variables)</h4><p class="small">รายได้โต · OPM · FCF margin · จำนวนหุ้น (buyback/dilution) · งบ 10-K/10-Q งวดถัดไป · เหตุการณ์ 8-K</p><p class="muted small"><span class="tag-assump">ล้มล้าง thesis</span>' + esc(s.scen.bear.note) + '</p></div>'
    + '</div><div class="src-line"><span class="tag-interp">AI-assisted</span>สรุปจากข้อมูลในระบบเท่านั้น (งบ demo + moat/risks/catalysts ที่ระบุ) · ไม่สร้างข่าวหรือ fact ใหม่ ' + DEMO + '</div>';
}
/* Data confidence: High = TV+SEC live · Medium = อย่างใดอย่างหนึ่ง ·
   Low = demo อย่างเดียว. Computed when live fills finish. */
function confidenceHTML(level, reason) {
  const map = { High: ['b-green', '● High'], Medium: ['b-yellow', '● Medium'], Low: ['b-red', '● Low'] };
  const m = map[level] || map.Low;
  return '<span class="badge ' + m[0] + '" title="ความเชื่อมั่นข้อมูล: ' + esc(reason) + '">' + m[1] + '</span> <span class="muted small">' + esc(reason) + '</span>';
}

/* ---------------- STOCK DETAIL -------------------------------------- */
function renderStock(t) {
  const s = SEED[t];
  if (!s) { view().innerHTML = '<div class="card"><h2>ไม่พบหุ้นตัวนี้</h2><p class="muted">ไม่มีข้อมูลของ ' + esc(t) + ' สถาปัตยกรรมรองรับการเพิ่มโดยไม่ต้องเขียน UI ใหม่ — ดู README</p><a class="btn ghost sm" href="#/">← แดชบอร์ด</a></div>'; return; }
  const hist = mkHist(s.price * 0.4, s.cagr5 / 100, 260, 0.04);
  const yoy = s.rev5y.map((v, i) => i ? +(((v - s.rev5y[i - 1]) / s.rev5y[i - 1]) * 100).toFixed(1) : 0);
  const years = ['FY-4', 'FY-3', 'FY-2', 'FY-1', 'FY2026'];
  const gaugePos = s.fwdPE < 18 ? 0 : s.fwdPE < 26 ? 1 : s.fwdPE < 34 ? 2 : 3;
  const gLabels = ['ถูกเกินไป', 'เหมาะสม', 'ค่อนข้างแพง', 'แพงมาก'];
  const notes = getNotes(t);
  view().innerHTML =
    '<div class="row"><a class="btn ghost sm" href="#/">← แดชบอร์ด</a><a class="btn ghost sm" href="#/compare">เปรียบเทียบ</a><a class="btn ghost sm" href="#/valuation/' + t + '">เปิดใน DCF</a><span style="margin-left:auto"></span><button class="btn ghost sm" data-watch="' + t + '">' + (inWatch(t) ? '★ อยู่ในรายการ' : '☆ เพิ่มเข้ารายการ') + '</button></div>'
    + '<div class="card sec"><div class="sc-head"><div style="display:flex;gap:12px;align-items:center">' + pfLogo(t) + '<div><div class="ticker">' + t + ' · ' + esc(s.name) + '</div><div class="cname">' + esc(s.sector) + ' · ' + esc(s.industry) + ' · 52W ' + fmt$(s.lo52, 0) + '–' + fmt$(s.hi52, 0) + '</div></div></div>'
    + '<div style="text-align:right"><div class="price num" data-lp="' + t + '">' + fmt$(s.price) + '</div><div class="muted small" data-lp-src="' + t + '">มูลค่าตลาด ' + fmtB(s.mcap) + ' ' + DEMO + '</div><div id="liveAsOf" style="margin-top:4px">' + freshness('ตลาด: กำลังโหลดข้อมูลสด… · งบ: กำลังโหลดจาก SEC EDGAR…') + '</div><div id="confBadge" style="margin-top:4px">' + confidenceHTML('Low', 'demo อย่างเดียว — รอข้อมูลสด') + '</div></div></div>'
    + '<div class="kv" style="margin-top:12px">'
    + [['รายได้โต', fmtPct(s.revGrowth)], ['กำไร/หุ้นโต', fmtPct(s.epsGrowth)], ['มาร์จิ้นขั้นต้น', fmtN(s.grossM) + '%'], ['มาร์จิ้นดำเนินงาน', fmtN(s.opM) + '%'], ['กระแสเงินสดอิสระ', fmtB(s.fcf)], ['มาร์จิ้น FCF', fmtN(s.fcfM) + '%'], ['P/E · ล่วงหน้า', fmtN(s.pe) + ' · ' + fmtN(s.fwdPE)], ['PEG', fmtN(s.peg)], ['ปันผล', fmtN(s.divY) + '%']].map((k) => '<div class="cell"><div class="k">' + k[0] + '</div><div class="v">' + k[1] + '</div></div>').join('')
    + '</div>' + statusBadges(s) + srcLine(s) + '</div>'

    + '<div class="card sec" id="secLive"><div class="sec-head"><h3>★ LIVE — งบจริง SEC EDGAR + ราคาสด</h3><span class="badge b-green">REAL DATA</span></div><div id="secBody"><p class="muted">กำลังโหลดงบที่ยื่นจริงจาก SEC EDGAR…</p></div></div>'

    + '<div class="card sec" id="tvLive"><div class="sec-head"><h3>📊 TradingView — สแนปช็อตสด + กราฟจริง</h3><span class="badge b-green">REAL DATA</span></div><div id="tvBody"><p class="muted">กำลังโหลดข้อมูล TradingView…</p></div></div>'

    + '<div class="grid g2"><div class="card sec"><div class="sec-head"><h3>📁 ฟีดเอกสาร — งบกำไร เหตุการณ์ 8-K insider</h3><span class="badge b-green">REAL DATA</span></div><div id="filBody"><p class="muted">กำลังโหลดฟีดเอกสาร…</p></div></div>'
    + '<div class="card sec"><div class="sec-head"><h3>📈 ผลตอบแทนย้อนหลัง — ราคาจริง</h3><span class="badge b-green">REAL DATA</span></div><div id="perfBody"><p class="muted">กำลังคำนวณจากราคาย้อนหลังรายวัน…</p></div><p class="muted small">ผลตอบแทนอดีตไม่การันตีอนาคต</p></div></div>'

    + '<div class="card sec"><div class="sec-head"><h3>1 · ธุรกิจ — บริษัททำอะไร?</h3>' + DEMO + '</div><p><span class="tag-fact">ข้อเท็จจริง</span>' + esc(s.desc) + '</p><div id="wikiBiz"><p class="muted small">กำลังดึงภาพรวมธุรกิจ…</p></div><p class="muted small"><span class="tag-interp">การตีความ</span>โมเดล: ' + esc(s.bizModel) + ' · ลูกค้า: ' + esc(s.customers) + '</p>'
    + '<div class="grid g2"><div><h4 class="muted small">สัดส่วนรายได้</h4><canvas class="chart" id="segC"></canvas></div><div><h4 class="muted small">ภูมิภาค</h4><canvas class="chart" id="geoC"></canvas></div></div>' + srcLine(s) + '</div>'

    + '<div class="card sec"><div class="sec-head"><h3>2 · การเติบโต — ประวัติรายได้ / กำไร / FCF</h3>' + DEMO + '</div><canvas class="chart" id="revC"></canvas>'
    + '<div class="table-wrap"><table aria-label="ตารางเติบโต"><thead><tr><th>ปี</th><th>รายได้ $B</th><th>โต%</th><th>EPS $</th><th>EPS โต</th><th>FCF $B</th></tr></thead><tbody>'
    + years.map((y, i) => '<tr><td>' + y + '</td><td class="num">' + fmtN(s.rev5y[i]) + '</td><td class="num">' + fmtPct(yoy[i]) + '</td><td class="num">' + fmtN(s.eps5y[i], 2) + '</td><td class="num">' + (i ? fmtPct(((s.eps5y[i] - s.eps5y[i - 1]) / Math.abs(s.eps5y[i - 1])) * 100) : '—') + '</td><td class="num">' + fmtN(s.fcf5y[i]) + '</td></tr>').join('')
    + '</tbody></table></div><p class="muted small"><span class="tag-calc">การคำนวณ</span>ดู CAGR ที่แดชบอร์ด <span class="tag-interp">การตีความ</span>แยกโตเอง vs ซื้อกิจการ vs ขึ้นราคา vs ปริมาณขาย: ' + NA + ' (แสดงเฉพาะถ้างบแยกมาให้)</p>' + srcLine(s) + '</div>'

    + '<div class="card sec"><h3>3 · คูเมือง — ทำไมคู่แข่งสู้ยาก?</h3>' + s.moat.map((m) => '<p><b>' + esc(m[0]) + '</b> — <span class="badge b-blue">' + esc(m[1]) + '</span><br><span class="muted small"><span class="tag-fact">หลักฐาน</span>' + esc(m[2]) + '</span></p>').join('') + '</div>'

    + '<div class="card sec"><div class="sec-head"><h3>4 · สุขภาพการเงิน + 5 · งบดุล + กระแสเงินสด + ความสามารถทำกำไร</h3>' + DEMO + '</div>'
    + '<div class="kv">' + [['รายได้', fmtB(s.rev5y[4])], ['มาร์จิ้นขั้นต้น', fmtN(s.grossM) + '%'], ['มาร์จิ้นดำเนินงาน', fmtN(s.opM) + '%'], ['มาร์จิ้นสุทธิ', fmtN(s.netM) + '%'], ['ROE', fmtN(s.roe) + '%'], ['ROIC', fmtN(s.roic) + '%'], ['เงินสด', fmtB(s.cash)], ['หนี้', fmtB(s.debt)], ['หนี้สุทธิ', fmtB(s.debt - s.cash)], ['Debt/FCF', fmtN(s.debt / Math.max(s.fcf, 0.1), 1) + 'x'], ['FCF = OCF − CapEx', fmtB(s.fcf)], ['มาร์จิ้น FCF', fmtN(s.fcfM) + '%']].map((k) => '<div class="cell"><div class="k">' + k[0] + '</div><div class="v">' + k[1] + '</div></div>').join('') + '</div>'
    + '<canvas class="chart" id="fcfC" style="margin-top:12px"></canvas>' + srcLine(s) + '</div>'

    + '<div class="card sec"><div class="sec-head"><h3>⭐ Fundamental Score — อธิบายได้ทุกคะแนน</h3>' + DEMO + '</div>' + fundScoreHTML(t) + srcLine(s) + '</div>'

    + '<div class="card sec"><div class="sec-head"><h3>6 · มูลค่า — อย่าดูแค่ P/E</h3>' + DEMO + '</div>'
    + '<div class="kv">' + [['P/E', fmtN(s.pe)], ['P/E ล่วงหน้า', fmtN(s.fwdPE)], ['PEG', fmtN(s.peg)], ['P/S', fmtN(s.ps)], ['EV/EBITDA', fmtN(s.evEbitda)], ['Price/FCF', fmtN(s.pFCF)], ['ยีลด์ FCF', fmtN(s.fcfYield) + '%']].map((k) => '<div class="cell"><div class="k">' + k[0] + '</div><div class="v">' + k[1] + '</div></div>').join('') + '</div>'
    + '<div class="gauge" role="img" aria-label="Valuation gauge">' + gLabels.map((g, i) => '<div class="' + (i === gaugePos ? 'on' : '') + '" style="' + (i === gaugePos ? 'background:' + ['#22c55e', '#3b82f6', '#eab308', '#ef4444'][i] : '') + '">' + g + '</div>').join('') + '</div>'
    + '<p class="muted small"><span class="tag-interp">การตีความ</span>อิงมูลค่าเชิงประวัติ/เชิงเปรียบเทียบ — ไม่ได้ฟันธงว่าหุ้นแพง ค่าเฉลี่ย 5Y/10Y และ sector: ' + NA + ' (ต้องต่อ provider เสริม)</p>'
    + '<div class="row"><a class="btn sm" href="#/valuation/' + t + '">เปิดเครื่องคำนวณ DCF</a></div>' + srcLine(s) + '</div>'

    + '<div class="grid g2"><div class="card sec"><h3>7 · อุตสาหกรรม / TAM</h3><p class="muted small">ดูหน้า<a href="#/industry">อุตสาหกรรม</a>เรื่องขนาดตลาด ส่วนแบ่ง และคู่แข่ง</p></div>'
    + '<div class="card sec"><h3>8 · ตัวเร่ง — แค่ความเป็นไปได้ ไม่ใช่คำสัญญา</h3><ul>' + s.catalysts.map((c) => '<li><b>ตัวเร่งที่เป็นไปได้:</b> ' + esc(c) + '</li>').join('') + '</ul></div></div>'

    + '<div class="card sec"><h3>9 · ตารางความเสี่ยง</h3><div class="table-wrap"><table class="risk-table"><thead><tr><th>ความเสี่ยง</th><th>โอกาสเกิด</th><th>ผลกระทบ</th><th>หลักฐาน</th></tr></thead><tbody>'
    + s.risks.map((r) => '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td style="text-align:left;white-space:normal">' + esc(r[3]) + '</td></tr>').join('')
    + '</tbody></table></div></div>'

    + '<div class="card sec"><div class="sec-head"><h3>10 · กรณี BULL / BASE / BEAR — SCENARIO</h3>' + DEMO + '</div>' + scenarioHTML(t) + '</div>'

    + '<div class="card sec"><div class="sec-head"><h3>📝 Investment Thesis — 5 คำถามต้องตอบได้</h3>' + DEMO + '</div>' + thesisHTML(t) + '</div>'

    + '<div class="card sec"><div class="sec-head"><h3>แดชบอร์ดเทคนิค — แยกจากการวิเคราะห์พื้นฐาน</h3><span class="badge b-green" id="pxLiveBadge" style="display:none">REAL DATA</span></div>'
    + '<div class="toolbar" id="pxBar" role="group" aria-label="ช่วงกราฟราคา">'
    + ['1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'].map((r) => '<button class="chip-sel' + (r === '1Y' ? ' on' : '') + '" data-pxr="' + r + '">' + r + '</button>').join('')
    + '<span style="margin-left:auto"></span><button class="chip-sel on" id="pxMA">MA 50/200</button><button class="chip-sel" id="pxVol">Volume</button></div>'
    + '<canvas class="chart" id="techC" style="margin-top:10px"></canvas><canvas class="chart" id="pxV" style="display:none;height:70px"></canvas><div class="kv" id="techKV" style="margin-top:10px"></div><p class="muted small">กราฟสด = ราคาปิดรายวันจริง (Stooq) · แนวรับ ≈ จุดต่ำสุดรอบล่าสุด · แนวต้าน ≈ จุดสูงสุดรอบล่าสุด · <span id="pxSrc">demo</span></p></div>'

    + '<div class="card sec"><h3>สมมติฐานและโน้ตของฉัน (บันทึกในเครื่อง)</h3><div class="note-grid">'
    + [['thesis', 'สมมติฐานของฉัน'], ['bull', 'กรณีดี'], ['bear', 'กรณีแย่'], ['entry', 'แผนเข้าซื้อ'], ['risk', 'ความเสี่ยง'], ['notes', 'โน้ต']].map((f) => '<label class="fl">' + f[1] + '<textarea id="n_' + f[0] + '" rows="3" aria-label="' + f[1] + '">' + esc(notes[f[0]]) + '</textarea></label>').join('')
    + '</div><div class="row" style="margin-top:10px"><button class="btn sm" id="saveNotes">บันทึกโน้ต</button><span class="muted small" id="notesMsg">เก็บใน LocalStorage · ย้ายไป Supabase ได้ (key เดิม)</span></div></div>'

    + '<div class="card sec"><h3>บัตรสรุปวิเคราะห์</h3><p><b>ธุรกิจ</b> ' + esc(s.desc) + '</p><p><b>เติบโต</b> รายได้ ' + fmtPct(s.revGrowth) + ' YoY; CAGR 5 ปี ' + fmtPct(s.cagr5) + ' (จำลอง)</p><p><b>คูเมือง</b> ' + esc(s.moat[0][0]) + ' — ' + esc(s.moat[0][1]) + '.</p><p><b>การเงิน</b> OpM ' + fmtN(s.opM) + '%, FCF ' + fmtB(s.fcf) + ', หนี้สุทธิ ' + fmtB(s.debt - s.cash) + '.</p><p><b>มูลค่า</b> Fwd P/E ' + fmtN(s.fwdPE) + ', PEG ' + fmtN(s.peg) + ' — ' + gLabels[gaugePos] + ' เชิงเปรียบเทียบ</p><p><b>เสี่ยง</b> ' + esc(s.risks[0][0]) + ' (' + esc(s.risks[0][1]) + ').</p><p><b>ตัวเร่ง</b> ' + esc(s.catalysts[0]) + ' (แค่ความเป็นไปได้)</p></div>';
  // charts
  donut($('#segC'), s.segments); donut($('#geoC'), s.geo);
  lineChart($('#revC'), [{ label: 'Revenue $B', data: s.rev5y, color: '#3b82f6', fill: true }, { label: 'FCF $B', data: s.fcf5y, color: '#22c55e' }], { lastLabels: true });
  lineChart($('#fcfC'), [{ label: 'FCF $B', data: s.fcf5y, color: '#22c55e', fill: true }], { lastLabels: true });
  // ---- price chart state: ranges + MA/volume (real daily closes when live)
  pchartRange = '1Y'; pchartMA = true; pchartVol = false; pchartData = []; pchartLive = false; pchartT = t;
  function drawTech(data, liveTag) {
    setPchart(data.map((c) => ({ c, v: 0 })), !!liveTag);
  }
  drawTech(hist, false);
  $$('#pxBar [data-pxr]').forEach((b) => b.onclick = () => { pchartRange = b.dataset.pxr; $$('#pxBar [data-pxr]').forEach((x) => x.classList.toggle('on', x === b)); redrawPchart(); });
  $('#pxMA').onclick = (e) => { pchartMA = !pchartMA; e.target.classList.toggle('on', pchartMA); redrawPchart(); };
  $('#pxVol').onclick = (e) => { pchartVol = !pchartVol; e.target.classList.toggle('on', pchartVol); redrawPchart(); };
  fillLivePrices();
  fillStockLive(t, drawTech);
  $('[data-watch]').onclick = (e) => toggleWatch(t);
  $('#saveNotes').onclick = () => { const o = {}; ['thesis', 'bull', 'bear', 'entry', 'risk', 'notes'].forEach((f) => o[f] = $('#n_' + f).value); store.set('asrt_notes_' + t, o); $('#notesMsg').textContent = 'บันทึกแล้ว ✓ ' + new Date().toLocaleString(); };
}

/* ---------------- MY PORTFOLIO (พอร์ตจริงของฉัน, บาท) ---------------- */
const PF_LOGO_BG = { AVGO: '#e11d48', MU: '#1d4ed8', ASML: '#1e40af', NVDA: '#16a34a', AMD: '#52525b', COST: '#b91c1c', AMZN: '#f97316' };
const TV_LOGO = { NVDA: 'nvidia', AVGO: 'broadcom', MU: 'micron-technology', ASML: 'asml', AMD: 'advanced-micro-devices', GOOGL: 'alphabet', AMZN: 'amazon', COST: 'costco-wholesale' };
const PF_TICKS = ['AVGO', 'MU', 'ASML', 'NVDA', 'AMD', 'COST', 'AMZN', 'GOOGL', 'META', 'AAPL', 'MSFT', 'TSM', 'อื่นๆ'];
let pfOpen = -1;
function pfDefault() {
  return {
    totalCost: 190.55, fx: 33.43, sort: 'value', mode: 'day',
    holdings: [
      { t: 'AVGO', value: 60.53, day: 0.15, cost: 0, shares: 0 },
      { t: 'MU', value: 53.90, day: 1.60, cost: 0, shares: 0 },
      { t: 'ASML', value: 30.98, day: 4.49, cost: 0, shares: 0 },
      { t: 'NVDA', value: 16.34, day: 2.64, cost: 0, shares: 0 },
      { t: 'AMD', value: 10.16, day: 4.93, cost: 0, shares: 0 },
      { t: 'COST', value: 9.20, day: 2.99, cost: 0, shares: 0 },
      { t: 'AMZN', value: 7.69, day: 2.12, cost: 0, shares: 0 },
      { t: 'GOOGL', value: 5.37, day: 0, cost: 5.35, shares: 0.0156433 },
    ],
  };
}
function getMyPort() {
  const d = store.get('asrt_myport', null);
  const p = d && d.holdings ? d : pfDefault();
  /* โอนข้อมูลเก่า: 'อื่นๆ' 5.37 = GOOGL 0.0156433 หุ้น ทุน $342/หุ้น */
  const oi = p.holdings.findIndex((h) => h.t === 'อื่นๆ');
  if (oi >= 0 && !p.holdings.some((h) => h.t === 'GOOGL')) {
    p.holdings[oi].t = 'GOOGL';
    if (!+p.holdings[oi].shares) p.holdings[oi].shares = 0.0156433;
    if (!+p.holdings[oi].cost) p.holdings[oi].cost = 5.35;
    saveMyPort(p);
  }
  return p;
}
function saveMyPort(p) { store.set('asrt_myport', p); }
function pfCalc(p) {
  const val = p.holdings.reduce((a, h) => a + (+h.value || 0), 0);
  let dayGain = 0;
  p.holdings.forEach((h) => { const v = +h.value || 0, d = +h.day || 0; dayGain += v - v / (1 + d / 100); });
  const dayPct = val - dayGain !== 0 ? (dayGain / (val - dayGain)) * 100 : 0;
  const gainUSD = val - (+p.totalCost || 0);
  const gainPct = +p.totalCost ? (gainUSD / +p.totalCost) * 100 : 0;
  return { val, dayGain, dayPct, gainUSD, gainPct };
}
const pfLogo = (t) => {
  let id = null;
  try { id = (store.get('asrt_logos', {})[t]) || null; } catch (_) {}
  id = id || TV_LOGO[t] || null;
  const fb = '<span class="pf-logo" style="background:' + (PF_LOGO_BG[t] || '#3b82f6') + ';display:none">' + esc(String(t).slice(0, 3)) + '</span>';
  if (!id) return fb.replace('display:none', 'display:grid');
  return '<img class="pf-logo-img" src="https://s3-symbol-logo.tradingview.com/' + id + '--big.svg" alt="โลโก้ ' + esc(t) + '" loading="lazy" onerror="pfLogoFail(this)">' + fb;
};
function pfLogoFail(img) { img.style.display = 'none'; const s = img.nextElementSibling; if (s) s.style.display = 'grid'; }
const pfUp = (v) => (v >= 0 ? 'var(--green)' : 'var(--red)');
function renderPortfolio() {
  try { pfAuto = localStorage.getItem('asrt_pfauto') !== '0'; } catch (_) {}
  const p = getMyPort();
  const c = pfCalc(p);
  const fx = +p.fx || 33.43;
  const thb = (v) => '≈ ' + Math.round(v * fx).toLocaleString('th-TH') + ' THB';
  const rows = [...p.holdings];
  const hg = (h) => (+h.cost > 0 ? (((+h.value - +h.cost) / +h.cost) * 100) : +h.day || 0);
  const hgUSD = (h) => (+h.cost > 0 ? (+h.value - +h.cost) : (+h.value - +h.value / (1 + (+h.day || 0) / 100)));
  if (p.sort === 'gain') rows.sort((a, b) => hg(b) - hg(a));
  else if (p.sort === 'name') rows.sort((a, b) => String(a.t).localeCompare(String(b.t)));
  else rows.sort((a, b) => (+b.value || 0) - (+a.value || 0));
  view().innerHTML = '<div class="hero"><div><h1>💼 พอร์ตของฉัน</h1><p>กรอกมูลค่า ทุน และ % เองได้ — ตัวเลขรวมคำนวณให้ทันที เก็บในเครื่อง</p></div>'
    + '<div class="toolbar"><button class="btn sm" id="pfLive">🔄 อัปเดตราคาสด</button><button class="chip-sel ' + (pfAuto ? 'on' : '') + '" id="pfAutoBtn" title="รีเฟรชราคาอัตโนมัติทุก 60 วินาที">' + (pfAuto ? '⏸ ออโต้: เปิด' : '▶ ออโต้: ปิด') + '</button><button class="btn ghost sm" id="pfReset">รีเซ็ตเป็นข้อมูลจริงของฉัน</button><span class="muted small" id="pfUpdated"></span></div></div>'
    + '<div class="card"><div class="num" style="font-size:34px;font-weight:900">' + fmt$(c.val) + ' <span class="muted small">USD</span></div>'
    + '<div class="muted">≈ ' + Math.round(c.val * fx).toLocaleString('th-TH') + ' THB <span style="margin-left:8px">🇺🇸 1 USD = <input id="pfFx" type="number" step="0.01" value="' + fx + '" style="width:84px;display:inline-block;padding:4px 8px" aria-label="อัตราแลกเปลี่ยน"> THB</span> <span class="muted small" id="pfFxNote"></span></div>'
    + '<div class="muted" style="margin-top:4px">~ ต้นทุนรวม: <input id="pfCost" type="number" step="0.01" value="' + (+p.totalCost || 0) + '" style="width:110px;display:inline-block;padding:4px 8px" aria-label="ต้นทุนรวม USD"> USD</div>'
    + '<div class="grid g2" style="margin-top:10px"><div><div class="muted small">% เปลี่ยนจากวันก่อน</div><div class="num" style="font-size:22px;font-weight:800;color:' + pfUp(c.dayPct) + '">' + (c.dayPct >= 0 ? '↗ ' : '↘ ') + fmtN(Math.abs(c.dayPct), 2) + '% <span class="small">(' + (c.dayGain >= 0 ? '+' : '') + fmtN(c.dayGain, 2) + ' USD)</span></div></div>'
    + '<div><div class="muted small">กำไรของสินทรัพย์ที่ถืออยู่</div><div class="num" style="font-size:22px;font-weight:800;color:' + pfUp(c.gainPct) + '">' + (c.gainPct >= 0 ? '↗ ' : '↘ ') + fmtN(Math.abs(c.gainPct), 2) + '% <span class="small">(' + (c.gainUSD >= 0 ? '+' : '') + fmtN(c.gainUSD, 2) + ' USD)</span></div></div></div></div>'
    + '<div class="card sec"><div class="toolbar"><label class="fl">เรียงตาม<select id="pfSort" class="inline"><option value="value">มูลค่าสินทรัพย์</option><option value="gain">กำไรขาดทุน</option><option value="name">ชื่อ</option></select></label>'
    + '<button class="chip-sel ' + (p.mode === 'day' ? 'on' : '') + '" id="pfModeDay">% รายวัน</button><button class="chip-sel ' + (p.mode === 'total' ? 'on' : '') + '" id="pfModeTot">กำไรขาดทุน ⇄</button>'
    + '<span class="muted small" style="margin-left:auto">' + p.holdings.length + ' สินทรัพย์</span></div>'
    + '<div id="pfRows">' + rows.map((h) => {
      const idx = p.holdings.indexOf(h);
      const w = c.val ? ((+h.value || 0) / c.val) * 100 : 0;
      const dv = +h.value - +h.value / (1 + (+h.day || 0) / 100);
      const showGain = p.mode === 'total' && +h.cost > 0;
      const pct = showGain ? hg(h) : (+h.day || 0);
      const usd = showGain ? (+h.value - +h.cost) : dv;
      return '<div class="pf-row"><div class="pf-main">' + pfLogo(h.t) + '<div style="flex:1;min-width:0"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><b>' + esc(h.t) + '</b><span class="num" style="font-weight:800;font-size:17px">' + fmtN(+h.value || 0, 2) + '</span><span class="num" style="font-weight:800;color:' + pfUp(pct) + '">' + (pct >= 0 ? '↗' : '↘') + ' ' + fmtN(Math.abs(pct), 2) + '%</span></div>'
        + '<div style="display:flex;justify-content:space-between;gap:8px" class="muted small"><span>◔ ' + fmtN(w, 2) + '%</span><span>' + thb(+h.value || 0) + '</span><span style="color:' + pfUp(usd) + '">(' + (usd >= 0 ? '+' : '') + fmtN(usd, 2) + ' USD)</span></div></div>'
        + '<button class="icon-btn" data-pfedit="' + idx + '" aria-label="แก้ไข ' + esc(h.t) + '">✎</button></div>'
        + (pfOpen === idx ? '<div class="pf-edit"><label class="fl">มูลค่าปัจจุบัน (USD)<input type="number" step="0.01" data-f="value" data-i="' + idx + '" value="' + (+h.value || 0) + '"></label>'
          + '<label class="fl">% วันนี้<input type="number" step="0.01" data-f="day" data-i="' + idx + '" value="' + (+h.day || 0) + '"></label>'
          + '<label class="fl">ต้นทุน (USD)<input type="number" step="0.01" data-f="cost" data-i="' + idx + '" value="' + (+h.cost || 0) + '"></label>'
          + '<label class="fl">หุ้น (ถ้ามี → ดึงราคาสด)<input type="number" step="any" data-f="shares" data-i="' + idx + '" value="' + (+h.shares || 0) + '"></label>'
          + (+h.shares > 0 && +h.cost > 0 ? '<div class="muted small" style="align-self:end">ทุน/หุ้น: $' + fmtN(+h.cost / +h.shares, 2) + '</div>' : '')
          + '<button class="btn ghost sm" data-pfdel="' + idx + '">ลบ</button></div>' : '')
        + '</div>';
    }).join('') + '</div>'
    + '<div class="row" style="margin-top:10px"><select id="pfNew" class="inline">' + PF_TICKS.map((x) => '<option>' + x + '</option>').join('') + '</select><button class="btn sm" id="pfAdd">+ เพิ่มสินทรัพย์</button></div></div>';
  $('#pfSort').value = p.sort;
  $('#pfSort').onchange = (e) => { const q = getMyPort(); q.sort = e.target.value; saveMyPort(q); renderPortfolio(); };
  $('#pfModeDay').onclick = () => { const q = getMyPort(); q.mode = 'day'; saveMyPort(q); renderPortfolio(); };
  $('#pfModeTot').onclick = () => { const q = getMyPort(); q.mode = 'total'; saveMyPort(q); renderPortfolio(); };
  $('#pfCost').onchange = (e) => { const q = getMyPort(); q.totalCost = +e.target.value || 0; saveMyPort(q); renderPortfolio(); };
  $('#pfFx').onchange = (e) => { const q = getMyPort(); q.fx = +e.target.value || q.fx; saveMyPort(q); renderPortfolio(); };
  $('#pfAdd').onclick = () => { const q = getMyPort(); const t = $('#pfNew').value; if (q.holdings.some((h) => h.t === t)) return alert('มี ' + t + ' แล้ว'); q.holdings.push({ t, value: 0, day: 0, cost: 0, shares: 0 }); pfOpen = q.holdings.length - 1; saveMyPort(q); renderPortfolio(); };
  $('#pfReset').onclick = () => { if (confirm('รีเซ็ตเป็นข้อมูลพอร์ตจริงของฉัน?')) { pfOpen = -1; saveMyPort(pfDefault()); renderPortfolio(); } };
  $('#pfLive').onclick = () => pfLiveRefresh(false);
  $('#pfAutoBtn').onclick = () => { pfAuto = !pfAuto; try { localStorage.setItem('asrt_pfauto', pfAuto ? '1' : '0'); } catch (_) {} renderPortfolio(); };
  $$('[data-pfedit]').forEach((b) => b.onclick = () => { pfOpen = +b.dataset.pfedit === pfOpen ? -1 : +b.dataset.pfedit; renderPortfolio(); });
  $$('[data-pfdel]').forEach((b) => b.onclick = () => { const q = getMyPort(); q.holdings.splice(+b.dataset.pfdel, 1); pfOpen = -1; saveMyPort(q); renderPortfolio(); });
  $$('#pfRows input[data-f]').forEach((inp) => inp.onchange = () => {
    const q = getMyPort(); const i = +inp.dataset.i;
    q.holdings[i][inp.dataset.f] = +inp.value || 0;
    saveMyPort(q); renderPortfolio();
  });
  if (!pfFxDone) { pfFxDone = true; pfLoadFx(); }
  startPfAuto();
}
let pfFxDone = false;
async function pfLoadFx() {
  try {
    const j = await fetchJSON('https://api.frankfurter.app/latest?from=USD&to=THB', 8000);
    if (j && j.rates && j.rates.THB) {
      const q = getMyPort();
      q.fx = +j.rates.THB.toFixed(2);
      saveMyPort(q);
      const inp = $('#pfFx');
      if (inp) inp.value = q.fx;
      const n = $('#pfFxNote');
      if (n) n.textContent = 'เรทจริง ' + j.date;
      if ($('#pfRows')) renderPortfolio();
    }
  } catch (_) { const n = $('#pfFxNote'); if (n) n.textContent = 'เรทจำ/กรอกเอง'; }
}
async function pfLiveRefresh(quiet) {
  if (!DataService.liveOn()) { if (!quiet) return alert('เปิดโหมด Live ก่อน (ตั้งค่า)'); else return; }
  const btn = $('#pfLive');
  if (btn && !quiet) btn.textContent = '⏳ กำลังดึง…';
  const p = getMyPort();
  let n = 0;
  for (const h of p.holdings) {
    if (+h.shares > 0 && TV_EX[h.t]) {
      try {
        const tv = await getTVSnapshot(h.t, true);
        if (tv && tv.close != null) { h.value = +(+h.shares * tv.close).toFixed(2); if (tv.change != null) h.day = +tv.change.toFixed(2); n++; }
      } catch (_) {}
    }
  }
  saveMyPort(p);
  if (!location.hash.startsWith('#/portfolio')) return;
  renderPortfolio();
  const ts2 = $('#pfUpdated');
  if (ts2) ts2.textContent = 'อัปเดตล่าสุด ' + new Date().toLocaleTimeString('th-TH') + (quiet ? ' · อัตโนมัติทุก 60 วิ' : '');
  if (!quiet) alert(n ? 'อัปเดตราคาสด ' + n + ' ตัว (จากจำนวนหุ้น)' : 'ไม่มีหุ้นที่ใส่จำนวนหุ้นไว้ — กรอกช่อง "หุ้น" ใน ✎ ของแต่ละตัวก่อน');
}
/* Auto-refresh ทุก 60 วิ: หยุดเองเมื่อซ่อนแท็บ / ออกจากหน้า / กำลังแก้ */
let pfTimer = null, pfAuto = true;
function stopPfAuto() { if (pfTimer) { clearInterval(pfTimer); pfTimer = null; } }
function startPfAuto() {
  stopPfAuto();
  if (!pfAuto) return;
  pfTimer = setInterval(async () => {
    if (!pfAuto || document.visibilityState !== 'visible') return;
    if (!location.hash.startsWith('#/portfolio')) { stopPfAuto(); return; }
    if (pfOpen !== -1) return;
    const ae = document.activeElement;
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'SELECT' || ae.tagName === 'TEXTAREA')) return;
    await pfLiveRefresh(true);
    const ts = $('#pfUpdated');
    if (ts) ts.textContent = 'อัปเดตล่าสุด ' + new Date().toLocaleTimeString('th-TH') + ' · อัตโนมัติทุก 60 วิ';
  }, 60000);
}

/* ---------------- RANKINGS (จัดอันดับหุ้นน่าลงทุน) -------------------- */
function renderRankings() {
  const preset = RANK_PRESETS.find((x) => x.id === rankPreset) || RANK_PRESETS[0];
  view().innerHTML = '<div class="hero"><div><h1>🏆 จัดอันดับหุ้นน่าลงทุน</h1><p>สแกนหุ้น US จริงจาก TradingView screener + วิเคราะห์ให้ว่าทำไมน่าสนใจ % ที่เห็นคือ<b>อดีตจริง (YoY)</b> — ไม่มีใครการันตีอนาคต ดูงบ SEC ประกอบทุกครั้ง</p></div>'
    + '<div class="toolbar"><button class="btn sm" id="rkGo">🔄 สแกนใหม่</button></div></div>'
    + '<div class="card"><h3>เลือกมุมมอง</h3><div class="toolbar">'
    + RANK_PRESETS.map((x) => '<button class="chip-sel ' + (x.id === rankPreset ? 'on' : '') + '" data-preset="' + x.id + '">' + x.name + '</button>').join('') + '</div>'
    + '<p class="muted small">' + esc(preset.desc) + '</p>'
    + '<div class="toolbar"><label class="fl">มูลค่าตลาดขั้นต่ำ<select id="rkMcap" class="inline"><option value="2000000000"> $2B+</option><option value="10000000000" selected> $10B+</option><option value="50000000000"> $50B+</option><option value="200000000000"> $200B+</option></select></label>'
    + '<label class="fl">ตลาด<select id="rkEx" class="inline"><option value="both">NASDAQ + NYSE</option><option value="NASDAQ">NASDAQ อย่างเดียว</option><option value="NYSE">NYSE อย่างเดียว</option></select></label></div></div>'
    + '<div class="card sec"><div id="rkBody"><p class="muted">กำลังสแกนตลาดจริง…</p></div></div>';
  $('#rkMcap').value = String(rankMcap);
  $$('[data-preset]').forEach((b) => b.onclick = () => { rankPreset = b.dataset.preset; renderRankings(); });
  $('#rkMcap').onchange = (e) => { rankMcap = +e.target.value; renderRankings(); };
  $('#rkEx').onchange = (e) => { rankEx = e.target.value === 'both' ? ['NASDAQ', 'NYSE'] : [e.target.value]; renderRankings(); };
  $('#rkGo').onclick = () => renderRankings();
  fillRankings();
}
async function fillRankings() {
  const el = $('#rkBody');
  if (!el) return;
  if (!DataService.liveOn()) { el.innerHTML = '<p class="muted">เปิดโหมด Live ก่อน (ตั้งค่า) — screener ต้องใช้เน็ต</p>'; return; }
  try {
    const { rows, total, at, mode } = await tvScan();
    if (!$('#rkBody')) return;
    rankRowsCache = rows;
    const medal = ['🥇', '🥈', '🥉'];
    el.innerHTML = '<p class="muted small">เจอ ' + total + ' ตัวตามเงื่อนไข · โชว์ 20 อันดับแรก · สแกนเมื่อ ' + esc(at) + (mode === 'universe' ? ' · <span class="badge b-yellow">โหมดสำรอง: 56 หุ้นใหญ่ (POST โดนบล็อกเลยใช้ GET ตรง)</span>' : '') + ' · <span class="badge b-green">REAL DATA · TradingView</span></p>'
      + '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(330px,1fr))">'
      + rows.map((r, i) => {
        const chg = r.change, up = (chg || 0) >= 0;
        const sc = futureScore(r);
        const chip = (k, v) => '<span class="rk-chip"><b>' + k + '</b> ' + v + '</span>';
        return '<div class="card rk-card"><div class="rk-top"><span class="rk-rank">' + (medal[i] || (i + 1)) + '</span>' + rkLogo(r)
          + '<div style="flex:1;min-width:0"><b style="font-size:17px">' + esc(r.t) + '</b><div class="muted small">' + esc(r.description || '') + '</div></div>'
          + '<div style="text-align:right"><div class="num" style="font-weight:800;font-size:18px">' + fmt$(r.close) + '</div>'
          + '<div class="num small" style="color:' + (up ? 'var(--green)' : 'var(--red)') + '">' + (up ? '+' : '') + fmtN(chg, 2) + '%</div></div></div>'
          + '<div class="rk-verdict">💡 ' + esc(rankVerdict(r)) + '</div>'          + '<div class="rk-chips">'
          + chip('รายได้โต', r.total_revenue_yoy_growth_ttm != null ? '+' + fmtN(r.total_revenue_yoy_growth_ttm, 0) + '%' : 'N/A')
          + chip('กำไรโต', r.earnings_per_share_diluted_yoy_growth_ttm != null ? '+' + fmtN(r.earnings_per_share_diluted_yoy_growth_ttm, 0) + '%' : 'N/A')
          + chip('P/E', r.price_earnings_ttm > 0 ? fmtN(r.price_earnings_ttm, 1) : 'N/A')
          + chip('มาร์จิ้น', r.gross_margin_ttm != null ? fmtN(r.gross_margin_ttm, 0) + '%' : 'N/A')
          + chip('RSI', r.RSI != null ? fmtN(r.RSI, 0) : 'N/A')
          + chip('คะแนน', sc.score + '/100')
          + '</div>'
          + '<div class="row" style="margin-top:4px"><span class="badge b-blue">' + tvRating(r['Recommend.All']) + '</span><span style="margin-left:auto"></span>'
          + '<button class="btn ghost sm" data-rkexp="' + esc(r.t) + '">งบรายปี</button><button class="btn sm" data-rkfut="' + esc(r.t) + '">🔮 อนาคต</button></div>'
          + '<div id="rkx_' + esc(r.t) + '" style="display:none"><div class="muted small rkx-body" style="margin-top:10px">กดปุ่มเพื่อดูรายละเอียด…</div></div>'
          + '</div>';
      }).join('') + '</div>'
      + '<p class="muted small">% เติบโต = YoY จริง (TTM เทียบปีก่อน) · คะแนน = คัดกรองจากตัวเลข ไม่ใช่คำทำนาย · อันดับนี้ไม่ใช่คำแนะนำซื้อขาย</p>';
    $$('[data-rkexp]').forEach((b) => b.onclick = () => rkExpand(b.dataset.rkexp));
    $$('[data-rkfut]').forEach((b) => b.onclick = () => rkFuture(b.dataset.rkfut));
  } catch (e) {
    if ($('#rkBody')) el.innerHTML = '<p style="color:var(--red)">สแกนไม่ได้ (' + esc(e.message) + ') — เช็คเน็ตแล้วกด “🔄 สแกนใหม่” อีกครั้ง</p>';
  }
}
function rkLogo(r) {
  const id = r.logoid;
  const fb = '<span class="pf-logo" style="background:#3b82f6;display:none;width:36px;height:36px;font-size:11px">' + esc(String(r.t).slice(0, 3)) + '</span>';
  if (!id) return fb.replace('display:none', 'display:grid');
  return '<img class="pf-logo-img" style="width:36px;height:36px" src="https://s3-symbol-logo.tradingview.com/' + id + '--big.svg" alt="โลโก้ ' + esc(r.t) + '" loading="lazy" onerror="pfLogoFail(this)">' + fb;
}
const WIKI_TITLES = { NVDA: 'Nvidia', AVGO: 'Broadcom', MU: 'Micron_Technology', ASML: 'ASML', AMD: 'AMD', GOOGL: 'Google', AMZN: 'Amazon_(company)', COST: 'Costco', AAPL: 'Apple_Inc.', MSFT: 'Microsoft', META: 'Meta_Platforms', TSLA: 'Tesla,_Inc.', NFLX: 'Netflix', JPM: 'JPMorgan_Chase', V: 'Visa_Inc.', MA: 'Mastercard', WMT: 'Walmart', HD: 'Home_Depot', PG: 'Procter_&_Gamble', JNJ: 'Johnson_&_Johnson', XOM: 'ExxonMobil', CVX: 'Chevron_Corporation', UNH: 'UnitedHealth_Group', LLY: 'Eli_Lilly_and_Company', DIS: 'The_Walt_Disney_Company', NKE: 'Nike,_Inc.', ORCL: 'Oracle_Corporation', CRM: 'Salesforce', ADBE: 'Adobe_Inc.', INTC: 'Intel', QCOM: 'Qualcomm', AMAT: 'Applied_Materials', TXN: 'Texas_Instruments', CSCO: 'Cisco', ABBV: 'AbbVie', MRK: 'Merck_&_Co.', KO: 'Coca-Cola_Company', PEP: 'PepsiCo', MCD: "McDonald's", CAT: 'Caterpillar_Inc.', GE: 'GE_Aerospace', TMO: 'Thermo_Fisher_Scientific' };
async function wikiSummary(t) {
  if (!WIKI_TITLES[t]) return null;
  const cached = LiveCache.get('wiki_' + t, 7 * 864e5);
  if (cached) return cached;
  const j = await fetchJSON('https://en.wikipedia.org/api/rest_v1/page/summary/' + WIKI_TITLES[t], 10000);
  if (!j || !j.extract) return null;
  const out = { desc: j.description || '', extract: j.extract, url: (j.content_urls && j.content_urls.desktop && j.content_urls.desktop.page) || '' };
  LiveCache.set('wiki_' + t, out);
  return out;
}
async function fillWiki(t) {
  const el = $('#wikiBiz');
  if (!el || !WIKI_TITLES[t]) { if (el) el.innerHTML = ''; return; }
  try {
    const w = await wikiSummary(t);
    if (!$('#wikiBiz')) return;
    el.innerHTML = w ? '<p><b>ภาพรวมธุรกิจ (Wikipedia):</b> ' + esc(w.extract) + ' <a href="' + w.url + '" target="_blank" rel="noopener">อ่านต่อ →</a></p>' : '';
  } catch (_) { if ($('#wikiBiz')) el.innerHTML = ''; }
}
function rankVerdict(r) {
  const bits = [];
  if (r.total_revenue_yoy_growth_ttm != null && r.total_revenue_yoy_growth_ttm >= 20) bits.push('รายได้โตแรง +' + fmtN(r.total_revenue_yoy_growth_ttm, 0) + '%');
  if (r.earnings_per_share_diluted_yoy_growth_ttm != null && r.earnings_per_share_diluted_yoy_growth_ttm >= 20) bits.push('กำไรโต +' + fmtN(r.earnings_per_share_diluted_yoy_growth_ttm, 0) + '%');
  if (r.gross_margin_ttm != null && r.gross_margin_ttm >= 60) bits.push('มาร์จิ้นสูง ' + fmtN(r.gross_margin_ttm, 0) + '%');
  if (r.price_earnings_ttm > 0 && r.price_earnings_ttm < 15) bits.push('P/E ต่ำแค่ ' + fmtN(r.price_earnings_ttm, 1));
  if (r['Recommend.All'] >= 0.5) bits.push('นักวิเคราะห์เชียร์แรง');
  if (!bits.length) return 'หุ้นใหญ่พื้นฐานมั่นคง — ต้องเจาะงบก่อนตัดสินใจ';
  return bits.slice(0, 3).join(' · ');
}
async function rkExpand(t) {
  const row = $('#rkx_' + t);
  if (!row) return;
  const body = row.querySelector('.rkx-body');
  const open = row.style.display !== 'none';
  if (open && body.dataset.view === 'year') { row.style.display = 'none'; return; }
  row.style.display = '';
  body.dataset.view = 'year';
  if (!body) return;
  if (body.dataset.yearHTML) { body.innerHTML = body.dataset.yearHTML; return; }
  body.innerHTML = 'กำลังดึงข้อมูลงบ + ธุรกิจของ ' + esc(t) + '…';
  let biz = '';
  try { const w = await wikiSummary(t); if (w) biz = '<p><b>ธุรกิจคืออะไร (Wikipedia):</b> ' + (w.desc ? esc(w.desc) + ' — ' : '') + esc(w.extract.slice(0, 300)) + '… <a href="' + w.url + '" target="_blank" rel="noopener">อ่านต่อ →</a></p>'; } catch (_) {}
  try {
    const f = await getFundamentals(t);
    if (!f.revA.length) throw new Error('ไม่มีงบ SEC (อาจเป็น ETF/หุ้นต่างประเทศ)');
    const rows = f.revA.slice(-5).map((o, i, arr) => {
      const p = arr[i - 1];
      const y = p ? (((o.val - p.val) / Math.abs(p.val)) * 100) : null;
      return '<tr><td>' + esc(o.frame) + '</td><td class="num">' + secB(o.val) + '</td><td class="num" style="color:var(--green)">' + (y != null ? '+' + fmtN(y, 1) + '%' : '—') + '</td></tr>';
    }).join('');
    body.innerHTML = biz + '<b>รายได้รายปี ' + esc(t) + ' (SEC EDGAR, ตัวจริง)</b><div class="table-wrap"><table style="margin-top:6px"><thead><tr><th>ปีงบ</th><th>รายได้</th><th>โต YoY</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      + '<span class="small">' + (SEED[t] ? '<a href="#/stock/' + t + '">เปิดวิเคราะห์เต็ม →</a> · ' : '') + '<a href="https://th.tradingview.com/symbols/' + esc(t) + '/" target="_blank" rel="noopener">ดูบน TradingView →</a></span>';
    body.dataset.yearHTML = body.innerHTML;
  } catch (e) {
    body.innerHTML = '<span style="color:var(--red)">ดึงงบไม่ได้: ' + esc(e.message) + '</span>';
  }
}

let rankRowsCache = [];
function peerStats(rows) {
  const med = (a) => {
    const v = a.filter((x) => x != null && isFinite(x)).sort((x, y) => x - y);
    if (!v.length) return null;
    const m = v.length >> 1;
    return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
  };
  return {
    rev: med(rows.map((r) => r.total_revenue_yoy_growth_ttm)),
    eps: med(rows.map((r) => r.earnings_per_share_diluted_yoy_growth_ttm)),
    gm: med(rows.map((r) => r.gross_margin_ttm)),
    pe: med(rows.map((r) => (r.price_earnings_ttm > 0 ? r.price_earnings_ttm : null))),
    rsi: med(rows.map((r) => r.RSI)),
    rec: med(rows.map((r) => r['Recommend.All'])),
  };
}
/* คะแนนคัดกรอง 0–100 (โมเดลถ่วงน้ำหนัก ไม่ใช่คำทำนาย) */
function futureScore(r) {
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v == null || !isFinite(v) ? lo : v));
  const pRev = (cl(r.total_revenue_yoy_growth_ttm, 0, 200) / 200) * 40;
  const pEps = (cl(r.earnings_per_share_diluted_yoy_growth_ttm, -100, 200) + 100) / 300 * 20;
  const pGm = (cl(r.gross_margin_ttm, 0, 80) / 80) * 15;
  const pRec = ((cl(r['Recommend.All'], -1, 1) + 1) / 2) * 15;
  let pTech = 2;
  if (r.RSI != null) pTech = r.RSI >= 50 && r.RSI <= 65 ? 8 : (r.RSI >= 40 && r.RSI <= 70 ? 6 : 2);
  if (r.SMA200 != null && r.close != null && r.close > r.SMA200) pTech = Math.min(10, pTech + 2);
  const parts = [{ k: 'เติบโต (รายได้ 40)', v: pRev, max: 40 }, { k: 'กำไร (20)', v: pEps, max: 20 }, { k: 'มาร์จิ้น (15)', v: pGm, max: 15 }, { k: 'นักวิเคราะห์ (15)', v: pRec, max: 15 }, { k: 'เทคนิค (10)', v: pTech, max: 10 }];
  return { score: Math.round(pRev + pEps + pGm + pRec + pTech), parts };
}
function rankPos(rows, t, col, asc) {
  const vs = rows.map((r) => ({ t: r.t, v: r[col] })).filter((x) => x.v != null && isFinite(x.v));
  vs.sort((a, b) => asc ? a.v - b.v : b.v - a.v);
  const i = vs.findIndex((x) => x.t === t);
  return i < 0 ? '—' : (i + 1) + '/' + vs.length;
}
async function rkFuture(t) {
  const row = $('#rkx_' + t);
  if (!row) return;
  const body = row.querySelector('.rkx-body');
  if (row.style.display !== 'none' && body.dataset.view === 'future') { row.style.display = 'none'; return; }
  row.style.display = '';
  body.dataset.view = 'future';
  if (body.dataset.futureHTML) { body.innerHTML = body.dataset.futureHTML; return; }
  body.innerHTML = 'กำลังวิเคราะห์อนาคต ' + esc(t) + ' (ตัวเลข vs กลุ่ม + หลักฐานประจักษ์)…';
  try {
    const r = (rankRowsCache.find((x) => x.t === t)) || null;
    if (!r) throw new Error('ไม่เจอข้อมูลสแกน');
    const ps = peerStats(rankRowsCache.length ? rankRowsCache : [r]);
    const sc = futureScore(r);
    /* --- หลักฐานประจักษ์จาก SEC + filings --- */
    const ev = [];
    let sec = null, subs = null, biz = '';
    try { sec = await getFundamentals(t); } catch (_) {}
    try { subs = await getSubmissions(t); } catch (_) {}
    try { const w = await wikiSummary(t); if (w) biz = (w.desc ? w.desc + ' — ' : '') + w.extract.slice(0, 200) + '…'; } catch (_) {}
    if (sec && sec.revA.length > 1) {
      let streak = 0;
      for (let i = sec.revA.length - 1; i > 0; i--) {
        if (sec.revA[i].val > sec.revA[i - 1].val) streak++;
        else break;
      }
      if (streak >= 2) ev.push('📈 รายได้โตติดกัน <b>' + streak + ' ปีงบ</b> (SEC: ' + sec.revA.slice(-streak - 1).map((o) => esc(o.frame)).join(' → ') + ')');
      const yrs = sec.revA.slice(-4);
      const ms = yrs.map((o) => { const g = (sec.gpA || []).find((x) => x.frame === o.frame); return g && o.val ? (g.val / o.val) * 100 : null; }).filter((x) => x != null);
      if (ms.length >= 2 && ms[ms.length - 1] > ms[0] + 1) ev.push('📊 มาร์จิ้นขั้นต้นขยาย <b>' + fmtN(ms[0], 1) + '% → ' + fmtN(ms[ms.length - 1], 1) + '%</b>');
      if (sec.sharesTrend.length > 1) {
        const a0 = sec.sharesTrend[0], a1 = sec.sharesTrend[sec.sharesTrend.length - 1];
        const ch = ((a1.val - a0.val) / a0.val) * 100;
        if (ch < -1) ev.push('💰 จำนวนหุ้นลด <b>' + fmtN(Math.abs(ch), 1) + '%</b> (' + esc(a0.year) + '→' + esc(a1.year) + ') — ซื้อหุ้นคืน ดัน EPS');
      }
    }
    if (subs && subs.filings && subs.filings.recent) {
      const R = subs.filings.recent;
      const items = R.form.map((fm, i) => ({ fm, fd: R.filingDate[i] }));
      const lastE = items.find((x) => x.fm === '10-K' || x.fm === '10-Q');
      if (lastE) ev.push('📁 งบล่าสุด ' + lastE.fm + ' ยื่น <b>' + esc(lastE.fd) + '</b> (ข้อมูลสด ยืนยันตัวเลขได้)');
      const k8 = items.filter((x) => x.fm === '8-K' && new Date(x.fd) >= Date.now() - 90 * 864e5).length;
      if (k8) ev.push('⚡ มี 8-K <b>' + k8 + ' ฉบับใน 90 วัน</b> — บริษัทมีอีเวนต์ (ตัวเร่ง)');
      const f4 = items.filter((x) => (x.fm === '4' || x.fm === '4/A') && new Date(x.fd) >= Date.now() - 90 * 864e5).length;
      if (f4) ev.push('👔 insider ยื่น Form 4 <b>' + f4 + ' ฉบับใน 90 วัน</b> (เปิดดูว่า buy/sell)');
    }
    if (!ev.length) ev.push('หลักฐาน SEC ยังดึงไม่ได้ — ใช้ตัวเลขสแกนด้านล่างประกอบ');
    /* --- จุดเสี่ยงจากข้อมูล --- */
    const risks = [];
    if (r.RSI != null && r.RSI > 70) risks.push('RSI ' + fmtN(r.RSI, 0) + ' — ร้อนแรง เสี่ยงซื้อแพง');
    if (r.price_earnings_ttm > 0 && ps.pe != null && r.price_earnings_ttm > ps.pe * 2) risks.push('P/E ' + fmtN(r.price_earnings_ttm, 1) + ' สูงกว่ากลางกลุ่ม (' + fmtN(ps.pe, 1) + ') 2 เท่า');
    if ((r.total_revenue_yoy_growth_ttm || 0) > 0 && (r.earnings_per_share_diluted_yoy_growth_ttm || 0) < 0) risks.push('รายได้โตแต่กำไรหด — โตแบบไม่มีกำไร');
    if (r.SMA200 != null && r.close != null && r.close < r.SMA200) risks.push('ราคาหลุด SMA200 — เทรนด์หลักยังเป็นขาลง');
    if ((r['Recommend.All'] || 0) < 0) risks.push('มตินักวิเคราะห์เป็นลบ');
    /* --- ตารางเทียบกลุ่ม --- */
    const cmpRows = [
      ['รายได้โต YoY %', r.total_revenue_yoy_growth_ttm, ps.rev, false, 0],
      ['กำไรโต YoY %', r.earnings_per_share_diluted_yoy_growth_ttm, ps.eps, false, 0],
      ['มาร์จิ้นขั้นต้น %', r.gross_margin_ttm, ps.gm, false, 0],
      ['P/E', r.price_earnings_ttm > 0 ? r.price_earnings_ttm : null, ps.pe, true, 1],
      ['RSI', r.RSI, ps.rsi, false, 0],
      ['มตินักวิเคราะห์', r['Recommend.All'], ps.rec, false, 2],
    ];
    const colOf = { 'รายได้โต YoY %': 'total_revenue_yoy_growth_ttm', 'กำไรโต YoY %': 'earnings_per_share_diluted_yoy_growth_ttm', 'มาร์จิ้นขั้นต้น %': 'gross_margin_ttm', 'P/E': 'price_earnings_ttm', 'RSI': 'RSI', 'มตินักวิเคราะห์': 'Recommend.All' };
    body.innerHTML = '<div class="rk-verdict" style="font-size:14.5px">🔮 <b>สรุป:</b> ' + esc(rankVerdict(r)) + ' — คะแนน ' + sc.score + '/100 ' + (sc.score >= 70 ? '(องค์ประกอบครบ)' : sc.score >= 45 ? '(มีดีบางด้าน)' : '(ยังไม่เด่น)') + '</div>'
      + '<div class="grid g2" style="margin-top:10px"><div><h4>คะแนนแยกส่วน (เต็ม 100)</h4>'
      + sc.parts.map((x) => '<div class="small">' + esc(x.k) + ' <b class="num">' + fmtN(x.v, 1) + '/' + x.max + '</b><div style="background:var(--line);border-radius:6px;height:7px"><div style="width:' + Math.round((x.v / x.max) * 100) + '%;height:100%;border-radius:6px;background:linear-gradient(90deg,var(--blue),var(--cyan))"></div></div></div>').join('')
      + '</div><div><h4>👁 หลักฐานประจักษ์ (พิสูจน์ได้)</h4><p class="small">' + (biz ? '🏢 ' + esc(biz) + '<br>' : '') + ev.map((x) => '• ' + x).join('<br>') + '</p>'
      + (risks.length ? '<h4 style="color:var(--red)">⚠ อะไรทำให้ผิดทางได้</h4><p class="small">' + risks.map((x) => '• ' + esc(x)).join('<br>') + '</p>' : '<p class="small" style="color:var(--green)">✓ ไม่เจอสัญญาณเตือนจากข้อมูลชุดนี้</p>')
      + '</div></div>'
      + '<h4 class="muted small" style="margin-top:10px">A · เหตุผลตัวเลข — เทียบกลางกลุ่มที่สแกนได้ (' + rankRowsCache.length + ' ตัว)</h4>'
      + '<div class="table-wrap"><table><thead><tr><th>ตัวชี้วัด</th><th>' + esc(t) + '</th><th>กลางกลุ่ม</th><th>อันดับในกลุ่ม</th></tr></thead><tbody>'
      + cmpRows.map(([k, v, m, asc, d]) => '<tr><td>' + k + '</td><td class="num"><b>' + (v != null ? fmtN(v, d) : 'N/A') + '</b></td><td class="num">' + (m != null ? fmtN(m, d) : 'N/A') + '</td><td class="num">' + rankPos(rankRowsCache, t, colOf[k], asc) + '</td></tr>').join('')
      + '</tbody></table></div>'
      + '<p class="muted small">แนวโน้ม ≠ การันตี — ตัวเลขดีแค่เพิ่มโอกาส ไม่ได้รับประกันอนาคต ตัดสินใจจากงบ + valuation ของคุณเอง</p>';
    body.dataset.futureHTML = body.innerHTML;
  } catch (e) {
    body.innerHTML = '<span style="color:var(--red)">วิเคราะห์ไม่ได้: ' + esc(e.message) + '</span>';
  }
}

/* ---------------- COMPARE ------------------------------------------- */
let cmpSel = ['NVDA', 'AVGO', 'AMD', 'MU', 'ASML'];
let cmpMetric = 'revGrowth';
/* price-chart state (per stock page) */
let pchartRange = '1Y', pchartMA = true, pchartVol = false, pchartData = [], pchartLive = false, pchartT = '';
const PX_DAYS = { '1M': 22, '3M': 66, '6M': 132, '1Y': 260, '3Y': 780, '5Y': 1300, MAX: 1e9 };
function setPchart(rows, live) { pchartData = rows; pchartLive = live; redrawPchart(); }
function redrawPchart() {
  if (!$('#techC') || !pchartData.length) return;
  const n = PX_DAYS[pchartRange] || 260;
  const seg = pchartData.slice(-n);
  const closes = seg.map((r) => r.c);
  const series = [{ label: pchartT + (pchartLive ? ' (สดรายวัน)' : ' (จำลอง)'), data: closes, color: '#3b82f6', fill: true }];
  if (pchartMA) {
    series.push({ label: 'SMA50', data: sma(closes, 50), color: '#eab308', dash: true });
    series.push({ label: 'SMA200', data: sma(closes, 200), color: '#a78bfa', dash: true });
  }
  lineChart($('#techC'), series, { h: 220, lastLabels: true });
  const vv = $('#pxV');
  if (vv) {
    if (pchartVol && seg.some((r) => r.v > 0)) {
      vv.style.display = '';
      const sc = setupCanvas(vv, 70), ctx = sc[0], w = sc[1], h = sc[2];
      const mx = Math.max(...seg.map((r) => r.v || 0), 1);
      const bw = (w - 10) / seg.length;
      seg.forEach((r, i) => {
        const bh = ((r.v || 0) / mx) * (h - 8);
        ctx.fillStyle = 'rgba(59,130,246,.55)';
        ctx.fillRect(5 + i * bw, h - 4 - bh, Math.max(bw - 0.5, 1), bh);
      });
    } else vv.style.display = 'none';
  }
  const rr = rsi(closes)[closes.length - 1];
  const a200f = sma(closes, 200), last200 = a200f[a200f.length - 1];
  const a20f = sma(closes, 20), a50f = sma(closes, 50);
  const kv = $('#techKV');
  if (kv) kv.innerHTML = [['RSI(14)', rr == null ? 'N/A' : rr], ['แนวโน้ม vs SMA200', last200 == null ? 'N/A' : (closes[closes.length - 1] > last200 ? '<span style="color:var(--green)">เหนือเส้น (ขาขึ้น)</span>' : '<span style="color:var(--red)">หลุดเส้น (ขาลง)</span>')], ['SMA20/50/200', [a20f[a20f.length - 1], a50f[a50f.length - 1], last200].map((v) => v == null ? '—' : '$' + v).join(' / ')], ['สูงสุด / ต่ำสุดช่วงนี้', '$' + Math.max(...closes).toFixed(2) + ' / $' + Math.min(...closes).toFixed(2)], ['แนวรับ / แนวต้าน', '$' + Math.min(...closes.slice(-60)).toFixed(2) + ' / $' + Math.max(...closes.slice(-60)).toFixed(2)]].map((k) => '<div class="cell"><div class="k">' + k[0] + '</div><div class="v" style="font-size:15px">' + k[1] + '</div></div>').join('');
  const badge = $('#pxLiveBadge');
  if (badge) badge.style.display = pchartLive ? '' : 'none';
  const src = $('#pxSrc');
  if (src) src.textContent = pchartLive ? 'Stooq daily (REAL DATA)' : 'demo';
}
function renderCompare() {
  const metrics = [['revGrowth', 'รายได้โต %'], ['epsGrowth', 'กำไรโต %'], ['grossM', 'มาร์จิ้นขั้นต้น %'], ['opM', 'มาร์จิ้นดำเนินงาน %'], ['fcf', 'FCF $B'], ['roic', 'ROIC %'], ['pe', 'P/E'], ['fwdPE', 'P/E ล่วงหน้า'], ['mcap', 'มูลค่าตลาด $B'], ['debt', 'หนี้ $B'], ['cash', 'เงินสด $B']];
  view().innerHTML = '<div class="hero"><div><h1>โหมดเปรียบเทียบ</h1><p>เทียบข้างกันสูงสุด 5 ตัว ไม่จัดอันดับที่ 1/2/3 — แต่ละตัวชี้วัดมีบริบทของมัน ' + DEMO + '</p></div></div>'
    + '<div class="card"><h3>เลือกหุ้น (สูงสุด 5)</h3><div class="toolbar">' + TICKERS.map((t) => '<button class="chip-sel ' + (cmpSel.includes(t) ? 'on' : '') + '" data-cmp="' + t + '">' + t + '</button>').join('') + '</div>'
    + '<div class="row" style="margin-top:10px"><label class="fl">ตัวชี้วัดในกราฟ<select id="cmpMet" class="inline">' + metrics.map((m) => '<option value="' + m[0] + '"' + (cmpMetric === m[0] ? ' selected' : '') + '>' + m[1] + '</option>').join('') + '</select></label></div>'
    + '<canvas class="chart" id="cmpC" style="margin-top:10px"></canvas></div>'
    + '<div class="card sec"><div class="table-wrap"><table aria-label="ตารางเปรียบเทียบ"><thead><tr><th>ตัวชี้วัด</th>' + cmpSel.map((t) => '<th><a href="#/stock/' + t + '">' + t + '</a></th>').join('') + '</tr></thead><tbody>'
    + metrics.map((m) => '<tr><td>' + m[1] + '</td>' + cmpSel.map((t) => '<td class="num">' + fmtN(SEED[t][m[0]], m[0] === 'mcap' || m[0] === 'fcf' || m[0] === 'debt' || m[0] === 'cash' ? 1 : 1) + '</td>').join('') + '</tr>').join('')
    + '</tbody><tbody id="cmpLiveRow"><tr><td colspan="' + (cmpSel.length + 1) + '"><span class="muted">กำลังโหลดราคาสด…</span></td></tr></tbody></table></div>' + srcLine({ src: 'ชุดข้อมูลตั้งต้น (demo)' }) + '</div>';
  $$('[data-cmp]').forEach((b) => b.onclick = () => {
    const t = b.dataset.cmp;
    cmpSel = cmpSel.includes(t) ? cmpSel.filter((x) => x !== t) : cmpSel.length >= 5 ? (alert('สูงสุด 5 ตัว — เอาตัวหนึ่งออกก่อน'), cmpSel) : [...cmpSel, t];
    renderCompare();
  });
  $('#cmpMet').onchange = (e) => { cmpMetric = e.target.value; drawCmp(); };
  function drawCmp() {
    const vals = cmpSel.map((t) => SEED[t][cmpMetric]);
    bars($('#cmpC'), cmpSel, vals, '#3b82f6');
  }
  drawCmp();
  fillCompareLive();
}
async function fillCompareLive() {
  const tb = $('#cmpLiveRow');
  if (!tb) return;
  if (!DataService.liveOn()) { tb.innerHTML = ''; return; }
  try {
    const q = await getQuotesLive(cmpSel);
    const cells = await Promise.all(cmpSel.map(async (x) => {
      let pe = 'N/A';
      try { const f = await getFundamentals(x); if (q[x] && f.epsTTM && f.epsTTM.val > 0) pe = fmtN(q[x].close / f.epsTTM.val, 1); } catch (_) {}
      return { px: q[x] ? fmt$(q[x].close) : 'N/A', pe };
    }));
    if (!$('#cmpLiveRow')) return;
    tb.innerHTML = '<tr><td><b>ราคาสด (ดีเลย์)</b></td>' + cells.map((c) => '<td class="num">' + c.px + '</td>').join('') + '</tr>'
      + '<tr><td><b>P/E ย้อนหลังสด (คำนวณ)</b></td>' + cells.map((c) => '<td class="num">' + c.pe + '</td>').join('') + '</tr>';
  } catch (_) { if ($('#cmpLiveRow')) tb.innerHTML = '<tr><td colspan="' + (cmpSel.length + 1) + '" class="muted">ข้อมูลสดใช้ไม่ได้ชั่วคราว</td></tr>'; }
}

/* ---------------- VALUATION (DCF + PEG) ------------------------------ */
function renderValuation(pre) {
  const t = (pre && SEED[pre]) ? pre : 'NVDA';
  const s = SEED[t];
  view().innerHTML = '<div class="hero"><div><h1>เครื่องมือประเมินมูลค่า</h1><p>DCF เป็น<b>ข้อสมมติของโมเดล</b> ไม่ใช่ราคาที่แท้จริง แสดงสมมติฐานทุกตัว PEG เป็นค่าประมาณ ไม่ใช่มูลค่าที่แท้จริง</p></div>'
    + '<div class="toolbar"><label class="fl">หุ้น<select id="dcfT" class="inline">' + TICKERS.map((x) => '<option ' + (x === t ? 'selected' : '') + '>' + x + '</option>').join('') + '</select></label></div></div>'
    + '<div class="grid g2"><div class="card"><h3>คำนวณ DCF — ' + t + ' ' + DEMO + '</h3>'
    + [['revG', 'รายได้โต %/ปี', 18], ['opM', 'มาร์จิ้นดำเนินงาน %', s.opM], ['tax', 'ภาษี %', 15], ['wacc', 'WACC %', 9.5], ['termG', 'เติบโตปลายทาง %', 3], ['yrs', 'จำนวนปีคาดการณ์', 5], ['rev0', 'รายได้ตั้งต้น $B', s.rev5y[4]], ['shares', 'หุ้นทั้งหมด (พันล้าน)', +(s.mcap / s.price).toFixed(2)]].map((f) => '<label class="fl">' + f[1] + '<input type="number" id="dcf_' + f[0] + '" value="' + f[2] + '" step="any"></label>').join('')
    + '<div class="row" style="margin-top:10px"><button class="btn sm" id="dcfGo">คำนวณ</button></div><div id="dcfOut" style="margin-top:12px"></div></div>'
    + '<div class="card"><h3>คำนวณ PEG</h3><p class="muted small">PEG = P/E ล่วงหน้า ÷ กำไร/หุ้นโต ค่าประมาณเท่านั้น</p>'
    + '<label class="fl">P/E ล่วงหน้า<input type="number" id="pegPE" value="' + s.fwdPE + '" step="any"></label>'
    + '<label class="fl">กำไรโตที่คาด %<input type="number" id="pegG" value="' + s.epsGrowth + '" step="any"></label>'
    + '<div class="row" style="margin-top:10px"><button class="btn sm" id="pegGo">คำนวณ PEG</button></div><div id="pegOut" style="margin-top:12px"></div>'
    + '<div class="gauge" style="margin-top:14px"><div>ถูกเกินไป</div><div>เหมาะสม</div><div>ค่อนข้างแพง</div><div>แพงมาก</div></div><p class="muted small">อิงมูลค่าเชิงประวัติ/เชิงเปรียบเทียบ</p></div></div>'
    + '<div class="card sec"><h3>ตาราง multiple</h3><div class="table-wrap"><table><thead><tr><th>หุ้น</th><th>P/E</th><th>P/E ล่วงหน้า</th><th>PEG</th><th>P/S</th><th>EV/EBITDA</th><th>P/FCF</th><th>ยีลด์ FCF</th></tr></thead><tbody>'
    + TICKERS.map((x) => { const q = SEED[x]; return '<tr><td><a href="#/valuation/' + x + '"><b>' + x + '</b></a></td><td class="num">' + fmtN(q.pe) + '</td><td class="num">' + fmtN(q.fwdPE) + '</td><td class="num">' + fmtN(q.peg) + '</td><td class="num">' + fmtN(q.ps) + '</td><td class="num">' + fmtN(q.evEbitda) + '</td><td class="num">' + fmtN(q.pFCF) + '</td><td class="num">' + fmtN(q.fcfYield) + '%</td></tr>'; }).join('')
    + '</tbody></table></div><p class="muted small">ค่าเฉลี่ย 5Y/10Y และ sector: ' + NA + ' (ต้องต่อ provider เสริม)</p></div>';
  $('#dcfT').onchange = (e) => location.hash = '#/valuation/' + e.target.value;
  const calcDCF = () => {
    const g = +$('#dcf_revG').value / 100, m = +$('#dcf_opM').value / 100, tax = +$('#dcf_tax').value / 100, w = +$('#dcf_wacc').value / 100, tg = +$('#dcf_termG').value / 100, yrs = Math.min(Math.max(+$('#dcf_yrs').value || 5, 1), 15);
    let rev = +$('#dcf_rev0').value, sh = +$('#dcf_shares').value || 1, pv = 0; const rows = [];
    for (let y = 1; y <= yrs; y++) { rev = rev * (1 + g); const fcf = rev * m * (1 - tax); const d = fcf / Math.pow(1 + w, y); pv += d; rows.push([y, rev, fcf, d]); }
    const term = (rows[rows.length - 1][2] * (1 + tg)) / (w - tg); const pvT = term / Math.pow(1 + w, yrs);
    const ev = pv + pvT, fair = ev / sh;
    const mk = (adj) => { let r2 = +$('#dcf_rev0').value, p2 = 0; for (let y = 1; y <= yrs; y++) { r2 *= (1 + g * adj); const f = r2 * m * (1 - tax); p2 += f / Math.pow(1 + w, y); } const tv = (r2 * m * (1 - tax) * (1 + tg)) / (w - tg) / Math.pow(1 + w, yrs); return (p2 + tv) / sh; };
    $('#dcfOut').innerHTML = '<div class="kv"><div class="cell"><div class="k">มูลค่าเหมาะ (แย่)</div><div class="v">' + fmt$(mk(0.6)) + '</div></div><div class="cell"><div class="k">มูลค่าเหมาะ (ฐาน)</div><div class="v">' + fmt$(fair) + '</div></div><div class="cell"><div class="k">มูลค่าเหมาะ (ดี)</div><div class="v">' + fmt$(mk(1.3)) + '</div></div></div>'
      + '<div class="table-wrap"><table style="margin-top:10px"><thead><tr><th>ปี</th><th>รายได้</th><th>FCF</th><th>มูลค่าปัจจุบัน</th></tr></thead><tbody>' + rows.map((r) => '<tr><td>' + r[0] + '</td><td class="num">' + fmtB(r[1]) + '</td><td class="num">' + fmtB(r[2]) + '</td><td class="num">' + fmtB(r[3]) + '</td></tr>').join('') + '</tbody></table></div>'
      + '<p class="muted small"><span class="tag-assump">ข้อสมมติ</span>รายได้โต ' + (g * 100) + '% · มาร์จิ้นดำเนินงาน ' + (m * 100) + '% · ภาษี ' + (tax * 100) + '% · WACC ' + (w * 100) + '% · โตปลายทาง ' + (tg * 100) + '% · มูลค่ากิจการ ' + fmtB(ev) + ' · เทียบราคาปัจจุบัน ' + fmt$(s.price) + ' (จำลอง) ไม่ใช่เป้าราคา</p>';
  };
  $('#dcfGo').onclick = calcDCF; calcDCF();
  if (DataService.liveOn()) {
    getFundamentals(t).then((f) => {
      if (!$('#dcf_rev0')) return;
      const lr = f.revA.length ? f.revA[f.revA.length - 1] : null;
      if (lr) $('#dcf_rev0').value = (lr.val / 1e9).toFixed(1);
      if (f.shares) $('#dcf_shares').value = (f.shares.val / 1e9).toFixed(2);
      if (lr || f.shares) calcDCF();
    }).catch(() => {});
  }
  $('#pegGo').onclick = () => {
    const pe = +$('#pegPE').value, g = +$('#pegG').value;
    const peg = g ? pe / g : null;
    $('#pegOut').innerHTML = '<div class="cell kv"><div class="cell"><div class="k">PEG</div><div class="v">' + (peg == null ? 'N/A' : fmtN(peg, 2)) + '</div></div></div><p class="muted small">“PEG เป็นค่าประมาณ ไม่ใช่มูลค่าที่แท้จริงของธุรกิจ”</p>';
  };
}

/* ---------------- INDUSTRY ------------------------------------------ */
const SC_MAP = [
  { layer: 'GPU', co: 'NVIDIA', t: 'NVDA', note: 'AI accelerator + CUDA' },
  { layer: 'ASIC', co: 'Broadcom', t: 'AVGO', note: 'Custom XPU + networking' },
  { layer: 'CPU / Accelerator', co: 'AMD', t: 'AMD', note: 'EPYC + Instinct' },
  { layer: 'Memory', co: 'Micron', t: 'MU', note: 'DRAM + HBM' },
  { layer: 'Foundry', co: 'TSMC', t: null, url: 'https://th.tradingview.com/symbols/NYSE-TSM/', note: 'ผลิตชิป (เปิดบน TradingView)' },
  { layer: 'Lithography', co: 'ASML', t: 'ASML', note: 'EUV เจ้าเดียวในโลก' },
  { layer: 'Equipment', co: 'Applied Materials', t: null, url: 'https://th.tradingview.com/symbols/NASDAQ-AMAT/', note: 'อุปกรณ์ผลิตชิป (เปิดบน TradingView)' },
];
function scMapHTML() {
  return '<div class="card sec"><div class="sec-head"><h3>🗺 Semiconductor AI Map — กด node เพื่อเปิดรายละเอียด</h3>' + DEMO + '</div>'
    + '<div class="scmap"><div class="sc-root">AI</div><div class="sc-branch">'
    + SC_MAP.map((n) => {
      const link = n.t ? '#/stock/' + n.t : n.url;
      const ext = n.t ? '' : ' target="_blank" rel="noopener"';
      return '<a class="sc-node" href="' + link + '"' + ext + '><span class="sc-layer">' + esc(n.layer) + '</span><b>' + esc(n.co) + (n.t ? ' · ' + n.t : ' ↗') + '</b><span class="muted small">' + esc(n.note) + '</span></a>';
    }).join('') + '</div></div>'
    + '<p class="muted small">ห่วงโซ่: ออกแบบ (NVDA/AVGO/AMD) → ผลิต (TSMC) ด้วยเครื่อง EUV (ASML) + อุปกรณ์ (AMAT) → หน่วยความจำ HBM (MU) ประกอบเป็น AI server</p></div>';
}
function renderIndustry() {
  const groups = [
    ['เซมิคอนดักเตอร์ — AI Compute', 'TAM ~$300B ปี 2030 (demo) · โต ~15%/ปี', ['NVDA', 'AMD', 'AVGO']],
    ['เมมโมรี — DRAM/NAND + HBM', 'TAM ~$200B · วัฏจักร + แรงหนุน AI', ['MU']],
    ['ลิโทกราฟี — ผูกขาด EUV', 'TAM ~$40B เครื่องจักร · วัฏจักร High-NA', ['ASML']],
    ['คลาวด์ — AWS / Azure / GCP', 'TAM ~$1T+ · โต ~17%/ปี', ['GOOGL', 'AMZN']],
  ];
  view().innerHTML = '<div class="hero"><div><h1>อุตสาหกรรมและ TAM</h1><p>แต่ละบริษัทอยู่ตรงไหน ตลาดใหญ่แค่ไหน ใครแข่งบ้าง ' + DEMO + '</p></div></div>'
    + scMapHTML()
    + groups.map((g) => '<div class="card sec"><div class="sec-head"><h3>' + esc(g[0]) + '</h3><span class="badge b-blue">' + esc(g[1]) + '</span></div><div class="stock-grid">'
      + g[2].map(cardHTML).join('') + '</div></div>').join('')
    + '<div class="card sec"><h3>แผนที่คู่แข่ง</h3><div class="table-wrap"><table><thead><tr><th>สนาม</th><th>ผู้เล่น</th></tr></thead><tbody>'
    + [['AI GPU', 'NVIDIA · AMD · Broadcom (XPU) · Intel'], ['เมมโมรี', 'Micron · SK Hynix · Samsung'], ['ลิโทกราฟี', 'ASML (EUV เจ้าเดียว)'], ['คลาวด์', 'AWS · Azure · Google Cloud']].map((r) => '<tr><td>' + r[0] + '</td><td style="text-align:left">' + r[1] + '</td></tr>').join('')
    + '</tbody></table></div></div>';
  paintSparks();
  fillLivePrices(); $$('[data-watch]').forEach((b) => b.onclick = (e) => { e.preventDefault(); e.stopPropagation(); toggleWatch(b.dataset.watch); });
}

/* ---------------- TOOLS (DCA + Portfolio) ---------------------------- */
function renderTools() {
  view().innerHTML = '<div class="hero"><div><h1>จำลองลงทุน</h1><p>เครื่องจำลอง DCA · ดอกเบี้ยทบต้น · พอร์ต จำลองเท่านั้น — ไม่รับประกันผลตอบแทน</p></div></div>'
    + '<div class="card sec"><h3>📈 ดอกเบี้ยทบต้น (Compound)</h3>'
    + '<div class="grid g4">'
    + '<label class="fl">เงินตั้งต้น (USD)<input type="number" id="cpI" value="10000"></label>'
    + '<label class="fl">ลงทุนเพิ่ม/เดือน (USD)<input type="number" id="cpM" value="500"></label>'
    + '<label class="fl">ผลตอบแทน %/ปี<input type="number" id="cpR" value="10" step="any"></label>'
    + '<label class="fl">ทบต้น<select id="cpF" class="inline"><option value="12">รายเดือน</option><option value="1">รายปี</option></select></label></div>'
    + '<div class="row" style="margin-top:10px"><button class="btn sm" id="cpGo">คำนวณ</button></div><div id="cpOut" style="margin-top:10px"></div>'
    + '<p class="muted small">Scenario simulation only. Not investment advice. ผลตอบแทนในอดีตไม่รับประกันอนาคต</p></div>'
    + '<div class="grid g2"><div class="card"><h3>คำนวณ DCA</h3>'
    + '<div class="row" style="margin-bottom:10px"><label class="fl">สกุลเงิน<select id="dcaC" class="inline"><option value="THB">฿ บาท (THB)</option><option value="USD">$ ดอลลาร์ (USD)</option></select></label><span class="muted small" id="fxNote">กำลังดึงเรท USD→THB จริง…</span></div>'
    + [['dcaM', 'ลงทุนรายเดือน', 10000], ['dcaI', 'เงินตั้งต้น', 50000], ['dcaY', 'จำนวนปี', 10], ['dcaR', 'ผลตอบแทนคาดหวัง %/ปี', 8]].map((f) => '<label class="fl">' + f[1] + '<input type="number" id="' + f[0] + '" value="' + f[2] + '"></label>').join('')
    + '<div class="row" style="margin-top:10px"><button class="btn sm" id="dcaGo">จำลอง</button></div><div id="dcaOut" style="margin-top:10px"></div></div>'
    + '<div class="card"><h3>จำลองพอร์ต</h3><p class="muted small">ใส่น้ำหนัก % (รวมต้องได้ 100)</p><div id="pfRows">'
    + TICKERS.map((t) => '<label class="fl">' + t + ' %<input type="number" class="pfW" data-t="' + t + '" value="' + ({ NVDA: 20, AVGO: 20, MU: 10, ASML: 15, AMD: 10, GOOGL: 15, AMZN: 10 }[t] || 0) + '"></label>').join('')
    + '</div><div class="row" style="margin-top:10px"><button class="btn sm" id="pfGo">จำลองพอร์ต</button></div><div id="pfOut" style="margin-top:10px"></div></div></div>';
  let fxRate = 0, fxNote = '';
  const dcaFmt = (v) => $('#dcaC').value === 'THB' ? '฿' + Math.round(v).toLocaleString('th-TH') : fmt$(v, 0);
  const dca = () => {
    const m = +$('#dcaM').value || 0, init = +$('#dcaI').value || 0, yrs = Math.min(+$('#dcaY').value || 10, 40);
    const scen = [5, 8, 10, 12];
    const val = (r) => { const i = r / 100 / 12, n = yrs * 12; return init * Math.pow(1 + r / 100, yrs) + (i ? m * ((Math.pow(1 + i, n) - 1) / i) : m * n); };
    const contrib = init + m * yrs * 12;
    const base8 = val(8);
    const y0 = new Date().getFullYear();
    const r0 = +$('#dcaR').value || 8;
    let bal = init;
    const yrRows = [];
    for (let y = 1; y <= yrs; y++) {
      for (let mo = 0; mo < 12; mo++) bal = bal * (1 + (r0 / 100) / 12) + m;
      yrRows.push('<tr><td>ปีที่ ' + y + ' <span class="muted small">(ค.ศ. ' + (y0 + y) + ')</span></td><td class="num">' + dcaFmt(init + m * 12 * y) + '</td><td class="num">' + dcaFmt(bal) + '</td></tr>');
    }
    const eq = $('#dcaC').value === 'THB' && fxRate ? '<p class="muted small">กรณี 8% ≈ $' + Math.round(base8 / fxRate).toLocaleString('en-US') + ' (' + esc(fxNote) + ')</p>' : (fxRate ? '<p class="muted small">' + esc(fxNote) + '</p>' : '');
    $('#dcaOut').innerHTML = '<p><b>ระยะเวลา ' + yrs + ' ปี</b> <span class="muted">ค.ศ. ' + y0 + ' → ' + (y0 + yrs) + ' · เงินต้นรวม ' + dcaFmt(contrib) + '</span></p>'
      + '<div class="table-wrap"><table><thead><tr><th>กรณี</th><th>เงินต้น</th><th>มูลค่าประมาณ</th><th>กำไรประมาณ</th></tr></thead><tbody>'
      + scen.map((r) => { const v = val(r); return '<tr><td>' + r + '%</td><td class="num">' + dcaFmt(contrib) + '</td><td class="num">' + dcaFmt(v) + '</td><td class="num">' + dcaFmt(v - contrib) + '</td></tr>'; }).join('')
      + '</tbody></table></div>' + eq
      + '<h4 class="muted small" style="margin:12px 0 6px">รายปี (ตามผลตอบแทน ' + r0 + '%/ปี ที่กรอก)</h4>'
      + '<div class="table-wrap"><table><thead><tr><th>ปี</th><th>เงินต้นสะสม</th><th>มูลค่าประมาณ</th></tr></thead><tbody>' + yrRows.join('') + '</tbody></table></div>'
      + '<p class="muted small"><b>จำลองเท่านั้น</b> — ไม่รับประกันผลตอบแทน</p>';
  };
  $('#dcaGo').onclick = dca;
  $('#dcaC').onchange = () => { try { localStorage.setItem('asrt_dca_cur', $('#dcaC').value); } catch (_) {} dca(); };
  try { $('#dcaC').value = localStorage.getItem('asrt_dca_cur') || 'THB'; } catch (_) {}
  dca();
  const cp = () => {
    const init = +$('#cpI').value || 0, m = +$('#cpM').value || 0, r = (+$('#cpR').value || 0) / 100, f = +$('#cpF').value || 12;
    const miles = [1, 5, 10, 20, 30];
    const balAt = (y) => {
      const n = y * 12;
      let b = init;
      for (let mo = 0; mo < n; mo++) { b = b * (1 + r / 12) + m; }
      void f;
      return b;
    };
    const rows = miles.map((y) => {
      const principal = init + m * 12 * y, total = balAt(y);
      return { y, principal, total, growth: total - principal };
    });
    $('#cpOut').innerHTML = '<div class="table-wrap"><table><thead><tr><th>ปี</th><th>เงินต้นสะสม</th><th>ดอกผลทบต้น</th><th>มูลค่ารวม</th></tr></thead><tbody>'
      + rows.map((o) => '<tr><td>' + o.y + 'Y</td><td class="num">' + fmt$(o.principal, 0) + '</td><td class="num" style="color:var(--green)">' + fmt$(o.growth, 0) + '</td><td class="num"><b>' + fmt$(o.total, 0) + '</b></td></tr>').join('')
      + '</tbody></table></div><canvas class="chart" id="cpC" style="margin-top:10px"></canvas>'
      + '<p class="muted small"><span class="tag-calc">สูตร</span>ทบต้นรายเดือน: ยอด × (1+r/12) + เงินรายเดือน ทุกเดือน · เส้นน้ำเงิน = เงินต้นสะสม · เส้นเขียว = มูลค่ารวม</p>';
    lineChart($('#cpC'), [
      { label: 'เงินต้น', data: rows.map((o) => +o.principal.toFixed(0)), color: '#3b82f6' },
      { label: 'มูลค่ารวม', data: rows.map((o) => +o.total.toFixed(0)), color: '#22c55e', fill: true },
    ], { h: 200, lastLabels: true });
  };
  $('#cpGo').onclick = cp; $('#cpF').onchange = cp; cp();
  (async () => {
    try {
      const j = await fetchJSON('https://api.frankfurter.app/latest?from=USD&to=THB', 8000);
      if (j && j.rates && j.rates.THB) { fxRate = j.rates.THB; fxNote = 'เรทจริง ' + fmtN(fxRate, 2) + ' ฿/USD (' + j.date + ')'; }
      else throw new Error('no rate');
    } catch (_) { fxRate = 35; fxNote = 'เรทประมาณ 35 ฿/USD (ดึงเรทจริงไม่ได้)'; }
    const el = $('#fxNote');
    if (el) el.textContent = fxNote;
    if ($('#dcaOut')) dca();
  })();
  const pf = () => {
    const ws = $$('.pfW').map((i) => ({ t: i.dataset.t, w: +i.value || 0 }));
    const sum = ws.reduce((a, x) => a + x.w, 0);
    if (Math.abs(sum - 100) > 0.01) { $('#pfOut').innerHTML = '<p style="color:var(--red);font-weight:700">น้ำหนักรวมได้ ' + sum + '% — ต้องเท่ากับ 100%</p>'; return; }
    const vol = ws.reduce((a, x) => a + (x.w / 100) * SEED[x.t].vol, 0);
    const sectors = {}; ws.forEach((x) => { const s = SEED[x.t].sector; sectors[s] = (sectors[s] || 0) + x.w; });
    const top = ws.reduce((a, b) => a.w > b.w ? a : b);
    $('#pfOut').innerHTML = '<div class="kv"><div class="cell"><div class="k">ความผันผวนประมาณ</div><div class="v">~' + fmtN(vol, 1) + '%</div></div><div class="cell"><div class="k">กระจุกตัว</div><div class="v" style="font-size:14px">มากสุด: ' + top.t + ' ' + top.w + '%</div></div><div class="cell"><div class="k">สัดส่วน sector</div><div class="v" style="font-size:13px">' + Object.entries(sectors).map((e) => e[0] + ' ' + e[1] + '%').join(' · ') + '</div></div></div>'
      + '<canvas class="chart" id="pfC" style="margin-top:10px"></canvas>'
      + (top.w > 35 ? '<p style="color:var(--orange);font-weight:700">⚠ หุ้นตัวเดียวเกิน 35%</p>' : '<p class="muted small">กระจายน้ำหนักดูโอเค (โมเดลความเสี่ยง demo)</p>');
    donut($('#pfC'), ws.filter((x) => x.w > 0).map((x) => [x.t, x.w]));
  };
  $('#pfGo').onclick = pf; pf();
}

/* ---------------- BACKTEST LAB (monthly DCA on REAL Stooq history) -----
   Strategy: invest fixed USD at each month-end close. Metrics from the
   resulting portfolio-value series. No fake fills — if history is missing
   the asset is skipped with a reason. Past ≠ future. -------------------- */
const BT_ASSETS = ['NVDA', 'AVGO', 'MU', 'ASML', 'AMD', 'VOO', 'BTC'];
let btSel = ['NVDA', 'AVGO', 'MU', 'ASML', 'AMD'];
async function getMonthly(t) {
  const key = 'monthly_' + t;
  const cached = LiveCache.get(key, 36e5);
  if (cached) return cached;
  const sym = STOOQ_SYM[t];
  if (!sym) throw new Error('No symbol for ' + t);
  const txt = await fetchText('https://stooq.com/q/d/l/?s=' + sym + '&i=m', 15000);
  const rows = txt.trim().split('\n').slice(1)
    .map((ln) => { const p = ln.split(','); return { d: p[0], c: +p[4] }; })
    .filter((r) => r.c > 0 && /^\d{4}-/.test(r.d || ''));
  if (rows.length < 24) throw new Error('History too short for ' + t);
  LiveCache.set(key, rows);
  return rows;
}
function btRun(rows, monthly, initial) {
  let shares = initial > 0 ? initial / rows[0].c : 0;
  const vals = [];
  rows.forEach((r, i) => {
    if (i > 0) shares += monthly / r.c;
    vals.push({ d: r.d, v: shares * r.c });
  });
  const contrib = initial + monthly * (rows.length - 1);
  const final = vals[vals.length - 1].v;
  const yrs = Math.max((new Date(rows[rows.length - 1].d) - new Date(rows[0].d)) / 31557600000, 1 / 12);
  const totRet = ((final - contrib) / contrib) * 100;
  const cagr = (Math.pow(final / Math.max(contrib, 1), 1 / yrs) - 1) * 100;
  const mdd = maxDD(vals.map((x) => x.v));
  const rets = vals.slice(1).map((x, i) => (x.v - vals[i].v) / vals[i].v);
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const vol = Math.sqrt(rets.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / rets.length) * Math.sqrt(12) * 100;
  const byYear = {};
  vals.forEach((x) => { const y = x.d.slice(0, 4); if (!byYear[y]) byYear[y] = []; byYear[y].push(x.v); });
  const yrets = Object.keys(byYear).map((y) => ({ y, r: ((byYear[y][byYear[y].length - 1] - byYear[y][0]) / byYear[y][0]) * 100 }));
  yrets.sort((a, b) => a.r - b.r);
  return { final, contrib, totRet, cagr, mdd, vol, vals, best: yrets[yrets.length - 1], worst: yrets[0], from: rows[0].d, to: rows[rows.length - 1].d };
}
function renderBacktest() {
  view().innerHTML = '<div class="hero"><div><h1>◉ Backtest Lab</h1><p>กลยุทธ์ Monthly DCA บน<b>ราคาจริงรายเดือน (Stooq)</b> — ผลอดีตไม่รับประกันอนาคต จำลองเท่านั้น ไม่ใช่คำแนะนำลงทุน</p></div>'
    + '<div class="toolbar"><button class="btn sm" id="btGo">▶ รันแบ็กเทสต์</button><span class="muted small" id="btMsg"></span></div></div>'
    + '<div class="card"><h3>ตั้งค่ากลยุทธ์</h3><div class="toolbar">'
    + BT_ASSETS.map((t) => '<button class="chip-sel ' + (btSel.includes(t) ? 'on' : '') + '" data-bt="' + t + '">' + t + (t === 'VOO' ? ' (ดัชนี)' : t === 'BTC' ? ' (คริปโต)' : '') + '</button>').join('') + '</div>'
    + '<div class="grid g3" style="margin-top:10px">'
    + '<label class="fl">เงินตั้งต้น (USD)<input type="number" id="btI" value="3000"></label>'
    + '<label class="fl">DCA รายเดือน (USD)<input type="number" id="btM" value="200"></label>'
    + '<label class="fl">ย้อนหลัง<select id="btY" class="inline"><option value="5">5 ปี</option><option value="10" selected>10 ปี</option></select></label></div></div>'
    + '<div class="card sec"><div id="btOut"><p class="muted">เลือกสินทรัพย์แล้วกด “▶ รันแบ็กเทสต์” — ระบบจะดึงราคาย้อนหลังจริงแล้วคำนวณ</p></div></div>';
  $$('[data-bt]').forEach((b) => b.onclick = () => {
    const t = b.dataset.bt;
    btSel = btSel.includes(t) ? btSel.filter((x) => x !== t) : [...btSel, t];
    renderBacktest();
  });
  $('#btGo').onclick = fillBacktest;
}
async function fillBacktest() {
  const out = $('#btOut'), msg = $('#btMsg');
  if (!out) return;
  if (!DataService.liveOn()) { out.innerHTML = '<p class="muted">เปิดโหมด Live ก่อน (ตั้งค่า) — แบ็กเทสต์ต้องใช้ราคาจริง</p>'; return; }
  if (!btSel.length) { out.innerHTML = '<p style="color:var(--red)">เลือกสินทรัพย์อย่างน้อย 1 ตัว</p>'; return; }
  const monthly = +$('#btM').value || 0, initial = +$('#btI').value || 0, yrs = +$('#btY').value || 10;
  out.innerHTML = '<p class="muted">กำลังดึงราคาย้อนหลังจริง ' + btSel.join(' · ') + '…</p>';
  if (msg) msg.textContent = 'กำลังคำนวณ…';
  const results = [];
  for (const t of btSel) {
    try {
      const rows = (await getMonthly(t)).slice(-(yrs * 12 + 1));
      if (rows.length < 24) throw new Error('history too short');
      results.push({ t, ok: true, r: btRun(rows, monthly, initial) });
    } catch (e) { results.push({ t, ok: false, err: e.message }); }
  }
  if (!$('#btOut')) return;
  const good = results.filter((x) => x.ok);
  if (!good.length) { out.innerHTML = '<p style="color:var(--red)">ดึงข้อมูลไม่ได้เลย (' + esc(results[0].err || 'network') + ') — เช็คเน็ตแล้วลองใหม่ ข้อมูลเก่าจะไม่ถูกเอามาหลอกว่าเป็นของจริง</p>'; if (msg) msg.textContent = ''; return; }
  const cols = ['#3b82f6', '#22d3ee', '#a78bfa', '#22c55e', '#eab308', '#f97316', '#f87171'];
  out.innerHTML = '<p class="muted small">งวด ' + esc(good[0].r.from) + ' → ' + esc(good[0].r.to) + ' · เงินต้นรวมต่อสินทรัพย์ $' + Math.round(good[0].r.contrib).toLocaleString('en-US') + ' · <span class="badge b-green">REAL DATA · Stooq monthly</span></p>'
    + '<div class="table-wrap"><table><thead><tr><th>สินทรัพย์</th><th>มูลค่าสุดท้าย</th><th>Total Return</th><th>CAGR</th><th>Max Drawdown</th><th>Vol (ann.)</th><th>ปีดีสุด</th><th>ปีแย่สุด</th></tr></thead><tbody>'
    + results.map((x) => x.ok
      ? '<tr><td><b>' + x.t + '</b></td><td class="num">' + fmt$(x.r.final, 0) + '</td><td class="num" style="color:' + (x.r.totRet >= 0 ? 'var(--green)' : 'var(--red)') + '">' + fmtPct(x.r.totRet) + '</td><td class="num">' + fmtPct(x.r.cagr) + '</td><td class="num" style="color:var(--red)">' + fmtN(x.r.mdd, 1) + '%</td><td class="num">' + fmtN(x.r.vol, 1) + '%</td><td class="num">' + x.r.best.y + ' (' + fmtPct(x.r.best.r, 0) + ')</td><td class="num">' + x.r.worst.y + ' (' + fmtPct(x.r.worst.r, 0) + ')</td></tr>'
      : '<tr><td><b>' + x.t + '</b></td><td colspan="7" style="color:var(--red)">ข้อมูลยังไม่พอ (' + esc(x.err) + ')</td></tr>').join('')
    + '</tbody></table></div><canvas class="chart" id="btC" style="margin-top:12px"></canvas>'
    + '<p class="muted small"><span class="tag-calc">วิธีคำนวณ</span>ซื้อทุกสิ้นเดือนที่ราคาปิดจริง · CAGR = (final/contrib)^(1/years)−1 · MDD = จุดตกสูงสุดของมูลค่าพอร์ต · Vol = SD รายเดือน × √12 · <b>ผลอดีตไม่การันตีอนาคต · Scenario simulation only. Not investment advice.</b></p>';
  try {
    lineChart($('#btC'), good.map((x, i) => ({ label: x.t, data: x.r.vals.map((v) => +v.v.toFixed(0)), color: cols[i % cols.length] })), { h: 220, lastLabels: true });
  } catch (_) {}
  if (msg) msg.textContent = 'เสร็จ ' + new Date().toLocaleTimeString('th-TH');
}

/* ---------------- JOURNAL ------------------------------------------- */
function renderJournal() {
  const t0 = TICKERS[0];
  view().innerHTML = '<div class="hero"><div><h1>บันทึกการลงทุน</h1><p>เขียนสมมติฐาน<i>ก่อน</i>ราคาขยับ เก็บในเครื่อง ย้ายไป Supabase ได้ด้วยโครงเดียวกัน</p></div></div>'
    + '<div class="card"><h3>รายการใหม่</h3><div class="grid g4">'
    + '<label class="fl">วันที่<input type="text" id="jD" value="' + new Date().toISOString().slice(0, 10) + '"></label>'
    + '<label class="fl">หุ้น<select id="jT">' + TICKERS.map((t) => '<option>' + t + '</option>').join('') + '</select></label>'
    + '<label class="fl">ราคา<input type="number" id="jP" value="' + SEED[t0].price + '"></label>'
    + '<label class="fl">เหตุผล<input type="text" id="jR" placeholder="เช่น งบออก เช็กสมมติฐาน"></label></div>'
    + '<label class="fl" style="margin-top:10px">สมมติฐาน<textarea id="jTh" rows="3"></textarea></label>'
    + '<div class="row" style="margin-top:10px"><button class="btn sm" id="jAdd">เพิ่มรายการ</button></div></div>'
    + '<div class="card sec"><h3>ประวัติ (' + journal.length + ')</h3><div class="table-wrap"><table><thead><tr><th>วันที่</th><th>หุ้น</th><th>เหตุผล</th><th>ราคา</th><th>สมมติฐาน</th><th></th></tr></thead><tbody>'
    + (journal.map((j, i) => '<tr><td>' + esc(j.d) + '</td><td><b>' + esc(j.t) + '</b></td><td style="text-align:left">' + esc(j.r) + '</td><td class="num">' + fmt$(j.p) + '</td><td style="text-align:left;white-space:normal">' + esc(j.th) + '</td><td><button class="btn ghost sm" data-del="' + i + '">ลบ</button></td></tr>').join('') || '<tr><td colspan="6" class="muted">ยังไม่มีรายการ</td></tr>')
    + '</tbody></table></div></div>';
  $('#jAdd').onclick = () => { journal.unshift({ d: $('#jD').value, t: $('#jT').value, p: +$('#jP').value, r: $('#jR').value, th: $('#jTh').value }); store.set('asrt_journal', journal); renderJournal(); };
  $$('[data-del]').forEach((b) => b.onclick = () => { journal.splice(+b.dataset.del, 1); store.set('asrt_journal', journal); renderJournal(); });
}

/* ---------------- NEWS ---------------------------------------------- */
function newsInterp(n) {
  const names = n.tick.filter((x) => x !== 'ALL').map((x) => (SEED[x] ? x + ' (' + SEED[x].industry + ')' : x)).join(' · ');
  return '<span class="tag-interp">AI ตีความ</span><span class="small">ข่าวนี้เกี่ยวกับ <b>' + esc(names || 'ภาพรวมตลาด') + '</b> — '
    + 'สิ่งที่ควรตามต่อคือ (1) รายได้/มาร์จิ้นในงบ 10-Q งวดถัดไปยืนยันเทรนด์นี้ไหม (2) งบลงทุน (capex) ของลูกค้ากลุ่ม hyperscaler (3) เหตุการณ์ 8-K ใหม่ๆ '
    + 'ข่าวเป็น Tier-3 (บริบท) ไม่แทนงบการเงิน ตัดสินใจจาก SEC filings + valuation ของคุณเอง</span>';
}
function renderNews() {
  view().innerHTML = '<div class="hero"><div><h1>ข่าว — บริบท ไม่ใช่งบการเงิน</h1><p>ข่าว Tier-3 (Reuters · Bloomberg · CNBC · FT · WSJ) ให้แค่บริบทประกอบเท่านั้น แยก <span class="tag-fact">ข้อเท็จจริง</span> กับ <span class="tag-interp">AI ตีความ</span> ชัดเจน</p></div></div>'
    + '<div class="grid g2">' + NEWS.map((n, i) => '<div class="card"><span class="badge b-gray">' + esc(n.src) + ' · ' + esc(n.date) + '</span><h3 style="margin-top:8px">' + esc(n.title) + '</h3>'
      + '<p class="muted small"><span class="tag-fact">FACT</span>' + esc(n.body) + '</p>'
      + '<div id="ni_' + i + '" style="display:none;margin-top:6px">' + newsInterp(n) + '</div>'
      + '<div class="row" style="margin-top:8px"><button class="btn ghost sm" data-news="' + i + '">🤖 สรุปโดย AI</button></div>'
      + '<p class="small">เกี่ยวข้อง: ' + n.tick.map((x) => x === 'ALL' ? 'ALL' : '<a href="#/stock/' + x + '">' + x + '</a>').join(' · ') + '</p></div>').join('') + '</div>';
  $$('[data-news]').forEach((b) => b.onclick = () => {
    const el = $('#ni_' + b.dataset.news);
    if (el) { const open = el.style.display !== 'none'; el.style.display = open ? 'none' : ''; b.textContent = open ? '🤖 สรุปโดย AI' : 'ซ่อนสรุป'; }
  });
}

/* ---------------- SETTINGS ------------------------------------------ */
function renderSettings() {
  const dark = document.documentElement.dataset.theme !== 'light';
  view().innerHTML = '<div class="hero"><div><h1>ตั้งค่า</h1><p>ตั้งค่าผู้ให้บริการข้อมูล ธีม และการจัดการข้อมูล</p></div></div>'
    + '<div class="grid g2"><div class="card"><h3>ผู้ให้บริการข้อมูลตลาด</h3>'
    + '<label class="fl">ผู้ให้บริการ<select id="sProv"><option value="live">Live — TradingView + Stooq (ราคา) + SEC EDGAR (งบ) · แนะนำ</option><option value="demo">Demo (ตัวเลขจำลองในตัว)</option><option value="custom">Custom API (อนาคต)</option></select></label>'
    + '<label class="fl" style="margin-top:10px">API base URL<input type="text" id="sBase" placeholder="https://api.example.com  (ดู .env.example)" value="' + esc(DataService.baseURL) + '"></label>'
    + '<p class="muted small">เมธอด adapter: getQuote() · getFinancials() · getEarnings() · getValuation() · getHistoricalPrices() · getNews() — สลับภายในโดยไม่ต้องแตะ UI</p>'
    + '<div class="row"><button class="btn sm" id="sSave">บันทึก</button></div><p class="muted small" id="sMsg"></p></div>'
    + '<div class="card"><h3>หน้าตาและข้อมูล</h3><div class="row"><button class="btn ghost sm" id="sTheme">สลับมืด / สว่าง (ตอนนี้: ' + (dark ? 'มืด' : 'สว่าง') + ')</button>'
    + '<button class="btn ghost sm warn" id="sReset">ล้างข้อมูลในเครื่อง</button></div>'
    + '<p class="muted small">หุ้นติดตาม โน้ต และบันทึก อยู่ใน LocalStorage ใต้ key asrt_* ย้ายไป Supabase ได้โดยเปลี่ยน store.get/set เป็น Supabase client — key เดิม</p></div></div>';
  $('#sProv').value = DataService.provider;
  $('#sSave').onclick = () => { DataService.provider = $('#sProv').value; DataService.baseURL = $('#sBase').value; localStorage.setItem('asrt_provider', DataService.provider); localStorage.setItem('asrt_base', DataService.baseURL); $('#marketStatus').innerHTML = '<span class="pulse"></span> ' + (DataService.provider === 'live' ? 'LIVE · ดีเลย์' : DataService.provider === 'demo' ? 'ข้อมูล DEMO' : 'CUSTOM API'); $('#sMsg').textContent = 'บันทึกแล้ว ✓ — กำลังโหลดข้อมูลใหม่…'; route(); };
  $('#sTheme').onclick = toggleTheme;
  $('#sReset').onclick = () => { if (confirm('ล้างหุ้นติดตาม โน้ต และบันทึกทั้งหมด?')) { Object.keys(localStorage).filter((k) => k.startsWith('asrt_')).forEach((k) => localStorage.removeItem(k)); location.reload(); } };
}

/* ---------------- RESEARCH ASSISTANT CHAT (rule-based, data-grounded) --
   Answers are composed ONLY from SEED + live provider data (TradingView /
   SEC / Stooq). Unknown → "Data unavailable". Never predicts prices. ----- */
const CHAT_ALIAS = { NVDA: ['nvda', 'nvidia'], AVGO: ['avgo', 'broadcom'], MU: ['mu', 'micron', 'ไมครอน'], ASML: ['asml'], AMD: ['amd'], GOOGL: ['googl', 'google', 'alphabet'], AMZN: ['amzn', 'amazon'] };
function chatTickers(q) {
  const s = ' ' + String(q || '').toLowerCase() + ' ';
  const found = [];
  for (const t of TICKERS) {
    const words = [t.toLowerCase(), ...(CHAT_ALIAS[t] || [])];
    if (words.some((w) => new RegExp('(^|[^a-zก-๙])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z]|$)').test(s))) found.push(t);
  }
  return [...new Set(found)];
}
function chatIntent(q) {
  const s = String(q || '').toLowerCase();
  const has = (...ws) => ws.some((w) => s.includes(w));
  if (has('เทียบ', 'compare', ' vs ', ' vs.', 'ดีกว่า', 'เลือกตัว')) return 'compare';
  if (has('p/e', 'peg', 'valuation', 'แพง', 'ถูก', 'มูลค่า', 'ev/ebitda')) return 'valuation';
  if (has('rsi', 'sma', 'macd', 'เทคนิค', 'แนวรับ', 'แนวต้าน', 'trend', 'overbought', 'oversold')) return 'technical';
  if (has('โต', 'growth', 'รายได้', 'revenue', 'cagr', 'ยอดขาย')) return 'growth';
  if (has('margin', 'มาร์จิ้น', 'กำไรขั้นต้น', 'profitability', 'roe', 'roic')) return 'margins';
  if (has('fcf', 'เงินสด', 'กระแสเงินสด', 'cash', 'หนี้', 'debt', 'งบดุล', 'balance')) return 'cash';
  if (has('ปันผล', 'dividend')) return 'dividend';
  if (has('เสี่ยง', 'risk')) return 'risk';
  if (has('moat', 'คูเมือง', 'แข่งขัน', 'advantage', 'จุดแข็ง')) return 'moat';
  if (has('analyst', 'consensus', 'นักวิเคราะห์', 'rating', 'recommend', 'ซื้อไหม', 'น่าซื้อ', 'ขายไหม')) return 'consensus';
  if (has('งบ', 'filing', '10-k', '10-q', '8-k', 'insider', 'sec', 'form 4')) return 'filings';
  if (has('ราคา', 'price', 'quote', 'เท่าไหร่', 'เท่าไร', 'ทะลุ', 'ร่วง', 'ขึ้น', 'ลง')) return 'price';
  if (has('สรุป', 'summary', 'ภาพรวม', 'thesis', 'วิเคราะห์', 'overview', 'เป็นยังไง', 'ดีไหม')) return 'summary';
  if (has('watchlist', 'ทั้งหมด', 'ทุกตัว', 'มีตัวไหน', 'list')) return 'watchlist';
  if (has('help', 'ช่วย', 'ทำอะไรได้', 'ใช้ยังไง', 'สวัสดี', 'hello', 'hi')) return 'help';
  return '';
}
async function chatData(t) {
  const out = { s: SEED[t], tv: null, sec: null };
  if (DataService.liveOn()) {
    try { out.tv = await getTVSnapshot(t); } catch (_) {}
    try { out.sec = await getFundamentals(t); } catch (_) {}
  }
  return out;
}
const chatLink = (t) => '<a href="#/stock/' + t + '">' + t + '</a>';
const chatSrc = (d, t) => '<div class="muted small">ที่มา: ' + (d.tv ? 'TradingView' : '') + (d.tv && d.sec ? ' + ' : '') + (d.sec ? 'SEC EDGAR' : '') + ((!d.tv && !d.sec) ? 'demo (ต่อเน็ตเพื่อดึงข้อมูลจริง)' : '') + ' · ' + (t ? chatLink(t) : '') + '</div>';

async function chatSummary(t) {
  const d = await chatData(t), s = d.s, tv = d.tv, sec = d.sec;
  const px = tv ? fmt$(tv.close) : fmt$(s.price) + ' ' + DEMO;
  const chg = tv && tv.change != null ? ' <span style="color:' + (tv.change >= 0 ? 'var(--green)' : 'var(--red)') + '">(' + (tv.change >= 0 ? '+' : '') + fmtN(tv.change, 2) + '%)</span>' : '';
  const eps = tv && tv.earnings_per_share_diluted_ttm != null ? fmtN(tv.earnings_per_share_diluted_ttm, 2) : (sec && sec.epsTTM ? fmtN(sec.epsTTM.val, 2) : 'N/A');
  const pe = tv && tv.price_earnings_ttm != null ? fmtN(tv.price_earnings_ttm, 1) : 'N/A';
  const rev = tv && tv.total_revenue_ttm != null ? secB(tv.total_revenue_ttm) : 'N/A';
  const rsi = tv && tv.RSI != null ? fmtN(tv.RSI, 1) : 'N/A';
  return '<b>' + t + ' · ' + esc(s.name) + '</b><br>💰 ราคา ' + px + chg
    + '<br>📦 รายได้ TTM ' + rev + ' · EPS TTM ' + eps + ' · P/E ' + pe
    + '<br>📊 มาร์จิ้น TTM: ขั้นต้น ' + (tv ? fmtN(tv.gross_margin_ttm, 1) : 'N/A') + '% / ดำเนินงาน ' + (tv ? fmtN(tv.operating_margin_ttm, 1) : 'N/A') + '%'
    + '<br>📈 RSI ' + rsi + ' · มตินักวิเคราะห์: <b>' + tvRating(tv && tv['Recommend.All']) + '</b>'
    + '<br>⚠️ เสี่ยงหลัก: ' + esc(s.risks[0][0]) + ' (' + esc(s.risks[0][1]) + ')'
    + '<br>👉 เจาะลึก ' + chatLink(t) + ' · ดูงบ SEC + DCF ที่นั่นได้' + chatSrc(d, t);
}
async function chatPrice(t) {
  const d = await chatData(t), tv = d.tv;
  if (!tv) return '<b>' + t + '</b> ราคา demo ' + fmt$(d.s.price) + ' ' + DEMO + '<br><span class="muted">ดึงราคาจริงไม่ได้ตอนนี้ — เช็คเน็ตแล้วถามใหม่</span>' + chatSrc(d, t);
  return '<b>' + t + '</b> ราคาสด <b>' + fmt$(tv.close) + '</b> <span style="color:' + (tv.change >= 0 ? 'var(--green)' : 'var(--red)') + '">(' + (tv.change >= 0 ? '+' : '') + fmtN(tv.change, 2) + '%)</span>'
    + '<br>เปิด ' + fmt$(tv.open) + ' · สูง ' + fmt$(tv.high) + ' · ต่ำ ' + fmt$(tv.low) + ' · วอล ' + (tv.volume / 1e6).toFixed(1) + 'M'
    + '<br>52W: ' + fmt$(tv.price_52_week_low, 0) + ' – ' + fmt$(tv.price_52_week_high, 0) + chatSrc(d, t);
}
async function chatValuation(t) {
  const d = await chatData(t), s = d.s, tv = d.tv, sec = d.sec;
  let livePE = 'N/A';
  if (tv && tv.close != null && sec && sec.epsTTM && sec.epsTTM.val > 0) livePE = fmtN(tv.close / sec.epsTTM.val, 1);
  else if (tv && tv.price_earnings_ttm != null) livePE = fmtN(tv.price_earnings_ttm, 1) + ' (TV TTM)';
  return '<b>' + t + ' มูลค่า</b><br>P/E ย้อนหลัง (คำนวณ: ราคาสด ÷ EPS TTM): <b>' + livePE + '</b>'
    + '<br>P/E ล่วงหน้า (จำลอง): ' + fmtN(s.fwdPE) + ' · PEG: ' + fmtN(s.peg) + ' <span class="muted">— PEG เป็นค่าประมาณ ไม่ใช่มูลค่าที่แท้จริง</span>'
    + '<br><span class="muted">เทียบ 5Y/10Y + ค่าเฉลี่ย sector: ข้อมูลยังไม่พอ (ต้องต่อ provider เสริม)</span>' + chatSrc(d, t);
}
async function chatGrowth(t) {
  const d = await chatData(t), sec = d.sec;
  if (sec && sec.revA.length > 1) {
    const yrs = sec.revA.slice(-3).map((o) => {
      const i = sec.revA.indexOf(o);
      const p = sec.revA[i - 1];
      const y = p ? (((o.val - p.val) / Math.abs(p.val)) * 100) : null;
      return '<tr><td>' + esc(o.frame) + '</td><td class="num">' + secB(o.val) + '</td><td class="num">' + (y != null ? fmtPct(y) : '—') + '</td></tr>';
    }).join('');
    return '<b>' + t + ' รายได้จริง (SEC)</b><table><thead><tr><th>FY</th><th>รายได้</th><th>YoY</th></tr></thead><tbody>' + yrs + '</tbody></table>'
      + 'TTM: ' + (sec.revTTM ? secB(sec.revTTM.val) : 'N/A') + ' · EPS TTM ' + (sec.epsTTM ? fmtN(sec.epsTTM.val, 2) : 'N/A') + chatSrc(d, t);
  }
  const s = d.s;
  return '<b>' + t + '</b> รายได้โต (จำลอง): YoY ' + fmtPct(s.revGrowth) + ' · 5Y CAGR ' + fmtPct(s.cagr5) + '<br><span class="muted">ดึง SEC ไม่ได้ตอนนี้</span>' + chatSrc(d, t);
}
async function chatMargins(t) {
  const d = await chatData(t), s = d.s, tv = d.tv;
  return '<b>' + t + ' มาร์จิ้น</b><br>' + (tv
    ? 'TTM จริง (TV): ขั้นต้น ' + fmtN(tv.gross_margin_ttm, 1) + '% · ดำเนินงาน ' + fmtN(tv.operating_margin_ttm, 1) + '% · สุทธิ ' + fmtN(tv.net_margin_ttm, 1) + '%'
    : 'Demo: ขั้นต้น ' + fmtN(s.grossM, 1) + '% · ดำเนินงาน ' + fmtN(s.opM, 1) + '%') + chatSrc(d, t);
}
async function chatCash(t) {
  const d = await chatData(t), s = d.s, sec = d.sec;
  if (sec) {
    const oc = sec.ocfA.length ? sec.ocfA[sec.ocfA.length - 1] : null;
    const cx = sec.capeA.length ? sec.capeA[sec.capeA.length - 1] : null;
    const fcf = oc && cx && oc.frame === cx.frame ? oc.val - cx.val : null;
    const debt = ((sec.debtLT && sec.debtLT.val) || 0) + ((sec.debtST && sec.debtST.val) || 0);
    const de = sec.equity && sec.equity.val ? debt / sec.equity.val : null;
    return '<b>' + t + ' เงินสด/หนี้ (SEC)</b><br>FCF = OCF − CapEx = <b>' + secB(fcf) + '</b>'
      + '<br>เงินสด ' + secB(sec.cash && sec.cash.val) + ' · หนี้รวม ' + secB(debt || null) + ' · D/E ' + (de != null ? fmtN(de, 2) + 'x' : 'N/A') + chatSrc(d, t);
  }
  return '<b>' + t + '</b> FCF (จำลอง) ' + fmtB(s.fcf) + ' · เงินสด ' + fmtB(s.cash) + ' · หนี้ ' + fmtB(s.debt) + chatSrc(d, t);
}
async function chatปันผล(t) {
  const d = await chatData(t), tv = d.tv, sec = d.sec;
  const dps = sec && sec.dpsA.length ? sec.dpsA[sec.dpsA.length - 1] : null;
  return '<b>' + t + ' ปันผล</b><br>ยีลด์ (TV): ' + (tv && tv.dividends_yield_current != null ? fmtN(tv.dividends_yield_current, 2) + '%' : 'N/A')
    + ' · จ่าย/หุ้นล่าสุด (SEC): ' + (dps ? '$' + fmtN(dps.val, 2) + ' (' + esc(dps.frame) + ')' : 'ไม่มี/ N/A') + chatSrc(d, t);
}
async function chatRisk(t) {
  const d = await chatData(t);
  return '<b>' + t + ' ความเสี่ยง</b><br>' + d.s.risks.map((r, i) => (i + 1) + '. ' + esc(r[0]) + ' — โอกาส ' + esc(r[1]) + ' · ผลกระทบ ' + esc(r[2])).join('<br>') + chatSrc(d, t);
}
async function chatMoat(t) {
  const d = await chatData(t);
  return '<b>' + t + ' คูเมือง</b><br>' + d.s.moat.map((m) => '• <b>' + esc(m[0]) + '</b> (' + esc(m[1]) + '): ' + esc(m[2])).join('<br>') + chatSrc(d, t);
}
async function chatTechnical(t) {
  const d = await chatData(t), tv = d.tv;
  if (!tv) return '<b>' + t + '</b> ดึง technical จริงไม่ได้ตอนนี้ — เปิด ' + chatLink(t) + ' ดูกราฟ demo ก่อน' + chatSrc(d, t);
  return '<b>' + t + ' เทคนิค (TV, แยกจากพื้นฐาน)</b><br>RSI ' + fmtN(tv.RSI, 1)
    + ' · ราคา' + (tv.SMA200 != null ? (tv.close > tv.SMA200 ? 'เหนือ' : 'หลุด') + ' SMA200 ($' + fmtN(tv.SMA200, 0) + ')' : ' N/A')
    + '<br>SMA20/50: $' + fmtN(tv.SMA20, 0) + ' / $' + fmtN(tv.SMA50, 0)
    + ' · MACD ' + (tv['MACD.macd'] > tv['MACD.signal'] ? 'เป็นบวก' : 'เป็นลบ') + chatSrc(d, t);
}
async function chatConsensus(t) {
  const d = await chatData(t), tv = d.tv;
  return '<b>' + t + ' นักวิเคราะห์ (TV composite)</b><br>คะแนน: <b>' + tvRating(tv && tv['Recommend.All']) + '</b>' + (tv ? ' (' + fmtN(tv['Recommend.All'], 2) + ')' : '')
    + '<br><span class="muted">เป็นมติรวม ไม่ใช่คำสั่งซื้อขาย — ตัดสินใจจากงบ + valuation ของคุณเอง</span>' + chatSrc(d, t);
}
async function chatFilings(t) {
  if (!DataService.liveOn()) return '<b>' + t + '</b> เอกสาร: เปิดโหมด live ก่อน (ตั้งค่า)';
  try {
    const s = await getSubmissions(t);
    const R = s.filings && s.filings.recent;
    const items = R.form.map((fm, i) => ({ fm, fd: R.filingDate[i] }));
    const earn = items.filter((x) => x.fm === '10-K' || x.fm === '10-Q').slice(0, 3);
    const k8 = items.filter((x) => x.fm === '8-K').length;
    const f4 = items.filter((x) => x.fm === '4' || x.fm === '4/A').filter((x) => new Date(x.fd) >= Date.now() - 90 * 864e5).length;
    return '<b>' + t + ' เอกสารยื่น (SEC)</b><br>งบล่าสุด: ' + earn.map((x) => x.fm + ' ' + esc(x.fd)).join(' · ')
      + '<br>8-K ในฟีด: ' + k8 + ' ฉบับ · Insider Form 4 (90 วัน): ' + f4 + ' ฉบับ<br>ดูทั้งหมดที่ ' + chatLink(t) + ' → Filings feed';
  } catch (e) {   return '<b>' + t + '</b> เอกสาร: ข้อมูลยังไม่พอ (' + esc(e.message) + ')'; }
}
async function chatCompare(ts) {
  const rows = await Promise.all(ts.slice(0, 3).map(async (t) => {
    const d = await chatData(t);
    const px = d.tv ? d.tv.close : d.s.price;
    const pe = d.tv && d.tv.price_earnings_ttm != null ? fmtN(d.tv.price_earnings_ttm, 1) : 'N/A';
    const rev = d.tv && d.tv.total_revenue_ttm != null ? secB(d.tv.total_revenue_ttm) : 'N/A';
    const nm = d.tv && d.tv.net_margin_ttm != null ? fmtN(d.tv.net_margin_ttm, 1) + '%' : 'N/A';
    return { t, px: px != null ? fmt$(px) : 'N/A', pe, rev, nm };
  }));
  return '<b>เทียบ side-by-side (ไม่จัดอันดับ)</b><table><thead><tr><th></th>' + rows.map((r) => '<th>' + chatLink(r.t) + '</th>').join('') + '</tr></thead><tbody>'
    + '<tr><td>ราคา</td>' + rows.map((r) => '<td class="num">' + r.px + '</td>').join('') + '</tr>'
    + '<tr><td>P/E TTM</td>' + rows.map((r) => '<td class="num">' + r.pe + '</td>').join('') + '</tr>'
    + '<tr><td>รายได้ TTM</td>' + rows.map((r) => '<td class="num">' + r.rev + '</td>').join('') + '</tr>'
    + '<tr><td>มาร์จิ้นสุทธิ</td>' + rows.map((r) => '<td class="num">' + r.nm + '</td>').join('') + '</tr>'
    + '</tbody></table><span class="muted small">ที่มา: TradingView live · เต็มๆ ที่หน้าเปรียบเทียบ</span>';
}
function chatHelp() {
  return 'ถามได้เช่น:<br>• “สรุป NVDA” / “ราคา MU?”<br>• “เทียบ NVDA vs AMD”<br>• “P/E AVGO แพงไหม” / “RSI GOOGL”<br>• “ความเสี่ยง MU” / “moat ASML”<br>• “ปันผล AVGO” / “งบ AMZN ล่าสุด”<br><span class="muted">รองรับชื่อย่อ ชื่อบริษัท ไทย/อังกฤษ</span>';
}
function chatWatchlist() {
  const rows = watchlist.filter((t) => SEED[t]);
  return '<b>Watchlist (' + rows.length + ')</b><br>' + rows.map((t) => chatLink(t) + ' ' + fmtPct(SEED[t].revGrowth)).join(' · ')
    + '<br><span class="muted small">% = รายได้โต YoY (จำลอง) · ถาม “สรุป TICKER” เพื่อเจาะรายตัว</span>';
}
async function chatAnswer(q) {
  const ts = chatTickers(q);
  let intent = chatIntent(q);
  if (!ts.length) {
    if (intent === 'watchlist') return chatWatchlist();
    if (intent === 'help' || !intent) return chatHelp() + '<br><span class="muted">ระบุหุ้นด้วย เช่น “สรุป NVDA”</span>';
    return 'ระบุหุ้นหน่อยครับ เช่น “สรุป NVDA” “เทียบ MU vs AMD”<br>' + TICKERS.map(chatLink).join(' · ');
  }
  if (intent === 'compare' && ts.length === 1) {
    const peer = TICKERS.find((x) => x !== ts[0] && SEED[x].sector === SEED[ts[0]].sector) || TICKERS.find((x) => x !== ts[0]);
    ts.push(peer);
  }
  if (ts.length >= 2 || intent === 'compare') return chatCompare(ts);
  const t = ts[0];
  switch (intent) {
    case 'price': return chatPrice(t);
    case 'valuation': return chatValuation(t);
    case 'growth': return chatGrowth(t);
    case 'margins': return chatMargins(t);
    case 'cash': return chatCash(t);
    case 'dividend': return chatปันผล(t);
    case 'risk': return chatRisk(t);
    case 'moat': return chatMoat(t);
    case 'technical': return chatTechnical(t);
    case 'consensus': return chatConsensus(t);
    case 'filings': return chatFilings(t);
    case 'watchlist': return chatWatchlist();
    case 'help': return chatHelp();
    default: return chatSummary(t);
  }
}
/* Chat UI wiring */
function chatAdd(text, who) {
  const box = $('#chatMsgs');
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  if (who === 'user') div.textContent = text;
  else div.innerHTML = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}
function chatSave(user, bot) {
  try {
    const h = store.get('asrt_chat', []);
    h.push({ u: user, b: bot });
    store.set('asrt_chat', h.slice(-50));
  } catch (_) {}
}
async function chatAsk(q) {
  q = String(q || '').trim();
  if (!q) return;
  chatAdd(q, 'user');
  $('#chatInput').value = '';
  const loading = chatAdd('<span class="typing">กำลังดึงข้อมูลจริง…</span>', 'bot');
  try {
    const ans = await chatAnswer(q);
    loading.innerHTML = ans;
  } catch (e) {
    loading.innerHTML = 'ขออภัย เกิดข้อผิดพลาด (' + esc(e.message) + ') — ลองใหม่อีกครั้ง';
  }
  $('#chatMsgs').scrollTop = $('#chatMsgs').scrollHeight;
  chatSave(q, loading.innerHTML);
}
function chatToggle(open) {
  const p = $('#chatPanel');
  const show = open == null ? p.hasAttribute('hidden') : open;
  if (show) { p.removeAttribute('hidden'); renderChatHist(); setTimeout(() => $('#chatInput').focus(), 50); }
  else p.setAttribute('hidden', '');
}
function renderChatHist() {
  const box = $('#chatMsgs');
  if (box.children.length) return;
  store.get('asrt_chat', []).slice(-10).forEach((m) => { chatAdd(m.u, 'user'); chatAdd(m.b, 'bot'); });
  if (!box.children.length) chatAdd('สวัสดีครับ 👋 ถามข้อมูลหุ้นได้เลย — ราคา งบ กำไร ความเสี่ยง เทียบหุ้น<br><span class="muted">ลอง: “สรุป NVDA”</span>', 'bot');
  const chips = ['สรุป NVDA', 'ราคา MU?', 'เทียบ NVDA vs AMD', 'P/E AVGO แพงไหม', 'RSI GOOGL', 'ความเสี่ยง MU', 'ปันผล AVGO'];
  $('#chatChips').innerHTML = chips.map((c) => '<button type="button">' + esc(c) + '</button>').join('');
  $$('#chatChips button').forEach((b) => b.onclick = () => chatAsk(b.textContent));
}

/* ---------------- SEARCH + THEME + BOOT ------------------------------ */
function toggleTheme() {
  const el = document.documentElement;
  el.dataset.theme = el.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('asrt_theme', el.dataset.theme); route();
}
(function boot() {
  document.documentElement.dataset.theme = localStorage.getItem('asrt_theme') || 'dark';
  const inp = $('#globalSearch'), box = $('#searchResults');
  const doSearch = () => {
    const q = inp.value.trim().toLowerCase();
    if (!q) { box.classList.remove('open'); box.innerHTML = ''; return; }
    const hits = TICKERS.filter((t) => t.toLowerCase().includes(q) || SEED[t].name.toLowerCase().includes(q) || SEED[t].industry.toLowerCase().includes(q)).slice(0, 8);
    box.innerHTML = hits.length ? hits.map((t) => '<button role="option" data-t="' + t + '"><b>' + t + '</b><span class="muted small">' + esc(SEED[t].name) + ' · ' + esc(SEED[t].industry) + '</span></button>').join('') : '<div class="muted small" style="padding:12px">ไม่เจอ — ลอง NVDA, Micron, MU, Semiconductors…</div>';
    box.classList.add('open');
    $$('button[data-t]', box).forEach((b) => b.onclick = () => { location.hash = '#/stock/' + b.dataset.t; box.classList.remove('open'); inp.value = ''; });
  };
  inp.addEventListener('input', doSearch);
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const first = $('button[data-t]', box); if (first) first.click(); } if (e.key === 'Escape') box.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === '/' && document.activeElement !== inp && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); inp.focus(); } });
  document.addEventListener('click', (e) => { if (!e.target.closest('.search-wrap')) box.classList.remove('open'); });
  $('#themeBtn').onclick = toggleTheme; $('#themeBtn2').onclick = toggleTheme;
  $('#menuBtn').onclick = () => $('.sidebar').classList.toggle('open');
  $('#chatFab').onclick = () => chatToggle();
  $('#chatClose').onclick = () => chatToggle(false);
  $('#chatForm').onsubmit = (e) => { e.preventDefault(); chatAsk($('#chatInput').value); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#chatPanel').hasAttribute('hidden')) chatToggle(false); });
  $('#marketStatus').innerHTML = '<span class="pulse"></span> ' + (DataService.provider === 'live' ? 'LIVE · ดีเลย์' : DataService.provider === 'demo' ? 'ข้อมูล DEMO' : 'CUSTOM API');
  const pill = $('#feedPill');
  if (pill) { const live = DataService.liveOn(); pill.textContent = live ? 'STOOQ · SEC LIVE' : 'DEMO DATA'; pill.title = live ? 'Live: Stooq delayed quotes + SEC EDGAR filings' : 'Demo illustrative figures — switch to Live in Settings'; }
  if (!location.hash) location.hash = '#/';
  route();
  window.addEventListener('resize', () => { /* canvases repaint on next route; cheap + avoids jank */ });
})();
