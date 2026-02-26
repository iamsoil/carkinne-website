interface EMICalculations {
  loanAmount: number;
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  interestPercentage: number;
}

export const useEMI = (
  carPrice: number,
  downPaymentPercent: number = 20,
  interestRate: number = 10,
  tenureYears: number = 5
): EMICalculations => {
  const downPayment = carPrice * (downPaymentPercent / 100);
  const loanAmount = carPrice - downPayment;
  const monthlyRate = interestRate / 12 / 100;
  const months = tenureYears * 12;
  
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
              (Math.pow(1 + monthlyRate, months) - 1);
  
  const totalAmount = emi * months;
  const totalInterest = totalAmount - loanAmount;
  const interestPercentage = loanAmount > 0 ? (totalInterest / loanAmount) * 100 : 0;
  
  return {
    loanAmount: Math.round(loanAmount),
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    interestPercentage: parseFloat(interestPercentage.toFixed(1))
  };
};