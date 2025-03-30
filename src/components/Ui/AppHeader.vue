<template>
  <div>
    <h1 class="title">Timetable</h1>
    <div class="header">
      <nav class="nav">
        <router-link class="nav-link" to="/" :class="{ active: $route.path === '/' }">
          Bus Lines
        </router-link>
        <router-link
          to="/stops"
          class="nav-link"
          :class="{ active: $route.path === '/stops' }"
        >
          Stops
        </router-link>
      </nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.header {
  padding: 0 24px;
  background-color: color('background', 'white');
  border-radius: border-radius('sm');
}
.nav-link {
  padding: 20px 24px !important;
}
.title {
  font-size: 1.5rem;
  font-weight: 500;
  color: color('text', 'black');
  margin-bottom: 28px;
}

.nav {
  display: flex;
}

.nav-link {
  text-decoration: none;
  color: color('text', 'secondary');
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  padding: 0.75rem 0;
  position: relative;
}

.nav-link:hover {
  color: color('text', 'primary');
}

.nav-link.active {
  color: color('text', 'black');
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: color('primary');
}
</style>
