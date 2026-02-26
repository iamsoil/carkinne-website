"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const EmiCalculatorPage = () => {
  const [carPrice, setCarPrice] = useState<number>(3000000);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(300000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(10);
  const [loanTenure, setLoanTenure] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Calculate EMI
  const calculateEMI = () => {
    const loanAmount = carPrice - downPaymentAmount;
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTenure * 12;
    
    if (monthlyInterestRate === 0) {
      return loanAmount / numberOfPayments;
    }
    
    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return Math.round(emi);
  };

  // Calculate total interest
  const calculateTotalInterest = () => {
    const emi = calculateEMI();
    const totalPayment = emi * loanTenure * 12;
    const loanAmount = carPrice - downPaymentAmount;
    return Math.round(totalPayment - loanAmount);
  };

  // Calculate total payment
  const calculateTotalPayment = () => {
    const loanAmount = carPrice - downPaymentAmount;
    return loanAmount + calculateTotalInterest();
  };

  // Update down payment percentage when amount changes
  useEffect(() => {
    if (carPrice > 0) {
      const percent = (downPaymentAmount / carPrice) * 100;
      setDownPaymentPercent(parseFloat(percent.toFixed(2)));
    }
  }, [downPaymentAmount, carPrice]);

  // Update down payment amount when percentage changes
  useEffect(() => {
    const amount = (downPaymentPercent / 100) * carPrice;
    setDownPaymentAmount(Math.round(amount));
  }, [downPaymentPercent, carPrice]);

  // Format price in Nepali format
  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString('en-IN')}`;
  };

  // Format price in lakh format
  const formatLakh = (price: number) => {
    const lakh = price / 100000;
    return `Rs. ${lakh.toFixed(2)} Lakh`;
  };

  // Calculate amortization schedule
  const calculateAmortization = () => {
    const emi = calculateEMI();
    const loanAmount = carPrice - downPaymentAmount;
    const monthlyInterestRate = interestRate / 12 / 100;
    let balance = loanAmount;
    const schedule = [];

    for (let year = 1; year <= loanTenure; year++) {
      let openingBalance = balance;
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let month = 1; month <= 12; month++) {
        const interest = balance * monthlyInterestRate;
        const principal = emi - interest;
        yearlyInterest += interest;
        yearlyPrincipal += principal;
        balance -= principal;
      }

      schedule.push({
        year,
        openingBalance: Math.round(openingBalance),
        emiPaid: Math.round(emi * 12),
        interest: Math.round(yearlyInterest),
        principal: Math.round(yearlyPrincipal),
        closingBalance: balance > 0 ? Math.round(balance) : 0
      });
    }

    return schedule;
  };

  const emi = calculateEMI();
  const totalInterest = calculateTotalInterest();
  const totalPayment = calculateTotalPayment();
  const amortizationSchedule = calculateAmortization();

  // Bank data
  const banks = [
    { name: 'NMB Bank', rate: 10.5, tenure: 7, financing: 80, fee: 0.5 },
    { name: 'Nabil Bank', rate: 10.75, tenure: 7, financing: 85, fee: 0.5 },
    { name: 'Everest Bank', rate: 10.25, tenure: 7, financing: 80, fee: 0.5 },
    { name: 'Sanima Bank', rate: 10.5, tenure: 6, financing: 80, fee: 0.5 },
    { name: 'Global IME', rate: 11.0, tenure: 7, financing: 85, fee: 1.0 },
    { name: 'Laxmi Sunrise', rate: 10.5, tenure: 7, financing: 80, fee: 0.5 }
  ];

  // Handle bank selection
  const handleBankSelect = (rate: number) => {
    setInterestRate(rate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Copy result to clipboard
  const copyResult = () => {
    const text = `Car EMI calculated on CarKinne.com
