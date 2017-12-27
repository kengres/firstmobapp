<template lang="pug">
  q-layout.layout-padding(view="lHh Lpr fFf")
    q-list
      q-item(separator v-for="cat in categories" :key="cat.name")
        q-item-side
          q-item-tile(:icon="cat.icon", :color="cat.color")
        q-item-main
          q-item-tile(label) {{cat.name}}
        q-item-side(right :ref="`target${cat.name}`")
          q-item-tile(icon="more_vert", color="lime")
          q-popover(:ref="`popover${cat.name}`", anchor="top right", self="top right")
            q-list(separator)
              q-item(@click="updateCategory(cat), $refs[`popover${cat.name}`][0].close()")
                q-item-tile Edit
              q-item(@click="deleteCategory(cat), $refs[`popover${cat.name}`][0].close()")
                q-item-tile Delete
    q-fixed-position(corner="bottom-right", :offset="[20, 10]")
      q-btn(round color="positive" @click="addNewCategory" icon="add")

</template>
<script>
import { addCategoryPath } from '../../../config'
import { mapGetters } from 'vuex'
export default {
  created () {
    if (this.user) {
      this.$store.dispatch('fetchCategories')
    }
  },
  computed: {
    ...mapGetters(['user', 'categories'])
  },
  methods: {
    addNewCategory () {
      this.$router.push({
        path: addCategoryPath
      })
    },
    updateCategory (cat) {
      console.log('update: ', cat)
      // this.$store.dispatch('updateCategory', cat)
    },
    deleteCategory (cat) {
      console.log('delete: ', cat)
      // alert first
      // this.$store.dispatch('deleteCategory', cat)
    }
  }
}
</script>
