<template lang="pug">
  q-layout.layout-padding
    q-list
      q-item(separator)
        q-item-side
          q-item-tile(icon="work", color="lime")
        q-item-main
          q-item-tile(label) work
        q-item-side(right)
          q-item-tile(icon="more_vert", color="lime")
          q-popover(ref="popover", anchor="top right", self="top right")
            q-list(separator)
              q-item
                q-item-tile Edit
              q-item
                q-item-tile Delete
    q-fixed-position(corner="bottom-right", :offset="[20, 10]")
      q-btn(round color="positive" @click="addNewCategory" icon="add")

</template>
<script>
import { addCategoryPath } from '../../../config'
export default {
  methods: {
    addNewCategory () {
      this.$router.push({
        path: addCategoryPath
      })
    }
  }
}
</script>
