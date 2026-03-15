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
  templateUrl: './post.html',
  styleUrl: './post.css'
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
