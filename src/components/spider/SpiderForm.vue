<template>
  <Form v-if="form" ref="formRef" :model="form">
    <!-- Row -->
    <FormItem
        :span="2"
        :label="t('components.spider.form.name')"
        prop="name"
        required
    >
      <el-input
          v-model="form.name"
          :disabled="isFormItemDisabled('name')"
          :placeholder="t('components.spider.form.name')"
      />
    </FormItem>
    <FormItem
        :span="2"
        :label="t('components.spider.form.project')"
        prop="project_id"
    >
      <el-select
          v-model="form.project_id"
          :disabled="isFormItemDisabled('project_id')"
          filterable
      >
        <el-option
            v-for="op in allProjectSelectOptions"
            :key="op.value"
            :label="op.label"
            :value="op.value"
        />
      </el-select>
    </FormItem>
    <!-- ./Row -->

    <!-- Row -->
    <FormItem
        :span="2"
        :label="t('components.spider.form.command')"
        prop="cmd"
        required
    >
      <InputWithButton
          v-model="form.cmd"
          :button-icon="['fa', 'edit']"
          :button-label="t('common.actions.edit')"
          :placeholder="t('components.spider.form.command')"
          :disabled="isFormItemDisabled('cmd')"
      />
    </FormItem>
    <FormItem
        :span="2"
        :label="t('components.spider.form.param')"
        prop="param"
    >
      <InputWithButton
          v-model="form.param"
          :button-icon="['fa', 'edit']"
          :button-label="t('common.actions.edit')"
          :placeholder="t('components.spider.form.param')"
          :disabled="isFormItemDisabled('param')"
      />
    </FormItem>
    <!-- ./Row -->

    <!-- Row -->
    <FormItem
        :span="2"
        :label="t('components.spider.form.defaultMode')"
        prop="mode"
        required
    >
      <el-select
          v-model="form.mode"
          :disabled="isFormItemDisabled('mode')"
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
        :label="t('components.spider.form.resultsCollection')"
        prop="col_name"
        required
    >
      <el-autocomplete
          v-model="form.col_name"
          :disabled="isFormItemDisabled('col_name')"
          :placeholder="t('components.spider.form.resultsCollection')"
          :fetch-suggestions="fetchDataCollectionSuggestions"
          @input="onDataCollectionInput"
          @select="onDataCollectionSuggestionSelect"
      />
    </FormItem>
    <!-- ./Row -->

    <FormItem
        v-if="form.mode === TASK_MODE_SELECTED_NODE_TAGS"
        :span="4"
        :label="t('components.spider.form.selectedTags')"
        prop="node_tags"
        required
    >
      <CheckTagGroup
          v-model="form.node_tags"
          :options="allNodeTags"
          :disabled="isFormItemDisabled('node_tags')"
      />
    </FormItem>

    <FormItem
        v-if="[TASK_MODE_SELECTED_NODES, TASK_MODE_SELECTED_NODE_TAGS].includes(form.mode)"
        :span="4"
        :label="t('components.spider.form.selectedNodes')"
        required
    >
      <CheckTagGroup
          v-model="form.node_ids"
          :options="allNodeSelectOptions"
          :disabled="form.mode === TASK_MODE_SELECTED_NODE_TAGS && isFormItemDisabled('node_ids')"
      />
    </FormItem>

    <FormItem
        :span="4"
        :label="t('components.spider.form.description')"
        prop="description"
    >
      <el-input
          v-model="form.description"
          :disabled="isFormItemDisabled('description')"
          :placeholder="t('components.spider.form.description')"
          type="textarea"
      />
    </FormItem>
  </Form>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue';
import {useStore} from 'vuex';
import useSpider from '@/components/spider/spider';
import useNode from '@/components/node/node';
import useProject from '@/components/project/project';
import Form from '@/components/form/Form.vue';
import FormItem from '@/components/form/FormItem.vue';
import InputWithButton from '@/components/input/InputWithButton.vue';
import CheckTagGroup from '@/components/tag/CheckTagGroup.vue';
import {TASK_MODE_SELECTED_NODE_TAGS, TASK_MODE_SELECTED_NODES} from '@/constants/task';
import pinyin, {STYLE_NORMAL} from 'pinyin';
import {isZeroObjectId} from '@/utils/mongo';
import {useI18n} from 'vue-i18n';

export default defineComponent({
  name: 'SpiderForm',
  components: {
    Form,
    FormItem,
    InputWithButton,
    CheckTagGroup,
  },
  setup() {
    // i18n
    const {t} = useI18n();

    // store
    const store = useStore();

    // use node
    const {
      allListSelectOptions: allNodeSelectOptions,
      allTags: allNodeTags,
    } = useNode(store);

    // use project
    const {
      allListSelectOptionsWithEmpty: allProjectSelectOptions,
    } = useProject(store);

    // use spider
    const {
      form,
    } = useSpider(store);

    // whether col field of form has been changed
    const isFormColChanged = ref<boolean>(false);

    const onColInput = () => {
      isFormColChanged.value = true;
    };

    watch(() => form.value?.name, () => {
      if (isFormColChanged.value) return;
      if (form.value?._id && isZeroObjectId(form.value?._id)) return;
      if (!form.value.name) {
        form.value.col_name = '';
      } else {
        const name = pinyin(form.value.name, {style: STYLE_NORMAL})
            .map(d => d.join('_'))
            .join('_');
        form.value.col_name = `results_${name}`;
      }
    });

    const onDataCollectionSuggestionSelect = ({_id}: { _id: string; value: string }) => {
      form.value.col_id = _id;
    };

    const onDataCollectionInput = (value: string) => {
      form.value.col_name = value;
      form.value.col_id = undefined;
    };

    return {
      ...useSpider(store),

      // custom
      TASK_MODE_SELECTED_NODES,
      TASK_MODE_SELECTED_NODE_TAGS,
      allNodeSelectOptions,
      allNodeTags,
      allProjectSelectOptions,
      onColInput,
      onDataCollectionSuggestionSelect,
      onDataCollectionInput,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>

</style>
