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
        search: {
          notRefresh: 'detail,nav1'
        }
      }
    }
  }
}
</script>
