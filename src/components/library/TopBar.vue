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
    :class="$q.dark.isActive ? `light` : `dark`"
    icon="filter_list"
    @click="dialo = true"
  >
    <q-tooltip> Sort / Filter / Display </q-tooltip>
  </q-btn>
  <q-dialog v-model="dialo">
    <q-card>
      <q-card-section class="q-pa-none">
        <q-tabs v-model="tab" class="text-teal">
          <q-tab
            class="q-px-xl"
            name="filter"
            icon="filter_list"
            label="Filter"
          />
          <q-tab class="q-px-xl" name="sort" icon="sort" label="Sort" />
          <q-tab
            class="q-px-xl"
            name="display"
            icon="display_settings"
            label="Display"
          />
        </q-tabs>
      </q-card-section>

      <div v-if="tab == 'filter'">
        <q-card-section class="q-px-md q-pt-md q-pb-xs">
          <q-checkbox
            v-model="unread"
            style="width: 100%"
            toggle-indeterminate
            label="Unread"
            checked-icon="check_box"
            unchecked-icon="r_disabled_by_default"
            indeterminate-icon="check_box_outline_blank"
            keep-color
            size="lg"
            color="blue"
          />
        </q-card-section>
        <q-card-section class="q-px-md q-pt-xs q-pb-md">
          <q-checkbox
            v-model="downloaded"
            style="width: 100%"
            toggle-indeterminate
            label="Downloaded"
            checked-icon="check_box"
            unchecked-icon="r_disabled_by_default"
            indeterminate-icon="check_box_outline_blank"
            keep-color
            size="lg"
            color="green"
          />
        </q-card-section>
      </div>

      <div v-if="tab == 'sort'">
        <q-card-section class="q-px-md q-pt-md q-pb-xs">
          <q-checkbox
            v-model="leftToRead"
            style="width: 100%"
            checked-icon="arrow_upward"
            unchecked-icon="arrow_downward"
            indeterminate-icon="null"
            color="primary"
            keep-color
            label="By left to Read"
          />
        </q-card-section>
        <q-card-section class="q-px-md q-pt-xs q-pb-xs">
          <q-checkbox
            v-model="alphabetical"
            style="width: 100%"
            checked-icon="arrow_upward"
            unchecked-icon="arrow_downward"
            indeterminate-icon="null"
            color="primary"
            keep-color
            label="Alphabetical"
          />
        </q-card-section>
        <q-card-section class="q-px-md q-pt-xs q-pb-md">
          <q-checkbox
            v-model="ByID"
            style="width: 100%"
            checked-icon="arrow_upward"
            unchecked-icon="arrow_downward"
            indeterminate-icon="null"
            color="primary"
            keep-color
            label="By ID"
          />
        </q-card-section>
      </div>

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
    :class="$q.dark.isActive ? `light` : `dark`"
    icon="refresh"
    @click="update"
  >
    <q-tooltip> Update category </q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import SearchBar from 'src/components/global/SearchBar.vue';
import { defineComponent, ref } from 'vue';
import Filters from './Filters';

export default defineComponent({
  name: 'LibraryTopBar',
  components: { SearchBar },
  setup() {
    const filters = Filters();
    const unread = ref(<boolean | null>filters.unread.value);
    const downloaded = ref(<boolean | null>filters.downloaded.value);
    const leftToRead = ref(<boolean | null>filters.leftToRead.value);
    const alphabetical = ref(<boolean | null>filters.alphabetical.value);
    const ByID = ref(<boolean | null>filters.ByID.value);
    const disp = ref(<'null' | 'true' | 'false'>`${filters.Display.value}`);
    return {
      dialo: ref(false),
      tab: ref('filter'),
      unread,
      downloaded,
      leftToRead,
      alphabetical,
      ByID,
      disp,
      filters,
    };
  },
  watch: {
    unread() {
      this.filters.setUnread(this.unread);
    },
    downloaded() {
      this.filters.setDownloaded(this.downloaded);
    },
    leftToRead() {
      this.filters.setLeftToRead(this.leftToRead);
      if (this.leftToRead != null) {
        this.alphabetical = null;
        this.ByID = null;
      }
    },
    alphabetical() {
      this.filters.setAlphabetical(this.alphabetical);
      if (this.alphabetical != null) {
        this.leftToRead = null;
        this.ByID = null;
      }
    },
    ByID() {
      this.filters.setByID(this.ByID);
      if (this.ByID != null) {
        this.alphabetical = null;
        this.leftToRead = null;
      }
    },
    disp() {
      if (this.disp == 'null') this.filters.setDisplay(null);
      else this.filters.setDisplay(this.disp == 'true');
    },
  },
  methods: {
    update() {
      this.$api.post(
        '/api/v1/update/fetch',
        `categoryId=${this.$route.query['tab']}`
      );
    },
  },
});
</script>
