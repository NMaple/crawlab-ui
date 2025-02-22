<template>
  <el-dialog
    :before-close="onClose"
    :model-value="visible"
    :title="t('components.table.columnsTransfer.title')">
    <div class="table-columns-transfer-content">
      <Transfer
        :data="computedData"
        :titles="[
          t('components.table.columnsTransfer.titles.left'),
          t('components.table.columnsTransfer.titles.right')
        ]"
        :value="internalSelectedColumnKeys"
        @change="onChange"
      />
    </div>
    <template #footer>
      <Button plain type="info" @click="onClose">
        {{ t('common.actions.cancel') }}
      </Button>
      <Button @click="onConfirm">
        {{ t('common.actions.confirm') }}
      </Button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeMount, ref} from 'vue';
import Transfer from '@/components/transfer/Transfer.vue';
import Button from '@/components/button/Button.vue';
import {DataItem} from 'element-plus/lib/components/transfer';
import {useI18n} from 'vue-i18n';

export default defineComponent({
  name: 'TableColumnsTransfer',
  components: {Button, Transfer},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selectedColumnKeys: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  emits: [
    'close',
    'change',
    'sort',
    'confirm',
  ],
  setup(props, {emit}) {
    // i18n
    const {t} = useI18n();

    const internalSelectedColumnKeys = ref<string[]>([]);

    const computedData = computed<DataItem[]>(() => {
      const {columns} = props as TableColumnsTransferProps;
      return columns.map(d => {
        const {key, label, disableTransfer} = d;
        return {
          key,
          label,
          disabled: disableTransfer || false,
        };
      });
    });

    const onClose = () => {
      emit('close');
    };

    const onChange = (value: string[]) => {
      internalSelectedColumnKeys.value = value;
    };

    const onConfirm = () => {
      emit('confirm', internalSelectedColumnKeys.value);
      emit('close');
    };

    onBeforeMount(() => {
      const {selectedColumnKeys} = props as TableColumnsTransferProps;
      internalSelectedColumnKeys.value = selectedColumnKeys || [];
    });

    return {
      internalSelectedColumnKeys,
      computedData,
      onClose,
      onChange,
      onConfirm,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
.table-columns-transfer-content {
  display: flex;
  justify-content: center;
}
</style>
