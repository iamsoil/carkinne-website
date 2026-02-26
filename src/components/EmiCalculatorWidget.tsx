import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatPrice, formatEMI } from '@/utils/formatters';

interface EmiCalculatorWidgetProps {
  defaultCarPrice?: number;
}

const EmiCalculatorWidget = ({ defaultCarPrice = 3000000 }: EmiCalculatorWidgetProps) => {
  const [carPrice, setCarPrice] = useState(defaultCarPrice);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(5);
  const [results, setResults] = useState({
    loanAmount: 0,
    monthlyEMI: 0,
    totalInterest: 0,
    totalAmount: 0
  });

  const calculateEMI = () => {
    const loanAmount = carPrice - (carPrice * downPayment / 100);
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;
    
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalAmount = emi * months;
    const totalInterest = totalAmount - loanAmount;
    
    setResults({
      loanAmount: Math.round(loanAmount),
      monthlyEMI: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount)
    });
  };

  // Calculate on initial load
  useState(() => {
    calculateEMI();
  });

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">EMI Calculator</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="car-price-widget">Car Price (Rs.)</Label>
              <span className="font-medium">{formatPrice(carPrice)}</span>
            </div>
            <Slider 
              id="car-price-widget"
              min={500000} 
              max={20000000} 
              step={100000} 
              value={[carPrice]} 
              onValueChange={(value) => setCarPrice(value[0])}
              className="mb-2"
            />
            <Input 
              type="number" 
              value={carPrice} 
              onChange={(e) => setCarPrice(Number(e.target.value))}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="down-payment-widget">Down Payment (%)</Label>
              <span className="font-medium">{downPayment}%</span>
            </div>
            <Slider 
              id="down-payment-widget"
              min={0} 
              max={100} 
              step={5} 
              value={[downPayment]} 
              onValueChange={(value) => setDownPayment(value[0])}
              className="mb-2"
            />
            <Input 
              type="number" 
              value={downPayment} 
              onChange={(e) => setDownPayment(Number(e.target.value))}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="interest-rate-widget">Interest Rate (%)</Label>
              <span className="font-medium">{interestRate}%</span>
            </div>
            <Slider 
              id="interest-rate-widget"
              min={1} 
              max={20} 
              step={0.5} 
              value={[interestRate]} 
              onValueChange={(value) => setInterestRate(value[0])}
              className="mb-2"
            />
            <Input 
              type="number" 
              step="0.5"
              value={interestRate} 
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="tenure-widget">Loan Tenure (Years)</Label>
              <span className="font-medium">{tenure} years</span>
            </div>
            <Slider 
              id="tenure-widget"
              min={1} 
              max={10} 
              step={1} 
              value={[tenure]} 
              onValueChange={(value) => setTenure(value[0])}
              className="mb-2"
            />
            <Input 
              type="number" 
              value={tenure} 
              onChange={(e) => setTenure(Number(e.target.value))}
            />
          </div>
          
          <Button className="w-full" onClick={calculateEMI}>
            Calculate EMI
          </Button>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm">Monthly EMI:</span>
              <span className="font-bold text-lg">{formatEMI(results.monthlyEMI)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Total Interest:</span>
              <span>{formatPrice(results.totalInterest)}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm">Total Amount:</span>
              <span className="font-bold">{formatPrice(results.totalAmount)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmiCalculatorWidget;