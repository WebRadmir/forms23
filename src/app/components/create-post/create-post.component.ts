import { Component } from '@angular/core';
import { PostTableComponent } from '../post-table/post-table.component';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent {
  title = '';
  userID = '';
  body = '';

  constructor(private postTable: PostTableComponent) {}

  createPost() {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: this.title,
        body: this.body,
        userId: this.userID,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((newPost) => {
        this.postTable.addNewPost(newPost);
        console.log(newPost);
      });
  }
}
