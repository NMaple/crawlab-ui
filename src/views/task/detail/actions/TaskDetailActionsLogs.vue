<template>
  <NavActionGroup class="task-detail-actions-logs">
    <NavActionFaIcon :icon="['fa', 'file-alt']"/>
    <NavActionItem>
      <el-tooltip
          :content="t('components.task.logs.actions.autoUpdateLogs')"
      >
        <Switch
            v-model="internalAutoUpdate"
            @change="onAutoUpdateChange"
        />
      </el-tooltip>
    </NavActionItem>
  </NavActionGroup>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue';
import NavActionGroup from '@/components/nav/NavActionGroup.vue';
import NavActionItem from '@/components/nav/NavActionItem.vue';
import NavActionFaIcon from '@/components/nav/NavActionFaIcon.vue';
import {useStore} from 'vuex';
import useTask from '@/components/task/task';
import Switch from '@/components/switch/Switch.vue';
import {useI18n} from 'vue-i18n';

export default defineComponent({
  name: 'TaskDetailActionsLogs',
  components: {
    Switch,
    NavActionFaIcon,
    NavActionGroup,
    NavActionItem,
  },
  setup() {
    // i18n
    const {t} = useI18n();

    // store
    const ns = 'task';
    const store = useStore();
    const {
      task: state,
    } = store.state as RootStoreState;

    // internal auto update
    const internalAutoUpdate = ref<boolean>(state.logAutoUpdate);

    // watch log auto update
    watch(() => state.logAutoUpdate, () => {
      setTimeout(() => {
        internalAutoUpdate.value = state.logAutoUpdate;
      }, 100);
    });

    // auto update change
    const onAutoUpdateChange = (value: boolean) => {
      if (value) {
        store.commit(`${ns}/enableLogAutoUpdate`);
      } else {
        store.commit(`${ns}/disableLogAutoUpdate`);
      }
    };

    return {
      ...useTask(store),
      internalAutoUpdate,
      onAutoUpdateChange,
      t,
    };
  },
});
</script>

<style scoped>
</style>
