<template>
  <NavActionGroup>
    <NavActionButton
        :disabled="disabled"
        :icon="['fa', 'undo']"
        button-type="label"
        :label="t('components.nav.actions.back')"
        type="primary"
        @click="() => $emit('back')"
    />
    <NavActionButton
        :disabled="disabled"
        :icon="['fa', 'save']"
        button-type="label"
        :label="t('components.nav.actions.save')"
        type="success"
        @click="() => $emit('save')"
    />
  </NavActionGroup>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import NavActionGroup from '@/components/nav/NavActionGroup.vue';
import NavActionButton from '@/components/nav/NavActionButton.vue';
import {useI18n} from 'vue-i18n';

export default defineComponent({
  name: 'NavActionGroupDetailCommon',
  components: {NavActionButton, NavActionGroup},
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'back',
  ],
  setup() {
    const {t} = useI18n();

    return {
      t,
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
