<template>
   <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index">{{item.name}}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>
<script setup name="BreadCrumb">
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
const route = useRoute()
//装路由数据的数组
const menus = ref([])

watch(
  ()=> route.matched,
  (newV) => {
    menus.value = newV
  },
  {
    immediate: true
  }
)
</script>