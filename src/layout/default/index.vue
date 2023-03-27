<template>
  <div class="default-container">
    <sidebar class="sidebar" />
    <div class="main-container">
      <el-card :body-style="{padding:'10px'}" >
        <div  class="fixed-header">
          <!-- <tags-view class="tags-view" /> -->
          <Breadcrumb/>
        <navbar />
        </div>
      </el-card>
      <el-scrollbar class="main-scrollbar">
        <app-main />
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import { Sidebar, AppMain } from '@/layout/components/index'
import { TagsView, Navbar } from '@/layout/default/components/index'
import { useSettingsStore } from '@/store/settings'
import { computed } from 'vue'
import Breadcrumb from '@/layout/classic/components/Navbar/Breadcrumb'

const settingsStore = useSettingsStore()
// 侧边栏宽度 + 20偏差
const menuWidth = computed(() =>
  settingsStore.menuCollapse
    ? 'calc(64px + 20px)'
    : `${settingsStore.menuWidth}px`
)
</script>
<style lang="scss" scoped>
.default-container {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: #fff;

  .sidebar {
    z-index: 1001;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
    transition: width 0.28s;
    font-size: 0;
  }

  .main-container {
    position: relative;
    min-height: 100%;
    margin-left: v-bind(menuWidth);
    transition: margin-left 0.28s;

    .fixed-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;
      .tags-view {
        flex: 1;
        margin-right: 10px;
      }
    }

    .main-scrollbar {
      // navbar height 50 padding 上下各20
      height: 100vh;
    }
  }
}
</style>
