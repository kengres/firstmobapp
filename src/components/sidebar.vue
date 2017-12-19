<template>
  <q-list no-border link inset-delimiter>
    <q-list-header>Useful Links</q-list-header>
    <q-item @click="launch('http://quasar-framework.org')">
      <q-item-side icon="school" />
      <q-item-main label="Docs" />
    </q-item>
    <q-item @click="launch('http://forum.quasar-framework.org')">
      <q-item-side icon="record_voice_over" />
      <q-item-main label="Forum" />
    </q-item>
    <q-item @click="launch('https://gitter.im/quasarframework/Lobby')">
      <q-item-side icon="chat" />
      <q-item-main label="Gitter Channel" />
    </q-item>
  </q-list>
</template>
<script>
import {
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain
} from 'quasar'
export default {
  components: {
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain
  }
}
</script>
