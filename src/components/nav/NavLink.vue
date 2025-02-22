<template>
  <div class="nav-link" @click="onClick">
    <Icon :icon="icon" class="icon"/>
    <span class="title">{{ label }}</span>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import Icon from '@/components/icon/Icon.vue';
import {useRouter} from 'vue-router';
import {sendEvent} from '@/admin/umeng';

export default defineComponent({
  name: 'NavLink',
  components: {Icon},
  props: {
    path: {
      type: String,
      default: '',
    },
    label: {
      type: [String, Number, Boolean],
      default: '',
    },
    icon: {
      type: [String, Array] as PropType<Icon>,
      default: '',
    },
    external: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'click',
  ],
  setup(props: NavLinkProps, {emit}) {
    const router = useRouter();

    const onClick = () => {
      const {path, external} = props;
      if (external) {
        window.open(path);
        return;
      }
      if (path) {
        router.push(path);
      }
      emit('click');

      sendEvent('click_nav_link', {
        path,
        external,
        currentPath: router.currentRoute.value.path,
      });
    };

    return {
      onClick,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../../styles/color";

.nav-link {
  cursor: pointer;
  color: $blue;

  &:hover {
    text-decoration: underline;
  }

  .icon {
    margin-right: 3px;
  }
}
</style>
