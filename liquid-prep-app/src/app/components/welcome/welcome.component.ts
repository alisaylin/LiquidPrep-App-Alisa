import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { Router, ActivatedRoute} from '@angular/router';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {SwiperComponent} from "ngx-swiper-wrapper";
import {LanguageTranslatorService} from '../../service/LanguageTranslatorService';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})


export class WelcomeComponent implements OnInit {

  /* FOR TRANSLATION */
  public skip = "skip";
  public saveWater = "Save water";
  public useOnly = "Only use the amount of water your crops need";
  public grow = "Grow your Crop";
  public differentWater = "Your crop has different water needs at every stage of growth";
  public measure = "measure";
  public soilMoisture = "Soil moisture level is the key to accurate watering advice";
  public back = "back";
  public next = "next";
  public selectedLanguage = "spanish";

  private IS_FIRST_START = `first-start`;

  translations = [this.skip, this.saveWater, this.useOnly, this.grow, this.differentWater, this.measure, this.soilMoisture, this.back, this.next];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private languageService: LanguageTranslatorService,
    @Inject( LOCAL_STORAGE ) private storage: StorageService) { 
      this.updateTranslation();
    }

  public config: SwiperOptions = {
    a11y: {enabled: true},
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: false,
    autoplay: false,
    speed: 500,
    longSwipesRatio: 0.1,
    longSwipesMs: 100,
    threshold: 5
  };

  @ViewChild(SwiperComponent, { static: false }) swiper?: SwiperComponent;

  public curIndex = 0;
  public isFirstSlide = true;
  public isLastSlide = false;

  public disabled = false;

  private firstStart = true;

  ngOnInit(): void {
    this.firstStart = this.storage.get(this.IS_FIRST_START);
    if (this.firstStart !== undefined && this.firstStart === false){
      this.router.navigate(['my-crops']).then(r => {});
    }
  }

  updateTranslation() {
    this.languageService.getTranslation(this.translations, this.selectedLanguage).subscribe((response: any) => {
      // [this.skip, this.saveWater, this.useOnly, this.grow, this.differentWater, this.measure, this.soilMoisture, this.back, this.next]
      this.skip = (response.translations[0].translation);
      this.saveWater = (response.translations[1].translation);
      this.useOnly = (response.translations[2].translation);
      this.grow = (response.translations[3].translation);
      this.differentWater = (response.translations[4].translation);
      this.measure = (response.translations[5].translation);
      this.soilMoisture = (response.translations[6].translation);
      this.back = (response.translations[7].translation);
      this.next = (response.translations[8].translation);
      console.log(response.translations[0].translation);
      });
  }

  public onGetStarted(){
    this.router.navigate(['my-crops']).then(r => {});
    this.storage.set(this.IS_FIRST_START, false);
  }

  public onIndexChange(index: number): void {

    this.curIndex = index;
    if (index === 0 ){
      this.isFirstSlide = true;
      this.isLastSlide = false;
    }else if (index === 2){
      this.isFirstSlide = false;
      this.isLastSlide = true;
    }else{
      this.isFirstSlide = false;
      this.isLastSlide = false;
    }
  }

  public onSwiperEvent(event: string): void {
  }

  onSlideNav(direction: string){
    if (direction === 'next'){
      if (this.isLastSlide === true){
        this.onGetStarted();
      }else{
        this.swiper.directiveRef.nextSlide(200);
      }
    }else if (direction === 'back'){
      this.swiper.directiveRef.prevSlide(200);
    }else {
    }
  }
}
