"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const banks = [
  { name: 'NMB Bank',           rate: 10.50, tenure: 7, financing: 80, fee: 0.5, lowest: false },
  { name: 'Nabil Bank',         rate: 10.75, tenure: 7, financing: 85, fee: 0.5, lowest: false },
  { name: 'Everest Bank',       rate: 10.25, tenure: 7, financing: 80, fee: 0.5, lowest: true  },
  { name: 'Sanima Bank',        rate: 10.50, tenure: 6, financing: 80, fee: 0.5, lowest: false },
  { name: 'Global IME Bank',    rate: 11.00, tenure: 7, financing: 85, fee: 1.0, lowest: false },
  { name: 'Laxmi Sunrise Bank', rate: 10.50, tenure: 7, financing: 80, fee: 0.5, lowest: false },
];

const emiTips = [
  {
    title: 'Higher Down Payment',
    description: 'Paying more upfront reduces your loan amount and total interest paid over time.',
  },
  {
    title: 'Compare Interest Rates',
    description: 'Even a 1% difference in rate can save you several lakhs over the loan tenure.',
  },
  {
    title: 'Prepayment Benefits',
    description: 'Making extra payments reduces your principal and saves significantly on interest.',
  },
  {
    title: 'Factor in All Costs',
    description: 'Include processing fees, insurance, and registration in your total budget.',
  },
];

const popularTerms = [
  { label: '3 Years (36 months)', tag: 'Lower Interest',  tenure: 3  },
  { label: '5 Years (60 months)', tag: 'Most Popular',    tenure: 5  },
  { label: '7 Years (84 months)', tag: 'Lower EMI',       tenure: 7  },
];

// Nepali number format: 3000000 -> Rs. 30,00,000
function formatNPR(amount: number): string {
  if (!amount && amount !== 0) return 'Rs. 0';
  const str = Math.round(amount).toString();
  if (str.length <= 3) return `Rs. ${str}`;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `Rs. ${formatted},${last3}`;
}

