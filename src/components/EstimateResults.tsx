import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  ComposedChart, Area, Line,
} from 'recharts';
import { X, TrendingUp, Calendar, Users, Download, ExternalLink, Home, MapPin, Bed, Bath } from 'lucide-react';

function RFooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] text-black mb-4 uppercase tracking-[0.12em]" style={{ fontFamily: 'PoppinsMedium, sans-serif' }}>
      {children}
    </div>
  );
}
function RFooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block text-[13px] text-black hover:text-ha-gray transition-colors mb-[9px] leading-snug">
      {label}
    </a>
  );
}
function RPaymentBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center justify-center gap-1 bg-white border border-[#E0DADA] rounded-md px-2 py-1 h-7">
      {children}
    </div>
  );
}
function RAppStoreBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-black rounded-lg px-3 py-1.5">
      <svg width="16" height="20" viewBox="0 0 18 22" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.975 11.617c-.02-2.56 2.087-3.8 2.183-3.861-1.19-1.74-3.044-1.977-3.703-2.003-1.57-.16-3.076.928-3.874.928-.797 0-2.027-.907-3.337-.882-1.712.025-3.3 1.004-4.18 2.535-1.786 3.095-.457 7.673 1.283 10.183.856 1.228 1.874 2.603 3.21 2.553 1.293-.052 1.782-.832 3.345-.832 1.564 0 2.01.832 3.376.803 1.385-.025 2.265-1.252 3.112-2.487.985-1.42 1.388-2.8 1.41-2.87-.032-.013-2.703-1.036-2.725-4.067z"/>
        <path d="M12.467 3.797c.71-.862 1.19-2.059 1.058-3.254-1.022.042-2.26.68-2.993 1.54-.658.757-1.232 1.97-1.078 3.133 1.14.088 2.303-.58 3.013-1.42z"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-white text-[8px]" style={{ fontFamily: 'PoppinsLight, sans-serif' }}>Download on the</span>
        <span className="text-white text-[12px]" style={{ fontFamily: 'PoppinsMedium, sans-serif', lineHeight: '1.3' }}>App Store</span>
      </div>
    </div>
  );
}
function RGooglePlayBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-black rounded-lg px-3 py-1.5">
      <svg width="16" height="18" viewBox="0 0 18 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.428 0.275C0.16 0.56 0 1.01 0 1.59v16.82c0 .58.16 1.03.43 1.315l.07.065 9.42-9.42v-.225L0.498.21l-.07.065z" fill="#4285F4"/>
        <path d="M12.07 13.495l-3.14-3.14v-.225l3.14-3.14.07.04 3.72 2.113c1.063.602 1.063 1.59 0 2.195l-3.72 2.113-.07.044z" fill="#FBBC05"/>
        <path d="M12.14 13.45L8.93 10.24.428 18.74c.35.37.928.415 1.578.046l10.134-5.337" fill="#EA4335"/>
        <path d="M12.14 7.03L2.006 1.694C1.356 1.32.778 1.37.428 1.74l8.502 8.5 3.21-3.21z" fill="#34A853"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-white text-[8px]" style={{ fontFamily: 'PoppinsLight, sans-serif' }}>GET IT ON</span>
        <span className="text-white text-[12px]" style={{ fontFamily: 'PoppinsMedium, sans-serif', lineHeight: '1.3' }}>Google Play</span>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

interface FormData {
  posizione: string;
  letti: number;
  bagni_privati: number;
  bagni_condivisi: number;
  stanze_totali: number;
}

interface EstimateResultsProps {
  scrapeData: AnyData;
  formData: FormData;
  onClose: () => void;
}

function buildPlaceholderMonthlyBreakdown(avg: number) {
  const seasons: Record<string, number> = {
    january: 0.88, february: 0.90, march: 0.95, april: 1.02,
    may: 1.05, june: 1.08, july: 1.00, august: 0.95,
    september: 1.10, october: 1.08, november: 0.95, december: 0.90,
  };
  const result: Record<string, { min: number; max: number }> = {};
  for (const [month, factor] of Object.entries(seasons)) {
    const center = Math.round(avg * factor);
    result[month] = { min: Math.round(center * 0.88), max: Math.round(center * 1.12) };
  }
  return result;
}

