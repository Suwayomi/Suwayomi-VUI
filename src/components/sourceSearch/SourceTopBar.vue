<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
 <template>
  <SearchBar></SearchBar>
  <q-btn
    flat
    class="q-ml-sm"
    round
    :text-color="$q.dark.isActive ? `white` : `dark`"
    icon="display_settings"
    @click="dialo = true"
  />
  <q-dialog v-model="dialo">
    <q-card>
      <q-card-section class="q-pa-none">
        <q-tabs v-model="tab" class="text-teal">
          <q-tab
            class="q-px-xl"
            name="display"
            icon="display_settings"
            label="Display"
          />
        </q-tabs>
      </q-card-section>

      <div v-if="tab == 'display'">
        <q-item class="q-mx-lg q-pt-md q-pb-xs">
          <q-item-section thumbnail class="q-pr-sm">
            <q-icon name="display_settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>DISPLAY MODE</q-item-label>
          </q-item-section>
        </q-item>
        <q-card-section class="q-px-md q-py-xs">
          <q-radio v-model="disp" val="null" label="Compact grid" />
        </q-card-section>
        <q-card-section class="q-px-md q-py-xs">
          <q-radio v-model="disp" val="true" label="Comfortable grid" />
        </q-card-section>
        <q-card-section class="q-px-md q-pt-xs q-pb-md">
          <q-radio v-model="disp" val="false" label="list" />
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>

  <q-btn
    flat
    round
    class="q-ml-sm"
    icon="settings"
    v-if="isConfigurable"
    to="../config"
  ></q-btn>
</template>

<script lang="ts">
import SearchBar from 'src/components/global/SearchBar.vue';
import { defineComponent, ref } from 'vue';
import Filters from 'src/components/library/Filters';
import { isConfig } from 'src/components/sourceSearch/isConfigurable';

export default defineComponent({
  name: 'libraryTopBar',
  components: { SearchBar },
  watch: {
    disp() {
      if (this.disp == 'null') this.filters.setDisplay(null);
      else this.filters.setDisplay(this.disp == 'true');
    }
  },
  setup() {
    const filters = Filters();
    const isConfigurable = ref(isConfig().isConfigurable);
    const disp = ref(<'null' | 'true' | 'false'>`${filters.Display.value}`);
    return {
      dialo: ref(false),
      tab: ref('display'),
      disp,
      filters,
      isConfigurable
    };
  }
});
</script>
