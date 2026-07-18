(() => {
const gachaDrawButton = document.querySelector("[data-gacha-draw]");
const gachaStage = document.querySelector(".gacha-stage");
const gacha3dMount = document.querySelector("[data-gacha-3d]");
const gacha3dStatus = document.querySelector("[data-gacha-3d-status]");
const gachaMachine = document.querySelector(".gacha-machine");
const gachaKnob = document.querySelector(".gacha-knob");
const gachaWindow = document.querySelector("[data-gacha-window]");
const gachaResultCard = document.querySelector("[data-gacha-result]");
const gachaImage = document.querySelector("[data-gacha-image]");
const gachaName = document.querySelector("[data-gacha-name]");
const gachaMood = document.querySelector("[data-gacha-mood]");
const gachaNote = document.querySelector("[data-gacha-note]");
const gachaCategory = document.querySelector("[data-gacha-category]");
const gachaStatus = document.querySelector("[data-gacha-status]");
const gachaCopyButton = document.querySelector("[data-gacha-copy]");
const gachaCapsules = document.querySelectorAll(".gacha-capsule");
const gachaOutputCapsule = document.querySelector("[data-gacha-output-capsule]");
const characterDetails = window.MoonlitreatsCharacterDetails || {};
const renderImage = window.Moonlitreats?.renderImage;
const prefersReducedMotion = window.Moonlitreats?.prefersReducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gachaDrawMs = 1500;
let latestGachaText = "";

const createGacha3DStage = () => {
  if (!gachaStage || !gacha3dMount || !window.THREE || prefersReducedMotion) return null;

  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const machine = new THREE.Group();
  const capsules = [];
  const lightBulbs = [];
  const clock = new THREE.Clock();
  let drawStart = null;
  let drawResolve = null;
  let frameId = null;
  let isDrawing = false;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  gacha3dMount.appendChild(renderer.domElement);

  camera.position.set(0, 1.65, 10.4);
  camera.lookAt(0, 0.1, 0);

  scene.add(new THREE.HemisphereLight(0xfff8e8, 0x18233d, 2.1));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(4, 6, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xffd2e1, 1.2, 8);
  fillLight.position.set(-3, 2.4, 3);
  scene.add(fillLight);

  const makeMaterial = (color, options = {}) => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.72,
      metalness: 0.02,
      flatShading: true,
      ...options
    });
  };

  const matNavy = makeMaterial(0x172440);
  const matCream = makeMaterial(0xfffbf2);
  const matWarm = makeMaterial(0xfff2d6);
  const matRose = makeMaterial(0xf4a9bd);
  const matGold = makeMaterial(0xf6bb42);
  const matGlass = makeMaterial(0xdff6ff, {
    transparent: true,
    opacity: 0.32,
    roughness: 0.16
  });
  const matGlassShine = makeMaterial(0xffffff, {
    transparent: true,
    opacity: 0.34,
    roughness: 0.18
  });
  const matSlot = makeMaterial(0x9b6249);
  const matShadow = makeMaterial(0x2b2b35);
  const matLightOff = makeMaterial(0xfff2d6, {
    emissive: 0x2d1a10,
    emissiveIntensity: 0.12
  });
  const matLightOn = makeMaterial(0xffd36b, {
    emissive: 0xffb24a,
    emissiveIntensity: 1.5
  });

  const addMesh = (geometry, material, position, scale = [1, 1, 1], parent = machine) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const setCastShadow = (object) => {
    object.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });
  };

  const createCapsule = (position, topMaterial, bottomMaterial, radius = 0.34) => {
    const capsule = new THREE.Group();
    const top = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2),
      topMaterial
    );
    const bottom = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 8, 4, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
      bottomMaterial
    );
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 1.01, radius * 1.01, radius * 0.1, 8),
      matCream
    );
    band.rotation.x = Math.PI / 2;
    capsule.add(top, bottom, band);
    capsule.position.set(...position);
    capsule.userData.home = new THREE.Vector3(...position);
    capsule.userData.spin = 0.6 + capsules.length * 0.13;
    setCastShadow(capsule);
    machine.add(capsule);
    return capsule;
  };

  const base = addMesh(new THREE.BoxGeometry(2.8, 2.8, 1.5, 1, 1, 1), matCream, [0, -1.35, 0]);
  const bodyTop = addMesh(new THREE.BoxGeometry(3.05, 0.34, 1.68, 1, 1, 1), matWarm, [0, 0.02, 0]);
  const chamber = addMesh(new THREE.BoxGeometry(3.05, 2.35, 1.62, 1, 1, 1), matGlass, [0, 1.38, 0]);
  const sign = addMesh(new THREE.BoxGeometry(2.5, 0.34, 1.76, 1, 1, 1), matNavy, [0, 2.78, 0]);
  const tray = addMesh(new THREE.CylinderGeometry(1.15, 1.32, 0.34, 8), matWarm, [0, 0.46, 0]);
  const output = addMesh(new THREE.BoxGeometry(0.76, 0.62, 0.16, 1, 1, 1), matSlot, [-0.78, -2.12, 0.82]);
  const coin = addMesh(new THREE.BoxGeometry(0.68, 0.46, 0.18, 1, 1, 1), matNavy, [0.9, -0.7, 0.82]);
  const outputCapsule = createCapsule([-0.78, -1.55, 0.9], matRose, matWarm, 0.24);
  outputCapsule.scale.setScalar(0.01);

  addMesh(new THREE.BoxGeometry(0.08, 2.42, 0.08, 1, 1, 1), matNavy, [-1.6, 1.38, 0.85]);
  addMesh(new THREE.BoxGeometry(0.08, 2.42, 0.08, 1, 1, 1), matNavy, [1.6, 1.38, 0.85]);
  addMesh(new THREE.BoxGeometry(3.26, 0.08, 0.08, 1, 1, 1), matNavy, [0, 2.56, 0.86]);
  addMesh(new THREE.BoxGeometry(3.26, 0.08, 0.08, 1, 1, 1), matNavy, [0, 0.22, 0.86]);

  const shine = addMesh(new THREE.BoxGeometry(0.1, 2.2, 0.04, 1, 1, 1), matGlassShine, [-0.86, 1.48, 0.88]);
  shine.rotation.z = -0.32;
  addMesh(new THREE.BoxGeometry(0.06, 1.4, 0.04, 1, 1, 1), matGlassShine, [0.92, 1.72, 0.88]).rotation.z = -0.32;

  [-0.18, 0.18].forEach((x, index) => {
    const bulb = addMesh(new THREE.SphereGeometry(0.12, 8, 6), index === 0 ? matLightOn : matLightOff, [x, -0.62, 0.93]);
    lightBulbs.push(bulb);
  });

  const knob = new THREE.Group();
  const knobDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.22, 12), matCream);
  const knobHandle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.78, 0.18, 1, 1, 1), matNavy);
  knobDisk.rotation.x = Math.PI / 2;
  knobDisk.castShadow = true;
  knobHandle.position.z = 0.12;
  knobHandle.castShadow = true;
  knob.add(knobDisk, knobHandle);
  knob.position.set(0.64, -1.36, 0.9);
  machine.add(knob);

  const capsuleMats = [
    [makeMaterial(0xffd2e1), makeMaterial(0xfff2d6)],
    [makeMaterial(0xbde5ff), makeMaterial(0xfff2d6)],
    [makeMaterial(0xffe890), makeMaterial(0xffd2e1)],
    [makeMaterial(0xb8d7a5), makeMaterial(0xfff2d6)],
    [makeMaterial(0xfff2d6), makeMaterial(0xf6bb42)],
    [makeMaterial(0xf6a7ce), makeMaterial(0xbde5ff)]
  ];

  const capsulePositions = [
    [-0.95, 1.18, 0.18],
    [-0.35, 1.0, 0.26],
    [0.38, 1.3, 0.08],
    [0.95, 1.02, 0.22],
    [0.05, 1.72, -0.02],
    [-0.72, 1.72, 0.04]
  ];

  capsulePositions.forEach((position, index) => {
    const [topMaterial, bottomMaterial] = capsuleMats[index % capsuleMats.length];
    const capsule = createCapsule(position, topMaterial, bottomMaterial);
    capsules.push(capsule);
  });

  const floor = new THREE.Mesh(new THREE.CircleGeometry(2.35, 18), matShadow);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.62, 0);
  floor.scale.y = 0.38;
  floor.receiveShadow = true;
  scene.add(floor);

  machine.scale.setScalar(0.84);
  machine.rotation.y = -0.24;
  scene.add(machine);

  const easeInOut = (value) => {
    return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
  };

  const easeOutBack = (value) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
  };

  const resize = () => {
    const bounds = gacha3dMount.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const render = () => {
    const elapsed = clock.getElapsedTime();
    const themeIsDark = document.documentElement.getAttribute("color-theme") === "dark";
    const idleTilt = Math.sin(elapsed * 0.75) * 0.035;

    machine.rotation.y = -0.24 + idleTilt;
    fillLight.color.set(themeIsDark ? 0x84caff : 0xffd2e1);
    lightBulbs.forEach((bulb, index) => {
      bulb.material.emissiveIntensity = 0.35 + Math.sin(elapsed * 2.2 + index * 1.7) * 0.2;
      bulb.scale.setScalar(1 + Math.sin(elapsed * 2.2 + index) * 0.04);
    });

    capsules.forEach((capsule, index) => {
      capsule.rotation.x += 0.008 + index * 0.001;
      capsule.rotation.z += 0.006 + capsule.userData.spin * 0.001;
      if (!isDrawing) {
        capsule.position.y = capsule.userData.home.y + Math.sin(elapsed * 1.2 + index) * 0.035;
        capsule.position.x = capsule.userData.home.x + Math.cos(elapsed * 0.75 + index) * 0.012;
      }
    });

    if (isDrawing && drawStart !== null) {
      const progress = Math.min((performance.now() - drawStart) / gachaDrawMs, 1);
      const charge = Math.min(progress / 0.18, 1);
      const spinProgress = Math.min(Math.max((progress - 0.12) / 0.56, 0), 1);
      const dropProgress = Math.min(Math.max((progress - 0.66) / 0.34, 0), 1);
      const shakePower = Math.sin(easeInOut(spinProgress) * Math.PI);
      const shake = Math.sin(progress * Math.PI * 26) * shakePower * 0.13;

      machine.position.x = shake;
      machine.position.y = Math.abs(shake) * 0.32 + Math.sin(charge * Math.PI) * 0.04;
      machine.rotation.z = Math.sin(progress * Math.PI * 18) * shakePower * 0.018;
      knob.rotation.z = easeInOut(Math.min(progress / 0.74, 1)) * Math.PI * 3.25;
      if (gacha3dStatus) {
        gacha3dStatus.textContent = progress < 0.2 ? "COIN" : progress < 0.68 ? "MIX" : "DROP";
      }

      lightBulbs.forEach((bulb, index) => {
        bulb.material.emissiveIntensity = 0.8 + Math.sin(progress * Math.PI * 24 + index * Math.PI) * 0.7;
        bulb.scale.setScalar(1.06 + Math.sin(progress * Math.PI * 18 + index) * 0.08);
      });

      capsules.forEach((capsule, index) => {
        const phase = spinProgress * Math.PI * 6 + index * 1.35;
        const radius = 0.34 + (index % 3) * 0.08;
        const swirl = Math.sin(easeInOut(spinProgress) * Math.PI);
        capsule.position.x = capsule.userData.home.x * (1 - swirl * 0.18) + Math.cos(phase) * radius * swirl;
        capsule.position.y = capsule.userData.home.y + Math.sin(phase * 1.2) * 0.24 * swirl + Math.sin(progress * Math.PI) * 0.08;
        capsule.position.z = capsule.userData.home.z + Math.sin(phase) * 0.24 * swirl;
        capsule.rotation.x += 0.055 + spinProgress * 0.04;
        capsule.rotation.y += 0.04 + index * 0.004;
      });

      if (dropProgress > 0) {
        const drop = easeOutBack(dropProgress);
        const bounce = Math.sin(dropProgress * Math.PI) * 0.2;
        outputCapsule.scale.setScalar(0.95);
        outputCapsule.position.set(-0.78, -1.18 - drop * 0.98 + bounce, 1.02);
        outputCapsule.rotation.z = dropProgress * Math.PI * 2.1;
        outputCapsule.rotation.x = dropProgress * Math.PI * 0.7;
      }

      if (progress >= 1) {
        isDrawing = false;
        drawStart = null;
        machine.position.set(0, 0, 0);
        machine.rotation.z = 0;
        knob.rotation.z = 0;
        outputCapsule.scale.setScalar(0.01);
        capsules.forEach((capsule) => {
          capsule.position.copy(capsule.userData.home);
        });
        if (drawResolve) {
          drawResolve();
          drawResolve = null;
        }
      }
    }

    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(render);
  };

  gachaStage.classList.add("is-3d-ready");
  resize();
  render();
  window.addEventListener("resize", resize, { passive: true });

  return {
    draw() {
      if (isDrawing) {
        return new Promise((resolve) => window.setTimeout(resolve, gachaDrawMs));
      }

      isDrawing = true;
      drawStart = performance.now();
      outputCapsule.scale.setScalar(0.01);
      if (gacha3dStatus) {
        gacha3dStatus.textContent = "DRAW";
      }

      return new Promise((resolve) => {
        drawResolve = () => {
          if (gacha3dStatus) {
            gacha3dStatus.textContent = "OPEN";
          }
          resolve();
        };
      });
    },
    destroy() {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("resize", resize);
      renderer.dispose();
    }
  };
};

