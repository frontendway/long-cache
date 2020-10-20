<template>
  <div id="app">
    <long-cache 
      :include="['search']"
      :from="['/detail']"
      :exclude="['home']"
      local-key="afterLink"
      cache-key="root"
    >
      <router-view />
    </long-cache>
  </div>
</template>
