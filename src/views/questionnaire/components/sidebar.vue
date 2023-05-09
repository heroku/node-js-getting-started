<template>
  <div class="leftSidebar">
    <div class="f-col mt10" v-for="(component, idx)  in leftComponents" :key="idx">
      <div class="title mt10 ml10">{{ component.title }}</div>
      <draggable
          :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
          :list="component.list"
          class="grid grid-cols-2"
          draggable=".components-item"
          ghost-class="ghost"
          :sort="false"
          :clone="cloneComponent"
          @end="onEnd"
      >

        <div
            class="components-item mt10 ml5 f-ac"
            v-for="element in component.list"
            :key="element.type"
            @click="addComponent(element)"
        >
          <SvgIcon class="mr10" :name="element.config.tagIcon"></SvgIcon>

          {{ element.config.label }}
        </div>
      </draggable>
    </div>

  </div>
</template>

<script lang="ts" setup name="leftSidebar">
import {ref} from "vue";
import _ from "lodash";
import $bus from '@/utils/bus'
import {getUuid} from '@/utils/tools'
import {inputComponents, formConf, selectComponents} from '@/config/templateConfig'
import {VueDraggableNext as draggable} from "vue-draggable-next";

const leftComponents = ref<ILeftComponents[]>([
  {
    title: '输入型组件',
    icon: '',
    list: inputComponents
  }, {
    title: '选择类型组件',
    icon: '',
    list: selectComponents
  },
])

function onEnd(obj: any) {
  // console.log(obj)
}

//  重构
const cloneComponent = (obj: IComponent) => {
  const  componentObj = _.cloneDeep(obj)
  const {span} = formConf
  componentObj.domId = getUuid(16, 16)
  componentObj.config.span = span
  return componentObj
}

function addComponent(item: IComponent) {
  const  componentObj = _.cloneDeep(item)
  componentObj.domId = getUuid(16, 16)
  $bus.emit('addDrawingComponent', componentObj)
}

</script>

<style lang="scss" scoped>
.leftSidebar {
  width: 240px;
  padding: 10px;
  height: calc(100% - 20px);
}

.title {
}

.components-item {
  //width: 80px;
  border: 1px transparent solid;
  height: 30px;
  padding: 5px 10px;
  border-radius: 5px;

  &:hover {
    cursor: move;
    border: #5f6165 1px dashed;
  }
}

</style>
