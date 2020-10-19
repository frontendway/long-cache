<template>
  <div id="app">
    <long-cache 
      :include="['search']"
      :exclude="['home']"
      :from="['/detail']"
      local-key="afterLink"
      cache-key="root"
    >
      <router-view />
    </long-cache>
  </div>
</template>
