import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-animated-background',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #particleCanvas class="particle-canvas"></canvas>`,
  styles: [
    `
      .particle-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
      }
    `,
  ],
})
export class AnimatedBackgroundComponent implements AfterViewInit {
  @ViewChild('particleCanvas') private particleCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number = 0;
  private mousePosition = { x: 0, y: 0 };
  private interactionRadius = 150;

  constructor() {}

  public ngAfterViewInit(): void {
    this.initCanvas();
    this.createParticles();
    this.animate();
    this.setupEventListeners();
  }

  private initCanvas(): void {
    const canvas = this.particleCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    // Ajustar o canvas para o tamanho da viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private createParticles(): void {
    // Usar a densidade para a viewport
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(
        new Particle(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
          Math.random() * 3.5 + 1.5,
          this.getRandomBlueColor()
        )
      );
    }
  }

  private getRandomBlueColor(): string {
    const colors = [
      'rgba(37, 99, 235, 0.4)',
      'rgba(59, 130, 246, 0.35)',
      'rgba(29, 78, 216, 0.4)',
      'rgba(191, 219, 254, 0.3)',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private animate(): void {
    const canvas = this.particleCanvas.nativeElement;

    // Limpar apenas o tamanho da viewport
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of this.particles) {
      // Atualizar as partículas sem passar a altura do documento
      particle.update(this.mousePosition, this.interactionRadius);
      particle.draw(this.ctx);
    }

    // Desenhar conexões entre partículas
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 180) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(37, 99, 235, ${0.2 * (1 - distance / 180)})`;
          this.ctx.lineWidth = 0.7;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', () => {
      const canvas = this.particleCanvas.nativeElement;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.createParticles();
    });

    window.addEventListener('mousemove', e => {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    });

    window.addEventListener('touchmove', e => {
      if (e.touches.length > 0) {
        this.mousePosition.x = e.touches[0].clientX;
        this.mousePosition.y = e.touches[0].clientY;
      }
    });
  }

  public ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', () => {});
    window.removeEventListener('mousemove', () => {});
    window.removeEventListener('touchmove', () => {});
  }
}

class Particle {
  private velocity = { x: 0, y: 0 };
  public size: number;
  private baseVelocity: { x: number; y: number };

  constructor(
    public x: number,
    public y: number,
    public readonly baseSize: number,
    public readonly color: string
  ) {
    this.size = baseSize;
    this.baseVelocity = {
      x: (Math.random() - 0.5) * 1.2,
      y: (Math.random() - 0.5) * 1.2,
    };
    this.velocity = { ...this.baseVelocity };
  }

  public update(mousePosition: { x: number; y: number }, interactionRadius: number): void {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Colisão com as bordas - usar a viewport, não o documento
    if (this.x < 0 || this.x > window.innerWidth) {
      this.velocity.x = -this.velocity.x;

      // Corrigir posição se estiver fora da tela
      if (this.x < 0) this.x = 0;
      if (this.x > window.innerWidth) this.x = window.innerWidth;
    }

    if (this.y < 0 || this.y > window.innerHeight) {
      this.velocity.y = -this.velocity.y;

      // Corrigir posição se estiver fora da tela
      if (this.y < 0) this.y = 0;
      if (this.y > window.innerHeight) this.y = window.innerHeight;
    }

    // Interação com o mouse/toque
    const dx = mousePosition.x - this.x;
    const dy = mousePosition.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < interactionRadius) {
      const force = (interactionRadius - distance) / interactionRadius;
      const directionX = dx / distance || 0;
      const directionY = dy / distance || 0;

      // Efeito mais forte de repulsão
      this.velocity.x -= directionX * force * 1.0;
      this.velocity.y -= directionY * force * 1.0;
      // Partículas crescem mais ao interagir com o mouse
      this.size = this.baseSize + this.baseSize * 2 * force;
    } else {
      // Retorno gradual à velocidade base quando longe do mouse
      this.velocity.x = this.velocity.x * 0.98 + this.baseVelocity.x * 0.02;
      this.velocity.y = this.velocity.y * 0.98 + this.baseVelocity.y * 0.02;
      this.size = this.baseSize;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Adicionar um brilho suave em volta das partículas
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
    const glowColor = this.color.replace(')', ', 0.2)').replace('rgba', 'rgba');
    ctx.fillStyle = glowColor;
    ctx.fill();
  }
}
