import { ref } from 'vue';

const isConfigurable = ref(<boolean>false);

export function isConfig() {
  function setConfigurable(data: boolean) {
    isConfigurable.value = data;
  }
  return {
    setConfigurable,
    isConfigurable
  };
}
