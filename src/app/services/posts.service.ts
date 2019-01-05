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
  private postsUpdated = new Subject<{posts: Post[], count: number}>();

  constructor(private http: HttpClient) {
  }

  getPosts(postsPerPage: number = 2, currentPage: number = 1) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<any>(`${environment.apiURL}/posts${queryParams}`)
      .subscribe(data => {
        this.posts = data['posts'];
        this.postsUpdated.next({posts: [...this.posts], count: data['count']});
      });
  }

  getPost(postId: string) {
    return {...this.posts.find(p => p.id === postId)};
  }

  addPost(newPost: Post) {
    const postData = new FormData();
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    postData.append('image', newPost.image, newPost.title);
    this.http.post<{ success: boolean; post: Post}>(`${environment.apiURL}/posts`, postData)
      .subscribe(data => {
        this.posts.push(data.post);
        this.postsUpdated.next({ posts: [...this.posts], count: 1});
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
        this.postsUpdated.next({ posts: [...this.posts], count: 1});
      });
  }

  updatePost(postId: string, updatedPost: Post) {
    let postData;
    if (typeof(updatedPost.image) === 'object') {
      postData = new FormData();
      postData.append('title', updatedPost.title);
      postData.append('content', updatedPost.content);
      postData.append('image', updatedPost.image, updatedPost.title);
    } else {
      postData = updatedPost;
    }
    this.http.put<any>(`${environment.apiURL}/posts/${postId}`, postData)
      .subscribe(data => {
        console.log(data);
        this.getPosts();
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
