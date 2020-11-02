import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-pop-up',
  templateUrl: './delete-pop-up.component.html',
  styleUrls: ['./delete-pop-up.component.scss']
})
export class DeletePopUpComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDeletePopUp) { }

  ngOnInit(): void {
  }

}

export interface IDeletePopUp {
  title: string;
  body: string;
}
