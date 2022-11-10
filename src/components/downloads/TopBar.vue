<template>
  <q-btn
    elevated
    class="q-ml-sm"
    round
    :text-color="$q.dark.isActive ? `white` : `dark`"
    :icon="PlayPause ? `pause` : `play_arrow`"
    @click="toggleplay"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useDlSock from 'src/components/downloads/useDlSock';
import { dlsock, isdlsock } from '../global/models';

export default defineComponent({
  name: 'SearchBar',
  methods: {
    toggleplay() {
      if (!this.PlayPause) {
        this.$fetch('/api/v1/downloads/start');
      } else {
        this.$fetch('/api/v1/downloads/stop');
      }
    }
  },
  watch: {
    'Emitter.eventsFromServer'(val) {
      const tmp = <dlsock>JSON.parse(val);
      if (isdlsock(tmp)) {
        this.PlayPause = tmp.status == 'Started';
      }
    }
  },
  setup() {
    const Emitt = useDlSock();
    const Emitter = ref(Emitt);

    const PlayPause = ref();
    const tmp = Emitt.eventsFromServer.value
      ? JSON.parse(Emitt.eventsFromServer.value)
      : [];
    if (isdlsock(tmp)) {
      PlayPause.value = tmp.status == 'Started';
    }
    if (Emitter.value.isConnected) {
      Emitt.sendMsg('STATUS');
    }

    return {
      PlayPause,
      Emitter
    };
  }
});
</script>
