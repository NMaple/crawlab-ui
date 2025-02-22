<template>
  <Dialog
      :title="title"
      :visible="visible"
      @close="onClose"
      @confirm="onConfirm"
  >
    <Form
        ref="formRef"
        :model="options"
    >
      <!-- Row -->
      <FormItem
          :span="2"
          :label="t('components.task.form.command')"
          prop="cmd"
          required
      >
        <InputWithButton
            v-model="options.cmd"
            :button-icon="['fa', 'edit']"
            :button-label="t('common.actions.edit')"
            :placeholder="t('components.task.form.command')"
        />
      </FormItem>
      <FormItem
          :span="2"
          :label="t('components.task.form.param')"
          prop="param"
      >
        <InputWithButton
            v-model="options.param"
            :button-icon="['fa', 'edit']"
            :button-label="t('common.actions.edit')"
            :placeholder="t('components.task.form.param')"
        />
      </FormItem>
      <!-- ./Row -->

      <!-- Row -->
      <FormItem
          :span="2"
          :label="t('components.task.form.mode')"
          prop="mode"
          required
      >
        <el-select
            v-model="options.mode"
        >
          <el-option
              v-for="op in modeOptions"
              :key="op.value"
              :label="op.label"
              :value="op.value"
          />
        </el-select>
      </FormItem>
      <FormItem
          :span="2"
          :label="t('components.task.form.priority')"
          prop="priority"
          required
      >
        <el-select
            v-model="options.priority"
        >
          <el-option
              v-for="op in priorityOptions"
              :key="op.value"
              :label="op.label"
              :value="op.value"
          />
        </el-select>
      </FormItem>
      <!-- ./Row -->

      <FormItem
          v-if="options.mode === TASK_MODE_SELECTED_NODE_TAGS"
          :span="4"
          :label="t('components.task.form.selectedTags')"
          prop="node_tags"
          required
      >
        <CheckTagGroup
            v-model="options.node_tags"
            :options="allNodeTags"
        />
      </FormItem>

      <FormItem
          v-if="[TASK_MODE_SELECTED_NODES, TASK_MODE_SELECTED_NODE_TAGS].includes(options.mode)"
          :span="4"
          :label="t('components.task.form.selectedNodes')"
          required
      >
        <CheckTagGroup
            v-model="options.node_ids"
            :options="allNodeSelectOptions"
        />
      </FormItem>
    </Form>
  </Dialog>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {useStore} from 'vuex';
import Dialog from '@/components/dialog/Dialog.vue';
import Form from '@/components/form/Form.vue';
import useSpider from '@/components/spider/spider';
import useNode from '@/components/node/node';
import {TASK_MODE_RANDOM, TASK_MODE_SELECTED_NODE_TAGS, TASK_MODE_SELECTED_NODES} from '@/constants/task';
import useTask from '@/components/task/task';
import FormItem from '@/components/form/FormItem.vue';
import InputWithButton from '@/components/input/InputWithButton.vue';
import CheckTagGroup from '@/components/tag/CheckTagGroup.vue';
import {ElMessage} from 'element-plus';
import {useI18n} from 'vue-i18n';
import {sendEvent} from '@/admin/umeng';

export default defineComponent({
  name: 'RunSpiderDialog',
  components: {
    Dialog,
    Form,
    FormItem,
    InputWithButton,
    CheckTagGroup,
  },
  setup() {
    // i18n
    const {t} = useI18n();

    // store
    const ns = 'spider';
    const store = useStore();
    const {
      spider: state,
    } = store.state as RootStoreState;

    const {
      allListSelectOptions: allNodeSelectOptions,
      allTags: allNodeTags,
    } = useNode(store);

    const {
      modeOptions,
      form,
    } = useSpider(store);

    const {
      priorityOptions,
    } = useTask(store);

    // spider
    const spider = computed<Spider>(() => form.value);

    // form ref
    const formRef = ref<typeof Form>();

    // run options
    const options = ref<SpiderRunOptions>({
      mode: TASK_MODE_RANDOM,
      cmd: spider.value.cmd,
      param: spider.value.param,
      priority: 5,
    });

    // dialog visible
    const visible = computed<boolean>(() => state.activeDialogKey === 'run');

    // title
    const title = computed<string>(() => {
      if (!spider.value) return t('components.spider.dialog.run.title');
      return `${t('components.spider.dialog.run.title')} - ${spider.value.name}`;
    });

    const onClose = () => {
      store.commit(`${ns}/hideDialog`);

      sendEvent('click_run_spider_dialog_close');
    };

    const onConfirm = async () => {
      await formRef.value?.validate();
      await store.dispatch(`${ns}/runById`, {id: spider.value?._id, options: options.value});
      store.commit(`${ns}/hideDialog`);
      await ElMessage.success(t('components.spider.message.success.scheduleTask'));
      await store.dispatch(`${ns}/getList`);

      sendEvent('click_run_spider_dialog_confirm', {
        mode: options.value.mode,
        priority: options.value.priority,
      });
    };

    return {
      TASK_MODE_SELECTED_NODES,
      TASK_MODE_SELECTED_NODE_TAGS,
      visible,
      title,
      formRef,
      options,
      modeOptions,
      allNodeSelectOptions,
      allNodeTags,
      priorityOptions,
      onClose,
      onConfirm,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
