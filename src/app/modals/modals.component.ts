import { Component, OnInit,Input  } from '@angular/core';
import { MyWalletComponent } from '../my-wallet/my-wallet.component';

import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {

  private modalRef;
  closeResult: string;
  @Input() name;
  constructor(public activeModal: NgbActiveModal,private modalService: NgbModal,public mywallet:MyWalletComponent, private modalservice:NgbModal) { }

  ngOnInit() {
   
  }
  open() {
    const modalRef = this.modalService.open(ModalsComponent);
    modalRef.componentInstance.name = 'World';
  }
  // open(content) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }
}
