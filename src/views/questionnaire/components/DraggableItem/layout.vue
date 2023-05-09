<template>
  <el-col :span="componentData.config.span" @mouseover="hover = true" @mouseout="hover = false">
    <div class="layout-box">
      <el-form-item
          :required="componentData.config.required"
          :label="componentData.config.label"
          :label-width="componentData.config.labelWidth"
          :rules="componentData.config.regList"
      >
        <slot></slot>
      </el-form-item>

      <div class="func-box f-ac">

        <el-popconfirm
            width="200"
            @confirm="delThisComponent"
            confirm-button-text="确定"
            cancel-button-text="再看看"
            :icon="Delete"
            icon-color="#e03141"
            :title="`确定要删除【${componentData.config.label}】`"
        >
          <template #reference>
            <div class="btn btn_a f-c h-red">
              <SvgIcon name="fa fa-trash-o"></SvgIcon>
            </div>
          </template>
        </el-popconfirm>

        <div class="btn f-c ml10 h-grey">
          <SvgIcon name="ele-Tools"></SvgIcon>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script lang="ts" setup name="component-layout">
import { Delete } from '@element-plus/icons-vue'
import {ref} from "vue";
import $bus from "@/utils/bus";

const props = defineProps({
      componentData: {
        type: Object,
        required: true
      },
    }
)

const hover = ref(false)

function delThisComponent() {
  $bus.emit('delComponent',props.componentData.domId)
}

</script>

<style scoped lang="scss">
.layout-box {
  cursor: move;
  width: calc(100% - 10px);
  padding: 15px 5px;
  position: relative;
  border: 1px transparent dashed;

  &:hover {
    background: #f3f3f3;
    //border-color: #d5d5d5;
    border-radius: 5px;
  }
}

.func-box {
  bottom: 0;
  right: 0;
  position: absolute;

  .btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
}

.h-red {
  &:hover {
    color: #fff;
    background: red;
    cursor: pointer;
  }
}

.h-grey {
  &:hover {
    color: #fff;
    background: #c4c4c4;
    cursor: pointer;
  }
}


</style>
