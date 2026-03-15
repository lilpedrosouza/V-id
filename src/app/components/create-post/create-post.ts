import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <nav class="mb-8">
        <a routerLink="/" class="text-neutral-400 hover:text-neutral-200 text-sm inline-flex items-center gap-2 transition-colors">
          <span aria-hidden="true">&larr;</span> Voltar para Home
        </a>
      </nav>

      <header class="mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-neutral-100 font-sans">Criar Novo Post</h1>
        <p class="text-neutral-400 mt-2">Escreva suas anotações e aprendizados usando Markdown.</p>
      </header>

      <form (ngSubmit)="onSubmit()" #postForm="ngForm" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-neutral-300 mb-2">Título</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            [(ngModel)]="title" 
            required
            class="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            placeholder="Ex: Entendendo Injeção de Dependência no Angular"
          >
        </div>

        <div>
          <label for="tags" class="block text-sm font-medium text-neutral-300 mb-2">Tags (separadas por vírgula)</label>
          <input 
            type="text" 
            id="tags" 
            name="tags" 
            [(ngModel)]="tagsStr" 
            class="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-2 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow font-mono text-sm"
            placeholder="Ex: Angular, Frontend, TypeScript"
          >
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-neutral-300 mb-2">Conteúdo (Markdown)</label>
          <textarea 
            id="content" 
            name="content" 
            [(ngModel)]="content" 
            required
            rows="15"
            class="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow font-mono text-sm leading-relaxed"
            placeholder="Escreva seu post aqui em formato Markdown..."
          ></textarea>
        </div>

        <div class="flex justify-end pt-4">
          <button 
            type="submit" 
            [disabled]="!postForm.valid"
            class="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publicar Post
          </button>
        </div>
      </form>
    </div>
  `
})
export class CreatePostComponent {
  blogService = inject(BlogService);
  router = inject(Router);

  title = '';
  tagsStr = '';
  content = '';

  onSubmit() {
    if (this.title && this.content) {
      const tags = this.tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      this.blogService.addPost({
        title: this.title,
        content: this.content,
        tags: tags
      });

      this.router.navigate(['/']);
    }
  }
}
