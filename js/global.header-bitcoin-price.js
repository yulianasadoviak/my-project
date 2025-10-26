const priceElement = document.getElementById("price");

async function fetchBitcoinPrice() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const price = data.bitcoin.usd;

    priceElement.textContent = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    priceElement.textContent = 'Failed to load Bitcoin price 😢';
  }
}

fetchBitcoinPrice();

setInterval(fetchBitcoinPrice, 60000);
