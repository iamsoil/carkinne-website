import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const EmiCalculator = () => {
  const [carPrice, setCarPrice] = useState(3000000);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">EMI Calculator</h1>
            <p className="text-muted-foreground">Calculate your monthly car loan payments</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="car-price">Car Price (Rs.)</Label>
                    <span className="font-medium">Rs.{carPrice.toLocaleString()}</span>
                  </div>
                  <Slider 
                    id="car-price"
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
                    <Label htmlFor="down-payment">Down Payment (%)</Label>
                    <span className="font-medium">{downPayment}%</span>
                  </div>
                  <Slider 
                    id="down-payment"
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
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <span className="font-medium">{interestRate}%</span>
                  </div>
                  <Slider 
                    id="interest-rate"
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
                    <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                    <span className="font-medium">{tenure} years</span>
                  </div>
                  <Slider 
                    id="tenure"
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
              </CardContent>
            </Card>
            
            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Loan Amount</span>
                    <span className="font-medium">Rs.{results.loanAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Monthly EMI</span>
                    <span className="font-bold text-lg text-orange-500">
                      Rs.{results.monthlyEMI.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Interest</span>
                    <span className="font-medium">Rs.{results.totalInterest.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-medium">Rs.{results.totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Interest Percentage</span>
                    <span className="font-medium">
                      {results.loanAmount > 0 
                        ? ((results.totalInterest / results.loanAmount) * 100).toFixed(1) + '%' 
                        : '0%'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-4">EMI Payment Breakdown</h3>
                  <div className="h-8 w-full bg-muted rounded-full overflow-hidden flex">
                    <div 
                      className="bg-orange-500 flex items-center justify-center text-xs text-white"
                      style={{ 
                        width: `${(results.loanAmount / results.totalAmount) * 100}%` 
                      }}
                    >
                      Principal
                    </div>
                    <div 
                      className="bg-orange-300 flex items-center justify-center text-xs text-orange-900"
                      style={{ 
                        width: `${(results.totalInterest / results.totalAmount) * 100}%` 
                      }}
                    >
                      Interest
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span>Principal: Rs.{results.loanAmount.toLocaleString()}</span>
                    <span>Interest: Rs.{results.totalInterest.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-medium mb-2">Tips to Reduce EMI</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Increase down payment to reduce loan amount</li>
                    <li>• Compare interest rates from different banks</li>
                    <li>• Choose a shorter loan tenure if possible</li>
                    <li>• Consider making part payments to reduce interest</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* EMI Table */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Year-wise Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Year</th>
                      <th className="text-right py-2">Opening Balance</th>
                      <th className="text-right py-2">EMI Paid</th>
                      <th className="text-right py-2">Principal</th>
                      <th className="text-right py-2">Interest</th>
                      <th className="text-right py-2">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((year) => (
                      <tr key={year} className="border-b">
                        <td className="py-3">{year}</td>
                        <td className="text-right py-3">Rs.{(results.loanAmount - (year-1) * (results.loanAmount/5)).toLocaleString()}</td>
                        <td className="text-right py-3">Rs.{(results.monthlyEMI * 12).toLocaleString()}</td>
                        <td className="text-right py-3">Rs.{(results.loanAmount/5).toLocaleString()}</td>
                        <td className="text-right py-3">Rs.{(results.totalInterest/5).toLocaleString()}</td>
                        <td className="text-right py-3">Rs.{(results.loanAmount - year * (results.loanAmount/5)).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;