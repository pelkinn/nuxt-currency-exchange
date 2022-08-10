<template lang="pug">
v-container.d-flex.flex-column.align-center.justify-center.h-full
  h1.text-h2.mb-10 Успешный обмен
  v-icon.mb-16(color="green" size="250" ) mdi-check-circle-outline
  v-btn(color="primary" outlined to="/") Вернуться на главную
</template>

<script>
export default {
  name: 'Success'
}
</script>

<style scoped>

</style>
