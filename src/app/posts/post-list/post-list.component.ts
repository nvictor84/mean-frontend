import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {PostsService} from '../../services/posts.service';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {PageEvent} from '@angular/material';
import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub = new Subscription();
  imagesPath: string;

  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  isLogged = false;
  private authStateSubs: Subscription;

  constructor(public postsService: PostsService,
              private auth: AuthService) {
    this.imagesPath = environment.imagesPath;
  }

  ngOnInit() {
    this.retrievePosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((updatedPosts: any) => {
        this.posts = updatedPosts.posts;
        this.totalPosts = updatedPosts.count;
      });
    this.authStateSubs = this.auth.getAuthStateListener()
      .subscribe(isAuthenticated => {
        this.isLogged = isAuthenticated;
      });
  }

  retrievePosts() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  onChangedPage(evt: PageEvent) {
    this.postsPerPage = evt.pageSize;
    this.currentPage = evt.pageIndex + 1;
    this.retrievePosts();
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStateSubs.unsubscribe();
  }

}
