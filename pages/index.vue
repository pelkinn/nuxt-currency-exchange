<template lang="pug">
v-container
  h1.mb-10 Nuxt Currency Exchange
  .d-flex.justify-center(v-if="$fetchState.pending")
    v-progress-circular(indeterminate color="primary")
  div(v-else-if="$fetchState.error") Ошибка при загрузке
  div(v-else)
    v-card.px-4.py-6(max-width="700" )
      v-form.d-flex.flex-column(ref="form")
        .mb-4.text-h6 Обмен валют
        .d-flex.mb-4
          .d-flex.flex-column.flex-grow-1
            v-autocomplete(:items="listCurrenciesFrom" outlined dense rounded label="Отдаете" v-model="selectedCurrencyBase")
              template(#item="{item}")
                .text-uppercase {{ item }}
              template(#selection="{item}")
                .text-uppercase {{ item }}
            v-text-field(outlined dense rounded :value="sumBase" @input="onInputSumBase" :rules="[val => !!val || 'Обязательное поле']" type="number" )
          v-spacer
          .d-flex.flex-column.flex-grow-1
            v-autocomplete(:items="listCurrenciesTo" outlined dense rounded label="Получаете" v-model="selectedCurrencyQuote")
              template(#item="{item}")
                .text-uppercase {{ item }}
              template(#selection="{item}")
                .text-uppercase {{ item }}
            v-text-field(outlined dense rounded :value="sumQuote" @input="onInputSumQuote" :rules="[val => !!val || 'Обязательное поле']" type="number")
        .d-flex.flex-column.mb-6
          span.mb-2.text-center(v-if="activeExchangeRate") Курс: 1 {{ selectedCurrencyBase.toUpperCase() }} = {{ activeExchangeRate.rate }} {{ selectedCurrencyQuote.toUpperCase() }}
          span.text-center(v-if="activePair") Коммиссия: {{ activePair.commission }} %
        v-btn.align-self-center(color="primary" elevation="0" rounded @click="submitExchange" :loading="loadingSubmit") Обменять
</template>

<script>
import CurrencyPairs from '@/mock/currencyPairs'
import ExchangeRates from '@/mock/exchangeRates'

export default {
  name: 'IndexPage',
  data () {
    return {
      pairsList: [],
      exchangeRates: [],
      selectedCurrencyBase: '',
      selectedCurrencyQuote: '',
      sumBase: null,
      sumQuote: null,
      loadingSubmit: false
    }
  },
  async fetch () {
    try {
      // await this.$axios.get()
      this.pairsList = await new Promise(resolve => resolve(CurrencyPairs))
      await this.getExchangeRates()
    } catch (e) {
      console.log(e)
    }
  },
  computed: {
    listCurrenciesFrom () {
      const arr = this.pairsList.map(item => item.base_currency)
      return [...new Set(arr)]
    },
    listCurrenciesTo () {
      return this.pairsList.reduce((res, item) => {
        if (this.selectedCurrencyBase === item.base_currency) {
          res.push(item.quote_currency)
        }
        return res
      }, [])
    },
    activePair () {
      return this.pairsList.find((item) => {
        return item.base_currency === this.selectedCurrencyBase && item.quote_currency === this.selectedCurrencyQuote
      })
    },
    activeExchangeRate () {
      return this.exchangeRates.find((item) => {
        return item.pair === `${this.selectedCurrencyBase}/${this.selectedCurrencyQuote}`
      })
    }
  },
  watch: {
    listCurrenciesFrom (val) {
      this.selectedCurrencyBase = val[0]
    },
    listCurrenciesTo (val) {
      if (!val.includes(this.selectedCurrencyQuote)) {
        this.selectedCurrencyQuote = val[0]
      }
    },
    selectedCurrencyBase (newVal, oldVal) {
      this.clearSumInputs()
    },
    selectedCurrencyQuote () {
      this.clearSumInputs()
    }
  },
  created () {
    const interval = 30000
    const run = async () => {
      await this.getExchangeRates()
      setTimeout(run, interval)
    }
    setTimeout(run, interval)
  },
  methods: {
    async submitExchange () {
      if (this.$refs.form.validate()) {
        this.loadingSubmit = true
        try {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000)
          })
          await this.$router.push({ name: 'success' })
        } catch (e) {
          console.log(e)
        }
        this.loadingSubmit = false
      }
    },
    onInputSumBase (evt) {
      this.sumBase = +evt
      this.calculateSumQuotes()
    },
    calculateSumQuotes () {
      const sumNotCommission = this.sumBase * this.activeExchangeRate.rate
      this.sumQuote = sumNotCommission - sumNotCommission / 100 * this.activePair.commission
    },
    onInputSumQuote (evt) {
      this.sumQuote = +evt
      this.calculateSumBase()
    },
    calculateSumBase () {
      const sumNotCommission = this.sumQuote / this.activeExchangeRate.rate
      this.sumBase = sumNotCommission + sumNotCommission / 100 * this.activePair.commission
    },
    clearSumInputs () {
      this.$refs.form.resetValidation()
      this.sumBase = null
      this.sumQuote = null
    },
    async getExchangeRates () {
      try {
        this.exchangeRates = await new Promise(resolve => resolve(ExchangeRates))
        console.log('GET EXCHANGES')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
