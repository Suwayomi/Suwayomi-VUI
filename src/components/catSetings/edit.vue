<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-btn round flat icon="edit" class="q-ml-xl" @click="editdialog = true" />
  <q-dialog v-model="editdialog">
    <q-card>
      <q-card-section>
        <div class="text-h5">Edit Category</div>
      </q-card-section>
      <q-item>
        <q-input
          style="width: 100%"
          type="text"
          label="Category Name"
          outlined
          v-model="edittxt"
        ></q-input>
      </q-item>
      <q-item>
        <q-toggle
          label="Default category when adding new manga to library"
          color="blue"
          v-model="defaul"
        />
      </q-item>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Save"
          color="primary"
          v-close-popup
          @click="savetxt"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { cat } from '../global/models';

export default defineComponent({
  name: 'CatSettingsEdit',
  props: {
    cat: {
      type: Object as PropType<cat>,
      required: true
    }
  },
  methods: {
    savetxt() {
      this.$api.patchForm(`/api/v1/category/${this.cat.id}`, {
        name: this.edittxt,
        default: this.defaul.toString()
      });
    }
  },
  setup(props) {
    return {
      editdialog: ref(false),
      defaul: ref(props.cat.default),
      edittxt: ref(props.cat.name)
    };
  }
});
</script>