const gacha3dController = createGacha3DStage();

if (gachaDrawButton && gachaResultCard && gachaImage && gachaName && gachaMood && gachaNote) {
  const gachaEntries = Object.entries(characterDetails);
  const revealGachaResult = (characterId, detail, note) => {
    renderImage(gachaImage, detail.image, `${detail.name} 캐릭터 카드 티켓`);
    gachaName.textContent = detail.name;
    gachaMood.textContent = detail.mood;
    gachaNote.textContent = note;
    if (gachaCategory) {
      gachaCategory.textContent = detail.motif;
    }
    if (gachaStatus) {
      gachaStatus.textContent = "Remastering";
    }
    latestGachaText = `MOONLITREATS 오늘의 캐릭터 카드\n${detail.name} - ${detail.mood}\n${detail.motif}\n${note}`;
    if (gachaCopyButton) {
      gachaCopyButton.disabled = false;
      gachaCopyButton.textContent = "Copy Result";
    }
    gachaResultCard.dataset.character = characterId;
    gachaResultCard.classList.add("is-revealed");
    gachaMachine?.classList.remove("is-drawing", "is-anime-driven");
    if (gachaWindow) {
      gachaWindow.textContent = "OPEN";
    }
    gachaDrawButton.disabled = false;
  };

  const cleanupGachaMotion = () => {
    gachaMachine?.classList.remove("is-anime-driven");
    if (gachaMachine) {
      gachaMachine.style.transform = "";
    }
    if (gachaKnob) {
      gachaKnob.style.transform = "";
    }
    gachaCapsules.forEach((capsule) => {
      capsule.style.transform = "";
    });
    if (gachaOutputCapsule) {
      gachaOutputCapsule.style.opacity = "";
      gachaOutputCapsule.style.transform = "";
    }
  };

  const runNativeGachaMotion = () => {
    if (!gachaMachine?.animate) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, gachaDrawMs);
      });
    }

    gachaMachine.classList.add("is-anime-driven");

    const capsuleOffsets = [
      [-14, -14, -18],
      [16, -10, 22],
      [-12, 10, -12],
      [14, 8, 18],
      [-8, -16, 14]
    ];

    const animations = [
      gachaMachine.animate([
        { transform: "translate(0, 0)" },
        { transform: "translate(-5px, -2px)" },
        { transform: "translate(5px, 2px)" },
        { transform: "translate(-3px, 1px)" },
        { transform: "translate(3px, -1px)" },
        { transform: "translate(0, 0)" }
      ], {
        duration: 520,
        easing: "ease-in-out",
        fill: "both"
      })
    ];

    gachaCapsules.forEach((capsule, index) => {
      if (!capsule.animate) return;
      const [x, y, rotate] = capsuleOffsets[index % capsuleOffsets.length];
      animations.push(capsule.animate([
        { transform: "translate(0, 0) rotate(0deg)" },
        { transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)` },
        { transform: `translate(${-x / 2}px, ${Math.abs(y) / 2}px) rotate(${-rotate / 2}deg)` },
        { transform: "translate(0, 0) rotate(0deg)" }
      ], {
        delay: index * 34,
        duration: 760,
        easing: "cubic-bezier(0.28, 0.8, 0.22, 1)",
        fill: "both"
      }));
    });

    if (gachaKnob?.animate) {
      animations.push(gachaKnob.animate([
        { transform: "rotate(0deg) scale(1)" },
        { transform: "rotate(315deg) scale(1.06)" },
        { transform: "rotate(360deg) scale(1)" }
      ], {
        delay: 360,
        duration: 680,
        easing: "cubic-bezier(0.28, 0.8, 0.22, 1)",
        fill: "both"
      }));
    }

    if (gachaOutputCapsule?.animate) {
      animations.push(gachaOutputCapsule.animate([
        { opacity: 0, transform: "translate(-50%, -58px) scale(0.7) rotate(0deg)" },
        { opacity: 1, transform: "translate(-50%, 8px) scale(1.1) rotate(18deg)" },
        { opacity: 1, transform: "translate(-50%, 0) scale(1) rotate(0deg)" }
      ], {
        delay: 880,
        duration: 560,
        easing: "cubic-bezier(0.18, 1.35, 0.24, 1)",
        fill: "both"
      }));
    }

    return Promise.all(animations.map((animation) => animation.finished.catch(() => {}))).then(() => {
      animations.forEach((animation) => animation.cancel());
      cleanupGachaMotion();
    });
  };

  const runGachaMotion = () => {
    if (gacha3dController) {
      return gacha3dController.draw();
    }

    gachaMachine?.classList.add("is-drawing");

    if (gachaOutputCapsule) {
      gachaOutputCapsule.style.opacity = "";
      gachaOutputCapsule.style.transform = "";
    }

    if (prefersReducedMotion || !gachaMachine || !window.anime?.timeline) {
      return prefersReducedMotion ? Promise.resolve() : runNativeGachaMotion();
    }

    gachaMachine.classList.add("is-anime-driven");

    const timeline = window.anime.timeline({
      autoplay: true,
      complete: cleanupGachaMotion
    });

    timeline
      .add({
        targets: gachaMachine,
        translateX: [0, -5, 5, -4, 4, -2, 2, 0],
        translateY: [0, -2, 2, -1, 1, 0],
        duration: 520,
        easing: "easeInOutSine"
      })
      .add({
        targets: gachaCapsules,
        keyframes: [
          {
            translateX: () => window.anime.random(-18, 18),
            translateY: () => window.anime.random(-16, 10),
            rotate: () => window.anime.random(-28, 28)
          },
          {
            translateX: () => window.anime.random(-12, 12),
            translateY: () => window.anime.random(-12, 14),
            rotate: () => window.anime.random(-22, 22)
          },
          {
            translateX: 0,
            translateY: 0,
            rotate: 0
          }
        ],
        delay: window.anime.stagger(34),
        duration: 760,
        easing: "easeInOutBack"
      }, "-=360")
      .add({
        targets: ".gacha-knob",
        rotate: "1turn",
        scale: [1, 1.06, 1],
        duration: 680,
        easing: "easeInOutBack"
      }, "-=560");

    if (gachaOutputCapsule) {
      timeline.add({
        targets: gachaOutputCapsule,
        opacity: [0, 1, 1],
        translateX: "-50%",
        translateY: [-58, 8, 0],
        scale: [0.7, 1.1, 1],
        rotate: [0, 18, -8, 0],
        duration: 560,
        easing: "easeOutBounce"
      }, "-=180");
    }

    return timeline.finished || new Promise((resolve) => {
      window.setTimeout(resolve, gachaDrawMs);
    });
  };

  gachaDrawButton.addEventListener("click", () => {
    const [characterId, detail] = gachaEntries[Math.floor(Math.random() * gachaEntries.length)];
    const note = detail.lines[Math.floor(Math.random() * detail.lines.length)];

    gachaDrawButton.disabled = true;
    if (gachaCopyButton) {
      gachaCopyButton.disabled = true;
      gachaCopyButton.textContent = "Copy Result";
    }
    gachaResultCard.classList.remove("is-revealed");
    if (gachaWindow) {
      gachaWindow.textContent = "DRAW";
    }

    runGachaMotion().then(() => {
      revealGachaResult(characterId, detail, note);
    });
  });

  gachaCopyButton?.addEventListener("click", async () => {
    if (!latestGachaText) return;

    try {
      await navigator.clipboard.writeText(latestGachaText);
      gachaCopyButton.textContent = "Copied";
    } catch {
      gachaCopyButton.textContent = "Copy unavailable";
    }

    window.setTimeout(() => {
      if (!gachaCopyButton.disabled) {
        gachaCopyButton.textContent = "Copy Result";
      }
    }, 1400);
  });
}
})();
