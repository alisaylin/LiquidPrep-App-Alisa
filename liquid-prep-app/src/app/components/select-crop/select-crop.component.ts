import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import { CropListResponse } from '../../models/api/CropListResponse';
import { Crop } from '../../models/Crop';
import { CropDataService } from '../../service/CropDataService';
import {LanguageTranslatorService} from '../../service/LanguageTranslatorService';

@Component({
  selector: 'app-select-crop',
  templateUrl: './select-crop.component.html',
  styleUrls: ['./select-crop.component.scss']
})

export class SelectCropComponent implements OnInit{

  public addACrop = "Add a crop";
  public selectedLanguage = "spanish";
  translations = [this.addACrop];

  searchText = '';
  title = 'Select Crop';

  @ViewChild('searchbar') searchbar: ElementRef;

  toggleSearch = false;
  cropsList: Crop[];
  myCrops: CropListResponse;
  NO_NEW_CROPS = '';
  public requestingCrop = true;

  constructor(private router: Router, private location: Location, private languageService: LanguageTranslatorService,
              private cropService: CropDataService) {
                this.updateTranslation();
               }

  ngOnInit(): void {

    // Get list of crops from backend service
    this.cropService.getCropsListData()
      .subscribe(
        (cropsListResponse) => {
          this.requestingCrop = false;
          if (cropsListResponse === undefined || cropsListResponse.length === 0) {
            this.NO_NEW_CROPS = '../../assets/crops-images/noNewCrops.PNG';
          } else {
            this.cropsList = cropsListResponse;
          }
        },
        (err) => {
          alert('Could not get crop list: ' + err);
        }
      );
  }

  updateTranslation() {
    // for (let i = 0; i < this.cropsList.length; i++) {
    //   console.log(this.cropsList[i]);
    // }
    this.languageService.getTranslation(this.translations, this.selectedLanguage).subscribe((response: any) => {
       this.addACrop = (response.translations[0].translation);
      });
  }

  backToMyCrops(){
    this.location.back();
  }

  openSearch() {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }
  searchClose() {
    this.searchText = '';
    this.toggleSearch = false;
  }

  addCrop(clickedCrop: Crop) {
    this.router.navigateByUrl('/seed-date/' + clickedCrop.id).then(r => {});
  }

  filterFunction(): Crop[]{
    if (this.searchText === null || this.searchText === ''){
      return this.cropsList;
    }else{
      return this.cropsList.filter(i => i.cropName.includes( this.searchText));
    }
  }
}
