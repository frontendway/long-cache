<template>
  <div>
    <span @click="$router.push('/')">login</span>
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