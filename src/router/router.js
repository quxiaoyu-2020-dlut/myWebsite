// import APP from "../App.vue"
import tDworld from "../page/3Dworld.vue"
import helloTest from "../page/helloTest.vue"
import index from "../page/index.vue"
import physicWorld from "../page/physicWorld.vue"

export default [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: index,
  },
  {
    path: "/world",
    name: "ThreeDworld",
    component: tDworld,
  },
  {
    path: "/hello",
    name: "helloTest",
    component: helloTest,
  },
  {
    path: "/physicworld",
    name: "physicWorld",
    component: physicWorld,
  },
  // {
  //   path: "/",
  //   component: APP,
  //   children: [
  //     {
  //       path: "/world",
  //       name: "ThreeDworld",
  //       component: tDworld,
  //     },
  //     {
  //       path: "/hello",
  //       name: "helloTest",
  //       component: helloTest,
  //     },
  //   ],
  // },
]
