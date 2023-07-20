import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../shared/utilities.service';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss']
})
export class FirstPageComponent implements OnInit {

  constructor(public constants: UtilitiesService,
    ) { }

  ngOnInit(): void {
  }

}
