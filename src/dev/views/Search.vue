<template>
  <div @click="$router.push('/detail')">
    search
  </div>
</template>

<script>
export default {
  name: 'search',
  created () {
    console.log('search created')
  }
}
</script>
