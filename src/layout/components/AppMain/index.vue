<template>
  <div class="app-main">
    <el-config-provider :locale="zhCn">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </el-config-provider>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTagsViewStore } from "@/store/tagsView";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";

const tagsViewStore = useTagsViewStore();
const cachedViews = computed(() => tagsViewStore.cachedViews);
</script>

<style lang="scss" scoped>
.app-main {
  /* fade */
  padding: 20px;
  padding-bottom: 80px;
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.28s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  /* fade-transform */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