Car Price: ${formatPrice(carPrice)} | Down Payment: ${formatPrice(downPaymentAmount)}
EMI: ${formatPrice(emi)}/month for ${loanTenure} years at ${interestRate}%`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold mb-2">Car Loan EMI Calculator</h1>
        <p className="text-[#6e6e73]">Calculate your monthly installment with real Nepal bank rates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-8">
          {/* Car Price Section */}
          <div>
            <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
              Car Price
            </Label>
            <Input
              type="number"
              placeholder="Rs. 0"
              value={carPrice}
              onChange={(e) => setCarPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Down Payment Section */}
          <div>
            <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
              Down Payment
            </Label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  type="number"
                  placeholder="Rs. 0"
                  value={downPaymentAmount}
                  onChange={(e) => setDownPaymentAmount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="%"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-[#d2d2d7] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#e8531a]"
              />
              <div className="flex justify-between text-xs text-[#6e6e73] mt-1">
                <span>10%</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          {/* Loan Tenure Section */}
          <div>
            <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
              Loan Tenure
            </Label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((years) => (
                <button
                  key={years}
                  onClick={() => setLoanTenure(years)}
                  className={`px-5 py-2 rounded-full text-sm ${
                    loanTenure === years
                      ? 'bg-[#1d1d1f] text-white'
                      : 'bg-white border border-[#d2d2d7] text-[#1d1d1f]'
                  }`}
                >
                  {years}yr
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate Section */}
          <div>
            <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
              Annual Interest Rate
            </Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setInterestRate(prev => Math.max(8, prev - 0.25))}
                className="border-[#d2d2d7] w-9 h-9"
              >
                -
              </Button>
              <Input
                type="number"
                step="0.25"
                min="8"
                max="18"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setInterestRate(prev => Math.min(18, prev + 0.25))}
                className="border-[#d2d2d7] w-9 h-9"
              >
                +
              </Button>
            </div>
            <p className="text-xs text-[#6e6e73] mt-2">
              Average Nepal bank car loan rate: 10-11%
            </p>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:sticky lg:top-8">
          <Card className="border border-[#d2d2d7] rounded-xl">
            <CardContent className="p-7">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#6e6e73] mb-2">
                  Monthly Installment
                </p>
                <p className="text-4xl font-bold text-[#e8531a]">
                  {formatPrice(emi)}
                  <span className="text-lg font-normal text-[#6e6e73] ml-2">per month</span>
                </p>
              </div>

              <div className="border-t border-[#d2d2d7] my-6"></div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] text-sm">Car Price</span>
                  <span className="text-[#1d1d1f] text-sm">{formatPrice(carPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] text-sm">Down Payment</span>
                  <span className="text-[#1d1d1f] text-sm">{formatPrice(downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] text-sm">Loan Amount</span>
                  <span className="text-[#1d1d1f] text-sm">{formatPrice(carPrice - downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] text-sm">Interest Rate</span>
                  <span className="text-[#1d1d1f] text-sm">{interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] text-sm">Loan Tenure</span>
                  <span className="text-[#1d1d1f] text-sm">{loanTenure} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e6e73] text-sm">Total Interest</span>
                  <span className="text-[#1d1d1f] text-sm">{formatPrice(totalInterest)}</span>
                </div>
                <div className="border-t border-[#d2d2d7] my-2"></div>
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1d1d1f] text-sm">Total Payment</span>
                  <span className="text-[#1d1d1f] text-sm">{formatPrice(totalPayment)}</span>
                </div>
              </div>

              <div className="border-t border-[#d2d2d7] my-6"></div>

              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="flex items-center text-[#e8531a] text-sm"
              >
                View year-by-year breakdown
                {showAmortization ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </button>

              {showAmortization && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#f5f5f7]">
                        <th className="text-left p-2">Year</th>
                        <th className="text-right p-2">Opening</th>
                        <th className="text-right p-2">EMI Paid</th>
                        <th className="text-right p-2">Interest</th>
                        <th className="text-right p-2">Principal</th>
                        <th className="text-right p-2">Closing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.map((row, index) => (
                        <tr key={row.year} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f5f5f7]'}>
                          <td className="p-2">{row.year}</td>
                          <td className="p-2 text-right">{formatLakh(row.openingBalance)}</td>
                          <td className="p-2 text-right">{formatLakh(row.emiPaid)}</td>
                          <td className="p-2 text-right">{formatLakh(row.interest)}</td>
                          <td className="p-2 text-right">{formatLakh(row.principal)}</td>
                          <td className="p-2 text-right">{formatLakh(row.closingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border-t border-[#d2d2d7] my-6"></div>

              <button
                onClick={copyResult}
                className="text-[#6e6e73] text-sm hover:text-[#1d1d1f]"
              >
                Copy result
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bank Comparison Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Compare Car Loan Rates</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f5f5f7]">
                <th className="text-left p-4 text-xs uppercase tracking-wider text-[#6e6e73]">Bank Name</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-[#6e6e73]">Interest Rate</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-[#6e6e73]">Max Tenure</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-[#6e6e73]">Max Financing</th>
                <th className="text-left p-4 text-xs uppercase tracking-wider text-[#6e6e73]">Processing Fee</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank, index) => (
                <tr 
                  key={bank.name} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f5f5f7]'} ${bank.rate === 10.25 ? 'border-l-4 border-l-[#e8531a]' : ''}`}
                  onClick={() => handleBankSelect(bank.rate)}
                >
                  <td className="p-4 border-t border-[#d2d2d7]">
                    <div className="flex items-center">
                      {bank.rate === 10.25 && (
                        <span className="bg-[#e8531a] text-white text-xs px-2 py-1 rounded mr-2">Best Rate</span>
                      )}
                      {bank.name}
                    </div>
                  </td>
                  <td className="p-4 border-t border-[#d2d2d7] text-[#e8531a] font-medium cursor-pointer">
                    {bank.rate}%
                  </td>
                  <td className="p-4 border-t border-[#d2d2d7]">{bank.tenure} years</td>
                  <td className="p-4 border-t border-[#d2d2d7]">{bank.financing}%</td>
                  <td className="p-4 border-t border-[#d2d2d7]">{bank.fee}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[#6e6e73] text-sm text-center mt-4">
          Rates are indicative. Contact banks directly for current rates.
        </p>
      </div>
    </div>
  );
};

export default EmiCalculatorPage;