function calcEMI(principal: number, rate: number, months: number): number {
  if (!principal || !rate || !months) return 0;
  const r = rate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const EmiCalculatorPage = () => {
  const [carPrice,     setCarPrice]     = useState(3000000);
  const [downPct,      setDownPct]      = useState(10);
  const [tenure,       setTenure]       = useState(5);
  const [interestRate, setInterestRate] = useState(10.5);
  const [showAmort,    setShowAmort]    = useState(false);

  // All derived — no useEffect, no infinite loop
  const downPayment   = Math.round(carPrice * downPct / 100);
  const loanAmount    = carPrice - downPayment;
  const months        = tenure * 12;
  const emi           = Math.round(calcEMI(loanAmount, interestRate, months));
  const totalPayment  = emi * months;
  const totalInterest = totalPayment - loanAmount;

  const handleDownAmount = (val: number) => {
    if (carPrice > 0)
      setDownPct(Math.min(50, Math.max(10, Math.round((val / carPrice) * 100))));
  };

  // Amortization rows
  const amortRows = (() => {
    const rows = [];
    let balance = loanAmount;
    const r = interestRate / 12 / 100;
    for (let y = 1; y <= tenure; y++) {
      const opening = balance;
      let yi = 0, yp = 0;
      for (let m = 0; m < 12; m++) {
        const interest  = balance * r;
        const principal = emi - interest;
        yi += interest;
        yp += principal;
        balance -= principal;
      }
      rows.push({
        year: y, opening,
        emiPaid:   emi * 12,
        interest:  Math.round(yi),
        principal: Math.round(yp),
        closing:   balance > 0 ? Math.round(balance) : 0,
      });
    }
    return rows;
  })();

  const copyResult = () => {
    const text = `EMI ${formatNPR(emi)}/month | Car ${formatNPR(carPrice)} | Down ${formatNPR(downPayment)} | ${tenure}yr @ ${interestRate}% — carkinne.com`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">

      {/* PAGE HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight text-[#1d1d1f]">
          Car Loan EMI Calculator
        </h1>
        <p className="text-lg text-[#6e6e73] mt-3">
          Calculate your monthly installment with real Nepal bank rates
        </p>
        <p className="text-lg text-[#6e6e73] mt-1">
          Plan your car purchase with confidence
        </p>
      </div>

      {/* CALCULATOR — TWO COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-[55%_43%] gap-8">

        {/* ── LEFT — INPUTS inside one bordered card ── */}
        <Card className="border border-[#d2d2d7] rounded-2xl shadow-none">
          <CardContent className="p-7 space-y-8">

            {/* Car Price */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
                Car Price
              </label>
              <input
                type="number"
                placeholder="Enter car price"
                value={carPrice || ''}
                onChange={e => setCarPrice(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-[#d2d2d7] text-base outline-none focus:border-[#e8531a] transition-colors"
              />
              <p className="text-xs text-[#6e6e73] mt-2">
                {carPrice > 0 ? formatNPR(carPrice) : 'Enter amount above'}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-[#d2d2d7]" />

            {/* Down Payment */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
                Down Payment
              </label>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="number"
                  value={downPayment || ''}
                  onChange={e => handleDownAmount(Number(e.target.value))}
                  placeholder="Amount"
                  className="px-4 py-3 rounded-xl border border-[#d2d2d7] text-base outline-none focus:border-[#e8531a] transition-colors"
                />
                <div className="relative">
                  <input
                    type="number"
                    min={10} max={50}
                    value={downPct}
                    onChange={e => setDownPct(Math.min(50, Math.max(10, Number(e.target.value))))}
                    className="w-full px-4 py-3 pr-8 rounded-xl border border-[#d2d2d7] text-base outline-none focus:border-[#e8531a] transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e6e73]">%</span>
                </div>
              </div>
              <input
                type="range" min={10} max={50} step={1}
                value={downPct}
                onChange={e => setDownPct(Number(e.target.value))}
                className="w-full accent-[#e8531a]"
              />
              <div className="flex justify-between text-xs text-[#6e6e73] mt-1">
                <span>10%</span><span>50%</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#d2d2d7]" />

            {/* Loan Tenure */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
                Loan Tenure
              </label>
              <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5,6,7].map(yr => (
                  <button
                    key={yr}
                    onClick={() => setTenure(yr)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      tenure === yr
                        ? 'bg-[#1d1d1f] text-white'
                        : 'bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:border-[#1d1d1f]'
                    }`}
                  >
                    {yr}yr
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#d2d2d7]" />

            {/* Interest Rate */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
                Interest Rate
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setInterestRate(r => Math.max(8, Math.round((r - 0.25) * 100) / 100))}
                  className="w-10 h-11 border border-[#d2d2d7] rounded-l-lg bg-white text-xl text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                >−</button>
                <div className="px-6 py-2.5 border-t border-b border-[#d2d2d7] text-base font-medium min-w-[90px] text-center">
                  {interestRate}%
                </div>
                <button
                  onClick={() => setInterestRate(r => Math.min(18, Math.round((r + 0.25) * 100) / 100))}
                  className="w-10 h-11 border border-[#d2d2d7] rounded-r-lg bg-white text-xl text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                >+</button>
              </div>
              <p className="text-xs text-[#6e6e73] mt-2">
                Average Nepal bank car loan rate: 10–11%
              </p>
            </div>

          </CardContent>
        </Card>

        {/* ── RIGHT — Results + EMI Tips + Popular Terms ── */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-8 h-fit">

          {/* RESULTS CARD */}
          <Card className="border border-[#d2d2d7] rounded-2xl shadow-none">
            <CardContent className="p-7">

              <p className="text-xs uppercase tracking-wider text-[#6e6e73] mb-2">
                Monthly Installment
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#e8531a]">{formatNPR(emi)}</span>
                <span className="text-base text-[#6e6e73]">/ month</span>
              </div>

              <div className="border-t border-[#d2d2d7] my-5" />

              <div className="space-y-3">
                {([
                  ['Car Price',      formatNPR(carPrice)],
                  ['Down Payment',   formatNPR(downPayment)],
                  ['Loan Amount',    formatNPR(loanAmount)],
                  ['Interest Rate',  `${interestRate}%`],
                  ['Loan Tenure',    `${tenure} years`],
                  ['Total Interest', formatNPR(Math.round(totalInterest))],
                ] as [string,string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-sm text-[#6e6e73]">{label}</span>
                    <span className="text-sm text-[#1d1d1f]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1d1d1f] my-3" />

              <div className="flex justify-between">
                <span className="text-sm font-semibold text-[#1d1d1f]">Total Payment</span>
                <span className="text-sm font-semibold text-[#1d1d1f]">{formatNPR(Math.round(totalPayment))}</span>
              </div>

              <div className="border-t border-[#d2d2d7] my-5" />

              <button
                onClick={() => setShowAmort(!showAmort)}
                className="flex items-center gap-1 text-sm text-[#e8531a]"
              >
                {showAmort
                  ? <ChevronUp className="w-4 h-4" />
                  : <ChevronDown className="w-4 h-4" />}
                View year-by-year breakdown
              </button>

              {showAmort && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#f5f5f7]">
                        {['Year','Opening','EMI','Interest','Principal','Closing'].map(h => (
                          <th key={h} className="p-2 text-right text-[#6e6e73] font-medium first:text-left">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {amortRows.map((row, i) => (
                        <tr key={row.year} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f5f5f7]'}>
                          <td className="p-2">{row.year}</td>
                          <td className="p-2 text-right">{formatNPR(row.opening)}</td>
                          <td className="p-2 text-right">{formatNPR(row.emiPaid)}</td>
                          <td className="p-2 text-right text-[#e8531a]">{formatNPR(row.interest)}</td>
                          <td className="p-2 text-right">{formatNPR(row.principal)}</td>
                          <td className="p-2 text-right">{formatNPR(row.closing)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-[#d2d2d7] my-5" />

              <button
                onClick={copyResult}
                className="text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
              >
                Copy Result
              </button>

            </CardContent>
          </Card>

          {/* EMI TIPS CARD */}
          <Card className="border border-[#d2d2d7] rounded-2xl shadow-none">
            <CardContent className="p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f] mb-5">
                EMI Tips
              </h3>
              <div className="space-y-4">
                {emiTips.map((tip, i) => (
                  <div key={i} className="flex gap-3">
                    {/* Orange dot accent */}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e8531a] mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#1d1d1f]">{tip.title}</p>
                      <p className="text-xs text-[#6e6e73] mt-0.5 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* POPULAR LOAN TERMS CARD */}
          <Card className="border border-[#d2d2d7] rounded-2xl shadow-none">
            <CardContent className="p-7">
              <h3 className="text-base font-semibold text-[#1d1d1f] mb-5">
                Popular Loan Terms
              </h3>
              <div className="space-y-3">
                {popularTerms.map((term) => (
                  <div
                    key={term.tenure}
                    onClick={() => setTenure(term.tenure)}
                    className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all ${
                      tenure === term.tenure
                        ? 'border-[#e8531a] bg-[#fff8f5]'
                        : 'border-[#d2d2d7] hover:border-[#1d1d1f]'
                    }`}
                  >
                    <span className="text-sm text-[#1d1d1f]">{term.label}</span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        tenure === term.tenure
                          ? 'bg-[#e8531a] text-white'
                          : 'bg-[#f5f5f7] text-[#6e6e73]'
                      }`}
                    >
                      {term.tag}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#6e6e73] mt-4">
                Clicking a term updates the calculator above.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* BANK RATES */}
      <div className="bg-[#f5f5f7] mt-16 py-14 -mx-4 px-4 rounded-2xl">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-[#1d1d1f]">
            Compare Bank Loan Rates
          </h2>
          <p className="text-center text-[#6e6e73] mt-2 mb-10">
            Click any rate to use it in the calculator above
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {banks.map(bank => (
              <div
                key={bank.name}
                onClick={() => {
                  setInterestRate(bank.rate);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-2xl p-6 cursor-pointer hover:-translate-y-1 transition-all"
                style={{
                  border: bank.lowest ? '2px solid #e8531a' : '1px solid #d2d2d7',
                }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-semibold text-[#1d1d1f]">{bank.name}</h3>
                  {bank.lowest && (
                    <span className="bg-[#e8531a] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Lowest
                    </span>
                  )}
                </div>

                <div className="text-4xl font-bold text-[#e8531a] mt-3">{bank.rate}%</div>
                <div className="text-xs text-[#6e6e73] mb-1">per annum</div>

                <div className="border-t border-[#d2d2d7] my-4" />

                <div className="space-y-2">
                  {([
                    ['Max Tenure',     `${bank.tenure} years`],
                    ['Max Financing',  `${bank.financing}% of car value`],
                    ['Processing Fee', `${bank.fee}%`],
                  ] as [string,string][]).map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-xs text-[#6e6e73]">{label}</span>
                      <span className="text-xs font-medium text-[#1d1d1f]">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#d2d2d7] my-4" />

                <span className="text-sm text-[#e8531a] font-medium">Use this rate →</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#6e6e73] text-center mt-8">
            Rates are indicative and subject to change. Contact banks directly for latest rates and offers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculatorPage;