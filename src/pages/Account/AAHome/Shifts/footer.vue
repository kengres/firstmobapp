<template lang="pug">
  div.row.no-wrap.justify-center.full-width
    q-btn.shiftBtn(flat)
      q-icon(name="view_day")
    q-btn.shiftBtn(flat)
      q-icon(name="view_week")
    q-btn.shiftBtn.shiftBtn--last(flat)
      q-icon(name="tune")
</template>
<style lang="scss" scoped>
.shiftBtn {
  margin-right: 10px;
  width: 35%;
  &--last {
    margin-right: 0;
  }
}
</style>
