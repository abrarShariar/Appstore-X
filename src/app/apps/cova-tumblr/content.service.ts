import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

const API_URL = environment.COVA_TUMBLER_API_URL;

@Injectable({
  providedIn: 'root'
})

export class ContentService {
  currentContent: any;
  detailContent: any;
  private showTabSource = new BehaviorSubject(true);
  currentShowTab = this.showTabSource.asObservable();

  private showBarSource = new BehaviorSubject(true);
  currentShowBar = this.showBarSource.asObservable();

  private showHeaderSource = new BehaviorSubject(true);
  currentShowHeader = this.showHeaderSource.asObservable();

  private showCategoriesSource = new BehaviorSubject(true);
  currentShowCategories = this.showCategoriesSource.asObservable();

  private searchParam = new BehaviorSubject<any>({});
  currentSearchParam = this.searchParam.asObservable();

  private showParametersSource = new BehaviorSubject(true);
  currentShowParams = this.showParametersSource.asObservable();

  private showCategoryButtons = new BehaviorSubject([]);
  currentShowButtons = this.showCategoryButtons.asObservable();

  private showTabButtonColors = new BehaviorSubject([]);
  currentShowButtonColors = this.showTabButtonColors.asObservable();

  private passTabButtonColors = new BehaviorSubject([]);
  currentPassedTabButtonColors = this.passTabButtonColors.asObservable();

  constructor(private http: HttpClient, private storage: Storage) { }

  async createAuthHeader() {
    let headers: HttpHeaders = new HttpHeaders();
    const token = await this.storage.get('jwt-token');
    headers = headers.set('Authorization', 'Bearer ' + token);
    return headers;
  }

  async getContent(url) {
    // console.log("Content url: ", url);
    const headers = await this.createAuthHeader();
    const address = `${API_URL}/${url}`;
    return this.http.get(address, {headers: headers}).toPromise();
  }

  async getContentCategories(url) {
    const headers = await this.createAuthHeader();
    const address = `${API_URL}/${url}`;
    return this.http.get(address, {headers: headers}).toPromise();
  }

  async getBookPreview(url) {
    const headers = await this.createAuthHeader();
    const address = `${API_URL}/${url}`;
    console.log('Going for book preview to address', address);
    return this.http.get(address, {headers: headers}).toPromise();
  }

  async sendPost(url, bookID) {
    const address = `${API_URL}/${url}`;
    const headers = await this.createAuthHeader();
    return this.http.post(address, {book_id: bookID}, {headers: headers}).toPromise();
  }

  async postChapterPaid(url, chapter_num) {
    const address = `${API_URL}/${url}`;
    const headers = await this.createAuthHeader();
    // console.log("Going to post to address: ", address);
    // console.log("chapter_num: ", chapter_num);
    return this.http.post(address, {chapter_num: chapter_num}, {headers: headers}).toPromise();
  }

  async getChapterList(url) {
    const headers = await this.createAuthHeader();
    const address = `${API_URL}/${url}`;
    // console.log("Going for chapter list to address", address);
    return this.http.get(address, {headers: headers}).toPromise();
  }

  async getSpecificChapter(url) {
    const headers = await this.createAuthHeader();
    const address = `${API_URL}/${url}`;
    // console.log("Going for specific chapter to address", address);
    return this.http.get(address, {headers: headers}).toPromise();
  }

  async getChapterPrice(url) {
    const headers = await this.createAuthHeader();
    const address = `${API_URL}/${url}`;
    // console.log("Going for chapter price to address", address);
    return this.http.get(address, {headers: headers}).toPromise();
  }

  toggleTab(flag: boolean) {
    this.showTabSource.next(flag);
  }

  toggleBar(flag: boolean) {
    this.showBarSource.next(flag);
  }

  toggleHeader(flag: boolean) {
    this.showHeaderSource.next(flag);
  }

  toggleCategories(flag: boolean) {
    this.showCategoriesSource.next(flag);
  }

  toggleParams(flag: boolean) {
    this.showParametersSource.next(flag);
  }

  resetButtonColors(flag: boolean[]) {
    this.showCategoryButtons.next(flag);
  }

  resetTabButtonColors(flag: boolean[]) {
    this.showTabButtonColors.next(flag);
  }

  placeTabButtonColors(flag: boolean[]) {
    this.passTabButtonColors.next(flag);
  }

  pingForData(data: any) {
    // console.log("pinging for data: ", data);
    this.searchParam.next(data);
  }
}
