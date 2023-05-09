<template>
  <div class="questionnaire w100">
    <LeftSidebar/>
    <MainContent/>
    <RightPanel/>
  </div>
</template>

<script lang="ts" setup name="questionnaire">
import {defineAsyncComponent} from "vue";

const LeftSidebar = defineAsyncComponent(() => import('./components/sidebar.vue'))
const MainContent = defineAsyncComponent(() => import('./components/content.vue'))
const RightPanel = defineAsyncComponent(() => import('./components/panel.vue'))

</script>

<style lang="scss" scoped>
.questionnaire {
  width: 100%;
  height: 100%;
  display: flex;
}

</style>
