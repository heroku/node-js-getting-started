<template>
  <ComponentLayout :componentData="componentData">
    <el-input
        :style="componentData.style"
        :disabled="componentData.disabled"
        :placeholder="componentData.placeholder"
        :clearable="componentData.clearable"
        :readonly="componentData.readonly"
        :prefix-icon="componentData['prefix-icon']"
        :suffix-icon="componentData['suffix-icon']"
        :maxlength="componentData.maxlength"
        :show-word-limit="componentData['show-word-limit']"
        v-model.trim="componentData.config.defaultValue">
      <template v-if="componentData.slot.append" #append> {{ componentData.slot.append }}</template>
      <template v-if="componentData.slot.prepend" #prepend> {{ componentData.slot.prepend }}</template>
    </el-input>

  </ComponentLayout>
</template>

<script lang="ts" setup name="component-input">
import {defineAsyncComponent} from "vue";

const ComponentLayout = defineAsyncComponent(() => import('../layout.vue'))

const props = defineProps({
      componentData: {
        type: Object,
        required: true
      },
    }
)

</script>

<style scoped lang="scss">

</style>
