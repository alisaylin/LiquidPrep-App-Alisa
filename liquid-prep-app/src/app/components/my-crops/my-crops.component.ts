import {Component, OnInit, Input, ApplicationRef, NgZone} from '@angular/core';
import { formatDate, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ThemePalette } from '@angular/material/core';

import { Crop } from '../../models/Crop';
import { WeatherDataService } from 'src/app/service/WeatherDataService';
import { TodayWeather } from 'src/app/models/TodayWeather';
import { CropDataService } from 'src/app/service/CropDataService';
import { DateTimeUtil } from 'src/app/utility/DateTimeUtil';
import {LanguageTranslatorService} from '../../service/LanguageTranslatorService';
import { Subscribable } from 'rxjs';

@Component({
  selector: 'app-my-crops',
  templateUrl: './my-crops.component.html',
  styleUrls: ['./my-crops.component.scss'],
})
export class MyCropsComponent implements OnInit {
  myCrops: Crop[];
  displayedColumns: string[] = ['EmptyColumnTitle'];

  tabs = ['My Crops', 'Settings'];
  activeTab = this.tabs[0];
  background: ThemePalette = undefined;

  /* FOR TRANSLATION */
  public selectedLanguage = 'spanish';
  public today = 'Today, ';
  public currentDate = '';
  public addYourCrop = 'Add your first crop';
  public selectOption = 'Select the crop for your watering advice!';
  public add = 'Add';
  translations = [this.today, this.addYourCrop, this.selectOption, this.add];

  public weatherIconDay = '';
  public weatherIconNight = '';
  public loading = false;
  public temperatureMax = null;
  public temperatureMin = null;
  public todayWeather = null;
  public translation = null;
  public myCropStatus: 'no-crop' | 'crop-selected' = 'no-crop';
  public errorMessage = '';
  result: Object;

  constructor(
    private router: Router, private location: Location, private languageService: LanguageTranslatorService,
    private weatherService: WeatherDataService, private cropDataService: CropDataService
    ) {
    this.updateWeatherInfo();
    this.updateTranslation();
  }

  ngOnInit(): void {

    this.cropDataService.getMyCrops().subscribe(myCrops => {
      this.myCrops = myCrops;
      if (this.myCrops.length > 0){
        this.myCropStatus = 'crop-selected';
      }
    });
    this.currentDate =  formatDate(new Date(), 'MMMM d, yyyy', 'en');
    // this.currentDate = this.translation;// this.languageService.getTranslation("November 15, 2022", "spanish");
    // TODO: Add weather template
    /*this.dataService.getWeatherInfo().subscribe((weatherInfo: WeatherResponse) => {
      const todayWeather = WeatherService.getInstance().createTodayWeather(weatherInfo);
    });*/
  }

  public tabClicked(tab) {
    this.activeTab = tab;
    if (tab === tab[0]) {
      this.router.navigateByUrl('/my-crops').then(r => {});
    } else {
      this.router.navigateByUrl('/settings').then(r => {});
    }
  }

  public fabClicked() {
    this.router.navigateByUrl('/select-crop').then(r => {});
  }

  public volumeClicked() {

  }

  public cropClicked(event){
    this.router.navigate(['advice']).then(r => {});
  }

  public backClicked() {
    this.location.back();
  }

  onContextMenu($event: MouseEvent, crop: Crop) {
  }

  onViewCropAdvice(crop: Crop) {
    this.cropDataService.storeSelectedCropIdInSession(crop.id);
    this.router.navigate(['advice/' + crop.id]).then(r => {});
  }

  onRemoveCrop(crop: Crop) {
    this.cropDataService.deleteMyCrop(crop.id);
    window.location.reload();
  }

  onAdd1stCrop() {
    this.router.navigateByUrl('/select-crop').then(r => {});
  }

  updateWeatherInfo(){

    this.loading = true;
    this.weatherService.getTodayWeather().subscribe(
        (todayWeather: TodayWeather) => {
          this.loading = false;
          this.todayWeather = todayWeather;
        },
        (err) => {
          this.loading = false;
          this.errorMessage = err ;
        }
    );
  }
  updateTranslation() {
    this.languageService.getTranslation(this.translations, this.selectedLanguage).subscribe((response: any) => {
       this.today = (response.translations[0].translation);
       this.addYourCrop = (response.translations[1].translation);
       this.selectOption = (response.translations[2].translation);
       this.add = (response.translations[3].translation);
      });
      // don't know how to make date into string
    this.languageService.getTranslation("November 16, 2022", this.selectedLanguage).subscribe((response: any) => {
       this.translation = (response.translations[0].translation);
       this.currentDate = (this.translation);
      });
  }


  showError(msg) {
    alert(msg ? msg : this.errorMessage);
  }

}
