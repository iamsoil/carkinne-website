"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmiCalculatorProps {
  prefillPrice?: number;
}

export const EmiCalculator = ({ prefillPrice }: EmiCalculatorProps) => {
  const [carPrice, setCarPrice] = useState<number>(prefillPrice || 3000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(10);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(10);

  // Calculate EMI
  const calculateEMI = () => {
    const downPayment = carPrice * (downPaymentPercent / 100);
    const loanAmount = carPrice - downPayment;
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    
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
    const totalPayment = emi * loanTerm * 12;
    const downPayment = carPrice * (downPaymentPercent / 100);
    const loanAmount = carPrice - downPayment;
    return totalPayment - loanAmount;
  };

  // Calculate total payment
  const calculateTotalPayment = () => {
    const downPayment = carPrice * (downPaymentPercent / 100);
    const loanAmount = carPrice - downPayment;
    return loanAmount + calculateTotalInterest();
  };

  const emi = calculateEMI();
  const totalInterest = calculateTotalInterest();
  const totalPayment = calculateTotalPayment();
  const downPaymentAmount = carPrice * (downPaymentPercent / 100);
  const loanAmount = carPrice - downPaymentAmount;

  // Format price in Nepali format
  const formatPrice = (price: number) => {
    return `Rs.${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
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
            {formatPrice(downPaymentAmount)}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Loan Amount</p>
          <p className="text-xl font-bold">
            {formatPrice(loanAmount)}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Monthly EMI</p>
          <p className="text-xl font-bold text-green-500">
            {formatPrice(emi)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Principal</p>
          <p className="text-lg font-bold">
            {formatPrice(loanAmount)}
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Interest</p>
          <p className="text-lg font-bold text-red-500">
            {formatPrice(totalInterest)}
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Payment</p>
          <p className="text-lg font-bold">
            {formatPrice(totalPayment)}
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
    </div>
  );
};