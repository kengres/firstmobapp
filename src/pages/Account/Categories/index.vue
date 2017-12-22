<template>
  <q-layout class="layout-padding" view="lHh Lpr fFf">
    <q-list separator no-border v-if="!loading">
      <q-list-header>
        All Categories
      </q-list-header>
      <template v-if="categories && categories.length > 0">
        <q-item v-for="cat in categories" :key="cat.id">
          <q-item-side>
            <q-icon :name="cat.icon" style="font-size: 24px" :color="cat.color" />
          </q-item-side>
          <q-item-main>
            <q-item-tile label>{{cat.name}}</q-item-tile>
            <q-item-tile sublabel>About {{cat.name}}</q-item-tile>
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
      </template>
      <q-item v-else>
        Please click the button bellow to add a new category.
      </q-item>
    </q-list>

    <q-fixed-position corner="bottom-right" :offset="[20, 10]">
      <q-btn round color="positive" @click="$router.push({path: addCategoryUrl})" icon="add" />
    </q-fixed-position>
      
  </q-layout>
</template>
<script>
import { mapGetters } from 'vuex'
import { addCategoryPath } from '../../../config'
export default {
  data () {
    return {
      addCategoryUrl: addCategoryPath
    }
  },
  watch: {
    user (value) {
      if (value) {
        this.$store.dispatch('fetchCategories')
      }
    }
  },
  created () {
    if (this.user) {
      this.$store.dispatch('fetchCategories')
    }
  },
  computed: {
    ...mapGetters(['user', 'categories', 'loading'])
  },
  methods: {
    addNewCategory () {
      console.log('clicked: ')
      const newCat = {
        id: 4, name: 'Sport', value: 'sport', icon: 'directions_run' }
      this.$store.dispatch('addCategory', newCat)
    },
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
