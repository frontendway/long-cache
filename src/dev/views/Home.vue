<template>
  <div>
    <header @click="$router.push('/search')">header</header>
    <div class="content">
      <long-cache 
        :keep-long="true"
        :from="[/\/detail/]" 
        local-key="afterLink"
        cache-key="home"
      >
        <router-view></router-view>
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
  data () {
    return {
      pattern: 'nav1,nav2'
    }
  }
}
</script>
