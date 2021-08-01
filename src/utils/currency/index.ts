export const formatCurrency = (value: number, rawFormat?: boolean) => {
  if(rawFormat) {
    const formattedValue = value.toLocaleString();
    return formattedValue === 'NaN' ? 0 : formattedValue
  }
  
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export const formatNumber = (value: string) =>  value.replace(/[^0-9.]/g, '')