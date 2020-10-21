<template>
  <div>
    <div>
      <router-link to="/detail">去详情页</router-link>
      <router-link to="/search">去搜索页</router-link>
    </div>
    nav1
  </div>
</template>

<script>
export default {
  name: 'nav1',
  mounted () {
    console.log('nav1 mounted')
  }
}
</script>
