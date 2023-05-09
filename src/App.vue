<template>
  <router-view/>
</template>

<script lang="ts" setup name="app">
</script>

<style lang="scss">

.sortable-ghost {
  position: relative;
  display: block;
  overflow: hidden;
&::before {
   content: " ";
   position: absolute;
   left: 0;
   right: 0;
   top: 0;
   height: 3px;
   background: rgb(89, 89, 223);
   z-index: 2;
 }
}
.components-item.sortable-ghost {
  width: 100%;
  height: 60px;
  background-color:#fff;
}

</style>
