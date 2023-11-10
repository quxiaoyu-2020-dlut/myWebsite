<template>
  <div>
    <div id="container"></div>
    <!-- <div>dasfasda</div> -->
  </div>
</template>

<!-- <script src="../../builds/ammo.js"></script> -->

<script>
import * as THREE from "three"
// import { Ammo } from "../builds/ammo"
import Ammo from "../builds/ammo"
const OrbitControls = require("three-orbit-controls")(THREE)
// import OrbitControls from "three-orbit-controls"

export default {
  name: "physicWorld",
  // components: { Ammo },
  mounted() {
    Ammo().then(Ammo => {
      console.log(Ammo)

      this.ammo = Ammo
      console.log(this.ammo, "111")
      this.initGraphics()
      this.initPhysic(Ammo)
      this.createObject(Ammo)
      this.inputEvent()
      this.animate()
    })
    // console.log(Ammo)
  },
  data() {
    return {
      ammo: null,
      // Graphic
      container: "",
      scene: "",
      camera: "",
      renderer: "",
      light: "",
      textureLoader: "",
      clock: new THREE.Clock(),
      time: 0,
      control: "",
      // Physics
      physicsWorld: "",
      margin: 0.01,
      rigidBodies: [],

      // input
      keysActions: {
        KeyW: "w",
        KeyS: "s",
        KeyA: "a",
        KeyD: "d",
      },
      actions: {},

      // ball
      ball: "",
      ballVelocity: "",
    }
  },
  methods: {
    initGraphics() {
      // container
      this.container = document.getElementById("container")
      // console.log(this.container)
      // scene
      this.scene = new THREE.Scene()
      // camera
      this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 2000)
      this.camera.position.set(-10, 10, 20)
      // renderer
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.shadowMap.enabled = true
      this.renderer.setPixelRatio(window.devicePixelRatio)
      // light
      this.light = new THREE.DirectionalLight(0xffffff, 1)
      this.light.position.set(10, 10, 10)
      this.light.castShadow = true
      var d = 10
      this.light.shadow.camera.left = -d
      this.light.shadow.camera.right = d
      this.light.shadow.camera.top = d
      this.light.shadow.camera.bottom = -d
      this.light.shadow.camera.near = 2
      this.light.shadow.camera.far = 50
      this.light.shadow.mapSize.x = 1024
      this.light.shadow.mapSize.y = 1024
      this.scene.add(this.light)
      // textureLoader
      this.textureLoader = new THREE.TextureLoader()

      //control
      this.controls = new OrbitControls(this.camera)
      this.controls.target.y = 2

      this.container.appendChild(this.renderer.domElement)
    },
    initPhysic(Ammo) {
      console.log(Ammo)
      // 碰撞参数
      //btSoftBodyRigidBodyCollisionConfiguration
      let collisionConfig = new Ammo.btSoftBodyRigidBodyCollisionConfiguration()
      // 碰撞分发器
      let dispatch = new Ammo.btCollisionDispatcher(collisionConfig)
      // 广义相位
      let broadphase = new Ammo.btDbvtBroadphase()
      // 约束求解器
      let solver = new Ammo.btSequentialImpulseConstraintSolver()
      // 软体解析器
      let softBodySolver = new Ammo.btDefaultSoftBodySolver()
      // 物理世界
      this.physicsWorld = new Ammo.btSoftRigidDynamicsWorld(
        dispatch,
        broadphase,
        solver,
        collisionConfig,
        softBodySolver
      )
    },
    createObject(Ammo) {
      // ground
      let pos = new THREE.Vector3()
      let quat = new THREE.Quaternion()

      pos.set(0, -0.5, 0)
      quat.set(0, 0, 0, 1)
      let ground = this.createBox(Ammo, 100, 1, 100, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0xffffff }))
      // this.scene.add(ground)
      console.log(this.textureLoader)
      this.textureLoader.load(require("../textures/grid.png"), texture => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(40, 40)
        ground.material.map = texture
        ground.material.needsUpdate = true
      })

      // obstacle
      let brickMass = 0.6
      let brickLength = 1.2
      let brickDepth = 0.6
      let brickHeight = brickLength * 0.5
      let numBrickLength = 10
      let numBrickHeight = 12
      let z0 = -numBrickLength * brickLength * 2.5
      pos.set(0, brickHeight * 0.5, z0)
      quat.set(0, 0, 0, 1)
      for (let i = 0; i < numBrickHeight; i++) {
        // 奇数行
        let oddRow = i % 2 == 1
        pos.z = z0

        if (oddRow) {
          pos.z -= 0.25 * brickLength
        }

        let nRow = oddRow ? numBrickLength + 1 : numBrickLength
        for (let j = 0; j < nRow; j++) {
          let brickLengthCur = brickLength
          let brickMassCur = brickMass
          if (oddRow && (j == 0 || j == nRow - 1)) {
            brickLengthCur *= 0.5
            brickMassCur *= 0.5
          }

          let brick = this.createBox(
            Ammo,
            brickDepth,
            brickHeight,
            brickLengthCur,
            brickMassCur,
            pos,
            quat,
            this.createMaterial()
          )
          if (oddRow && (j == 0 || j == nRow - 2)) {
            pos.z += 0.75 * brickLength
          } else {
            pos.z += brickLength
          }
        }
        pos.y += brickHeight
      }

      // ball
      pos.set(0, 1, 0)
      quat.set(0, 0, 0, 1)
      let ballRadius = 1
      this.ball = new THREE.Mesh(
        new THREE.SphereGeometry(ballRadius, 10, 10),
        new THREE.MeshPhongMaterial({ color: 0x00ffff })
      )
      this.ball.position.set(pos.x, pos.y, pos.z)
      this.ball.castShadow = true
      this.ball.receiveShadow = true
      this.scene.add(this.ball)
      let ballShape = new Ammo.btSphereShape(ballRadius)
      ballShape.setMargin(this.margin)
      this.createRigidBody(Ammo, this.ball, ballShape, 5, pos, quat)
    },
    createBox(Ammo, x, y, z, mass, pos, quat, material) {
      // 3D Obj
      let threeObj = new THREE.Mesh(new THREE.BoxGeometry(x, y, z, 2, 2, 2), material)
      threeObj.position.copy(pos)
      threeObj.quaternion.copy(quat)
      threeObj.castShadow = true
      threeObj.receiveShadow = true
      this.scene.add(threeObj)

      // shape
      let shape = new Ammo.btBoxShape(new Ammo.btVector3(0.5 * x, 0.5 * y, 0.5 * z))
      shape.setMargin(this.margin)

      // rigidBody
      this.createRigidBody(Ammo, threeObj, shape, mass, pos, quat)

      return threeObj
    },
    createRigidBody(Ammo, threeObj, shape, mass, pos, quat) {
      console.log(Ammo, pos, quat)
      let transform = new Ammo.btTransform()
      transform.setIdentity()
      // 这样写有问题
      // let tempbtVector = new Ammo.btVector3().setValue(pos.x, pos.y, pos.z)
      // let tempbtQuat = new Ammo.btQuaternion().setValue(quat.x, quat.y, quat.z, quat.w)
      let tempbtVector = new Ammo.btVector3(pos.x, pos.y, pos.z)
      let tempbtQuat = new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)

      console.log("tempbtVector", tempbtVector)
      transform.setOrigin(tempbtVector)
      transform.setRotation(tempbtQuat)
      let motionState = new Ammo.btDefaultMotionState(transform)

      let localInertia = new Ammo.btVector3(0, 0, 0)
      shape.calculateLocalInertia(mass, localInertia)

      let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia)
      let body = new Ammo.btRigidBody(rbInfo)
      // 设置刚体的初始速度为零
      body.setLinearVelocity(new Ammo.btVector3(0, 0, 0))
      body.setDamping(0.1, 0.1) // 设置线性阻尼和角阻尼为零
      body.setFriction(0.5) // 设置摩擦力为零

      threeObj.userData.physicsBody = body
      if (mass > 0) {
        this.rigidBodies.push(threeObj)

        // Disable deactivation
        body.setActivationState(4)
      }
      this.physicsWorld.addRigidBody(body)
    },
    createMaterial() {
      return new THREE.MeshPhongMaterial({ color: this.createRandomColor() })
    },
    createRandomColor() {
      return Math.floor(Math.random() * (1 << 24))
    },
    inputEvent() {
      this.ballVelocity = new THREE.Vector3(0, 0, 0)
      const ballSpeed = 1 // 调整速度以适应你的需求

      window.addEventListener(
        "keydown",
        e => {
          console.log(e)
          if (this.keysActions[e.code]) {
            switch (this.keysActions[e.code]) {
              case "w":
                this.ballVelocity.z -= ballSpeed
                break
              case "s":
                this.ballVelocity.z += ballSpeed
                break
              case "a":
                this.ballVelocity.x -= ballSpeed
                break
              case "d":
                this.ballVelocity.x += ballSpeed
                break
            }

            return false
          }
        },
        { passive: false }
      )
      window.addEventListener(
        "keyup",
        e => {
          console.log(e)
          if (this.keysActions[e.code]) {
            switch (this.keysActions[e.code]) {
              case "w":
              case "s":
                this.ballVelocity.z = 0
                break
              case "a":
              case "d":
                this.ballVelocity.x = 0
                break
            }

            return false
          }
        },
        { passive: false }
      )
    },
    updatePhysics(deltaTime) {
      // 更新小球位置
      // this.ball.position.x += this.ballVelocity.x
      // this.ball.position.z += this.ballVelocity.z
      // console.log(deltaTime)
      // 获取物理世界的时间步长
      // const deltaTime1 = 1 / 60 // 假设物理引擎以每秒 60 帧的速度运行

      // 更新物理世界的时间步
      this.physicsWorld.stepSimulation(deltaTime, 2) // 2 表示两次迭代
      let transformAux12 = new this.ammo.btTransform()
      // 遍历所有刚体
      for (let i = 0, il = this.rigidBodies.length; i < il; i++) {
        // console.log(this.rigidBodies)
        let objThree = this.rigidBodies[i]
        // threeObj.userData.physicsBody = body

        let objPhys = objThree.userData.physicsBody
        // if(objThree)
        // 检查物体是否是小球，然后设置速度
        if (objThree === this.ball) {
          objPhys.setLinearVelocity(new this.ammo.btVector3(this.ballVelocity.x, 0, this.ballVelocity.z))
        }
        // objPhys.setLinearVelocity(new this.ammo.btVector3(this.ballVelocity.x, 0, this.ballVelocity.z))

        let ms = objPhys.getMotionState()
        // console.log(ms)
        if (ms) {
          ms.getWorldTransform(transformAux12)
          let p = transformAux12.getOrigin()
          let q = transformAux12.getRotation()
          objThree.position.set(p.x(), p.y(), p.z())
          objThree.quaternion.set(q.x(), q.y(), q.z(), q.w())
        }
      }
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.render()
      // console.log(Ammo)
    },
    render() {
      let deltaTime = this.clock.getDelta()

      // console.log("物理引擎更新前的位置:", this.ball.position.x, this.ball.position.y, this.ball.position.z)

      this.updatePhysics(deltaTime)
      this.renderer.render(this.scene, this.camera)
      this.controls.update(deltaTime)

      this.time += deltaTime
    },
  },
}
</script>

<style></style>
