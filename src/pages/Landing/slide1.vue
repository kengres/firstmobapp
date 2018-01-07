<template lang="pug">
  div.row.no-wrap.justify-between
    image-one.imageone
    image-three.imagetwo
    image-five.imagethree
</template>
<script>
import ImageOne from './SlideOne/ImageOne'
import ImageThree from './SlideOne/ImageThree'
import ImageFive from './SlideOne/ImageFive'
export default {
  components: {
    ImageOne,
    ImageThree,
    ImageFive
  }
}
</script>

<style lang="scss" scoped>
  .imageone {
    fill: #ccaa14;
    width: 25%;

    .workmansvg {
      width: 100px;
    }
  }
  .imagetwo {
    fill: red;
    width: 47%;

    .workmansvg {
      width: 100px;
    }
  }
  .imagethree {
    fill: #ccaa14;
    width: 26%;

    .workmansvg {
      width: 100px;
    }
  }
</style>
