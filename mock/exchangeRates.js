import CurrencyPairs from '@/mock/currencyPairs'

const data = []

CurrencyPairs.forEach((item) => {
  data.push({
    pair: `${item.base_currency}/${item.quote_currency}`,
    rate: Math.floor(10 + Math.random() * (99 + 1 - 10))
  })
})

export default data
