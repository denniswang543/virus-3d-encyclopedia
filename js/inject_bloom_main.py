import os
import shutil

main_path = r"d:\__AI\SLF\virus-3d\js\main.js"
backup_path = r"d:\__AI\SLF\virus-3d\js\main_backup_no_bloom.js"
if not os.path.exists(backup_path):
    shutil.copy(main_path, backup_path)

with open(main_path, "r", encoding="utf-8") as f:
    js = f.read()

# 1. Inject setupPostProcessing in init
if "this.setupPostProcessing();" not in js:
    js = js.replace("this.setupLights();", "this.setupLights();\n      this.setupPostProcessing();")

# 2. Define setupPostProcessing
setup_bloom = """
  setupPostProcessing() {
    if (typeof THREE.EffectComposer === 'undefined') return;
    
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.setSize(width, height);
    
    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Create UnrealBloomPass (resolution, strength, radius, threshold)
    this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(width, height), 1.2, 0.4, 0.2);
    this.composer.addPass(this.bloomPass);
    
    this.enableBloom = false; // Toggled per virus
  }
"""
if "setupPostProcessing()" not in js:
    js = js.replace("setupLights() {", setup_bloom + "\n  setupLights() {")

# 3. Update animate render loop
render_old = "this.renderer.render(this.scene, this.camera);"
render_new = """
      if (this.renderer.xr.isPresenting) {
        this.renderer.render(this.scene, this.camera);
      } else if (this.composer && this.enableBloom) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
"""
js = js.replace(render_old, render_new)

# 4. Enable bloom and add emissive glow for SARS-CoV-2
load_virus_inject = """
    // Enable Bloom and glowing materials for SARS-CoV-2
    if (this.composer) {
      if (virusId === "sars-cov-2") {
        this.enableBloom = true;
        // Make spikes glow!
        this.currentModelGroup.traverse((child) => {
          if (child.isMesh && child.material && child.material.color) {
            // Check if it's the spike head (orange-ish) or stalk (red-ish)
            if (child.material.color.getHex() === 0xf39c12 || child.material.color.getHex() === 0xd35400) {
              child.material.emissive = child.material.color;
              child.material.emissiveIntensity = 0.6; // Glow!
            }
          }
        });
      } else {
        this.enableBloom = false;
      }
    }
"""

if "this.enableBloom = true;" not in js:
    js = js.replace("this.createHotspotMarkers();", load_virus_inject + "\n      this.createHotspotMarkers();")

with open(main_path, "w", encoding="utf-8") as f:
    f.write(js)

print("main.js updated with Bloom post-processing.")
