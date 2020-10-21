<template>
  <div>
    <header @click="$router.push('/search')">header</header>
    <div class="content">
      <long-cache
        map-key="home"
      >
        <router-view />
      </long-cache>
    </div>
    <footer>
      <router-link to="/nav1">nav1</router-link>
      <router-link to="/nav2">nav2</router-link>
      <router-link to="/nav3">nav3</router-link>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'home',
  mounted () {
    console.log('home mounted')
  }
}
</script>
