// {
//   "base_currency": "EUR",
//   "quote_currency": "USD",
//   "commission": "5.00"
// }
import Commissions from './commissions'
import FiatCurrencies from './fiatCurrencies'

const data = []

FiatCurrencies.forEach((item, i) => {
  FiatCurrencies.forEach((el) => {
    if (item !== el) {
      data.push({
        base_currency: item,
        quote_currency: el,
        commission: Commissions[Math.floor(Math.random() * Commissions.length)]
      })
    }
  })
})
export default data
