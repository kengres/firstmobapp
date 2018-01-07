<template lang="pug">
  div.row.no-wrap.justify-between
    image-two.imagethree
    image-six.imagetwo
    image-one.imageone
    
</template>
<script>
import ImageOne from './SlideThree/ImageOne'
import ImageTwo from './SlideThree/ImageTwo'
import ImageSix from './SlideThree/ImageSix'
export default {
  components: {
    ImageOne,
    ImageTwo,
    ImageSix
  }
}
</script>

<style lang="scss" scoped>
  .imageone {
    fill:#fff;
    width: 23%;
  }
  .imagetwo {
    fill:#fff;
    width: 54%;
  }
  .imagethree {
    width: 23%;
    fill: #fff;
  }
</style>
