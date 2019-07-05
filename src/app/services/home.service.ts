import { Injectable } from '@angular/core';
import { CustomHttpService } from "./custom-http.service";
import { environment } from "../../environments/environment";


@Injectable()
export class HomeService {
    constructor(private http: CustomHttpService) { }
}
