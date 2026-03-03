"use client";

import { useState, useEffect } from "react";

const BANKS = [
  { name: "NMB Bank", rate: 10.5, tenure: 7, finance: 80, fee: 0.5, best: false },
  { name: "Nabil Bank", rate: 10.75, tenure: 7, finance: 85, fee: 0.5, best: false },
  { name: "Everest Bank", rate: 10.25, tenure: 7, finance: 80, fee: 0.5, best: true },
  { name: "Sanima Bank", rate: 10.5, tenure: 6, finance: 80, fee: 0.5, best: false },
  { name: "Global IME Bank", rate: 11.0, tenure: 7, finance: 85, fee: 1.0, best: false },
  { name: "Laxmi Sunrise Bank", rate: 10.5, tenure: 7, finance: 80, fee: 0.5, best: false },
];

const IconPercent = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
)

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IconTrendDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
)

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
)

const IconBank = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2L2 7h20L12 2z"/>
  </svg>
)

const IconChevron = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

function formatNPR(amount: number): string {
  if (!amount) return "Rs. 0";
  const str = Math.round(amount).toString();
  if (str.length <= 3) return `Rs. ${str}`;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `Rs. ${formatted},${last3}`;
}

function calcEMI(principal: number, rate: number, months: number): number {
  if (!principal || !rate || !months) return 0;
  const r = rate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

interface EmiCalculatorProps {
  prefillPrice?: number;
}

export const EmiCalculator = ({ prefillPrice }: EmiCalculatorProps) => {
  const [carPrice, setCarPrice] = useState(prefillPrice || 3000000);
  const [carPriceInput, setCarPriceInput] = useState(prefillPrice?.toString() || "3000000");
  const [downPct, setDownPct] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [rate, setRate] = useState(10.5);
  const [showAmort, setShowAmort] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const downPayment = Math.round((carPrice * downPct) / 100);
  const loanAmount = carPrice - downPayment;
  const months = tenure * 12;
  const emi = calcEMI(loanAmount, rate, months);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  const amortRows = [];
  let balance = loanAmount;
  const monthlyRate = rate / 12 / 100;
  for (let y = 1; y <= tenure; y++) {
    let yearInterest = 0;
    let yearPrincipal = 0;
    const opening = balance;
    for (let m = 0; m < 12; m++) {
      const intPart = balance * monthlyRate;
      const prinPart = emi - intPart;
      yearInterest += intPart;
      yearPrincipal += prinPart;
      balance -= prinPart;
    }
    amortRows.push({
      year: y, opening,
      emiPaid: emi * 12,
      interest: yearInterest,
      principal: yearPrincipal,
      closing: balance < 0 ? 0 : balance,
    });
  }

  const copyResult = () => {
    const text = `EMI ${formatNPR(Math.round(emi))}/month | Car ${formatNPR(carPrice)} | Down ${formatNPR(downPayment)} | ${tenure}yr @ ${rate}% — carkinne.com`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBankClick = (bank: typeof BANKS[0]) => {
    setRate(bank.rate);
    setSelectedBank(bank.name);
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      color: '#1d1d1f',
      background: '#fff',
    }}>

      {/* HERO */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: isMobile ? '48px 16px 32px' : '60px 24px 40px',
      }}>
        <div style={{
          display: 'inline-block',
          background: '#fff8f5',
          border: '1px solid #e8531a',
          borderRadius: '6px',
          padding: '4px 14px',
          fontSize: '12px',
          fontWeight: '700',
          color: '#e8531a',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '16px',
        }}>
          EMI Calculator
        </div>
        <h1 style={{
          fontSize: isMobile ? '32px' : '42px',
          fontWeight: '800',
          letterSpacing: '-1.5px',
          margin: '0 0 8px',
          color: '#1d1d1f',
        }}>
          Car Loan EMI Calculator
        </h1>
        <p style={{
          fontSize: '17px',
          color: '#6e6e73',
          margin: 0,
        }}>
          Calculate your monthly installment with real Nepal bank rates
        </p>
      </div>

      {/* CALCULATOR */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: isMobile ? '0 16px 48px' : '0 24px 60px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '55% 43%',
        gap: '32px',
        alignItems: 'start',
      }}>
        {/* LEFT - INPUTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Car Price */}
          <div>
            <label style={{
              fontSize: '12px', fontWeight: '600', color: '#6e6e73',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              Car Price
            </label>
            <input
              type="number"
              value={carPriceInput}
              onChange={(e) => {
                setCarPriceInput(e.target.value);
                const v = parseInt(e.target.value);
                if (!isNaN(v)) setCarPrice(v);
              }}
              placeholder="Enter car price"
              style={{
                display: 'block', width: '100%', marginTop: '8px',
                padding: '12px 16px', fontSize: '16px',
                border: '1px solid #d2d2d7', borderRadius: '12px',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#e8531a'}
              onBlur={e => e.target.style.borderColor = '#d2d2d7'}
            />
            <p style={{ fontSize: '13px', color: '#6e6e73', marginTop: '6px' }}>
              {carPrice > 0 ? formatNPR(carPrice) : 'Enter amount above'}
            </p>
          </div>

          {/* Down Payment */}
          <div>
            <label style={{
              fontSize: '12px', fontWeight: '600', color: '#6e6e73',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              Down Payment
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px', marginTop: '8px',
            }}>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && carPrice > 0)
                    setDownPct(Math.round((v / carPrice) * 100));
                }}
                placeholder="Amount"
                style={{
                  padding: '12px 16px', fontSize: '15px',
                  border: '1px solid #d2d2d7', borderRadius: '12px',
                  outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#e8531a'}
                onBlur={e => e.target.style.borderColor = '#d2d2d7'}
              />
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  value={downPct}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v)) setDownPct(Math.min(50, Math.max(10, v)));
                  }}
                  style={{
                    padding: '12px 16px', fontSize: '15px',
                    border: '1px solid #d2d2d7', borderRadius: '12px',
                    outline: 'none', width: '100%',
                    boxSizing: 'border-box', fontFamily: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#e8531a'}
                  onBlur={e => e.target.style.borderColor = '#d2d2d7'}
                />
                <span style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#6e6e73', fontSize: '15px',
                }}>
                  %
                </span>
              </div>
            </div>
            <input
              type="range" min={10} max={50} value={downPct}
              onChange={(e) => setDownPct(parseInt(e.target.value))}
              style={{ width: '100%', marginTop: '12px', accentColor: '#e8531a' }}
            />
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '12px', color: '#6e6e73',
            }}>
              <span>10%</span><span>50%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <label style={{
              fontSize: '12px', fontWeight: '600', color: '#6e6e73',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              Loan Tenure
            </label>
            <div style={{
              display: 'flex', gap: '8px',
              marginTop: '8px', flexWrap: 'wrap',
            }}>
              {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setTenure(yr)}
                  style={{
                    padding: '8px 20px', borderRadius: '100px',
                    fontSize: '14px', fontWeight: '500',
                    cursor: 'pointer', border: '1px solid',
                    borderColor: tenure === yr ? '#e8531a' : '#d2d2d7',
                    background: tenure === yr ? '#e8531a' : '#fff',
                    color: tenure === yr ? '#fff' : '#1d1d1f',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                >
                  {yr}yr
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label style={{
              fontSize: '12px', fontWeight: '600', color: '#6e6e73',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              Interest Rate
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', marginTop: '8px',
            }}>
              <button
                onClick={() => setRate((r) => Math.max(8, Math.round((r - 0.25) * 100) / 100))}
                style={{
                  width: '40px', height: '44px',
                  border: '1px solid #d2d2d7',
                  borderRadius: '8px 0 0 8px',
                  background: '#fff', fontSize: '18px',
                  cursor: 'pointer', color: '#1d1d1f',
                  fontFamily: 'inherit',
                }}
              >
                −
              </button>
              <div style={{
                padding: '10px 24px',
                border: '1px solid #d2d2d7',
                borderLeft: 'none', borderRight: 'none',
                fontSize: '16px', fontWeight: '500',
                minWidth: '80px', textAlign: 'center',
              }}>
                {rate}%
              </div>
              <button
                onClick={() => setRate((r) => Math.min(18, Math.round((r + 0.25) * 100) / 100))}
                style={{
                  width: '40px', height: '44px',
                  border: '1px solid #d2d2d7',
                  borderRadius: '0 8px 8px 0',
                  background: '#fff', fontSize: '18px',
                  cursor: 'pointer', color: '#1d1d1f',
                  fontFamily: 'inherit',
                }}
              >
                +
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#6e6e73', marginTop: '6px' }}>
              Average Nepal bank car loan rate: 10–11%
            </p>
          </div>
        </div>

        {/* RIGHT - RESULTS */}
        <div style={{
          position: isMobile ? 'relative' : 'sticky',
          top: '24px',
          background: '#fff',
          border: '1.5px solid #e8531a',
          borderRadius: '16px',
          padding: '28px',
        }}>
          <p style={{
            fontSize: '12px', fontWeight: '600', color: '#6e6e73',
            letterSpacing: '1px', textTransform: 'uppercase', margin: 0,
          }}>
            Monthly Installment
          </p>
          <div style={{
            display: 'flex', alignItems: 'baseline',
            gap: '8px', marginTop: '8px',
          }}>
            <span style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: '800', color: '#e8531a',
              letterSpacing: '-1px',
            }}>
              {formatNPR(Math.round(emi))}
            </span>
            <span style={{ fontSize: '15px', color: '#6e6e73' }}>/ month</span>
          </div>

          <div style={{ height: '1px', background: '#f0f0f0', margin: '20px 0' }} />

          {([
            ['Car Price', formatNPR(carPrice)],
            ['Down Payment', formatNPR(downPayment)],
            ['Loan Amount', formatNPR(loanAmount)],
            ['Interest Rate', `${rate}%`],
            ['Loan Tenure', `${tenure} years`],
            ['Total Interest', formatNPR(Math.round(totalInterest))],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
            }}>
              <span style={{ fontSize: '14px', color: '#6e6e73' }}>{label}</span>
              <span style={{ fontSize: '14px', color: '#1d1d1f', fontWeight: '500' }}>{value}</span>
            </div>
          ))}

          <div style={{ height: '1px', background: '#1d1d1f', margin: '8px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
              Total Payment
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1d1d1f' }}>
              {formatNPR(Math.round(totalPayment))}
            </span>
          </div>

          <div style={{ height: '1px', background: '#f0f0f0', margin: '20px 0' }} />

          <button
            onClick={() => setShowAmort(!showAmort)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', color: '#e8531a', padding: 0,
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: 'inherit', fontWeight: '600',
            }}
          >
            <IconChevron open={showAmort} />
            Year-by-year breakdown
          </button>

          {showAmort && (
            <div style={{ marginTop: '16px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#fff8f5' }}>
                    {['Year', 'Opening', 'EMI', 'Interest', 'Principal', 'Closing'].map(h => (
                      <th key={h} style={{
                        padding: '8px 6px', textAlign: 'right',
                        color: '#6e6e73', fontWeight: '600',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {amortRows.map((row, i) => (
                    <tr key={row.year} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                      <td style={{ padding: '6px', textAlign: 'right' }}>{row.year}</td>
                      <td style={{ padding: '6px', textAlign: 'right' }}>{formatNPR(Math.round(row.opening))}</td>
                      <td style={{ padding: '6px', textAlign: 'right' }}>{formatNPR(Math.round(row.emiPaid))}</td>
                      <td style={{ padding: '6px', textAlign: 'right', color: '#e8531a' }}>{formatNPR(Math.round(row.interest))}</td>
                      <td style={{ padding: '6px', textAlign: 'right' }}>{formatNPR(Math.round(row.principal))}</td>
                      <td style={{ padding: '6px', textAlign: 'right' }}>{formatNPR(Math.round(row.closing))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ height: '1px', background: '#f0f0f0', margin: '20px 0' }} />

          <button
            onClick={copyResult}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '13px', color: copied ? '#22c55e' : '#6e6e73',
              padding: 0, display: 'flex', alignItems: 'center',
              gap: '6px', fontFamily: 'inherit', transition: 'color 0.2s',
            }}
          >
            {copied ? <IconCheck /> : <IconCopy />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
        </div>
      </div>

      {/* BANK RATES */}
      <div style={{ background: '#f5f5f7', padding: isMobile ? '48px 16px' : '60px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: '#fff8f5',
            border: '1px solid #e8531a',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#e8531a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            Bank Rates
          </div>
          <h2 style={{
            fontSize: isMobile ? '26px' : '32px',
            fontWeight: '800', color: '#1d1d1f',
            margin: '0 0 8px', letterSpacing: '-1px',
          }}>
            Compare Bank Loan Rates
          </h2>
          <p style={{
            fontSize: '15px', color: '#6e6e73',
            margin: '0 0 32px',
          }}>
            Click any bank to use its rate in the calculator
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {BANKS.map((bank) => {
              const isSelected = selectedBank === bank.name
              return (
                <div
                  key={bank.name}
                  onClick={() => handleBankClick(bank)}
                  style={{
                    background: isSelected ? '#fff8f5' : '#fff',
                    border: isSelected
                      ? '2px solid #e8531a'
                      : '1px solid #e5e5e5',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e8531a'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,83,26,0.12)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e5e5e5'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px',
                        background: isSelected ? '#e8531a' : '#f0f0f0',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? 'white' : '#6e6e73',
                        transition: 'all 0.2s',
                      }}>
                        <IconBank />
                      </div>
                      <h3 style={{
                        fontSize: '15px', fontWeight: '700',
                        color: '#1d1d1f', margin: 0,
                      }}>
                        {bank.name}
                      </h3>
                    </div>
                    {bank.best && (
                      <span style={{
                        background: '#e8531a', color: '#fff',
                        fontSize: '10px', padding: '3px 8px',
                        borderRadius: '100px', fontWeight: '700',
                        letterSpacing: '0.5px',
                      }}>
                        LOWEST
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#e8531a', letterSpacing: '-1px' }}>
                    {bank.rate}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#6e6e73', margin: '2px 0 16px' }}>
                    per annum
                  </div>

                  <div style={{ height: '1px', background: isSelected ? '#fde8da' : '#f0f0f0', margin: '12px 0' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Max Tenure', value: `${bank.tenure} years` },
                      { label: 'Max Finance', value: `${bank.finance}%` },
                      { label: 'Processing Fee', value: `${bank.fee}%` },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '11px', color: '#6e6e73' }}>{item.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1d1d1f', marginTop: '2px' }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    marginTop: '16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: isSelected ? '#e8531a' : '#6e6e73',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {isSelected ? (
                      <><IconCheck /> Using this rate</>
                    ) : (
                      'Use this rate →'
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <p style={{
            fontSize: '13px', color: '#6e6e73',
            textAlign: 'center', marginTop: '24px',
          }}>
            Rates are indicative and subject to change. Contact banks directly for latest offers.
          </p>
        </div>
      </div>

      {/* EMI TIPS */}
      <div style={{ padding: isMobile ? '48px 16px' : '60px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: '#fff8f5',
            border: '1px solid #e8531a',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#e8531a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            Tips
          </div>
          <h2 style={{
            fontSize: isMobile ? '26px' : '32px',
            fontWeight: '800', color: '#1d1d1f',
            margin: '0 0 8px', letterSpacing: '-1px',
          }}>
            EMI Tips for Nepal Car Buyers
          </h2>
          <p style={{
            fontSize: '15px', color: '#6e6e73',
            margin: '0 0 32px',
          }}>
            Make smarter decisions before taking a car loan.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            {[
              {
                Icon: IconTrendDown,
                title: 'Higher Down Payment = Lower EMI',
                desc: 'Paying 20–30% upfront significantly reduces your monthly burden and total interest paid.',
              },
              {
                Icon: IconPercent,
                title: 'Compare Rates Before Deciding',
                desc: 'Even 0.5% difference in interest rate can save you thousands over the loan tenure.',
              },
              {
                Icon: IconCalendar,
                title: 'Shorter Tenure = Less Interest',
                desc: 'A 5-year loan costs significantly less in total than a 7-year loan despite higher monthly EMI.',
              },
              {
                Icon: IconShield,
                title: 'Keep EMI Below 40% of Income',
                desc: 'Financial advisors recommend keeping total EMIs under 40% of monthly take-home pay.',
              },
              {
                Icon: IconClock,
                title: 'Processing Fees Add Up',
                desc: 'Factor in 0.5–1% processing fees when comparing banks — they affect your actual cost.',
              },
              {
                Icon: IconCheck,
                title: 'Check Pre-Payment Penalties',
                desc: 'Some Nepal banks charge fees for early loan repayment. Always check before signing.',
              },
            ].map((tip, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '14px',
                  padding: '22px',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#e8531a'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,83,26,0.12)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: '40px', height: '40px',
                  background: '#fff8f5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e8531a',
                  marginBottom: '14px',
                }}>
                  <tip.Icon />
                </div>
                <div style={{
                  fontSize: '14px', fontWeight: '700',
                  color: '#1d1d1f', marginBottom: '6px',
                }}>
                  {tip.title}
                </div>
                <div style={{
                  fontSize: '13px', color: '#6e6e73', lineHeight: 1.6,
                }}>
                  {tip.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POPULAR LOAN TERMS */}
      <div style={{ background: '#f5f5f7', padding: isMobile ? '48px 16px' : '60px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: '#fff8f5',
            border: '1px solid #e8531a',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#e8531a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            Loan Terms
          </div>
          <h2 style={{
            fontSize: isMobile ? '26px' : '32px',
            fontWeight: '800', color: '#1d1d1f',
            margin: '0 0 8px', letterSpacing: '-1px',
          }}>
            Popular Loan Terms in Nepal
          </h2>
          <p style={{
            fontSize: '15px', color: '#6e6e73',
            margin: '0 0 32px',
          }}>
            Quick reference for common car loan scenarios.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '16px',
          }}>
            {[
              {
                Icon: IconCalendar,
                term: '3 Year Loan',
                rate: '10.5%',
                note: 'Highest EMI, least interest paid overall. Good if you have strong cash flow.',
              },
              {
                Icon: IconCalendar,
                term: '5 Year Loan',
                rate: '10.5%',
                note: 'Most popular choice in Nepal. Balanced EMI and total interest.',
              },
              {
                Icon: IconCalendar,
                term: '7 Year Loan',
                rate: '10.5%',
                note: 'Lowest EMI but highest total interest. Good for budget-conscious buyers.',
              },
              {
                Icon: IconPercent,
                term: '10% Down Payment',
                rate: 'Minimum',
                note: 'Most banks require at least 10–15% down payment for car loans in Nepal.',
              },
              {
                Icon: IconShield,
                term: '80% Financing',
                rate: 'Standard',
                note: 'Most banks finance up to 80% of car value. Some offer up to 85%.',
              },
              {
                Icon: IconBank,
                term: 'Processing Fee',
                rate: '0.5–1%',
                note: 'One-time fee charged by banks when processing your car loan application.',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '14px',
                  padding: '22px',
                  transition: 'all 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#e8531a'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(232,83,26,0.12)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e5e5e5'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: '40px', height: '40px',
                  background: '#fff8f5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e8531a',
                  marginBottom: '14px',
                }}>
                  <item.Icon />
                </div>
                <div style={{
                  fontSize: '16px', fontWeight: '800',
                  color: '#e8531a', marginBottom: '2px',
                  letterSpacing: '-0.5px',
                }}>
                  {item.rate}
                </div>
                <div style={{
                  fontSize: '14px', fontWeight: '700',
                  color: '#1d1d1f', marginBottom: '6px',
                }}>
                  {item.term}
                </div>
                <div style={{
                  fontSize: '13px', color: '#6e6e73', lineHeight: 1.6,
                }}>
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmiCalculator;