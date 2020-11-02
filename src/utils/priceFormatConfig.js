export default function priceFormatConfig({ price }) {
  const priceNumber = price.toString().replace(',', '.') * 1;
  return priceNumber.toFixed(2);
}
