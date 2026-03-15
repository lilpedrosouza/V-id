import { Component, inject, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../../services/blog.service';
import { Post } from '../../models/post.model';
import { marked } from 'marked';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <nav class="mb-8 flex justify-between items-center">
        <a routerLink="/" class="text-neutral-400 hover:text-neutral-200 text-sm inline-flex items-center gap-2 transition-colors">
          <span aria-hidden="true">&larr;</span> Voltar para Home
        </a>

        @if (post()) {
          <div class="flex gap-4 items-center">
            @if (!showDeleteConfirm()) {
              <a [routerLink]="['/edit', post()!.id]" class="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">Editar</a>
              <button (click)="showDeleteConfirm.set(true)" class="text-sm text-red-400 hover:text-red-300 transition-colors">Excluir</button>
            } @else {
              <span class="text-sm text-neutral-400">Tem certeza?</span>
              <button (click)="confirmDelete()" class="text-sm text-red-400 hover:text-red-300 font-bold">Sim, excluir</button>
              <button (click)="showDeleteConfirm.set(false)" class="text-sm text-neutral-400 hover:text-neutral-200">Cancelar</button>
            }
          </div>
        }
      </nav>

      @if (post()) {
        <article>
          <header class="mb-10">
            <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-100 mb-4 font-sans">{{ post()!.title }}</h1>
            <div class="flex items-center gap-4 text-sm text-neutral-500 font-mono">
              <time [dateTime]="post()!.createdAt.toISOString()">{{ post()!.createdAt | date:'longDate' }}</time>
              <div class="flex gap-2">
                @for (tag of post()!.tags; track tag) {
                  <span class="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-xs">{{ tag }}</span>
                }
              </div>
            </div>
          </header>

          <div class="prose prose-invert prose-neutral max-w-none prose-pre:bg-[#1e1e1e] prose-pre:border prose-pre:border-neutral-800" [innerHTML]="parsedContent()"></div>
        </article>
      } @else {
        <div class="text-center py-12">
          <h2 class="text-2xl font-semibold text-neutral-200">Post não encontrado</h2>
          <p class="text-neutral-400 mt-2">O post que você está procurando não existe.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    /* PrismJS Dark Theme Customization for Minimalist Look */
    code[class*="language-"],
    pre[class*="language-"] {
      color: #d4d4d4;
      background: none;
      font-family: var(--font-mono);
      font-size: 0.875rem;
      text-align: left;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
      word-wrap: normal;
      line-height: 1.5;
      tab-size: 4;
      hyphens: none;
    }
    pre[class*="language-"] {
      padding: 1.25rem;
      margin: 1.5em 0;
      overflow: auto;
      border-radius: 0.5rem;
    }
    :not(pre) > code[class*="language-"] {
      background: #2d2d2d;
      padding: 0.2em 0.4em;
      border-radius: 0.3em;
      white-space: normal;
    }
    .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #6a9955; }
    .token.punctuation { color: #d4d4d4; }
    .token.namespace { opacity: .7; }
    .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #b5cea8; }
    .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #ce9178; }
    .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #d4d4d4; }
    .token.atrule, .token.attr-value, .token.keyword { color: #569cd6; }
    .token.function, .token.class-name { color: #dcdcaa; }
    .token.regex, .token.important, .token.variable { color: #d16969; }
  `]
})
export class PostComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  blogService = inject(BlogService);
  sanitizer = inject(DomSanitizer);
  
  post = signal<Post | undefined>(undefined);
  parsedContent = signal<SafeHtml>('');
  showDeleteConfirm = signal(false);

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const p = this.blogService.getPost(id);
    this.post.set(p);
    
    if (p) {
      const htmlContent = await marked.parse(p.content);
      // Usamos o DomSanitizer para evitar que o Angular remova as tags e classes do Markdown/PrismJS
      this.parsedContent.set(this.sanitizer.bypassSecurityTrustHtml(htmlContent));
      setTimeout(() => {
        Prism.highlightAll();
      }, 0);
    }
  }

  confirmDelete() {
    if (this.post()) {
      this.blogService.deletePost(this.post()!.id);
      this.router.navigate(['/']);
    }
  }
}
