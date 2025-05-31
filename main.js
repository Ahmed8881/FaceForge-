  class FaceSyncAI {
            constructor() {
                this.video = document.getElementById('video');
                this.canvas = document.getElementById('canvas');
                this.ctx = this.canvas.getContext('2d');
                this.startBtn = document.getElementById('startBtn');
                this.status = document.getElementById('status');
                this.spinner = document.getElementById('spinner');
                this.particleOverlay = document.getElementById('particleOverlay');
                
                this.isStreaming = false;
                this.currentFilter = 'normal';
                this.faceBoxes = [];
                this.particles = [];
                
                this.init();
            }
             init() {
                this.startBtn.addEventListener('click', () => this.toggleCamera());
                this.setupFilterButtons();
                this.createParticles();
                this.animateParticles();
            }
 setupFilterButtons() {
                const filterBtns = document.querySelectorAll('.filter-btn');
                filterBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        filterBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.currentFilter = btn.dataset.filter;
                        this.updateStatus(`Filter changed to: ${btn.textContent.trim()}`);
                    });
                });
            }

            async toggleCamera() {
                if (!this.isStreaming) {
                    await this.startCamera();
                } else {
                    this.stopCamera();
                }
            }
  async startCamera() {
                this.showSpinner(true);
                this.updateStatus('Initializing AI camera systems...');
                
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { 
                            width: { ideal: 1280 },
                            height: { ideal: 720 },
                            facingMode: 'user'
                        }
                    });
                    
                    this.video.srcObject = stream;
                    this.video.style.display = 'block';
                    this.startBtn.style.display = 'none';
                    
                    this.video.addEventListener('loadedmetadata', () => {
                        this.canvas.width = this.video.videoWidth;
                        this.canvas.height = this.video.videoHeight;
                        this.isStreaming = true;
                        this.startProcessing();
                        this.updateStatus('🎯 AI face detection active - Move around!');
                        this.showSpinner(false);
                    });
                    
                } catch (error) {
                    this.updateStatus('❌ Camera access denied. Please allow camera permissions.');
                    this.showSpinner(false);
                }
            }

            stopCamera() {
                if (this.video.srcObject) {
                    this.video.srcObject.getTracks().forEach(track => track.stop());
                }
                this.video.style.display = 'none';
                this.startBtn.style.display = 'block';
                this.isStreaming = false;
                this.clearFaceBoxes();
                this.updateStatus('Camera stopped');
            }

            startProcessing() {
                const processFrame = () => {
                    if (!this.isStreaming) return;
                    
                    this.simulateFaceDetection();
                    this.applyCurrentFilter();
                    requestAnimationFrame(processFrame);
                };
                processFrame();
            }

            simulateFaceDetection() {
                // Simulate AI face detection with realistic behavior
                const time = Date.now() * 0.001;
                const detectionChance = 0.8 + 0.2 * Math.sin(time * 2);
                
                if (Math.random() < detectionChance) {
                    const faceCount = Math.random() < 0.7 ? 1 : Math.floor(Math.random() * 3) + 1;
                    this.updateFaceBoxes(faceCount);
                } else {
                    this.clearFaceBoxes();
                }
            }

            updateFaceBoxes(count) {
                this.clearFaceBoxes();
                
                for (let i = 0; i < count; i++) {
                    const box = document.createElement('div');
                    box.className = 'face-detection-box';
                    
                    const pulseEffect = document.createElement('div');
                    pulseEffect.className = 'pulse-effect';
                    box.appendChild(pulseEffect);
                    
                    // Random but realistic face positions
                    const x = 20 + Math.random() * 60;
                    const y = 10 + Math.random() * 60;
                    const size = 80 + Math.random() * 40;
                    
                    box.style.left = `${x}%`;
                    box.style.top = `${y}%`;
                    box.style.width = `${size}px`;
                    box.style.height = `${size}px`;
                    
                    this.video.parentElement.appendChild(box);
                    this.faceBoxes.push(box);
                    
                    // Add filter-specific effects
                    this.addFilterEffects(box, i);
                }
            }

            addFilterEffects(box, index) {
                const effects = {
                    cyberpunk: () => {
                        box.style.borderColor = '#ff0080';
                        box.style.boxShadow = '0 0 30px rgba(255, 0, 128, 0.8)';
                    },
                    rainbow: () => {
                        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#a55eea'];
                        box.style.borderColor = colors[index % colors.length];
                        box.style.animation = 'pulse 1s ease-in-out infinite';
                    },
                    matrix: () => {
                        box.style.borderColor = '#00ff00';
                        box.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.6)';
                        this.addMatrixRain(box);
                    },
                    neon: () => {
                        box.style.borderColor = '#00ffff';
                        box.style.boxShadow = '0 0 40px rgba(0, 255, 255, 0.9)';
                    },
                    hologram: () => {
                        box.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                        box.style.background = 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(0,255,255,0.1))';
                    }
                };
                
                if (effects[this.currentFilter]) {
                    effects[this.currentFilter]();
                }
            }

            addMatrixRain(box) {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const char = document.createElement('div');
                        char.textContent = String.fromCharCode(0x30A0 + Math.random() * 96);
                        char.style.position = 'absolute';
                        char.style.color = '#00ff00';
                        char.style.fontSize = '12px';
                        char.style.left = Math.random() * 100 + '%';
                        char.style.animation = 'float 2s ease-out forwards';
                        box.appendChild(char);
                        
                        setTimeout(() => char.remove(), 2000);
                    }, i * 200);
                }
            }

            applyCurrentFilter() {
                const overlay = document.querySelector('.camera-overlay');
                overlay.className = `camera-overlay filter-${this.currentFilter}`;
            }

            clearFaceBoxes() {
                this.faceBoxes.forEach(box => box.remove());
                this.faceBoxes = [];
            }

            createParticles() {
                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 3 + 's';
                    particle.style.opacity = Math.random() * 0.5 + 0.2;
                    this.particleOverlay.appendChild(particle);
                    this.particles.push(particle);
                }
            }

            animateParticles() {
                setInterval(() => {
                    this.particles.forEach(particle => {
                        if (Math.random() < 0.1) {
                            particle.style.left = Math.random() * 100 + '%';
                            particle.style.top = Math.random() * 100 + '%';
                        }
                    });
                }, 2000);
            }

            updateStatus(message) {
                this.status.textContent = message;
            }

            showSpinner(show) {
                this.spinner.style.display = show ? 'inline-block' : 'none';
            }
        }

        // Initialize the app
        new FaceSyncAI();
        