/* ============================================================
   SCMS — THREE.JS ANIMATED BACKGROUND (three-bg.js)
   Floating 3D geometric objects + particle field
   ============================================================ */

function initThreeBackground() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 14);

  /* ─── Materials ─── */
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const getColor = () => isDark() ? 0xffffff : 0x0a0a0a;

  const wireMat = () => new THREE.MeshBasicMaterial({
    color: getColor(), wireframe: true, transparent: true, opacity: isDark() ? 0.25 : 0.12
  });

  /* ─── Floating Meshes ─── */
  const meshes = [];
  const geos = [
    new THREE.IcosahedronGeometry(1.4, 1),
    new THREE.OctahedronGeometry(1.2, 0),
    new THREE.TorusGeometry(1.0, 0.3, 8, 16),
    new THREE.TetrahedronGeometry(1.3, 0),
    new THREE.IcosahedronGeometry(0.8, 0),
    new THREE.BoxGeometry(1.6, 1.6, 1.6),
    new THREE.OctahedronGeometry(0.9, 0),
  ];

  const positions = [
    [-5, 2, -4], [5, -2, -6], [-3, -3, -2], [4, 3, -8],
    [-7, 0, -5], [6, 1, -3],  [0, 4, -7],
  ];

  geos.forEach((geo, i) => {
    const mesh = new THREE.Mesh(geo, wireMat());
    const [x, y, z] = positions[i] || [0, 0, -5];
    mesh.position.set(x, y, z);
    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.008,
      ry: (Math.random() - 0.5) * 0.012,
      floatAmp: 0.3 + Math.random() * 0.4,
      floatSpeed: 0.4 + Math.random() * 0.6,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: y,
    };
    scene.add(mesh);
    meshes.push(mesh);
  });

  /* ─── Particles ─── */
  const particleCount = 400;
  const pGeo = new THREE.BufferGeometry();
  const positions3 = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions3[i * 3]     = (Math.random() - 0.5) * 40;
    positions3[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions3[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions3, 3));
  const pMat = new THREE.PointsMaterial({
    color: getColor(), size: 0.06,
    transparent: true, opacity: isDark() ? 0.6 : 0.35
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ─── Mouse Parallax ─── */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ─── Animate ─── */
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    meshes.forEach(m => {
      m.rotation.x += m.userData.rx;
      m.rotation.y += m.userData.ry;
      m.position.y  = m.userData.baseY + Math.sin(t * m.userData.floatSpeed + m.userData.floatOffset) * m.userData.floatAmp;
      // Update material color on theme change
      m.material.color.set(getColor());
      m.material.opacity = isDark() ? 0.25 : 0.12;
    });

    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    pMat.color.set(getColor());
    pMat.opacity = isDark() ? 0.6 : 0.35;

    renderer.render(scene, camera);
  }
  animate();

  /* ─── Resize ─── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

document.addEventListener('DOMContentLoaded', initThreeBackground);
