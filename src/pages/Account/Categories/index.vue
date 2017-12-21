<template>
  <q-layout class="layout-padding">
    <q-list separator no-border>
      <q-list-header>
        All Categories
      </q-list-header>
      <q-item v-for="cat in categories" :key="cat.id">
        <q-item-side>
          <q-icon :name="cat.icon" style="font-size: 24px" color="green" />
        </q-item-side>
        <q-item-main>
          <q-item-tile label>{{cat.name}}</q-item-tile>
          <q-item-tile sublabel>About {{cat.value}}</q-item-tile>
        </q-item-main>
        <q-item-side right :ref="`target${cat.id}`">
          <q-item-tile icon="more_vert">

            <q-popover :ref="`popover${cat.id}`" anchor="top right" self="top right">
              <q-list separator>
                <q-item @click="deleteCategory(cat), $refs[`popover${cat.id}`][0].close()">
                  Delete
                </q-item>
                <q-item @click="editCategory(cat), $refs[`popover${cat.id}`][0].close()">
                  Edit
                </q-item>
              </q-list>
            </q-popover>

          </q-item-tile>
        </q-item-side>
      </q-item>
    </q-list>
  </q-layout>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['categories'])
  },
  methods: {
    editCategory (category) {
      console.log('clicked: ', category)
    },
    deleteCategory (category) {
      const popName = `popover${category.id}`
      // this.$refs[popName][0].close()
      console.log('pop name', popName)
      console.log('ref popname 0', this.$refs[popName][0])
      console.log('clicked: ', category)
    }
  }
}
</script>
