<template>
  <div @click="$router.push('/')">
    login
  </div>
</template>

<script>
export default {
  name: 'login',
  mounted () {
    console.log('login mounted')
  }
}
</script>
