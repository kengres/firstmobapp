<template lang="pug">
  div.rows.justify-between
    image-two.imageone
    image-four.imagetwo
    image-six.imagethree
</template>
<script>
import ImageTwo from './SlideTwo/ImageTwo'
import ImageFour from './SlideTwo/ImageFour'
import ImageSix from './SlideTwo/ImageSix'
export default {
  components: {
    ImageTwo,
    ImageFour,
    ImageSix
  }
}
</script>

<style lang="scss" scoped>
  .imageone {
    fill:#3b7e05;
    width: 25%;

    .workmansvg {
      width: 100px;
    }
  }
  .imagetwo {
    fill:#3b7e05;
    width: 47%;

    .workmansvg {
      width: 100px;
    }
  }
  .imagethree {
    width: 26%;
  }
</style>
