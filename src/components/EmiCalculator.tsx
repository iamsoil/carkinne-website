"use client";

import { useState } from "react";

const BANKS = [
  { name: "NMB Bank", rate: 10.5, tenure: 7, finance: 80, fee: 0.5, best: false },
  { name: "Nabil Bank", rate: 10.75, tenure: 7, finance: 85, fee: 0.5, best: false },
  { name: "Everest Bank", rate: 10.25, tenure: 7, finance: 80, fee: 0.5, best: true },
  { name: "Sanima Bank", rate: 10.5, tenure: 6, finance: 80, fee: 0.5, best: false },
  { name: "Global IME Bank", rate: 11.0, tenure: 7, finance: 85, fee: 1.0, best: false },
  { name: "Laxmi Sunrise Bank", rate: 10.5, tenure: 7, finance: 80, fee: 0.5, best: false },
];

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

export const EmiCalculator = () => {
  const [carPrice, setCarPrice] = useState(3000000);
  const [carPriceInput, setCarPriceInput] = useState("3000000");
  const [downPct, setDownPct] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [rate, setRate] = useState(10.5);
  const [showAmort, setShowAmort] = useState(false);

  const downPayment = Math.round((carPrice * downPct) / 100);
  const loanAmount = carPrice - downPayment;
  const months = tenure * 12;
  const emi = calcEMI(loanAmount, rate, months);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;

  // Amortization table
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
      year: y,
      opening,
      emiPaid: emi * 12,
      interest: yearInterest,
      principal: yearPrincipal,
      closing: balance < 0 ? 0 : balance,
    });
  }

  const copyResult = () => {
    const text = `EMI ${formatNPR(Math.round(emi))}/month | Car ${formatNPR(carPrice)} | Down ${formatNPR(downPayment)} | ${tenure}yr @ ${rate}% — carkinne.com`;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", color: "#1d1d1f", background: "#fff" }}>

      {/* PAGE HEADER */}
      <div style={{ textAlign: "center", padding: "60px 24px 40px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: -1, margin: 0 }}>
          Car Loan EMI Calculator
        </h1>
        <p style={{ fontSize: 18, color: "#6e6e73", marginTop: 8 }}>
          Calculate your monthly installment with real Nepal bank rates
        </p>
      </div>

      {/* CALCULATOR — TWO COLUMNS */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px 60px",
          display: "grid",
          gridTemplateColumns: "55% 43%",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* LEFT — INPUTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Car Price */}
          <div>
            <label
              style={{
                fontSize: 12, fontWeight: 500, color: "#6e6e73",
                letterSpacing: 1, textTransform: "uppercase",
              }}
            >
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
                display: "block", width: "100%", marginTop: 8,
                padding: "12px 16px", fontSize: 16,
                border: "1px solid #d2d2d7", borderRadius: 12,
                outline: "none", boxSizing: "border-box",
              }}
            />
            <p style={{ fontSize: 13, color: "#6e6e73", marginTop: 6 }}>
              {carPrice > 0 ? formatNPR(carPrice) : "Enter amount above"}
            </p>
          </div>

          {/* Down Payment */}
          <div>
            <label
              style={{
                fontSize: 12, fontWeight: 500, color: "#6e6e73",
                letterSpacing: 1, textTransform: "uppercase",
              }}
            >
              Down Payment
            </label>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}
            >
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
                  padding: "12px 16px", fontSize: 15,
                  border: "1px solid #d2d2d7", borderRadius: 12, outline: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  value={downPct}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v)) setDownPct(Math.min(50, Math.max(10, v)));
                  }}
                  style={{
                    padding: "12px 16px", fontSize: 15,
                    border: "1px solid #d2d2d7", borderRadius: 12,
                    outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                />
                <span
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)", color: "#6e6e73", fontSize: 15,
                  }}
                >
                  %
                </span>
              </div>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={downPct}
              onChange={(e) => setDownPct(parseInt(e.target.value))}
              style={{ width: "100%", marginTop: 12, accentColor: "#e8531a" }}
            />
            <div
              style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6e6e73" }}
            >
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <label
              style={{
                fontSize: 12, fontWeight: 500, color: "#6e6e73",
                letterSpacing: 1, textTransform: "uppercase",
              }}
            >
              Loan Tenure
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setTenure(yr)}
                  style={{
                    padding: "8px 20px", borderRadius: 100, fontSize: 14,
                    fontWeight: 500, cursor: "pointer", border: "1px solid",
                    borderColor: tenure === yr ? "#1d1d1f" : "#d2d2d7",
                    background: tenure === yr ? "#1d1d1f" : "#fff",
                    color: tenure === yr ? "#fff" : "#1d1d1f",
                    transition: "all 0.2s",
                  }}
                >
                  {yr}yr
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label
              style={{
                fontSize: 12, fontWeight: 500, color: "#6e6e73",
                letterSpacing: 1, textTransform: "uppercase",
              }}
            >
              Interest Rate
            </label>
            <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
              <button
                onClick={() =>
                  setRate((r) => Math.max(8, Math.round((r - 0.25) * 100) / 100))
                }
                style={{
                  width: 40, height: 44, border: "1px solid #d2d2d7",
                  borderRadius: "8px 0 0 8px", background: "#fff",
                  fontSize: 18, cursor: "pointer", color: "#1d1d1f",
                }}
              >
                −
              </button>
              <div
                style={{
                  padding: "10px 24px", border: "1px solid #d2d2d7",
                  borderLeft: "none", borderRight: "none",
                  fontSize: 16, fontWeight: 500, minWidth: 80, textAlign: "center",
                }}
              >
                {rate}%
              </div>
              <button
                onClick={() =>
                  setRate((r) => Math.min(18, Math.round((r + 0.25) * 100) / 100))
                }
                style={{
                  width: 40, height: 44, border: "1px solid #d2d2d7",
                  borderRadius: "0 8px 8px 0", background: "#fff",
                  fontSize: 18, cursor: "pointer", color: "#1d1d1f",
                }}
              >
                +
              </button>
            </div>
            <p style={{ fontSize: 13, color: "#6e6e73", marginTop: 6 }}>
              Average Nepal bank car loan rate: 10–11%
            </p>
          </div>
        </div>

        {/* RIGHT — RESULTS CARD */}
        <div
          style={{
            position: "sticky", top: 24,
            background: "#fff", border: "1px solid #d2d2d7",
            borderRadius: 16, padding: 28,
          }}
        >
          <p
            style={{
              fontSize: 12, fontWeight: 500, color: "#6e6e73",
              letterSpacing: 1, textTransform: "uppercase", margin: 0,
            }}
          >
            Monthly Installment
          </p>
          <div
            style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}
          >
            <span style={{ fontSize: 36, fontWeight: 700, color: "#e8531a" }}>
              {formatNPR(Math.round(emi))}
            </span>
            <span style={{ fontSize: 15, color: "#6e6e73" }}>/ month</span>
          </div>

          <div style={{ height: 1, background: "#d2d2d7", margin: "20px 0" }} />

          {/* Breakdown rows */}
          {(
            [
              ["Car Price", formatNPR(carPrice)],
              ["Down Payment", formatNPR(downPayment)],
              ["Loan Amount", formatNPR(loanAmount)],
              ["Interest Rate", `${rate}%`],
              ["Loan Tenure", `${tenure} years`],
              ["Total Interest", formatNPR(Math.round(totalInterest))],
            ] as [string, string][]
          ).map(([label, value]) => (
            <div
              key={label}
              style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}
            >
              <span style={{ fontSize: 14, color: "#6e6e73" }}>{label}</span>
              <span style={{ fontSize: 14, color: "#1d1d1f" }}>{value}</span>
            </div>
          ))}

          <div style={{ height: 1, background: "#1d1d1f", margin: "8px 0" }} />

          <div
            style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1d1d1f" }}>
              Total Payment
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1d1d1f" }}>
              {formatNPR(Math.round(totalPayment))}
            </span>
          </div>

          <div style={{ height: 1, background: "#d2d2d7", margin: "20px 0" }} />

          {/* Amortization toggle */}
          <button
            onClick={() => setShowAmort(!showAmort)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 14, color: "#e8531a", padding: 0,
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            {showAmort ? "▲" : "▼"} View year-by-year breakdown
          </button>

          {showAmort && (
            <div style={{ marginTop: 16, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f5f5f7" }}>
                    {["Year", "Opening", "EMI", "Interest", "Principal", "Closing"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "8px 6px", textAlign: "right",
                            color: "#6e6e73", fontWeight: 500,
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {amortRows.map((row, i) => (
                    <tr
                      key={row.year}
                      style={{ background: i % 2 === 0 ? "#fff" : "#f5f5f7" }}
                    >
                      <td style={{ padding: "6px", textAlign: "right" }}>{row.year}</td>
                      <td style={{ padding: "6px", textAlign: "right" }}>
                        {formatNPR(Math.round(row.opening))}
                      </td>
                      <td style={{ padding: "6px", textAlign: "right" }}>
                        {formatNPR(Math.round(row.emiPaid))}
                      </td>
                      <td style={{ padding: "6px", textAlign: "right", color: "#e8531a" }}>
                        {formatNPR(Math.round(row.interest))}
                      </td>
                      <td style={{ padding: "6px", textAlign: "right" }}>
                        {formatNPR(Math.round(row.principal))}
                      </td>
                      <td style={{ padding: "6px", textAlign: "right" }}>
                        {formatNPR(Math.round(row.closing))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ height: 1, background: "#d2d2d7", margin: "20px 0" }} />

          <button
            onClick={copyResult}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: "#6e6e73", padding: 0,
            }}
          >
            Copy Result
          </button>
        </div>
      </div>

      {/* BANK RATES SECTION */}
      <div style={{ background: "#f5f5f7", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto<dyad-write path="src/pages/Showrooms.tsx" description="Creating Showrooms page with city filters, brand dropdown, and Google Maps integration">
"use client";

import { useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Showrooms = () => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  // Sample showroom data
  const showrooms = [
    {
      id: '1',
      name: 'Suzuki Nepal Pvt. Ltd.',
      brand: 'Suzuki',
      city: 'Kathmandu',
      address: 'Naxal, Kathmandu',
      phone: '01-4413071',
      hours: 'Sun-Fri 9:00am - 6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Suzuki+Nepal+Naxal'
    },
    {
      id: '2',
      name: 'United Traders Syndicate (Toyota)',
      brand: 'Toyota',
      city: 'Kathmandu',
      address: 'Naxal, Kathmandu',
      phone: '01-4413100',
      hours: 'Sun-Fri 9:00am - 6:00pm',
      mapsUrl: 'https://maps.google.com/?q=United+Traders+Syndicate+Naxal'
    },
    {
      id: '3',
      name: 'Laxmi Intercontinental (Hyundai)',
      brand: 'Hyundai',
      city: 'Lalitpur',
      address: 'Jawalakhel, Lalitpur',
      phone: '01-5522480',
      hours: 'Sun-Fri 9:00am - 6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Laxmi+Intercontinental+Jawalakhel'
    },
    {
      id: '4',
      name: 'Sipradi Trading (Kia)',
      brand: 'Kia',
      city: 'Kathmandu',
      address: 'Naxal, Kathmandu',
      phone: '01-4422100',
      hours: 'Sun-Fri 9:00am - 6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Sipradi+Trading+Naxal'
    },
    {
      id: '5',
      name: 'Syakar Trading (MG)',
      brand: 'MG',
      city: 'Kathmandu',
      address: 'Gairidhara, Kathmandu',
      phone: '01-4002555',
      hours: 'Sun-Fri 9:00am - 6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Syakar+Trading+Gairidhara'
    },
    {
      id: '6',
      name: 'Sharma Transport (Honda)',
      brand: 'Honda',
      city: 'Kathmandu',
      address: 'Tripureshwor, Kathmandu',
      phone: '01-4260388',
      hours: 'Sun-Fri 9:00am - 6:00pm',
      mapsUrl: 'https://maps.google.com/?q=Sharma+Transport+Tripureshwor'
    }
  ];

  const cities = ['All', 'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Biratnagar', 'Butwal', 'Chitwan', 'Dharan'];
  const brands = ['All', 'Suzuki', 'Toyota', 'Hyundai', 'Kia', 'MG', 'Honda', 'Nissan', 'BYD'];

  // Filter showrooms based on selected city and brand
  const filteredShowrooms = showrooms.filter(showroom => {
    const cityMatch = selectedCity === 'All' || showroom.city === selectedCity;
    const brandMatch = selectedBrand === 'All' || showroom.brand === selectedBrand;
    return cityMatch && brandMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-semibold mb-2">Car Showrooms in Nepal</h1>
        <p className="text-[#6e6e73]">Find authorized dealers near you</p>
      </div>

      {/* City Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              selectedCity === city
                ? 'bg-[#1d1d1f] text-white rounded-full'
                : 'bg-white border border-[#d2d2d7] text-[#1d1d1f] rounded-full'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-8">
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Google Maps Embed */}
        <div className="lg:order-2">
          <div className="border border-[#d2d2d7] rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.27776862953!2d85.29111453057422!3d27.708968424465493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2snp!4v1234567890"
              width="100%"
              height="500"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Showroom List */}
        <div className="lg:order-1">
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredShowrooms.map((showroom) => (
              <div 
                key={showroom.id} 
                className="border border-[#d2d2d7] rounded-xl p-5 bg-white"
              >
                <div className="flex items-start">
                  <div className="bg-[#f5f5f7] w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="font-bold text-[#1d1d1f]">
                      {showroom.brand.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1d1d1f] text-base">
                      {showroom.name}
                    </h3>
                    <p className="text-[#6e6e73] text-sm mb-2">
                      {showroom.brand}
                    </p>
                    <div className="flex items-center text-[#6e6e73] text-sm mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{showroom.address}, {showroom.city}</span>
                    </div>
                    <div className="flex items-center text-[#1d1d1f] text-sm mb-1">
                      <Phone className="h-4 w-4 mr-1" />
                      <a href={`tel:${showroom.phone}`} className="hover:text-[#e8531a]">
                        {showroom.phone}
                      </a>
                    </div>
                    <div className="flex items-center text-[#6e6e73] text-sm mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{showroom.hours}</span>
                    </div>
                    <a 
                      href={showroom.mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#e8531a] text-sm flex items-center hover:underline"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showrooms;