import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from '../post.model';
import {NgForm} from '@angular/forms';
import {PostsService} from '../../services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postsService: PostsService) {
  }

  ngOnInit() {
  }

  onAddClick(form: NgForm) {
    const newPost: Post = {
      title: form.value['post-title'],
      content: form.value['post-content']
    };
    // this.postCreated.emit(newPost);
    this.postsService.addPost(newPost);
    form.resetForm();
  }


}
