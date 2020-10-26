<template>
  <div id="app">
    <long-cache
      map-key="root"
      exclude="home"
      :rules="rules"
    >
      <router-view />
    </long-cache>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rules: {
        detail: {
          refresh: 'search,nav1'
        }
      }
    }
  }
}
/* 
  注意项
    vue-router 每个路由必须配置 name 属性
  
  配置项
    include
    exclude
    map-key: 
      缓存的 key 值，唯一，必填
    rules: 
      刷新规则
      {
        routeName1: {
          refresh: ['routeName2', /routeName3/]
          refresh: 'routeName2,routeName3'
          refresh: /routeName3/
          refresh: '*'
          noRefresh: 同上配置
        }
      }
    keepActive: 
      是否永久缓存，根组件无需配置此选项
      better-keep-alive 的 exclude 中的页面需要永久缓存则开启
    max: 
      最大缓存数量
*/
</script>
