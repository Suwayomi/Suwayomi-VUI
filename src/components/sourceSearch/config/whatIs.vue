<!-- /*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */ -->
<template>
  <q-item
    clickable
    v-ripple
    @click="val = !val"
    class="row justify-between"
    v-if="isSwitchPreferenceCompat(preference)"
  >
    <q-item-section>
      <q-item-label>{{ preference.props.title }}</q-item-label>
      <q-item-label caption>{{ preference.props.summary }}</q-item-label>
    </q-item-section>
    <q-toggle color="blue" v-model="val" />
  </q-item>
  <q-item
    v-if="isCheckBoxPreference(preference)"
    clickable
    v-ripple
    @click="val = !val"
    class="row justify-between"
  >
    <q-item-section>
      <q-item-label>{{ preference.props.title }}</q-item-label>
      <q-item-label caption>{{ preference.props.summary }}</q-item-label>
    </q-item-section>
    <q-checkbox color="blue" v-model="val"
  /></q-item>
  <q-item
    v-if="isMultiSelectListPreference(preference)"
    clickable
    v-ripple
    @click="dialog = true"
  >
    <q-item-section>
      <q-item-label>{{ preference.props.title }}</q-item-label>
      <q-item-label caption>{{ preference.props.summary }}</q-item-label>
    </q-item-section>
    <q-dialog v-model="dialog">
      <q-card class="q-pa-md">
        <q-list>
          <div class="text-h5">{{ preference.props.title }}</div>
          <q-item
            :key="index"
            v-for="(selec, index) in preference.props.entries"
          >
            <q-checkbox
              v-model="val"
              :val="preference.props.entryValues[index]"
              :label="selec"
              color="blue"
            />
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
  </q-item>
  <q-item
    v-if="isEditTextPreference(preference)"
    clickable
    v-ripple
    @click="dialog = true"
  >
    <q-item-section>
      <q-item-label>{{ preference.props.title }}</q-item-label>
      <q-item-label caption>{{ preference.props.summary }}</q-item-label>
    </q-item-section>
    <q-dialog v-model="dialog">
      <q-card class="q-pa-md">
        <q-input v-if="typeof val == 'string'" outlined v-model="val" />
        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            v-close-popup
            @click="saveText"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-item>
  <q-item
    v-if="isListPreference(preference)"
    clickable
    v-ripple
    @click="dialog = true"
  >
    <q-item-section>
      <q-item-label>{{ preference.props.title }}</q-item-label>
      <q-item-label caption>{{
        preference.props.summary.replace(
          '%s',
          preference.props.entries[
            preference.props.entryValues.indexOf(preference.props.currentValue)
          ] || ''
        )
      }}</q-item-label>
    </q-item-section>
    <q-dialog v-model="dialog">
      <q-card class="q-pa-md">
        <q-list>
          <div class="text-h5">{{ preference.props.title }}</div>
          <q-item
            :key="index"
            v-for="(selec, index) in preference.props.entries"
          >
            <q-radio
              v-if="typeof val == 'string'"
              v-model="val"
              :val="preference.props.entryValues[index]"
              :label="selec"
              color="blue"
            />
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
  </q-item>
</template>

<script lang="ts">
import {
  isCheckBoxPreference,
  isEditTextPreference,
  isListPreference,
  isMultiSelectListPreference,
  isSwitchPreferenceCompat,
  preferences
} from 'src/components/global/models';
import { defineComponent, PropType, ref } from 'vue';

export default defineComponent({
  name: 'whatIs',
  props: {
    preference: {
      type: Object as PropType<preferences>,
      required: true
    },
    position: {
      type: Number as PropType<number>,
      required: true
    }
  },
  emits: ['getPrefs'],
  methods: {
    saveText() {
      let tmp: string;
      if (typeof this.val == 'object') {
        tmp = JSON.stringify(this.val);
      } else {
        tmp = (this.val as boolean | string).toString();
      }
      this.$api
        .post(`/api/v1/source/${this.$route.params['sourceID']}/preferences`, {
          position: this.position,
          value: tmp
        })
        .then(() => {
          this.$emit('getPrefs');
        });
    }
  },
  watch: {
    val() {
      if (!this.isEditTextPreference(this.preference)) {
        this.saveText();
      }
    }
  },
  setup(props) {
    const dialog = ref(<boolean>false);
    let val: unknown;
    if (isCheckBoxPreference(props.preference)) {
      val = ref(<boolean>props.preference.props.currentValue);
    } else if (isEditTextPreference(props.preference)) {
      val = ref(<string>props.preference.props.currentValue);
    } else if (isMultiSelectListPreference(props.preference)) {
      val = ref(<string[]>props.preference.props.currentValue);
    } else if (isSwitchPreferenceCompat(props.preference)) {
      val = ref(<boolean>props.preference.props.currentValue);
    } else {
      val = ref(<string>props.preference.props.currentValue);
    }
    return {
      dialog,
      val,
      isCheckBoxPreference,
      isEditTextPreference,
      isMultiSelectListPreference,
      isSwitchPreferenceCompat,
      isListPreference
    };
  }
});
</script>
