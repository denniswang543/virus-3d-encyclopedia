import re

filepath = r'd:\__AI\SLF\virus-3d\js\virusModels.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update HSV spike color to purple
js = js.replace('const spikeMat = this.createBiomaterial(0x2d3436, 0.5, 0.1);', 
                'const spikeMat = this.createBiomaterial(0x9b59b6, 0.5, 0.1); // Purple spikes for HSV')

# 2. Upgrade HPV model
new_hpv = """  buildHPV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    // Base blue sphere
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6) : new THREE.IcosahedronGeometry(radius, 4);
    
    // Perturb vertices to create a bumpy/golf-ball-like base for capsomeres
    if (!isHologram && !isCutaway && geo.attributes.position) {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // high frequency noise
        const noise = Math.sin(v.x*10)*Math.sin(v.y*10)*Math.sin(v.z*10);
        v.addScaledVector(v.clone().normalize(), noise*0.05);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
    }

    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x0984e3, wireframe: true })
                           : new THREE.MeshStandardMaterial({ color: 0x0984e3, roughness: 0.6, bumpScale: 0.1 });
    const cap = new THREE.Mesh(geo, mat);
    group.add(cap);

    // Add yellow star-shaped capsomeres (L1 pentamers)
    if (!isHologram) {
      // Star geometry
      const starShape = new THREE.Shape();
      const outerR = 0.35;
      const innerR = 0.15;
      const points = 5;
      for (let i = 0; i < points * 2; i++) {
        const r = (i % 2 === 0) ? outerR : innerR;
        const a = (i / (points * 2)) * Math.PI * 2;
        if (i === 0) starShape.moveTo(Math.cos(a)*r, Math.sin(a)*r);
        else starShape.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      
      const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
      const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
      
      // Center geometry
      starGeo.computeBoundingBox();
      const centerOffset = -0.5 * (starGeo.boundingBox.max.z - starGeo.boundingBox.min.z);
      starGeo.translate(0, 0, centerOffset);
      
      const starMat = new THREE.MeshStandardMaterial({ color: 0xfeca57, roughness: 0.5 });
      
      // Distribute stars on vertices of a simpler icosahedron
      const distIco = new THREE.IcosahedronGeometry(radius, 1);
      const pos = distIco.attributes.position;
      const added = [];
      for(let i=0; i<pos.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i);
        // check duplicate
        if (!added.find(a => a.distanceTo(v) < 0.1)) {
          added.push(v);
          if (isCutaway && v.y < -0.1) continue;
          
          const star = new THREE.Mesh(starGeo, starMat);
          star.position.copy(v).normalize().multiplyScalar(radius + 0.05);
          star.lookAt(new THREE.Vector3(0,0,0));
          group.add(star);
        }
      }
    }

    if (isCutaway && !isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 64, 8, 2, 3);
      const dnaMat = new THREE.MeshStandardMaterial({ color: 0xff7675, roughness: 0.4 });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    
    return group;
  },"""

js = re.sub(r'buildHPV\(mode = "surface"\) \{.*?(?=buildMeasles|case)', new_hpv + "\n\n  ", js, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated HPV and HSV")
