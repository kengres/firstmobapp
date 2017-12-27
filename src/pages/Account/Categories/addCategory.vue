<template lang="pug">
  q-layout.layout-padding
    q-card
      q-card-title Add new category
      q-card-separator
      q-card-main
        q-field
          q-input(v-model="form.name" float-label="name")
        q-field
          q-input(v-model="form.icon" float-label="icon")
        q-field
          q-select(v-model="form.color" float-label="color" :options="colors")
      q-card-actions
        q-btn(round color="green" @click="createCategory" icon="check")
        q-btn(round color="green" @click="$router.go(-1)" icon="close")
</template>
<script>
import { categoriesPath } from '../../../config'
export default {
  data () {
    return {
      form: {
        name: '',
        icon: '',
        color: ''
      },
      colors: [
        { label: 'green', value: 'green' },
        { label: 'lime', value: 'lime' },
        { label: 'yellow', value: 'yellow' },
        { label: 'primary', value: 'primary' },
        { label: 'tertiary', value: 'tertiary' }
      ]
    }
  },
  methods: {
    createCategory () {
      console.log('creatign category: ', this.form)
      const newCategory = {
        icon: this.form.icon,
        color: this.form.color,
        name: this.form.name
      }
      console.log('creatign category: ', newCategory)
      this.$store.dispatch('addCategory', newCategory)
      this.$router.replace(categoriesPath)
    }
  }
}
</script>