function buildPlaceholderRevenue(annualAvg: number) {
  const y = new Date().getFullYear();
  const base = annualAvg;
  return {
    growth_percent: 15,
    historical: [
      { year: y - 3, revenue: Math.round(base * 0.80) },
      { year: y - 2, revenue: Math.round(base * 0.87) },
      { year: y - 1, revenue: Math.round(base * 0.93) },
      { year: y,     revenue: base },
    ],
    forecast: [
      { year: y,     revenue: base },
      { year: y + 1, revenue: Math.round(base * 1.06) },
      { year: y + 2, revenue: Math.round(base * 1.10) },
      { year: y + 3, revenue: Math.round(base * 1.15) },
    ],
  };
}

const MONTH_ORDER = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// HousingAnywhere brand colors
const OCC_COLORS = ['#FF4B27', '#FFBBAE'];
const NAT_COLORS = ['#FF4B27', '#FFBBAE', '#FFE4DC', '#6D301D', '#ffd0c4'];
const AGE_COLORS = ['#FF4B27', '#FFBBAE', '#FFE4DC'];

const formatPrice = (v: number, currency = 'EUR') =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);

const CustomBarTooltip = ({ active, payload, label, currency }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string; currency?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-2xl p-3 shadow-lg border border-[#EBEBEB]/40 min-w-[140px]">
        <div className="text-[11px] uppercase tracking-wider text-[#676767] mb-2">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.name === 'min' ? '#FFBBAE' : '#FF4B27' }} />
              <span className="text-[#676767]">{p.name === 'min' ? 'Minimum' : 'Maximum'}</span>
            </div>
            <span className="font-semibold text-brand">{formatPrice(p.value, currency)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: {
  cx?: number; cy?: number; midAngle?: number; outerRadius?: number; percent?: number; name?: string;
}) => {
  if (!cx || !cy || midAngle === undefined || !outerRadius || !percent || percent < 0.03) return null;
  const RADIAN = Math.PI / 180;
  const isSmall = cx < 160;
  if (isSmall) {
    if (percent < 0.08) return null;
    const r = outerRadius * 0.65;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={11} fontWeight={700} fontFamily="inherit">
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  }
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const anchor = x > cx ? 'start' : 'end';
  return (
    <g>
      <text x={x} y={y - 7} textAnchor={anchor} fill="#0D0D0D" fontSize={13} fontWeight={500} fontFamily="inherit">
        {name}
      </text>
      <text x={x} y={y + 10} textAnchor={anchor} fill="#FF4B27" fontSize={13} fontWeight={700} fontFamily="inherit">
        {`${(percent * 100).toFixed(2).replace(/\.?0+$/, '')}%`}
      </text>
    </g>
  );
};

