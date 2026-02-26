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
    { name: 'Everest Bank', rate: 10.25, tenure: 7, financing: 80, fee: 0.5, lowest: true },
    { name: 'Sanima Bank', rate: 10.5, tenure: 6, financing: 80, fee: 0.5 },
    { name: 'Global IME Bank', rate: 11.0, tenure: 7, financing: 85, fee: 1.0 },
    { name: 'Laxmi Sunrise Bank', rate: 10.5, tenure: 7, financing: 80, fee: 0.5 }
  ];

  // Handle bank selection
  const handleBankSelect = (rate: number) => {
    setInterestRate(rate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Copy result to clipboard
  const copyResult = () => {
    const text = `EMI ${formatPrice(emi)}/month | Car ${formatPrice(carPrice)} | Down ${formatPrice(downPaymentAmount)} | ${loanTenure}yr @ ${interestRate}% — carkinne.com`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">Car Loan EMI Calculator</h1>
        <p className="text-[#6e6e73] mt-2">Calculate your monthly installment with real Nepal bank rates</p>
      </div>

      {/* Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-8">
          {/* Car Price */}
          <div>
            <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
              CAR PRICE
            </Label>
            <Input
              type="number"
              placeholder="Enter car price"
              value={carPrice}
              onChange={(e) => setCarPrice(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-[#6e6e73] mt-2">Or search a car above to auto-fill</p>
          </div>

          {/* Down Payment */}
          <div>
            <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
              DOWN PAYMENT
            </Label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                type="number"
                value={downPaymentAmount}
                onChange={(e) => setDownPaymentAmount(Number(e.target.value))}
                className="w-full"
              />
              <Input
                type="number"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full"
              />
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

          {/* Loan Tenure */}
          <div>
            <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
              LOAN TENURE
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

          {/* Interest Rate */}
          <div>
            <Label className="block text-xs uppercase tracking-wider text-[#6e6e73] mb-3">
              INTEREST RATE
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
              Average Nepal bank rate: 10–11%
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
                <p className="text-4xl font-bold text-[#e8531a] inline">
                  {formatPrice(emi)}
                </p>
                <span className="text-lg text-[#6e6e73] ml-2">/ month</span>
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
                Copy Result
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bank Rates Section */}
      <div className="bg-[#f5f5f7] mt-16 py-12 -mx-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-[#1d1d1f]">Compare Bank Loan Rates</h2>
          <p className="text-center text-[#6e6e73] mt-2 mb-10">Click any rate to use it in the calculator</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.map((bank) => (
              <Card 
                key={bank.name}
                className="border border-[#d2d2d7] rounded-xl p-6 cursor-pointer hover:border-[#1d1d1f] hover:-translate-y-0.5 transition-all"
                onClick={() => handleBankSelect(bank.rate)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-[#1d1d1f]">{bank.name}</h3>
                  {bank.lowest && (
                    <span className="bg-[#e8531a] text-white text-xs px-2 py-1 rounded-full">Lowest Rate</span>
                  )}
                </div>
                <p className="text-3xl font-bold text-[#e8531a]">{bank.rate}%</p>
                <p className="text-xs text-[#6e6e73]">per annum</p>
                
                <div className="border-t border-[#d2d2d7] my-4"></div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[#6e6e73]">Max Tenure</span>
                    <span className="text-sm font-medium text-[#1d1d1f]">{bank.tenure} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#6e6e73]">Max Financing</span>
                    <span className="text-sm font-medium text-[#1d1d1f]">{bank.financing}% of car value</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#6e6e73]">Processing Fee</span>
                    <span className="text-sm font-medium text-[#1d1d1f]">{bank.fee}%</span>
                  </div>
                </div>
                
                <p className="text-[#e8531a] text-sm mt-4">Use this rate</p>
              </Card>
            ))}
          </div>
          
          <p className="text-[#6e6e73] text-sm text-center mt-6">
            Rates shown are indicative and subject to change. Contact banks directly for latest rates and offers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculatorPage;