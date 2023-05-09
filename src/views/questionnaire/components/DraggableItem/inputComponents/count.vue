<template>
  <ComponentLayout :componentData="componentData">
    <el-input-number
        v-model.number="componentData.config.defaultValue"
        :precision="componentData.precision"
        :step-strictly="componentData['step-strictly']"
        :controls-position="componentData['controls-position']"
        :disabled="componentData.disabled"
        :min="componentData.min"
        :max="componentData.max"
        :step="componentData.step"
        :placeholder="componentData.placeholder"
        :readonly="componentData.readonly"
        :style="componentData.style"
       >
    </el-input-number>

  </ComponentLayout>
</template>

<script lang="ts" setup name="component-count">
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
