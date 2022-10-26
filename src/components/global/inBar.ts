import { Component, shallowRef } from 'vue';

const inbar = shallowRef();

export default function useInBar() {
  const setInBar = (data: Component | undefined = undefined) => {
    inbar.value = data;
  };

  return {
    setInBar,
    inbar
  };
}
