import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-emerald-500/30">
      <main>
        <router-outlet></router-outlet>
      </main>
      <footer class="border-t border-neutral-800 py-8 mt-12">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-neutral-500 text-sm font-mono">
          <p>&copy; {{ currentYear }} Meu Blog de Estudos. Minimalismo e Foco.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class App {
  currentYear = new Date().getFullYear();
}
