import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  blogService = inject(BlogService);

  searchQuery = signal('');
  selectedTag = signal<string | null>(null);

  allTags = computed(() => {
    const tags = new Set<string>();
    this.blogService.posts().forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  });

  filteredPosts = computed(() => {
    let posts = this.blogService.posts();
    const query = this.searchQuery().toLowerCase();
    const tag = this.selectedTag();

    if (query) {
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.content.toLowerCase().includes(query)
      );
    }
    if (tag) {
      posts = posts.filter(p => p.tags.includes(tag));
    }
    return posts;
  });

  getExcerpt(content: string): string {
    return content.replace(/[#*\`_\\[\\]]/g, '').substring(0, 150) + '...';
  }
}
