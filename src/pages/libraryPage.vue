<template>
  <q-page :style-fn="myTweak">
    <TabPanel active :tabs="tabs"></TabPanel>
    <MangaGrid v-if="!failedFetch"> </MangaGrid>
    <q-dialog v-model="failedFetch" persistent>
      <q-card style="min-width: 350px">
        <q-card-section
          ><q-item>
            <q-item-section>
              <q-item-label class="text-h6 text-negative"
                >Getting categories failed.
              </q-item-label>
              <q-item-label class="text-info q-pt-lg">
                <div>Have you set your server address?</div>
                <div>Is the server running?</div>
                <div class="q-pt-sm">
                  Pressing Ok will take you to the settings page
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="ok" v-close-popup to="/settings" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { tab } from 'src/components/global/models';
import TabPanel from 'src/components/library/TabPanel.vue';
import { defineComponent, ref } from 'vue';
import { cat } from 'src/components/global/models';
import MangaGrid from 'src/components/library/MangaGrid.vue';
import fetcher from 'src/components/global/fetcher';

export default defineComponent({
  name: 'libraryPage',
  components: { TabPanel, MangaGrid },
  created: async function () {
    try {
      const resp = await fetcher('/api/v1/category');
      const jsn: cat[] = await resp.json();
      this.tabs = jsn.map((cat) => {
        return {
          tabname: cat.name,
          tabID: cat.id
        };
      });
    } catch (e) {
      this.failedFetch = true;
    }
  },
  computed: {
    scrollbarTheme(): string {
      return this.$q.dark.isActive ? 'darkSB' : 'lightSB';
    }
  },
  methods: {
    myTweak(offset: number) {
      return {
        height: offset ? `calc(100vh - ${offset}px)` : '100vh'
      };
    }
  },
  setup(_props, { emit }) {
    emit('setTitle', 'Library');
    const tabs = ref<tab[]>([]);
    const failedFetch = ref(false);
    return {
      tabs,
      failedFetch
    };
  }
});
</script>
