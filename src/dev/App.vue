<template>
  <div id="app">
    <long-cache
      map-key="root"
      :rules="rules"
      exclude="home"
      route-name="afterLink"
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
        search: {
          notRefresh: 'detail'
        }
      }
    }
  }
}
</script>
