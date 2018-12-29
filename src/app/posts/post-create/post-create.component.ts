import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from '../post.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PostsService} from '../../services/posts.service';
import {ActivatedRoute} from '@angular/router';
import {mimeType} from './mime-type.validator';
import {environment} from '../../../environments/environment';

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

  form: FormGroup;
  imagePreview: string;

  constructor(public postsService: PostsService,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.initForm();
    this.route.paramMap
      .subscribe(routeParams => {
        if (routeParams.has('postId')) {
          this.mode = 'edit';
          this.postId = routeParams.get('postId');
          this.post = this.postsService.getPost(this.postId);
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.image
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  initForm() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
  }

  onAddClick() {
    if (this.form.invalid) {
      return;
    }
    const newPost: Post = {
      title: this.form.value['title'],
      content: this.form.value['content'],
      image: this.form.value['image']
    };
    // this.postCreated.emit(newPost);
    if (this.mode === 'create') {
      this.postsService.addPost(newPost);
    } else {
      this.postsService.updatePost(this.post.id, newPost);
    }
    this.form.reset();
  }

  onImagePicked(evt: Event) {

    const file = (evt.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

}
