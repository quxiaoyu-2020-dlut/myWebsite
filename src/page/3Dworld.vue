<template>
  <div>
    <div id="canvas-container"></div>
    <p class="textTest">hello world</p>
  </div>
</template>

<script>
import * as THREE from "three"
const OrbitControls = require("three-orbit-controls")(THREE)

export default {
  name: "ThreeDworld",
  data() {
    return {
      controls: "",
    }
  },
  mounted() {
    this.initScene()
  },
  methods: {
    initScene() {
      // 创建场景
      const scene = new THREE.Scene()

      // 创建相机
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      // camera.position.z = 5
      // camera.position.set(0, 0, 15)
      //  camera.lookAt(0, 0, 0)
      camera.position.set(-15, 30, 30) // 设置相机位置
      // camera.lookAt(0, 0, 0) // 设置相机朝向
      // 锁定摄像机镜头方向
      camera.lookAt(scene.position)
      // 创建渲染器
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0xaaaaaa) // 设置背景颜色
      // renderer.setClearColor(new THREE.Color(0xeeeeee)) // 设置渲染器颜色
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap // 根据需要选择阴影质量

      document.getElementById("canvas-container").appendChild(renderer.domElement)

      // 创建一个立方体
      const geometry = new THREE.BoxGeometry(5, 5, 5)
      const material = new THREE.MeshLambertMaterial({ color: 0xffffff }) // 白色
      // const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const cube = new THREE.Mesh(geometry, material)
      // 透视
      // var vertices = cube.geometry.vertices
      // for (var i = 0; i < vertices.length; i++) {
      //   vertices[i].multiplyScalar(-1)
      // }
      // console.log(vertices)
      // 立方体开启阴影效果

      cube.castShadow = true
      // cube.castShadow = false
      // cube.receiveShadow = true
      scene.add(cube)

      const sphere = new THREE.SphereGeometry(2)
      const sp = new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({ color: 0xffffff }))
      scene.add(sp)

      // 轨道控制器

      this.controls = new OrbitControls(camera)
      this.controls.target.y = 1
      this.controls.enablePan = false
      // // 设置轨道控制器属性（可选）
      // controls.enableDamping = true // 启用阻尼，使相机运动更平滑
      // controls.dampingFactor = 0.1 // 阻尼因子
      // controls.autoRotate = true // 自动旋转相机

      // 环境光
      const ambientLight = new THREE.AmbientLight(0xa404040) // 颜色
      scene.add(ambientLight)

      // // 半球光
      // const hemisphereLight = new THREE.HemisphereLight(0x00ff00, 0xff0000, 1) // 天空颜色为绿色，地面颜色为红色，强度为 1
      // scene.add(hemisphereLight)

      // // 聚光灯
      const spotLight = new THREE.SpotLight(0x00ff00, 1, 100, Math.PI / 4, 1, 2) // 颜色为黄色，强度为 1，距离为 100，锥形角度为 45 度
      spotLight.position.set(-6, 0, 6) // 设置光源位置

      // var d = 100
      // spotLight.shadow.camera.left = -d
      // spotLight.shadow.camera.right = d
      // spotLight.shadow.camera.top = d
      // spotLight.shadow.camera.bottom = -d

      // spotLight.shadow.camera.near = 2
      // spotLight.shadow.camera.far = 50

      // spotLight.shadow.mapSize.x = 1024
      // spotLight.shadow.mapSize.y = 1024

      spotLight.castShadow = true
      scene.add(spotLight)

      // // 平行光
      // const directionalLight = new THREE.DirectionalLight(0xba55d3, 0.5) // 颜色为，强度为 0.5
      // directionalLight.position.set(6, 0, 0)
      // directionalLight.castShadow = true // 允许光源投射阴影
      // scene.add(directionalLight)

      // // 点光源
      // const pointLight = new THREE.PointLight(0xff0000, 10, 100) // 颜色为红色，强度为 1，距离为 100
      // pointLight.castShadow = true // 允许光源投射阴影
      // pointLight.shadow.mapSize.width = 1024 // 阴影贴图宽度
      // pointLight.shadow.mapSize.height = 1024 // 阴影贴图高度

      // pointLight.position.set(-40, 50, 30) // 设置光源位置
      // scene.add(pointLight)

      // const pointLight2 = new THREE.PointLight(0x00ff00, 1, 100) // 颜色为绿色，强度为 1，距离为 100
      // pointLight2.castShadow = true // 允许光源投射阴影
      // pointLight2.shadow.mapSize.width = 1024 // 阴影贴图宽度
      // pointLight2.shadow.mapSize.height = 1024 // 阴影贴图高度

      // pointLight2.position.set(10, 10, -10) // 设置光源位置
      // scene.add(pointLight2)

      // 接受阴影的平面
      const groundGeometry = new THREE.PlaneGeometry(60, 50)
      const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }) // 设置颜色
      // const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
      // 为平面材质启用阴影投射
      // groundMaterial.castShadow = true
      // groundMaterial.receiveShadow = true // 允许平面接收阴影
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.receiveShadow = true
      ground.position.set(0, -10, 0)
      ground.rotation.x = -Math.PI / 2 // 使平面水平
      scene.add(ground)

      // 创建一个动画循环
      const animate = () => {
        requestAnimationFrame(animate)

        // 使立方体旋转
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01

        // 改变立方体的颜色（示例动画）
        // const time = Date.now() * 0.001
        // cube.material.color.setRGB(Math.sin(time), Math.cos(time), Math.tan(time))

        this.controls.update() // 更新轨道控制器

        renderer.render(scene, camera)
      }

      animate()

      // 画线
      const materialLine = new THREE.LineBasicMaterial({ color: 0x0000ff })
      const points = []
      points.push(new THREE.Vector3(-10, 0, 0))
      points.push(new THREE.Vector3(0, 10, 0))
      points.push(new THREE.Vector3(10, 0, 0))
      points.push(new THREE.Vector3(-10, 0, 0))

      const geometryLine = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometryLine, materialLine)

      // scene.add(line)
      renderer.render(scene, camera)
    },
  },
}
</script>

<style>
#canvas-container {
  width: 100%;
  height: 100vh;
  position: absolute;
}
.textTest {
  /* position: absolute; */
  top: 10px;
  width: 100%;
  text-align: center;
  z-index: 100;
  display: block;
}
</style>
