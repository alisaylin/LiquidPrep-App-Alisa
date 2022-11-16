import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { LanguageTranslatorService } from 'src/app/service/LanguageTranslatorService';

@Component({
  selector: 'app-connecting-dialog',
  templateUrl: './connecting-dialog.component.html',
  styleUrls: ['./connecting-dialog.component.scss']
})
export class ConnectingDialogComponent implements OnInit {

  /* FOR TRANSLATION */
  public connect = "Please connect the sensor";
  public cancel = "cancel";
  translations = [this.connect, this.cancel]
  public selectedLanguage = "spanish";

  constructor(private dialogRef: MatDialogRef<ConnectingDialogComponent>, private languageService: LanguageTranslatorService) {

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
    });

    dialogRef.afterOpened().subscribe(_ => {
      setTimeout(() => {
        dialogRef.close();
      }, 10000);
    });
    this.updateTranslation();
  }

  ngOnInit(): void {
  }
  updateTranslation() {
    this.languageService.getTranslation(this.translations, this.selectedLanguage).subscribe((response: any) => {
       this.connect = (response.translations[0].translation);
       this.cancel = (response.translations[1].translation);
      });
  }
}