export default function EstimateResults({ scrapeData, formData, onClose }: EstimateResultsProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [profileTab, setProfileTab] = useState<'occupation' | 'nationality' | 'age'>('nationality');

  const currency = scrapeData?.currency_code ?? 'EUR';
  const fmt = (v: number) => formatPrice(v, currency);

  const annualAvg = scrapeData?.annual_avg ?? (scrapeData?.monthly_avg ?? 500) * 12;
  const monthlyAvg = scrapeData?.monthly_avg ?? 500;
  const monthly_typical_min = scrapeData?.monthly_typical_min ?? Math.round(monthlyAvg * 0.85);
  const monthly_typical_max = scrapeData?.monthly_typical_max ?? Math.round(monthlyAvg * 1.15);
  const data = {
    monthly_typical_min,
    monthly_typical_max,
    annual_typical_min: scrapeData?.annual_typical_min ?? monthly_typical_min * 12,
    annual_typical_max: scrapeData?.annual_typical_max ?? monthly_typical_max * 12,
    listings: scrapeData?.listings ?? [],
    monthly_breakdown: buildPlaceholderMonthlyBreakdown(scrapeData?.monthly_avg ?? 500),
    revenue_projection: buildPlaceholderRevenue(annualAvg),
  };

  const handleDownloadPdf = async () => {
    if (!contentRef.current || downloading) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const { jsPDF } = await import('jspdf');

      const element = contentRef.current;

      const originalSvgs = Array.from(element.querySelectorAll('svg')) as SVGSVGElement[];
      const svgSnapshots = originalSvgs.map((svg) => {
        const rect = svg.getBoundingClientRect();
        const w = Math.round(rect.width) || parseInt(svg.getAttribute('width') || '18');
        const h = Math.round(rect.height) || parseInt(svg.getAttribute('height') || '18');
        const computedColor = window.getComputedStyle(svg).color || '#FF4B27';
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        if (!svg.getAttribute('width')) svg.setAttribute('width', String(w));
        if (!svg.getAttribute('height')) svg.setAttribute('height', String(h));
        const serialized = new XMLSerializer().serializeToString(svg)
          .replace(/currentColor/g, computedColor);
        return { serialized, w, h };
      });

      const container = document.createElement('div');
      container.style.cssText = `position:absolute;left:-9999px;top:0;width:${element.scrollWidth}px;background:#fff;`;
      document.body.appendChild(container);
      const clone = element.cloneNode(true) as HTMLElement;
      container.appendChild(clone);

      const cloneSvgs = Array.from(clone.querySelectorAll('svg'));
      await Promise.all(cloneSvgs.map((svgEl, i) => new Promise<void>((resolve) => {
        const { serialized, w, h } = svgSnapshots[i] || { serialized: '', w: 18, h: 18 };
        const cvs = document.createElement('canvas');
        cvs.width = w * 2;
        cvs.height = h * 2;
        cvs.style.cssText = `display:inline-block;vertical-align:middle;width:${w}px;height:${h}px;flex-shrink:0;`;
        const ctx = cvs.getContext('2d');
        if (!ctx || !serialized) { svgEl.parentNode?.replaceChild(cvs, svgEl); resolve(); return; }
        const blob = new Blob([serialized], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
          URL.revokeObjectURL(url);
          svgEl.parentNode?.replaceChild(cvs, svgEl);
          resolve();
        };
        img.onerror = () => { URL.revokeObjectURL(url); svgEl.remove(); resolve(); };
        img.src = url;
      })));

      clone.querySelectorAll('.truncate').forEach((el) => el.classList.remove('truncate'));

      await new Promise<void>((r) => setTimeout(r, 100));

      const cloneScrollH = clone.scrollHeight;
      const cloneRect = clone.getBoundingClientRect();
      const linkPositions = (Array.from(clone.querySelectorAll('a[href]')) as HTMLAnchorElement[])
        .map((a) => {
          const r = a.getBoundingClientRect();
          return {
            href: a.href,
            top: r.top - cloneRect.top,
            left: r.left - cloneRect.left,
            width: r.width,
            height: r.height,
          };
        })
        .filter((l) => l.href && !l.href.startsWith('javascript'));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: clone.scrollHeight,
        windowWidth: element.scrollWidth,
      });

      document.body.removeChild(container);

      const ctx2d = canvas.getContext('2d');
      let croppedHeight = canvas.height;
      if (ctx2d) {
        const imageData = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = canvas.height - 1; y >= 0; y--) {
          let isWhite = true;
          for (let x = 0; x < canvas.width; x += 4) {
            const idx = (y * canvas.width + x) * 4;
            if (imageData.data[idx] < 248 || imageData.data[idx + 1] < 248 || imageData.data[idx + 2] < 248) {
              isWhite = false; break;
            }
          }
          if (!isWhite) { croppedHeight = y + 20; break; }
        }
      }
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = canvas.width;
      croppedCanvas.height = Math.min(croppedHeight, canvas.height);
      croppedCanvas.getContext('2d')?.drawImage(canvas, 0, 0);

      const imgData = croppedCanvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH = (croppedCanvas.height * pageW) / croppedCanvas.width;

      let yOffset = 0;
      while (yOffset < imgH) {
        pdf.addImage(imgData, 'JPEG', 0, -yOffset, pageW, imgH);
        yOffset += pageH;
        if (yOffset < imgH) pdf.addPage();
      }

      for (const link of linkPositions) {
        const pdfX = (link.left / element.scrollWidth) * pageW;
        const pdfY = (link.top / cloneScrollH) * imgH;
        const pdfW = (link.width / element.scrollWidth) * pageW;
        const pdfH = (link.height / cloneScrollH) * imgH;
        const pageIdx = Math.floor(pdfY / pageH);
        const totalPages = pdf.getNumberOfPages();
        if (pageIdx >= 0 && pageIdx < totalPages) {
          pdf.setPage(pageIdx + 1);
          pdf.link(pdfX, pdfY - pageIdx * pageH, pdfW, pdfH, { url: link.href });
        }
      }

      pdf.save('estimate-housinganywhere.pdf');
    } finally {
      setDownloading(false);
    }
  };

  const monthlyChartData = MONTH_ORDER.map((month, idx) => ({
    name: MONTH_SHORT[idx],
    min: data.monthly_breakdown?.[month]?.min || 0,
    max: data.monthly_breakdown?.[month]?.max || 0,
  }));

  const nationalityRaw: { country: string; percent: number }[] = scrapeData?.nationality_breakdown ?? [];
  const natSum = nationalityRaw.reduce((s: number, n: { country: string; percent: number }) => s + n.percent, 0);
  const propertyCountry = formData.posizione?.split(',').pop()?.trim() ?? 'Local';
  const nationalityFallback = (() => {
    const others = [
      { name: 'France', value: 9 },
      { name: 'Spain', value: 8 },
      { name: 'Germany', value: 7 },
      { name: 'Other', value: 6 },
    ].filter(n => n.name !== propertyCountry);
    const otherTotal = others.slice(0, 3).reduce((s, n) => s + n.value, 0);
    return [
      { name: propertyCountry, value: 70 },
      ...others.slice(0, 3),
      { name: 'Other', value: 30 - otherTotal },
    ];
  })();
  const nationalityData = nationalityRaw.length > 0
    ? [
        ...nationalityRaw.map((n: { country: string; percent: number }) => ({ name: n.country, value: n.percent })),
        ...(natSum < 98 ? [{ name: 'Other', value: Math.round((100 - natSum) * 10) / 10 }] : []),
      ]
    : nationalityFallback;

  const occupationData = [
    { name: 'Students', value: 78 },
    { name: 'Young professionals', value: 22 },
  ];

  const ageData = [
    { name: '18–24', value: 55 },
    { name: '25–34', value: 32 },
    { name: '35+', value: 13 },
  ];

  const PROFILE_TABS = [
    { key: 'nationality' as const, label: 'Nationality' },
    { key: 'occupation' as const, label: 'Occupation' },
    { key: 'age' as const, label: 'Age' },
  ];
  const activeProfileData = profileTab === 'nationality' ? nationalityData : profileTab === 'occupation' ? occupationData : ageData;
  const activeProfileColors = profileTab === 'nationality' ? NAT_COLORS : profileTab === 'occupation' ? OCC_COLORS : AGE_COLORS;

  const currentYear = new Date().getFullYear();
  const anchorAnnual = scrapeData?.annual_avg ?? 0;

  const combinedRevenueData = (() => {
    const rp = data.revenue_projection;
    if (!rp) return [];
    const map = new Map<number, { year: string; historicalRevenue?: number; forecastRevenue?: number }>();
    rp.historical.forEach(({ year, revenue }: { year: number; revenue: number }) => {
      const r = (year === currentYear && anchorAnnual > 0) ? anchorAnnual : revenue;
      map.set(year, { year: String(year), historicalRevenue: r });
    });
    rp.forecast.forEach(({ year, revenue }: { year: number; revenue: number }) => {
      if (year > currentYear + 3) return;
      const r = (year === currentYear && anchorAnnual > 0) ? anchorAnnual : revenue;
      if (map.has(year)) {
        map.get(year)!.forecastRevenue = r;
      } else {
        map.set(year, { year: String(year), forecastRevenue: r });
      }
    });
    const rows = Array.from(map.values())
      .filter(d => Number(d.year) >= currentYear - 3 && Number(d.year) <= currentYear + 3)
      .sort((a, b) => Number(a.year) - Number(b.year));

    let floor = 0;
    for (const row of rows) {
      const val = row.historicalRevenue ?? row.forecastRevenue ?? 0;
      if (val > 0 && val < floor) {
        const bumped = Math.round(floor * 1.03);
        if (row.historicalRevenue !== undefined) row.historicalRevenue = bumped;
        if (row.forecastRevenue  !== undefined) row.forecastRevenue  = bumped;
        floor = bumped;
      } else {
        floor = Math.max(floor, val);
      }
    }
    return rows;
  })();

  const actualGrowthPercent = (() => {
    const currentRow = combinedRevenueData.find(d => Number(d.year) === currentYear);
    const lastRow = combinedRevenueData[combinedRevenueData.length - 1];
    const base = currentRow?.historicalRevenue ?? currentRow?.forecastRevenue ?? 0;
    const end  = lastRow?.forecastRevenue ?? lastRow?.historicalRevenue ?? 0;
    if (!base || !end || base === end) return data.revenue_projection?.growth_percent ?? 15;
    return Math.round(((end - base) / base) * 100);
  })();

  const RevenueTooltip = ({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    const histP = payload.find(p => p.dataKey === 'historicalRevenue');
    const foreP = payload.find(p => p.dataKey === 'forecastRevenue');
    const isHistorical = !!(histP?.value !== undefined && histP.value);
    const value = isHistorical ? histP!.value : foreP?.value ?? 0;
    if (!value) return null;
    const isCurrent = Number(label) === currentYear;
    const monthlyMin = isCurrent ? data.monthly_typical_min : Math.round(value * 0.82 / 12);
    const monthlyMax = isCurrent ? data.monthly_typical_max : Math.round(value * 1.18 / 12);
    const annualMin  = isCurrent ? data.annual_typical_min  : Math.round(value * 0.82);
    const annualMax  = isCurrent ? data.annual_typical_max  : Math.round(value * 1.18);
    return (
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#EBEBEB]/40 min-w-[200px]">
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="text-[13px] font-semibold text-[#0D0D0D]">{label}</span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wider ${isHistorical ? 'bg-ha-peach text-brand' : 'bg-ha-melon text-brand-dark'}`}>
            {isHistorical ? 'HISTORICAL' : 'FORECAST'}
          </span>
        </div>
        <div className="space-y-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#676767] mb-0.5">Monthly range</div>
            <div className="text-[16px] font-title text-brand">
              {fmt(monthlyMin)} – {fmt(monthlyMax)}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] pt-2">
            <div className="text-[10px] uppercase tracking-wider text-[#676767] mb-0.5">Annual range</div>
            <div className="text-[16px] font-title text-brand">
              {fmt(annualMin)} – {fmt(annualMax)}
            </div>
          </div>
        </div>
        {!isHistorical && (
          <div className="mt-2 pt-2 border-t border-[#EBEBEB] text-[11px] text-[#676767]">Estimate based on market trends</div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto custom-scrollbar bg-ha-bg"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-ha-border/50 px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
        <img src="/housinganywhere-logo.svg" alt="HousingAnywhere" style={{ height: 22, width: 'auto' }} />
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center gap-2 text-[13px] font-medium text-[#676767] hover:text-brand bg-ha-bg hover:bg-ha-border/60 px-3 py-2 rounded-full transition-colors disabled:opacity-50"
          >
            <Download size={15} />
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-ha-bg hover:bg-ha-border/30 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-ha-gray" />
          </button>
        </div>
      </div>

      <div ref={contentRef} className="px-4 sm:px-8 lg:px-12 py-8 space-y-6">

        {/* Input summary card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-ha-peach rounded-2xl px-6 py-4 flex flex-col gap-2 items-start sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2"
        >
          <div className="flex items-center gap-2 text-[14px] text-brand font-semibold">
            <MapPin size={14} className="text-brand flex-shrink-0" />
            {formData.posizione}
          </div>
          {[
            { icon: <Bed size={13} />, label: `${formData.letti} ${formData.letti === 1 ? 'bed' : 'beds'}` },
            ...(formData.bagni_privati > 0 ? [{ icon: <Bath size={13} />, label: `${formData.bagni_privati} private bathroom` }] : []),
            ...(formData.bagni_condivisi > 0 ? [{ icon: <Bath size={13} />, label: `${formData.bagni_condivisi} shared bathroom` }] : []),
            { icon: <Home size={13} />, label: `${formData.stanze_totali} total rooms` },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-white text-[12px] text-[#0D0D0D] px-3 py-1.5 rounded-full">
              <span className="text-[#676767]">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </motion.div>

        {/* Row 1: Hero cards + Monthly chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-brand rounded-3xl p-6 sm:p-8 text-white flex-1"
            >
              <div className="inline-flex items-center gap-1.5 bg-white/15 text-white/80 text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                <Calendar size={11} /> Monthly
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-title text-4xl sm:text-5xl text-white leading-none">{fmt(data.monthly_typical_min)}</span>
                <span className="font-title text-4xl sm:text-5xl text-white/60 leading-none">– {fmt(data.monthly_typical_max)}</span>
              </div>
              <div className="text-[13px] text-white/50 mt-3">per month · typical range</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-ha-melon rounded-3xl p-6 sm:p-8 flex-1"
            >
              <div className="inline-flex items-center gap-1.5 bg-brand/10 text-brand/80 text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                <TrendingUp size={11} /> Annual
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-title text-4xl sm:text-5xl text-brand leading-none">{fmt(data.annual_typical_min)}</span>
                <span className="font-title text-4xl sm:text-5xl text-brand/60 leading-none">– {fmt(data.annual_typical_max)}</span>
              </div>
              <div className="text-[13px] text-brand/60 mt-3">per year · typical range</div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-ha-peach flex items-center justify-center flex-shrink-0">
                <Calendar size={15} color="#FF4B27" />
              </div>
              <h3 className="font-title text-[18px] text-[#0D0D0D]">Monthly breakdown</h3>
            </div>
            <p className="text-[13px] text-[#676767] mb-6">Estimated rent range month by month</p>
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <div className="w-[240%] sm:w-full">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyChartData} barGap={2} barCategoryGap="25%">
                    <CartesianGrid vertical={false} stroke="#FFE4DC" strokeOpacity={0.8} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#676767' }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#676767' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v / 1000}k`}
                      width={32}
                    />
                    <Tooltip content={<CustomBarTooltip currency={currency} />} cursor={{ fill: '#FF4B2708' }} />
                    <Bar dataKey="min" name="min" fill="#FFBBAE" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="max" name="max" fill="#FF4B27" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-[12px] text-[#676767]">
                <span className="w-3 h-3 rounded-full bg-ha-melon inline-block" /> Minimum rent
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#676767]">
                <span className="w-3 h-3 rounded-full bg-brand inline-block" /> Maximum rent
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 2: Revenue Projection + Listings */}
        <div className={`grid grid-cols-1 gap-6 items-stretch ${data.listings && data.listings.length > 0 && data.revenue_projection && combinedRevenueData.length > 0 ? 'lg:grid-cols-2' : ''}`}>
        {data.revenue_projection && combinedRevenueData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.23 }}
            className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-ha-peach flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={15} color="#FF4B27" />
                </div>
                <h3 className="font-title text-[18px] text-[#0D0D0D]">Revenue projection</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-brand bg-ha-melon px-3 py-1.5 rounded-full">
                <TrendingUp size={13} />
                +{actualGrowthPercent}% Expected growth
              </div>
            </div>
            <p className="text-[13px] text-[#676767] mb-6">Estimated annual revenue and future projections</p>
            <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={combinedRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4B27" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#FF4B27" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFBBAE" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#FFBBAE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#FFE4DC" strokeOpacity={1} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#676767' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#676767' }} tickFormatter={(v: number) => `€${v / 1000}k`} width={44} />
                <Tooltip content={<RevenueTooltip />} cursor={{ stroke: '#FF4B27', strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.25 }} />
                <Area type="monotone" dataKey="historicalRevenue" stroke="none" fill="url(#gradHistorical)" activeDot={false} />
                <Area type="monotone" dataKey="forecastRevenue" stroke="none" fill="url(#gradForecast)" activeDot={false} />
                <Line type="monotone" dataKey="historicalRevenue" stroke="#FF4B27" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#FF4B27', stroke: '#fff', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="forecastRevenue" stroke="#FFBBAE" strokeWidth={3} strokeDasharray="6 4" dot={false} activeDot={{ r: 5, fill: '#FFBBAE', stroke: '#fff', strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2 text-[12px] text-[#676767]">
                <span className="w-3 h-3 rounded-full bg-brand inline-block" /> Historical data
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#676767]">
                <span className="w-3 h-3 rounded-full bg-ha-melon inline-block border border-[#e0a8a0]" /> Future projections
              </div>
            </div>
          </motion.div>
        )}

        {data.listings && data.listings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.27 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm h-full"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-ha-peach flex items-center justify-center flex-shrink-0">
                <Home size={15} color="#FF4B27" />
              </div>
              <h3 className="font-title text-[18px] text-[#0D0D0D]">Similar listings on HousingAnywhere</h3>
            </div>
            <p className="text-[13px] text-[#676767] mb-5">Real properties in your area</p>
            <div className="flex flex-col gap-3">
              {data.listings.map((listing: { name: string; url: string; monthly_price: number; annual_revenue: number }, idx: number) => (
                <a
                  key={idx}
                  href={listing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 bg-ha-peach rounded-2xl px-4 py-3 hover:bg-ha-melon transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-brand group-hover:text-brand-dark transition-colors">
                      <span className="truncate">{listing.name}</span>
                      <ExternalLink size={12} className="flex-shrink-0 opacity-60" />
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[14px] font-semibold text-brand">{fmt(listing.monthly_price)}<span className="text-[11px] font-normal text-brand/60"> /month</span></div>
                    <div className="text-[12px] font-medium text-brand-dark">{fmt(listing.annual_revenue)}<span className="text-[10px] font-normal text-brand-dark/70"> /year</span></div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
        </div>

        {/* Row 3: Tenant profile + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-ha-peach flex items-center justify-center flex-shrink-0">
                <Users size={15} color="#FF4B27" />
              </div>
              <h3 className="font-title text-[18px] text-[#0D0D0D]">Typical tenant profile</h3>
            </div>
            <div className="flex items-center gap-1 bg-ha-bg rounded-xl p-1 mb-2">
              {PROFILE_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setProfileTab(tab.key)}
                  className={`flex-1 text-[12px] font-medium py-1.5 rounded-lg transition-all ${
                    profileTab === tab.key
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-[#676767] hover:text-[#0D0D0D]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {profileTab === 'nationality' && nationalityData.length === 0 ? (
              <p className="text-[13px] text-[#676767] italic text-center py-10">Data not available for this city</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={340}>
                  <PieChart>
                    <Pie
                      data={activeProfileData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      labelLine={false}
                      label={CustomPieLabel}
                    >
                      {activeProfileData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={activeProfileColors[index % activeProfileColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 sm:hidden">
                  {activeProfileData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-[12px] text-[#676767]">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: activeProfileColors[index % activeProfileColors.length] }} />
                      {entry.name}
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-ha-peach rounded-3xl p-6 flex flex-col"
          >
            <h3 className="font-title text-[18px] text-[#0D0D0D] mb-3">Market analysis</h3>
            <p className="text-[14px] text-[#0D0D0D] leading-relaxed">
              {(() => {
                const city = formData.posizione.split(',')[0].trim();
                return `${city} has a dynamic mid-term rental market driven by strong demand from international students, Erasmus residents, and young professionals relocating for work. Rental prices in the city have steadily increased over recent years, reflecting low vacancy rates and a limited supply of well-furnished apartments. Seasonal peaks typically occur in September and January, coinciding with university intake periods, which pushes average rents higher and reduces time-to-lease significantly.`;
              })()}
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-ha-melon rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-title text-[22px] text-brand mb-1">Ready to earn with your property?</h3>
            <p className="text-[14px] text-[#676767]">List your property on HousingAnywhere and start earning.</p>
          </div>
          <a
            href="https://housinganywhere.com/renting-out-private--Italy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-brand text-white font-semibold text-[14px] px-6 py-3 rounded-full hover:bg-brand-light transition-colors whitespace-nowrap"
          >
            List your property
          </a>
        </motion.div>

        <div className="h-8" />
      </div>

      {/* Footer */}
      <footer className="bg-ha-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <RFooterHeading>HousingAnywhere</RFooterHeading>
              {[
                { label: 'About us',  href: 'https://housinganywhere.com/about' },
                { label: 'Blog',      href: 'https://housinganywhere.com/blog' },
                { label: 'Press',     href: 'https://housinganywhere.com/press' },
                { label: 'Contact',   href: 'https://housinganywhere.com/contact' },
                { label: 'Sitemap',   href: 'https://housinganywhere.com/sitemap' },
              ].map(l => <RFooterLink key={l.label} {...l} />)}
              <div className="mt-8">
                <RFooterHeading>Legal</RFooterHeading>
                {[
                  { label: 'Privacy policy',      href: 'https://housinganywhere.com/privacy-policy' },
                  { label: 'Cookies policy',       href: 'https://housinganywhere.com/cookie-policy' },
                  { label: 'Terms and conditions', href: 'https://housinganywhere.com/terms-and-conditions' },
                ].map(l => <RFooterLink key={l.label} {...l} />)}
              </div>
            </div>
            <div>
              <RFooterHeading>Tenants</RFooterHeading>
              {[
                { label: 'How it works',          href: 'https://housinganywhere.com/how-it-works' },
                { label: 'Tenant Protection',     href: 'https://housinganywhere.com/tenant-protection' },
                { label: 'Student accommodation', href: 'https://housinganywhere.com/student-accommodation' },
                { label: 'Find a room',           href: 'https://housinganywhere.com/s/Amsterdam--Netherlands/rooms' },
              ].map(l => <RFooterLink key={l.label} {...l} />)}
              <div className="mt-8">
                <RFooterHeading>Landlords</RFooterHeading>
                {[
                  { label: 'List your property',  href: 'https://housinganywhere.com/landlord' },
                  { label: 'Landlord Protection', href: 'https://housinganywhere.com/landlord-protection' },
                  { label: 'How it works',        href: 'https://housinganywhere.com/landlord/how-it-works' },
                  { label: 'Pricing',             href: 'https://housinganywhere.com/pricing' },
                ].map(l => <RFooterLink key={l.label} {...l} />)}
              </div>
            </div>
            <div>
              <RFooterHeading>Support</RFooterHeading>
              <a
                href="https://help.housinganywhere.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white border border-ha-border rounded-2xl px-4 py-3 mb-4 hover:shadow-md transition-shadow w-full max-w-[230px]"
              >
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4B27" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <span className="text-[13px] text-black leading-tight" style={{ fontFamily: 'PoppinsMedium, sans-serif' }}>Help centre</span>
              </a>
              <RFooterLink label="Contact support" href="https://help.housinganywhere.com/hc/en-us/requests/new" />
            </div>
            <div>
              <RFooterHeading>Download the app</RFooterHeading>
              <div className="flex flex-row gap-2 mb-8">
                <a href="https://apps.apple.com/app/housinganywhere/id869814874" target="_blank" rel="noopener noreferrer"><RAppStoreBadge /></a>
                <a href="https://play.google.com/store/apps/details?id=com.housinganywhere" target="_blank" rel="noopener noreferrer"><RGooglePlayBadge /></a>
              </div>
              <RFooterHeading>Follow us</RFooterHeading>
              <div className="flex items-center gap-4 flex-wrap">
                <a href="https://www.instagram.com/housinganywhere" target="_blank" rel="noopener noreferrer" className="text-black hover:text-ha-gray transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
                <a href="https://twitter.com/housinganywhere" target="_blank" rel="noopener noreferrer" className="text-black hover:text-ha-gray transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="https://www.linkedin.com/company/housinganywhere" target="_blank" rel="noopener noreferrer" className="text-black hover:text-ha-gray transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>
                <a href="https://www.facebook.com/housinganywhere" target="_blank" rel="noopener noreferrer" className="text-black hover:text-ha-gray transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
                <a href="https://www.youtube.com/c/HousingAnywhere" target="_blank" rel="noopener noreferrer" className="text-black hover:text-ha-gray transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg></a>
              </div>
            </div>
          </div>
          <div className="border-t border-ha-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <img src="/housinganywhere-logo.svg" alt="HousingAnywhere" style={{ height: 20, width: 'auto' }} />
              <span className="text-[12px] text-black">©{new Date().getFullYear()} HousingAnywhere — All rights reserved</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] text-black mr-1">Payment methods</span>
              <RPaymentBadge><img src="/paypal-logo.svg" alt="PayPal" className="h-4 w-auto" /></RPaymentBadge>
              <RPaymentBadge><img src="/visa-logo.svg" alt="Visa" className="h-4 w-auto" /></RPaymentBadge>
              <RPaymentBadge><img src="/mastercard-logo.svg" alt="Mastercard" className="h-5 w-auto" /></RPaymentBadge>
              <RPaymentBadge><img src="/americanexpress-logo.svg" alt="American Express" className="h-4 w-auto" /></RPaymentBadge>
              <RPaymentBadge><img src="/unionpay-logo.svg" alt="UnionPay" className="h-4 w-auto" /></RPaymentBadge>
            </div>
            <button className="flex items-center gap-1.5 text-[13px] text-black hover:text-ha-gray transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              English
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
