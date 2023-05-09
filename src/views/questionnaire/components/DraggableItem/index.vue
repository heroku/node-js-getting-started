<template>
  <component :is="coreComponents[activeComponent]" :componentData="componentData"/>
</template>

<!--核心-->
<script setup lang="ts" name="componentCore">
import _ from 'lodash'
import {defineAsyncComponent, computed, ref} from "vue";
import {ElMessage} from "element-plus";

const props = defineProps({
      componentData: {
        type: Object,
        required: true
      },
    }
)
const names = ref<string[]>([])

// 引入组件 glob  X=>globEager
const inputModules = import.meta.glob('./inputComponents/*.vue')
const selectComponents = import.meta.glob('./selectComponents/*.vue')

const modules: any = {...inputModules, ...selectComponents}
let coreComponents: any = {}

for (const path in modules) {
  const content = path.split('/');
  const name = _.trimEnd(content[content.length - 1], '.vue')
  names.value.push(name)
  coreComponents['component_' + name] = defineAsyncComponent(modules[path])
}

const activeComponent = computed(() => {
  return 'component_' + props.componentData.type
})

if (!names.value.includes(props.componentData.type)){
  ElMessage.error(`【${props.componentData.config.label}】组件，尚未重构请耐心等待 !`)
}

</script>

<style scoped lang="scss">

</style>
