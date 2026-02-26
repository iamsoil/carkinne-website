// Format price with Rupee symbol and commas
export const formatPrice = (price: number): string => {
  return `Rs.${price.toLocaleString('en-IN')}`;
};

// Format EMI amount
export const formatEMI = (emi: number): string => {
  return `Rs.${emi.toLocaleString('en-IN')}/month`;
};

// Format mileage
export const formatMileage = (mileage: number): string => {
  return `${mileage} kmpl`;
};

// Format engine capacity
export const formatEngine = (cc: number): string => {
  return `${cc} cc`;
};

// Format battery range
export const formatBatteryRange = (range: number): string => {
  return `${range} km`;
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format date and time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};