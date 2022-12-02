<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-btn
    flat
    class="q-ml-sm"
    round
    :text-color="
      $q.dark.isActive
        ? aredefaults()
          ? `white`
          : `orange`
        : aredefaults()
        ? `dark`
        : `orange`
    "
    icon="filter_list"
    @click="dialo = true"
  />
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
            color="primary"
          />
        </q-card-section>
        <q-card-section class="q-px-md q-py-xs">
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
            color="primary"
          />
        </q-card-section>
        <q-card-section class="q-px-md q-pt-xs q-pb-md">
          <q-checkbox
            v-model="bookmarked"
            style="width: 100%"
            toggle-indeterminate
            label="Bookmarked"
            checked-icon="check_box"
            unchecked-icon="r_disabled_by_default"
            indeterminate-icon="check_box_outline_blank"
            keep-color
            size="lg"
            color="primary"
          />
        </q-card-section>
      </div>

      <div v-if="tab == 'sort'">
        <q-card-section class="q-px-md q-pt-md q-pb-xs">
          <q-checkbox
            v-model="Source"
            style="width: 100%"
            checked-icon="arrow_upward"
            unchecked-icon="arrow_downward"
            indeterminate-icon="null"
            color="primary"
            keep-color
            label="By Source"
          />
        </q-card-section>
        <q-card-section class="q-px-md q-pt-xs q-pb-md">
          <q-checkbox
            v-model="FetchDate"
            style="width: 100%"
            checked-icon="arrow_upward"
            unchecked-icon="arrow_downward"
            indeterminate-icon="null"
            color="primary"
            keep-color
            label="By Fetch date"
          />
        </q-card-section>
      </div>

      <div v-if="tab == 'display'">
        <q-card-section class="q-px-md q-pt-md q-pb-xs">
          <q-radio v-model="disp" val="source" label="By Source Title" />
        </q-card-section>
        <q-card-section class="q-px-md q-pt-xs q-pb-md">
          <q-radio v-model="disp" val="chapter" label="By Chapter Number" />
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { chaptersFilter } from 'src/components/manga/filters';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'LibraryTopBar',
  setup() {
    const route = useRoute();
    const filt = chaptersFilter(parseInt(`${route.params['mangaID']}`));
    const filters = ref(filt);

    return {
      dialo: ref(false),
      tab: ref('filter'),
      unread: ref(filt.Unread),
      downloaded: ref(filt.Downloaded),
      bookmarked: ref(filt.Bookmarked),
      Source: ref(filt.Source),
      FetchDate: ref(filt.FetchDate),
      filt: filters,
      disp: ref(filt.Display),
    };
  },
  //setFilter(value: bnn, mangaID: number, whatChange: keykeys) {
  watch: {
    unread() {
      this.filt.setUnread(this.unread);
    },
    downloaded() {
      this.filt.setDownloaded(this.downloaded);
    },
    bookmarked() {
      this.filt.setBookmarked(this.bookmarked);
    },
    Source() {
      this.filt.setSource(this.Source);
      if (this.Source != null) {
        this.FetchDate = null;
      }
    },
    FetchDate() {
      this.filt.setFetchDate(this.FetchDate);
      if (this.FetchDate != null) {
        this.Source = null;
      }
    },
    disp() {
      this.filt.setDisplay(this.disp);
    },
  },
  methods: {
    aredefaults() {
      return (
        this.unread == null &&
        this.downloaded == null &&
        this.bookmarked == null &&
        this.Source == false &&
        this.FetchDate == null &&
        this.disp == 'source'
      );
    },
  },
});
</script>
