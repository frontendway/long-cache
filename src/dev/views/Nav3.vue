<template>
  <div>
    <div>
      <router-link to="/detail">去详情</router-link>
      <router-link to="/search">去搜索页</router-link>
    </div>
    nav3
  </div>
</template>

<script>
export default {
  name: 'nav3',
  mounted () {
    console.log('nav3 mounted')
  }
}
</script>
