import '../css/style.scss';
import { radian, valueToPercentage, percentageToRadians } from './utils';
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"


class Main {
  constructor() {
    this.data = [
      { value: 25, color: 0x006243 },
      { value: 10, color: 0x1a915d },
      { value: 30, color: 0x56c278 },
    ];
    this.size = {
      radius: 80,
      height: 20,
    }
    this.sectorsGroup = new THREE.Group();
    this.sectorsGroup.rotation.x += radian(-140);

    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);

    this.scene = new THREE.Scene();
    this.scene.add(this.sectorsGroup);

    this.camera = null;
    this.mesh = null;

    this.controls = null;
    this.gui = new GUI();

    this._init();
    this._update();
    this._addEvent();
  }

  _setCamera() {
    const fov = 45;
    const fovRadian = (fov / 2) * (Math.PI / 180); //視野角をラジアンに変換
    const distance = (this.viewport.height / 2) / Math.tan(fovRadian); //ウインドウぴったりのカメラ距離
    this.camera = new THREE.PerspectiveCamera(fov, this.viewport.width / this.viewport.height, 1, distance * 2);
    this.camera.position.z = distance;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  _setGui() {
    const chartGuiObj = {
      createChart: ()=> {
        this._deleteMesh();
        this._addMesh();
      }
    }
    this.gui.add(this.data[0], 'value').min(0).max(100).name('value 1').onChange(this._updateMesh);
    this.gui.add(this.data[1], 'value').min(0).max(100).name('value 2').onChange(this._updateMesh);
    this.gui.add(this.data[2], 'value').min(0).max(100).name('value 3').onChange(this._updateMesh);

    this.gui.add(chartGuiObj, 'createChart').name('グラフを生成').listen()
  }

  _setControlls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  _setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(1, 10, 1);
    this.scene.add(light);
  }

  _addMesh() {
    const totalValue = 100;

    // 円グラフを作成
    let startAngle = 0;
    // let startAngle = percentageToRadians(25);

    for (let i = 0; i < this.data.length; i++) {
      const { value, color } = this.data[i];

      // データの値をパーセンテージに変換
      const percentage = valueToPercentage(value, totalValue);

      // パーセンテージをラジアンに変換
      const angleRadians = percentageToRadians(percentage);

      // セクターを作成
      const material = new THREE.MeshToonMaterial({ color: color, side: THREE.DoubleSide });
      // const sectorGeometry = new THREE.CircleGeometry(50, 32, startAngle, angleRadians);
      const sectorGeometry = new THREE.CylinderGeometry(this.size.radius, this.size.radius, this.size.height, 32, 32, false, startAngle, angleRadians);
      // const sectorGeometry = new THREE.CylinderGeometry(this.size.radius, this.size.radius, this.size.height, 32, 32, true, startAngle, angleRadians);
      const sectorMesh = new THREE.Mesh(sectorGeometry, material);

      // 側面用メッシュを作成
      const sideGeometory = new THREE.PlaneGeometry(this.size.radius, this.size.height);
      const sideMesh = new THREE.Mesh(sideGeometory, material);

      if(i === 0) {
        let rad = angleRadians - radian(90);
        sideMesh.rotation.y = angleRadians - radian(90);

        let x = this.size.radius * 0.5 * Math.cos(rad);
        let z = this.size.radius * 0.5 * Math.sin(rad);

        sideMesh.position.x += x;
        sideMesh.position.z -= z;

      } else {
        let rad = startAngle + angleRadians - radian(90);

        sideMesh.rotation.y = startAngle + angleRadians - radian(90);

        let x = this.size.radius * 0.5 * Math.cos(rad);
        let z = this.size.radius * 0.5 * Math.sin(rad);

        sideMesh.position.x += x;
        sideMesh.position.z -= z;
      }


      // sectorMesh.rotation.x += radian(-140); //反転させるために回転

      

      // セクターをシーンに追加
      this.sectorsGroup.add(sectorMesh);

      // 側面を追加
      this.sectorsGroup.add(sideMesh);

      startAngle += angleRadians; // 開始角度を更新

      this._scaleMesh();
    }
  }

  _deleteMesh() {
    this.sectorsGroup.remove(...this.sectorsGroup.children);
  }

  _scaleMesh() {
    // for (let i = 0; i < this.data.length; i++) {
    //   const { value, color } = this.data[i];
    // }
  }

  _init() {
    this._setCamera();
    this._setGui();
    this._setControlls();
    this._setLight();
    this._addMesh();
  }

  _update() {
    // this.mesh.rotation.y += 0.01;
    // this.mesh.rotation.x += 0.01;

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    requestAnimationFrame(this._update.bind(this));
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }
}

new Main();



