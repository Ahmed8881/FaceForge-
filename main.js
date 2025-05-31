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

        }