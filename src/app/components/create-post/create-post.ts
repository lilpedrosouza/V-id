import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../../services/blog.service';
import { marked } from 'marked';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-csharp';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
  encapsulation: ViewEncapsulation.None
})
export class CreatePostComponent {
  blogService = inject(BlogService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  title = '';
  tagsStr = '';
  content = '';

  activeTab = signal<'write' | 'preview'>('write');
  renderedContent = signal<SafeHtml>('');

  private imageMap: Record<string, string> = {};
  private imageCounter = 0;

  /** Monta o markdown final com as referências de imagem no rodapé */
  private buildMarkdownWithImages(): string {
    const refs = Object.entries(this.imageMap)
      .map(([key, url]) => `[${key}]: ${url}`)
      .join('\n');
    return refs ? this.content + '\n\n' + refs : this.content;
  }

  async switchTab(tab: 'write' | 'preview') {
    this.activeTab.set(tab);
    if (tab === 'preview') {
      const html = await marked.parse(this.buildMarkdownWithImages());
      this.renderedContent.set(this.sanitizer.bypassSecurityTrustHtml(html));
      setTimeout(() => Prism.highlightAll(), 0);
    }
  }

  onPaste(event: ClipboardEvent, textarea: HTMLTextAreaElement) {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const key = `imagem-${++this.imageCounter}`;
          this.imageMap[key] = dataUrl;

          // Insere apenas o placeholder curto no textarea
          const placeholder = `![${key}][${key}]`;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          this.content =
            this.content.substring(0, start) +
            placeholder +
            this.content.substring(end);

          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
            textarea.focus();
          });
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  }

  onSubmit() {
    if (this.title && this.content) {
      const tags = this.tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      this.blogService.addPost({
        title: this.title,
        // Salva com as referências de imagem no final
        content: this.buildMarkdownWithImages(),
        tags: tags
      });

      this.router.navigate(['/']);
    }
  }
}
