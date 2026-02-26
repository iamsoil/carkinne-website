"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EmiCalculator = () => {
  const [carPrice, setCarPrice] = useState<number>(3000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(10);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(300000);
  const [loanAmount, setLoanAmount] = useState<number>(2700000);

  // Calculate EMI
  const calculateEMI = () => {
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    
    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return Math.round(emi);
  };

  // Calculate total interest
  const calculateTotalInterest = () => {
    const emi = calculateEMI();
    const totalPayment = emi * loanTerm * 12;
    return totalPayment - loanAmount;
  };

  // Calculate total payment
  const calculateTotalPayment = () => {
    return loanAmount + calculateTotalInterest();
  };

  // Update calculations when inputs change
  const updateCalculations = () => {
    const downPayment = carPrice * (downPaymentPercent / 100);
    setDownPaymentAmount(downPayment);
    setLoanAmount(carPrice - downPayment);
  };

  // Update calculations when car price or down payment changes
  useState(() => {
    updateCalculations();
  });

  const emi = calculateEMI();
  const totalInterest = calculateTotalInterest();
  const totalPayment = calculateTotalPayment();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">EMI Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your monthly car loan payments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="carPrice">Car Price (Rs.)</Label>
                  <Input
                    id="carPrice"
                    type="number"
                    value={carPrice}
                    onChange={(e) => setCarPrice(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="downPaymentPercent">Down Payment (%)</Label>
                  <Input
                    id="downPaymentPercent"
                    type="number"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                  <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="4">4 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="6">6 Years</SelectItem>
                      <SelectItem value="7">7 Years</SelectItem>
                      <SelectItem value="8">8 Years</SelectItem>
                      <SelectItem value="9">9 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Down Payment</p>
                  <p className="text-xl font-bold text-orange-500">
                    Rs.{downPaymentAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-xl font-bold">
                    Rs.{loanAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly EMI</p>
                  <p className="text-xl font-bold text-green-500">
                    Rs.{emi.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Calculate EMI
              </Button>
            </CardContent>
          </Card>
          
          {/* Amortization Schedule */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Loan Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Principal</p>
                  <p className="text-lg font-bold">
                    Rs.{loanAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-lg font-bold text-red-500">
                    Rs.{totalInterest.toLocaleString('en-IN')}
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                  <p className="text-lg font-bold">
                    Rs.{totalPayment.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Payment Breakdown</h3>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-orange-500 h-4 rounded-full" 
                    style={{ width: `${(loanAmount / totalPayment) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Principal: {((loanAmount / totalPayment) * 100).toFixed(1)}%</span>
                  <span>Interest: {((totalInterest / totalPayment) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tips and Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>EMI Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Higher Down Payment</h4>
                <p className="text-sm text-muted-foreground">
                  Paying more upfront reduces your loan amount and total interest.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Compare Interest Rates</h4>
                <p className="text-sm text-muted-foreground">
                  Even a 1% difference can save lakhs in interest over the loan term.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Prepayment Benefits</h4>
                <p className="text-sm text-muted-foreground">
                  Making extra payments reduces principal and saves on interest.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Processing Fees</h4>
                <p className="text-sm text-muted-foreground">
                  Factor in processing fees, documentation charges, and insurance.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Popular Loan Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>5 Years (60 months)</span>
                  <span className="font-medium">Most Popular</span>
                </li>
                <li className="flex justify-between">
                  <span>3 Years (36 months)</span>
                  <span className="font-medium">Lower Interest</span>
                </li>
                <li className="flex justify-between">
                  <span>7 Years (84 months)</span>
                  <span className="font-medium">Lower EMI</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;