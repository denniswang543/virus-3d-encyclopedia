const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', '__AI', 'SLF', 'virus-3d', 'js', 'virusModels.js');
let code = fs.readFileSync(filePath, 'utf8');

const newMethods = `
  buildMimivirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    const radius = 3.5;
    
    // Icosahedron with cutaway capability
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI*2, 0, Math.PI*0.6) : new THREE.IcosahedronGeometry(radius, 2);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x686de0, wireframe: true }) : this.createBiomaterial(0x4834d4, 0.7, 0.2);
    group.add(new THREE.Mesh(geo, mat));

    // Stargate
    if (!isHologram && !isCutaway) {
      const starGeo = new THREE.CylinderGeometry(0, 0.8, 0.2, 5);
      const starMat = this.createBiomaterial(0xeb4d4b, 0.5, 0.1);
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(0, radius - 0.1, 0);
      group.add(star);
    }

    // Hair fibers
    if (!isHologram) {
      const hairGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 4);
      const hairMat = this.createBiomaterial(0x7ed6df, 0.5, 0.1);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i += 4) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        if (isCutaway && v.y < -0.2 * radius) continue;
        v.normalize();
        if (v.y > 0.9) continue; // Leave stargate clear
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.copy(v).multiplyScalar(radius + 0.4);
        hair.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v);
        group.add(hair);
      }
    }
    
    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.IcosahedronGeometry(2, 1);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xffda79, wireframe: true });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    return group;
  },

  buildPithovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    // Amphora shape (Capsule-like)
    const geo = isCutaway ? new THREE.CylinderGeometry(2, 2, 6, 32, 1, false, 0, Math.PI) : new THREE.CapsuleGeometry(2, 4, 16, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf0932b, wireframe: true }) : this.createBiomaterial(0xffbe76, 0.8, 0.1);
    group.add(new THREE.Mesh(geo, mat));

    // Cork
    if (!isHologram) {
      const corkGeo = new THREE.TorusGeometry(1.5, 0.3, 8, 32);
      const corkMat = this.createBiomaterial(0xeb4d4b, 0.5, 0.1);
      const cork = new THREE.Mesh(corkGeo, corkMat);
      cork.position.set(0, 3.8, 0);
      cork.rotation.x = Math.PI / 2;
      group.add(cork);
      
      const gridGeo = new THREE.PlaneGeometry(2.8, 2.8, 8, 8);
      const gridMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b, wireframe: true });
      const grid = new THREE.Mesh(gridGeo, gridMat);
      grid.position.set(0, 3.8, 0);
      grid.rotation.x = Math.PI / 2;
      group.add(grid);
    }
    
    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 64, 8);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0x4cd137, wireframe: true });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    return group;
  },

  buildTupanvirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Head
    const radius = 2;
    const headGeo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI, 0, Math.PI) : new THREE.IcosahedronGeometry(radius, 2);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xeb4d4b, wireframe: true }) : this.createBiomaterial(0xff7979, 0.7, 0.1);
    const head = new THREE.Mesh(headGeo, mat);
    head.position.y = 3;
    group.add(head);

    // Giant Tail
    const tailGeo = isCutaway ? new THREE.CylinderGeometry(1.2, 1.2, 6, 32, 8, false, 0, Math.PI) : new THREE.CylinderGeometry(1.2, 1.2, 6, 32, 8);
    const tailMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf0932b, wireframe: true }) : this.createBiomaterial(0xffbe76, 0.6, 0.2);
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.y = -1;
    group.add(tail);

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.IcosahedronGeometry(1.2, 1);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0x686de0, wireframe: true });
      const dna = new THREE.Mesh(dnaGeo, dnaMat);
      dna.position.y = 3;
      group.add(dna);
    }
    return group;
  },

  buildATV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    // Spindle / Lemon shape
    const points = [];
    for ( let i = 0; i <= 20; i ++ ) {
      const y = (i / 20) * 4 - 2;
      const x = 1.5 * (1 - (y*y)/4);
      points.push( new THREE.Vector2( x, y ) );
    }
    const geo = isCutaway ? new THREE.LatheGeometry(points, 32, 0, Math.PI) : new THREE.LatheGeometry(points, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf9ca24, wireframe: true }) : this.createBiomaterial(0xf6e58d, 0.7, 0.2);
    const lemon = new THREE.Mesh(geo, mat);
    lemon.rotation.z = Math.PI / 4;
    group.add(lemon);

    // Two tails
    if (!isCutaway) {
      const tailGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
      const tailMat = this.createBiomaterial(0xf9ca24, 0.5, 0.1);
      const tail1 = new THREE.Mesh(tailGeo, tailMat);
      tail1.position.set(2, 2, 0);
      tail1.rotation.z = -Math.PI / 4;
      group.add(tail1);
      
      const tail2 = new THREE.Mesh(tailGeo, tailMat);
      tail2.position.set(-2, -2, 0);
      tail2.rotation.z = -Math.PI / 4;
      group.add(tail2);
    }
    
    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(0.8, 0.1, 64, 8);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0x4834d4, wireframe: true });
      const dna = new THREE.Mesh(dnaGeo, dnaMat);
      dna.rotation.z = Math.PI / 4;
      group.add(dna);
    }
    return group;
  },

  buildGeminivirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const geo = isCutaway ? new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI, 0, Math.PI) : new THREE.IcosahedronGeometry(1.5, 2);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x6ab04c, wireframe: true }) : this.createBiomaterial(0xbadc58, 0.6, 0.2);
    
    const cap1 = new THREE.Mesh(geo, mat);
    cap1.position.y = 1.2;
    group.add(cap1);
    
    const cap2 = new THREE.Mesh(geo, mat);
    cap2.position.y = -1.2;
    group.add(cap2);

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b });
      const dna1 = new THREE.Mesh(dnaGeo, dnaMat);
      dna1.position.y = 1.2;
      group.add(dna1);
      const dna2 = new THREE.Mesh(dnaGeo, dnaMat);
      dna2.position.y = -1.2;
      group.add(dna2);
    }
    return group;
  },

  buildTMV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    const geo = isCutaway ? new THREE.CylinderGeometry(1.5, 1.5, 6, 32, 1, false, 0, Math.PI) : new THREE.CylinderGeometry(1.5, 1.5, 6, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xbadc58, wireframe: true }) : this.createBiomaterial(0x6ab04c, 0.7, 0.2);
    group.add(new THREE.Mesh(geo, mat));

    // Spiral structure visual
    if (!isHologram && !isCutaway) {
      const spiralGeo = new THREE.TorusGeometry(1.55, 0.1, 8, 32, Math.PI*2);
      const spiralMat = this.createBiomaterial(0xeb4d4b, 0.4, 0.1);
      for(let i=0; i<15; i++) {
        const t = new THREE.Mesh(spiralGeo, spiralMat);
        t.position.y = -2.8 + i*0.4;
        group.add(t);
      }
    }

    if (isCutaway || isHologram) {
      const rnaGeo = new THREE.CylinderGeometry(0.5, 0.5, 5.8, 16);
      const rnaMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b, wireframe: true });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },

  buildM13(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const curvePoints = [];
    for(let i=0; i<=20; i++) {
      curvePoints.push(new THREE.Vector3(Math.sin(i*0.5)*2, (i-10)*0.5, Math.cos(i*0.3)*2));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    
    const geo = new THREE.TubeGeometry(curve, 100, 0.3, 16, false);
    if (isCutaway) this.clipGeometry(geo);
    
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xc7ecee, wireframe: true }) : this.createBiomaterial(0x7ed6df, 0.5, 0.1);
    group.add(new THREE.Mesh(geo, mat));

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    return group;
  },

  buildACV(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const curvePoints = [];
    for(let i=0; i<=100; i++) {
      const t = i / 100;
      const angle = t * Math.PI * 10; // 5 coils
      curvePoints.push(new THREE.Vector3(Math.cos(angle)*1.5, t*6 - 3, Math.sin(angle)*1.5));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    
    const geo = new THREE.TubeGeometry(curve, 200, 0.4, 16, false);
    if (isCutaway) this.clipGeometry(geo);
    
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xffbe76, wireframe: true }) : this.createBiomaterial(0xf0932b, 0.7, 0.3);
    group.add(new THREE.Mesh(geo, mat));
    
    return group;
  },

  buildGuttavirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Teardrop shape using LatheGeometry
    const points = [];
    for ( let i = 0; i <= 20; i ++ ) {
      const y = (i / 20) * 4 - 2;
      // Formula for droplet
      const x = 2 * (1 - y/2) * Math.sqrt((y+2)/4);
      points.push( new THREE.Vector2( x, y ) );
    }
    const geo = isCutaway ? new THREE.LatheGeometry(points, 32, 0, Math.PI) : new THREE.LatheGeometry(points, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x7ed6df, wireframe: true }) : this.createBiomaterial(0x22a6b3, 0.7, 0.1);
    group.add(new THREE.Mesh(geo, mat));

    // Beard
    if (!isCutaway) {
      const beardGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 4);
      const beardMat = this.createBiomaterial(0xc7ecee, 0.5, 0.1);
      for(let i=0; i<15; i++) {
        const b = new THREE.Mesh(beardGeo, beardMat);
        b.position.set((Math.random()-0.5)*0.5, 2.5, (Math.random()-0.5)*0.5);
        b.rotation.x = (Math.random()-0.5)*0.5;
        b.rotation.z = (Math.random()-0.5)*0.5;
        group.add(b);
      }
    }

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(0.8, 0.2, 64, 8);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xeb4d4b, wireframe: true });
      const dna = new THREE.Mesh(dnaGeo, dnaMat);
      dna.position.y = -0.5;
      group.add(dna);
    }
    return group;
  },

  buildAstrovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    const radius = 2.5;

    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI, 0, Math.PI) : new THREE.SphereGeometry(radius, 32, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xe056fd, wireframe: true }) : this.createBiomaterial(0xbe2edd, 0.7, 0.1);
    
    // Star shape displacement
    if (!isHologram && !isCutaway) {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        // Simple math to make 5-pointed star bumps on poles
        const phi = Math.atan2(v.x, v.z);
        const theta = Math.acos(v.y / radius);
        const bump = Math.cos(phi * 5) * Math.sin(theta * 3);
        if (bump > 0) {
           v.normalize().multiplyScalar(radius + bump * 0.3);
           pos.setXYZ(i, v.x, v.y, v.z);
        }
      }
      geo.computeVertexNormals();
    }
    group.add(new THREE.Mesh(geo, mat));

    if (isCutaway || isHologram) {
      const rnaGeo = new THREE.IcosahedronGeometry(1.5, 1);
      const rnaMat = new THREE.MeshBasicMaterial({ color: 0xf9ca24, wireframe: true });
      group.add(new THREE.Mesh(rnaGeo, rnaMat));
    }
    return group;
  },

  buildBaculovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Envelope
    const geo = isCutaway ? new THREE.CapsuleGeometry(1.5, 3, 16, 32, Math.PI) : new THREE.CapsuleGeometry(1.5, 3, 16, 32);
    // Envelope is somewhat transparent
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x4834d4, wireframe: true }) : new THREE.MeshStandardMaterial({ color: 0x686de0, transparent: true, opacity: 0.5, roughness: 0.1 });
    group.add(new THREE.Mesh(geo, mat));

    // Rod Nucleocapsid
    const coreGeo = isCutaway ? new THREE.CylinderGeometry(0.8, 0.8, 4, 32, 1, false, 0, Math.PI) : new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const coreMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff7979, wireframe: true }) : this.createBiomaterial(0xeb4d4b, 0.6, 0.2);
    group.add(new THREE.Mesh(coreGeo, coreMat));

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusGeometry(0.4, 0.05, 8, 32);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xf9ca24 });
      for(let i=-1.5; i<=1.5; i+=0.5) {
        const dna = new THREE.Mesh(dnaGeo, dnaMat);
        dna.position.y = i;
        dna.rotation.x = Math.PI/2;
        group.add(dna);
      }
    }
    return group;
  },

  buildOrf(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.5;
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 64, 64, 0, Math.PI) : new THREE.SphereGeometry(radius, 64, 64);
    geo.scale(1.2, 1.5, 1.2); // Oval shape
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xff7979, wireframe: true }) : this.createBiomaterial(0xff4d4d, 0.6, 0.2);
    
    // Criss-cross yarn displacement
    if (!isHologram && !isCutaway) {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        const theta = Math.atan2(v.x, v.z);
        const phi = Math.acos(v.y / (radius * 1.5));
        // Yarn pattern
        const bump = Math.sin(theta*15 + phi*10) * Math.sin(theta*15 - phi*10);
        v.multiplyScalar(1 + bump * 0.02);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
    }
    group.add(new THREE.Mesh(geo, mat));

    if (isCutaway || isHologram) {
      const coreGeo = new THREE.BoxGeometry(2, 3, 2);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x4834d4, wireframe: true });
      group.add(new THREE.Mesh(coreGeo, coreMat));
    }
    return group;
  },

  buildPhi29(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    // Prolate Icosahedron Head (Stretched)
    const headGeo = isCutaway ? new THREE.SphereGeometry(2, 32, 32, 0, Math.PI) : new THREE.IcosahedronGeometry(2, 1);
    headGeo.scale(1, 1.5, 1);
    const headMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x30336b, wireframe: true }) : this.createBiomaterial(0x130f40, 0.5, 0.3);
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.5;
    group.add(head);

    // Short Tail
    const tailGeo = isCutaway ? new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16, 1, false, 0, Math.PI) : new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const tailMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x535c68, wireframe: true }) : this.createBiomaterial(0x95afc0, 0.5, 0.3);
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.y = 0.25;
    group.add(tail);

    // Neck Appendages (Motor/Skirt)
    if (!isCutaway) {
      const skirtGeo = new THREE.CylinderGeometry(1.2, 0.3, 0.5, 12);
      const skirtMat = this.createBiomaterial(0xeb4d4b, 0.6, 0.1);
      const skirt = new THREE.Mesh(skirtGeo, skirtMat);
      skirt.position.y = 1;
      group.add(skirt);
    }

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusKnotGeometry(0.8, 0.1, 64, 8);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xffbe76, wireframe: true });
      const dna = new THREE.Mesh(dnaGeo, dnaMat);
      dna.position.y = 2.5;
      group.add(dna);
    }
    return group;
  },

  buildPhiX174(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";
    
    const radius = 2;
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI) : new THREE.IcosahedronGeometry(radius, 1);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x535c68, wireframe: true }) : this.createBiomaterial(0x95afc0, 0.6, 0.2);
    group.add(new THREE.Mesh(geo, mat));

    // Trumpet Spikes on vertices
    if (!isHologram) {
      const ico = new THREE.IcosahedronGeometry(radius, 0);
      const vertices = ico.attributes.position;
      const spikeGeo = new THREE.CylinderGeometry(0.4, 0.1, 1.5, 12);
      const spikeMat = this.createBiomaterial(0xeb4d4b, 0.5, 0.1);

      const added = new Set();
      for (let i = 0; i < vertices.count; i++) {
        const v = new THREE.Vector3(vertices.getX(i), vertices.getY(i), vertices.getZ(i));
        const key = v.x.toFixed(1)+","+v.y.toFixed(1)+","+v.z.toFixed(1);
        if (added.has(key)) continue;
        added.add(key);
        
        if (isCutaway && v.y < 0) continue;
        v.normalize();
        
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.copy(v).multiplyScalar(radius + 0.75);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), v);
        group.add(spike);
      }
    }

    if (isCutaway || isHologram) {
      const dnaGeo = new THREE.TorusGeometry(1, 0.1, 16, 32);
      const dnaMat = new THREE.MeshBasicMaterial({ color: 0xf9ca24 });
      group.add(new THREE.Mesh(dnaGeo, dnaMat));
    }
    return group;
  },

  buildTorovirus(mode = "surface") {
    const group = new THREE.Group();
    const isCutaway = mode === "cutaway";
    const isHologram = mode === "hologram";

    const radius = 2.8;
    const geo = isCutaway ? new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI) : new THREE.SphereGeometry(radius, 32, 32);
    const mat = isHologram ? new THREE.MeshBasicMaterial({ color: 0xf6e58d, wireframe: true, transparent: true, opacity: 0.4 }) : this.createBiomaterial(0xf9ca24, 0.6, 0.2);
    group.add(new THREE.Mesh(geo, mat));

    // Spikes (Peplomers)
    if (!isHologram) {
      const spikeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
      const spikeMat = this.createBiomaterial(0xeb4d4b, 0.5, 0.1);
      for(let i=0; i<200; i++) {
        const y = 1 - (i / 199) * 2;
        if (isCutaway && y < 0) continue;
        const tempR = Math.sqrt(1 - y*y);
        const theta = Math.PI * (3 - Math.sqrt(5)) * i;
        const norm = new THREE.Vector3(Math.cos(theta)*tempR, y, Math.sin(theta)*tempR);
        
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.copy(norm).multiplyScalar(radius + 0.3);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), norm);
        group.add(spike);
      }
    }

    // Torus nucleocapsid
    if (isCutaway || isHologram) {
      const coreGeo = new THREE.TorusGeometry(1.5, 0.5, 16, 64);
      const coreMat = isHologram ? new THREE.MeshBasicMaterial({ color: 0x4834d4, wireframe: true }) : this.createBiomaterial(0x686de0, 0.5, 0.2);
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.rotation.x = Math.PI / 3;
      group.add(core);
    }
    return group;
  },
`;

