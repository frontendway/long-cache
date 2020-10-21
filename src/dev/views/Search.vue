<template>
  <div @click="$router.push('/detail')">
    search
  </div>
</template>

<script>
export default {
  name: 'search',
  mounted () {
    console.log('search mounted')
  }
}
</script>
