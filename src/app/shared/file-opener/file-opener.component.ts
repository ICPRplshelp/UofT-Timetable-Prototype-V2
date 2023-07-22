import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-opener',
  templateUrl: './file-opener.component.html',
  styleUrls: ['./file-opener.component.scss']
})
export class FileOpenerComponent implements OnInit {




  constructor() { }

  ngOnInit(): void {
  }

  @Input() buttonPrompt = "TEMP";
  @Input() fileProcessor: (input: string) => void = (input) => {};

  selectedFile: File | null = null;


  onFileSelected(event: any) {
    // Retrieve the selected file from the event
    this.selectedFile = event.target.files[0] || null;
  }

  openFile() {
    if (this.selectedFile) {
      // You can perform any operations with the selected file here
      // console.log('Selected file:', this.selectedFile);
      
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        // e.target.result contains the file content as a string
        const fileContent = e.target?.result as string;
        // console.log('File content:', fileContent);
        this.fileProcessor(fileContent);
      };
      fileReader.readAsText(this.selectedFile);


    } else {
      console.log('No file selected.');
    }
  }

}
