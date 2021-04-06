import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  public progress: number = 0;
  public message: string = "";

  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  public uploadFile(files: any) {
    if (files.length === 0) {
      return;
    }

    let fileToUpload: File = files[0];

    const formData = new FormData();
    formData.append('files', fileToUpload, fileToUpload.name);

    this.http.post('https://localhost:44338/api/upload', formData, {reportProgress: true, observe: 'events'})
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total!);
        }
        else if (event.type === HttpEventType.Response) {
          this.message = 'Files are uploaded successfully!';
          this.onUploadFinished.emit(event.body);
        }
      },
      error => {
        this.message = 'Error is occured!';
      });
  }
}