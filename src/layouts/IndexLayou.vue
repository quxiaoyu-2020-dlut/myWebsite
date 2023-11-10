<template>
  <div class="starry-sky">
    <div v-for="(star, index) in stars" :key="index" class="star" :style="star.style"></div>
    <div v-for="(star, index) in stars" :key="index" class="starMove" :style="star.style"></div>
    <button @click="open3D">open 3D world</button>
    <!-- <button @click="test">test</button> -->
    <button @click="openWorld">Open Physic World!</button>

    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      stars: [],
    }
  },
  methods: {
    createStar() {
      const star = {
        style: {
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          animationDuration: `${Math.random() * 2 + 1}s`,
          animationDelay: `${Math.random() * 2}s`,
        },
      }
      this.stars.push(star)
    },
    createStars() {
      for (let i = 0; i < 100; i++) {
        this.createStar()
      }
    },
    open3D() {
      this.$router.push({
        path: "/world",
      })
    },
    test() {
      this.$router.push({
        path: "/hello",
      })
    },
    openWorld() {
      this.$router.push({
        path: "/physicworld",
      })
    },
  },
  mounted() {
    this.createStars()
  },
}
</script>

<style scoped>
.starry-sky {
  width: 100%;
  height: 100vh;
  background: #000;
  position: absolute;
  overflow: hidden; /* 使星星在视窗之外不可见 */
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  animation: twinkling 1s infinite;
}
.starMove {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  animation: moveStar 10s linear infinite;
}
/* .shooting-star {
  position: absolute;
  width: 8px;
  height: 2px;
  border-radius: 50%;

  background: linear-gradient(to right, transparent 0%, #fff 50%, transparent 100%);
  animation: moveStar 10s linear infinite;
} */

@keyframes twinkling {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* @keyframes moveStar {
  0% {
    top: 0;
  }
  100% {
    top: 100vh;
  }
} */
@keyframes moveStar {
  0% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(-100%) translateY(100vh);
  }
}
</style>
