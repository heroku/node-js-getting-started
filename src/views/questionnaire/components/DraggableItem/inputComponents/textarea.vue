<template>
  <ComponentLayout :componentData="componentData">
    <el-input
        type="textarea"
        :autosize="componentData.autosize"
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
    </el-input>
  </ComponentLayout>
</template>

<script lang="ts" setup name="component-textarea">
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
