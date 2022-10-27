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
          <q-tab name="filter" icon="filter_list" label="Filter" />
          <q-tab name="sort" icon="sort" label="Sort" />
          <q-tab name="display" icon="display_settings" label="Display" />
        </q-tabs>
      </q-card-section>

      <div v-if="tab == 'filter'">
        <q-card-section class="q-px-md q-pt-md q-pb-xs">
          <q-checkbox
            style="width: 100%"
            toggle-indeterminate
            v-model="unread"
            :dark="$q.dark.isActive"
            label="Unread"
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
            style="width: 100%"
            toggle-indeterminate
            v-model="downloaded"
            label="Downloaded"
            :dark="$q.dark.isActive"
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
            style="width: 100%"
            toggle-indeterminate
            v-model="bookmarked"
            label="Bookmarked"
            :dark="$q.dark.isActive"
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
            style="width: 100%"
            checked-icon="arrow_upward"
            unchecked-icon="arrow_downward"
            indeterminate-icon="null"
            color="primary"
            keep-color
            v-model="Source"
            label="By Source"
            :dark="$q.dark.isActive"
          />
        </q-card-section>
        <q-card-section class="q-px-md q-pt-xs q-pb-md">
          <q-checkbox
            style="width: 100%"
            checked-icon="arrow_upward"
            unchecked-icon="arrow_downward"
            indeterminate-icon="null"
            color="primary"
            keep-color
            v-model="FetchDate"
            label="By Fetch date"
            :dark="$q.dark.isActive"
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
  name: 'libraryTopBar',
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
    }
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
    }
  },
  setup() {
    const route = useRoute();
    const filt = chaptersFilter(parseInt(`${route.params['id']}`));
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
      disp: ref(filt.Display)
    };
  }
});
</script>
