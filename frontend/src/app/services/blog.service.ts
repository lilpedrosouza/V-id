import { Injectable, signal } from '@angular/core';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private initialPosts: Post[] = [
    {
      id: 1,
      title: 'Introdução ao C# e ASP.NET Core',
      content: 'Neste post, vamos explorar como criar uma API RESTful usando **C#** e **ASP.NET Core**.\n\n```csharp\n[ApiController]\n[Route("[controller]")]\npublic class PostsController : ControllerBase {\n    [HttpGet]\n    public IActionResult Get() {\n        return Ok(new { Message = "Hello World" });\n    }\n}\n```\n\nÉ muito simples e direto!',
      createdAt: new Date('2026-03-10T10:00:00'),
      tags: ['C#', 'Backend', 'ASP.NET Core']
    },
    {
      id: 2,
      title: 'Estruturas de Dados: Árvores Binárias',
      content: 'Uma árvore binária é uma estrutura de dados de árvore na qual cada nó tem no máximo dois filhos, chamados de filho esquerdo e filho direito.\n\n```typescript\nclass TreeNode {\n  value: number;\n  left: TreeNode | null;\n  right: TreeNode | null;\n\n  constructor(value: number) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}\n```',
      createdAt: new Date('2026-03-12T14:30:00'),
      tags: ['Estrutura de Dados', 'TypeScript']
    }
  ];

  posts = signal<Post[]>(this.initialPosts);

  getPost(id: number): Post | undefined {
    return this.posts().find(p => p.id === id);
  }

  addPost(post: Omit<Post, 'id' | 'createdAt'>) {
    const newPost: Post = {
      ...post,
      id: Math.max(0, ...this.posts().map(p => p.id)) + 1,
      createdAt: new Date()
    };
    this.posts.update(posts => [newPost, ...posts]);
  }

  updatePost(id: number, post: Omit<Post, 'id' | 'createdAt'>) {
    this.posts.update(posts => posts.map(p => p.id === id ? { ...p, ...post } : p));
  }

  deletePost(id: number) {
    this.posts.update(posts => posts.filter(p => p.id !== id));
  }
}
