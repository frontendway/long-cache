<template>
  <div id="app">
    <long-cache
      map-key="root"
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
          refresh: '*'
        }
      }
    }
  }
}
</script>
