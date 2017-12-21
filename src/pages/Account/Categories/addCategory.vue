<template>
  <q-layout class="layout-padding">
    <q-card v-if="choosePre">
      <q-card-title>
        Choose from prexisting ones
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-select :options="preCategories" v-model="preExisting" float-label="Choose a category"></q-select>
      </q-card-main>
      
      <q-card-actions>
        <q-btn color="green" small @click="saveCategory">Save</q-btn>
        <q-btn color="green" small @click="choosePre = false">Add New</q-btn>
      </q-card-actions>
    </q-card>
    <q-card v-else>
      <q-card-title>
        Add new category
      </q-card-title>
      <q-card-main>
        <q-input v-model="categoryForm.name" float-label="Name" />
        <q-input v-model="categoryForm.icon" float-label="Icon" />
        <q-select :options="colors" v-model="categoryForm.color" float-label="Choose a color" />
      </q-card-main>
      <q-card-actions>
        <q-btn color="green" small @click="saveCategory">Save</q-btn>
        <q-btn color="green" small @click="choosePre = true">Add Prexisting</q-btn>
      </q-card-actions>
    </q-card>
  </q-layout>
</template>
<script>
import { Toast } from 'quasar'
export default {
  data () {
    return {
      lastId: 4,
      choosePre: false,
      categoryForm: {
        name: '',
        icon: '',
        color: ''
      },
      preExisting: null,
      preCategories: [
        { label: 'Work', value: 'work' },
        { label: 'Sport', value: 'sport' },
        { label: 'Health', value: 'health' },
        { label: 'Sex', value: 'sex' }
      ],
      colors: [
        { label: 'green', value: 'green' },
        { label: 'blue', value: 'blue' },
        { label: 'lime', value: 'lime' },
        { label: 'orange', value: 'orange' },
        { label: 'black', value: 'black' }
      ]
    }
  },
  methods: {
    saveCategory () {
      console.log('saving...')
      const newCat = {
        id: this.lastId,
        name: this.categoryForm.name,
        icon: this.categoryForm.icon,
        color: this.categoryForm.color
      }
      console.log('adding a cat: ', newCat)
      this.$store.dispatch('addCategory', newCat)
      this.$router.go(-1)
    },
    notigy () {
      Toast.create.negative('NO no no')
    }
  }
}
</script>
