<template>
  <div class="navbar">
    <screenfull />
    <user />
    <!-- <setting /> -->
  </div>
</template>
<script setup>
import {
  Search,
  ErrorLog,
  Screenfull,
  SizeSelect,
  User,
  Setting
} from '@/layout/components/index'
</script>
<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  background-color: #fff;
  border-radius: 4px;
}
</style>
