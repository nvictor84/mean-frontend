import {Injectable} from '@angular/core';
import {Post} from '../posts/post.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {
  }

  getPosts() {
    this.http.get<any>(`${environment.apiURL}/posts`)
      .subscribe(data => {
        this.posts = data['posts'];
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(postId: string) {
    return {...this.posts.find(p => p.id === postId)};
  }

  addPost(newPost: Post) {
    this.http.post<any>(`${environment.apiURL}/posts`, {newPost})
      .subscribe(data => {
        console.log(data);
        this.posts.push(newPost);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete<any>(`${environment.apiURL}/posts/${postId}`)
      .subscribe(data => {
        console.log(data);
        const refreshPosts = this.posts.filter(post => {
          return post.id !== postId;
        });
        this.posts = refreshPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(postId: string, updatedPost: Post) {
    this.http.put<any>(`${environment.apiURL}/posts/${postId}`, updatedPost)
      .subscribe(data => {
        console.log(data);
        this.getPosts();
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
