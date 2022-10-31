<template>
  <q-page>
    <q-list>
      <div v-for="(source, index) in uselist" :key="index">
        <div
          v-if="
            is.deepEqual(
              uselist.find((ele) => ele.lang == source.lang),
              source
            )
          "
          class="text-h4 q-ml-xl q-my-lg"
        >
          {{ langCodeToName(source.lang) }}
        </div>
        <q-intersection style="height: 100px; width: 100%" class="flex-shrink">
          <sourcecard @reload="reload" :source="source"></sourcecard>
        </q-intersection>
      </div>
    </q-list>
    <q-inner-loading
      style="
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: fit-content;
        height: fit-content;
        background-color: transparent;
      "
      :showing="!uselist.length"
      color="primary"
    >
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import fetcher from 'src/components/global/fetcher';
import { source } from 'src/components/global/models';
import { defineComponent, ref } from 'vue';
import Filters from 'src/components/extantions/Filters';
import sourcecard from 'src/components/sources/sourceCard.vue';
import { is } from 'quasar';
import { langCodeToName } from 'src/components/extantions/language';

export default defineComponent({
  name: 'sourcesPage',
  components: { sourcecard },
  created: function () {
    this.reload();
  },
  methods: {
    reload() {
      fetcher('/api/v1/source/list')
        .then((resp) => resp.json())
        .then((data: source[]) => {
          this.list = data;
          this.filters.setcurrlangs(this.extractLangs(data));
        });
    },
    langCodeToName,
    extractLangs(lis: source[]): string[] {
      return Array.from(new Set(lis.map((ele) => ele.lang))).filter((elee) => {
        if ('all' == elee) {
          return false;
        }
        return true;
      });
    }
  },
  computed: {
    uselist(): source[] {
      return this.list.filter((ele) => {
        return [...this.langs, 'all'].includes(ele.lang);
      });
    }
  },
  setup(_props, { emit }) {
    emit('setTitle', 'Sources');
    const filters = Filters();
    const langs = ref(filters.langs);
    const list = ref(<source[]>[]);
    return { list, langs, filters, is };
  }
});
</script>
