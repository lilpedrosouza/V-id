import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <nav class="mb-8">
        <a [routerLink]="['/post', id]" class="text-neutral-400 hover:text-neutral-200 text-sm inline-flex items-center gap-2 transition-colors">
          <span aria-hidden="true">&larr;</span> Voltar para o Post
        </a>
      </nav>

      <header class="mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-neutral-100 font-sans">Editar Post</h1>
        <p class="text-neutral-400 mt-2">Atualize suas anotações e aprendizados.</p>
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
          ></textarea>
        </div>

        <div class="flex justify-end pt-4">
          <button 
            type="submit" 
            [disabled]="!postForm.valid"
            class="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  `
})
export class EditPostComponent implements OnInit {
  blogService = inject(BlogService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  id!: number;
  title = '';
  tagsStr = '';
  content = '';

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    const post = this.blogService.getPost(this.id);
    
    if (post) {
      this.title = post.title;
      this.content = post.content;
      this.tagsStr = post.tags.join(', ');
    } else {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    if (this.title && this.content) {
      const tags = this.tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      this.blogService.updatePost(this.id, {
        title: this.title,
        content: this.content,
        tags: tags
      });

      this.router.navigate(['/post', this.id]);
    }
  }
}
