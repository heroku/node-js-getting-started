<template>
  <div class="quest-content f1">
    <el-scrollbar class="center-scrollbar">
      <el-row class="center-board-row">
        <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
        >
          <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
            <DraggableItem v-for="(item,idx) in drawingList" :componentData="item" :key="item.domId"/>
          </draggable>

          <div v-show="!drawingList.length" class="empty-info">
            从左侧拖入或点选组件进行表单设计
          </div>
        </el-form>

      </el-row>
    </el-scrollbar>
  </div>

</template>

<script lang="ts" setup name="app">
import {formConf} from '@/config/templateConfig'
import {VueDraggableNext as draggable} from "vue-draggable-next";
import {ref, defineAsyncComponent} from "vue";
import $bus from '@/utils/bus'

const DraggableItem = defineAsyncComponent(() => import('./DraggableItem/index.vue'))

const drawingList = ref<IComponent[]>([])
const enabled = ref(true)
const dragging = ref(false)

$bus.on('addDrawingComponent', (item: IComponent) => {
  drawingList.value.push(item)
})

// 临时数据 临时处理方式 =>hock
$bus.on('delComponent', (domId: string) => {
  const idx = drawingList.value.findIndex(item => item.domId == domId)
  drawingList.value.splice(idx,1)
})

const checkMove = () => {

}
</script>

<style lang="scss">
@import '@/assets/css/questionnaire/content.scss';
</style>

