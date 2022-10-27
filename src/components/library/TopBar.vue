<template>
  <SearchBar></SearchBar>
  <q-btn
    flat
    class="q-ml-sm"
    round
    :text-color="$q.dark.isActive ? `white` : `dark`"
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
            color="blue"
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
            color="green"
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
            v-model="leftToRead"
            label="By left to Read"
            :dark="$q.dark.isActive"
          />
        </q-card-section>
        <q-card-section class="q-px-md q-pt-xs q-pb-xs">
          <q-checkbox
            style="width: 100%"
            checked-icon="arrow_upward"
            unchecked-icon="arrow_downward"
            indeterminate-icon="null"
            color="primary"
            keep-color
            v-model="alphabetical"
            label="Alphabetical"
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
            v-model="ByID"
            label="By ID"
            :dark="$q.dark.isActive"
          />
        </q-card-section>
      </div>

      <!-- TODO: grid display options -->
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import SearchBar from 'src/components/global/SearchBar.vue';
import { defineComponent, ref } from 'vue';
import Filters from './Filters';

export default defineComponent({
  name: 'libraryTopBar',
  components: { SearchBar },
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

        console.log(this.alphabetical);
      }
    },
    ByID() {
      this.filters.setByID(this.ByID);
      if (this.ByID != null) {
        this.alphabetical = null;
        this.leftToRead = null;

        console.log(this.ByID);
      }
    }
  },
  setup() {
    const filters = Filters();
    const unread = ref(<boolean | null>filters.unread.value);
    const downloaded = ref(<boolean | null>filters.downloaded.value);
    const leftToRead = ref(<boolean | null>filters.leftToRead.value);
    const alphabetical = ref(<boolean | null>filters.alphabetical.value);
    const ByID = ref(<boolean | null>filters.ByID.value);
    return {
      dialo: ref(false),
      tab: ref('filter'),
      unread,
      downloaded,
      leftToRead,
      alphabetical,
      ByID,
      filters
    };
  }
});
</script>
