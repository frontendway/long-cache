<template>
  <div @click="$router.push('/')">
    login
  </div>
</template>

<script>
export default {
  name: 'login',
  created () {
    console.log('login created')
  }
}
</script>
