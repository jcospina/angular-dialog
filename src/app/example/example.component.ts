import {Component} from '@angular/core';
import {DialogConfig} from '../dialog/config';
import {DialogRef} from '../dialog/dialog-ref';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {

  constructor(
    public config: DialogConfig,
    public dialogRef: DialogRef
  ) {
  }

  onClose() {
    this.dialogRef.close('some value');
  }

}
