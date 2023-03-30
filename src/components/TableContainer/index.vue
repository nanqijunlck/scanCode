<template>
    <div class="table-box">
        <el-card :body-style="{padding:10}">
            <div class="opreate-btn-group">
                <slot name="opreate"></slot>
            </div>
            <slot name="content"></slot>
        </el-card>
    </div>
</template>
<script setup name="TableContainer">

</script>
<style scoped>
.table-box{
    margin-top: 20px;
}
.opreate-btn-group{
    margin: 10px 0;
}
</style>
