<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-page>
    <q-list separator :dark="$q.dark.isActive ? true : false">
      <q-item
        v-for="(cat, index) in catag"
        :key="index"
        class="row justify-between"
      >
        <q-item-section avatar>
          <q-icon name="drag_handle" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ cat.name }}</q-item-label>
        </q-item-section>
        <q-btn
          @click="index ? moveto(cat.order, 1) : ``"
          round
          flat
          icon="keyboard_double_arrow_up"
        />
        <q-btn
          @click="index ? moveto(cat.order, cat.order - 1) : ``"
          round
          flat
          icon="keyboard_arrow_up"
        />
        <q-btn
          @click="
            index < catag.length - 1 ? moveto(cat.order, cat.order + 1) : ``
          "
          round
          flat
          icon="keyboard_arrow_down"
        />
        <q-btn
          @click="
            index < catag.length - 1 ? moveto(cat.order, catag.length) : ``
          "
          round
          flat
          icon="keyboard_double_arrow_down"
        />
        <catEdit :cat="cat" />
        <q-btn round flat icon="delete" @click="delcat(cat.id)" />
      </q-item>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        class="text-black"
        icon="add"
        color="blue"
        @click="newDialog = true"
      />
    </q-page-sticky>
    <q-dialog v-model="newDialog">
      <q-card>
        <q-card-section>
          <div class="text-h5">New Category</div>
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
  </q-page>
</template>
<script lang="ts">
import { cat } from 'src/components/global/models';
import { defineComponent, ref } from 'vue';
import catEdit from 'src/components/catSetings/edit.vue';

export default defineComponent({
  name: 'CategoriesSettingsPage',
  components: { catEdit },
  methods: {
    moveto(curr: number, to: number) {
      const cur = this.catag.findIndex((ele) => ele.order == curr);
      if (cur != undefined) {
        const tmp = this.catag[cur];
        if (tmp != undefined) {
          this.catag = <cat[]>this.array_move(this.catag, curr - 1, to - 1);
        }
        this.catag = this.catag.map((ele, inde) => {
          ele.order = inde + 1;
          return ele;
        });
        const fd = new FormData();
        fd.append('from', curr.toString());
        fd.append('to', to.toString());
        this.$fetch('/api/v1/category/reorder', {
          method: 'PATCH',
          body: fd
        });
      }
    },
    array_move(arr: unknown[], old_index: number, new_index: number) {
      if (new_index >= arr.length) {
        let k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr;
    },
    savetxt() {
      const fd = new FormData();
      fd.append('name', this.edittxt);
      fd.append('default', this.defaul.toString());
      this.$fetch('/api/v1/category/', {
        method: 'POST',
        body: fd
      }).then(() => this.getcats());
    },
    getcats() {
      this.$fetchJSON('/api/v1/category/').then((data: cat[]) => {
        this.catag = data.slice(1);
      });
    },
    delcat(id: number) {
      this.$fetch(`/api/v1/category/${id}`, { method: 'DELETE' }).then(() =>
        this.getcats()
      );
    }
  },
  mounted: function () {
    this.getcats();
  },
  setup() {
    return {
      catag: ref(<cat[]>[]),
      editdialog: ref(false),
      newDialog: ref(false),
      edittxt: ref(''),
      defaul: ref(false)
    };
  }
});
</script>