const switchStatement = `
      case "mimivirus": return this.buildMimivirus(mode);
      case "pithovirus": return this.buildPithovirus(mode);
      case "tupanvirus": return this.buildTupanvirus(mode);
      case "atv": return this.buildATV(mode);
      case "geminivirus": return this.buildGeminivirus(mode);
      case "tmv": return this.buildTMV(mode);
      case "m13": return this.buildM13(mode);
      case "acv": return this.buildACV(mode);
      case "guttavirus": return this.buildGuttavirus(mode);
      case "astrovirus": return this.buildAstrovirus(mode);
      case "baculovirus": return this.buildBaculovirus(mode);
      case "orf": return this.buildOrf(mode);
      case "phi29": return this.buildPhi29(mode);
      case "phix174": return this.buildPhiX174(mode);
      case "torovirus": return this.buildTorovirus(mode);
`;

const replaceMarker = 'case "measles": return this.buildMeasles(mode);';
let newCode = code.replace(replaceMarker, replaceMarker + '\\n' + switchStatement);

const splitMarker = 'createVirus(virusId, mode = "surface") {';
const parts = newCode.split(splitMarker);
if(parts.length > 1) {
   let modifiedCode = parts[0] + newMethods + "\\n  " + splitMarker + parts[1];
   fs.writeFileSync(filePath, modifiedCode, 'utf8');
   console.log('virusModels.js updated successfully with 15 weird models.');
}
