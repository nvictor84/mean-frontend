import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from '../post.model';
import {NgForm} from '@angular/forms';
import {PostsService} from '../../services/posts.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  // @Output() postCreated = new EventEmitter<Post>();

  private mode = 'create';
  private postId: string = null;
  public post: Post;

  constructor(public postsService: PostsService,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(routeParams => {
        if (routeParams.has('postId')) {
          this.mode = 'edit';
          this.postId = routeParams.get('postId');
          this.post = this.postsService.getPost(this.postId);
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  onAddClick(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const newPost: Post = {
      title: form.value['post-title'],
      content: form.value['post-content']
    };
    // this.postCreated.emit(newPost);
    if (this.mode === 'create') {
      this.postsService.addPost(newPost);
    } else {
      this.postsService.updatePost(this.post.id, newPost);
    }
    form.resetForm();
  }


}
