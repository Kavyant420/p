/* ================================================================
   LIQUID CORE — 3D scene: refracted glass blobs + liquid metal orb
   Runs behind the whole site. Graceful fallback if WebGL absent.
   ================================================================ */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const canvas = document.getElementById('scene');
if (canvas) boot().catch(() => { document.body.classList.add('no-webgl'); });

async function boot() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050506);
  scene.fog = new THREE.Fog(0x050506, 8, 26);

  const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0.4, 9);

  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  // let page scroll pass through — only rotate on drag
  canvas.style.pointerEvents = 'auto';

  /* ---- procedural monochrome studio HDR environment ---- */
  const envScene = new THREE.Scene();
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({ color: 0x0a0a0c, side: THREE.BackSide })
  );
  room.geometry = new THREE.BoxGeometry(20, 12, 20).toNonIndexed();
  envScene.add(room);
  const stripMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let i = 0; i < 7; i++) {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(14, 0.7), stripMat.clone());
    s.material.color.setScalar(i % 2 ? 0.9 : 0.25);
    s.position.set(0, -4 + i * 1.6, -9.4);
    envScene.add(s);
  }
  const bigSoft = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  bigSoft.position.set(8, 2, 2); bigSoft.rotation.y = -Math.PI / 2;
  envScene.add(bigSoft);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;

  /* ---- hero: liquid chrome sphere (MeshPhysicalMaterial) ---- */
  const chrome = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.55, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0xdddddd, metalness: 1, roughness: 0.06,
      envMapIntensity: 1.35, clearcoat: 1, clearcoatRoughness: 0.12
    })
  );
  chrome.name = 'chrome';
  scene.add(chrome);

  /* vertex displacement via onBeforeCompile — "liquid" wobble */
  const uniformsRef = { uTime: { value: 0 }, uAmp: { value: 0.16 } };
  chrome.material.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uniformsRef.uTime;
    sh.uniforms.uAmp = uniformsRef.uAmp;
    sh.vertexShader = `
      uniform float uTime; uniform float uAmp;
      vec3 lcPos(vec3 p){
        float t = uTime * 0.7;
        float w = sin(p.x*2.3+t)*cos(p.y*2.1-t*1.2)+sin(p.z*2.7+t*0.8);
        return p + normal * w * uAmp;
      }
    ` + sh.vertexShader
      .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = lcPos(normalize(position));')
      .replace('#include <begin_vertex>', 'vec3 transformed = lcPos(position);');
  };

  /* ---- glass shards drifting across the site ---- */
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.05, transmission: 1,
    thickness: 1.6, ior: 1.5, specularIntensity: 1, iridescence: 0.35,
    iridescenceIOR: 1.3, transparent: true, envMapIntensity: 1.2
  });
  const shards = [];
  const geos = [
    new THREE.TorusKnotGeometry(0.55, 0.16, 120, 16),
    new THREE.TorusGeometry(0.7, 0.22, 18, 60),
    new THREE.IcosahedronGeometry(0.7, 1),
    new THREE.SphereGeometry(0.6, 40, 40),
    new THREE.CapsuleGeometry(0.35, 0.9, 8, 24)
  ];
  const spots = [
    [-4.6, 2.2, -2], [4.8, -1.6, -3], [-5.4, -2.6, -1], [5.2, 2.8, -4], [0.2, 3.4, -6], [-1.5, -3.6, -5]
  ];
  spots.forEach((p, i) => {
    const m = new THREE.Mesh(geos[i % geos.length], glassMat);
    m.position.set(...p);
    m.userData.spin = new THREE.Vector3(
      (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.2
    );
    m.userData.floatSeed = Math.random() * 10;
    scene.add(m); shards.push(m);
  });

  /* faint key light so metal reads even without env */
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 6); scene.add(key);
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));

  /* ---- post: vignette + grain + slight chromatic edge ---- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const fxPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
      uTime: { value: 0 }
    },
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `
      varying vec2 vUv; uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes;
      float rand(vec2 c){return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);}
      void main(){
        vec2 uv=vUv;
        vec2 d=uv-0.5; float r=length(d);
        // subtle radial distortion like thick glass
        uv = 0.5 + d*(1.0+0.045*r*r);
        // monochrome luminance mapping
        vec4 c=texture2D(tDiffuse,uv);
        float lum=dot(c.rgb,vec3(0.299,0.587,0.114));
        vec3 mono=vec3(lum);
        // keep a whisper of contrast curve
        mono=pow(mono,vec3(1.06));
        float vig=smoothstep(0.92,0.28,r);
        float grain=(rand(uv*uRes+fract(uTime)*97.0)-0.5)*0.05;
        gl_FragColor=vec4(mono*vig+grain,1.0);
      }`
  });
  composer.addPass(fxPass);

  /* ---- interaction ---- */
  let mouseX = 0, mouseY = 0, targetAmp = 0.16;
  addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / innerWidth) * 2 - 1;
    mouseY = (e.clientY / innerHeight) * 2 - 1;
  });

  // pulse the orb when engine boots / messages arrive
  addEventListener('lc-pulse', () => {
    uniformsRef.uAmp.value = 0.55;
    chrome.scale.setScalar(1.12);
  });

  const clock = new THREE.Clock();
  const targetScale = new THREE.Vector3(1, 1, 1);
  let scrollY = 0;
  addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    uniformsRef.uTime.value = t;
    fxPass.uniforms.uTime.value = t;

    // ease amplitude + scale back
    uniformsRef.uAmp.value += (targetAmp - uniformsRef.uAmp.value) * 0.03;
    chrome.scale.lerp(targetScale, 0.06);
    chrome.rotation.y = t * 0.16 + mouseX * 0.4;
    chrome.rotation.x = Math.sin(t * 0.2) * 0.12 + mouseY * 0.25;
    chrome.position.y = Math.sin(t * 0.6) * 0.14 - scrollY * 0.0009;

    shards.forEach((m) => {
      m.rotation.x += m.userData.spin.x * 0.01;
      m.rotation.y += m.userData.spin.y * 0.01;
      m.position.y += Math.sin(t * 0.5 + m.userData.floatSeed) * 0.0016;
    });

    controls.update();
    composer.render();
  });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    fxPass.uniforms.uRes.value.set(innerWidth, innerHeight);
  });

  document.body.classList.add('webgl-live');
}
