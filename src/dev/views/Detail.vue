<template>
  <div>
    <div @click="$router.back()">
      返回
    </div>
    <div @click="$router.push('/login')">
      去登录
    </div>
    <div @click="$router.push('/search')">
      去搜索
    </div>
    detail
  </div>
</template>

<script>
export default {
  name: 'detail',
  created () {
    console.log('详情页 created')
  }
}
</script>
