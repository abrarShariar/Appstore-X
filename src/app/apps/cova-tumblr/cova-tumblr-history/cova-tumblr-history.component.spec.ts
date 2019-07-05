import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovaTumblrHistoryComponent } from './cova-tumblr-history.component';

describe('CovaTumblrHistoryComponent', () => {
  let component: CovaTumblrHistoryComponent;
  let fixture: ComponentFixture<CovaTumblrHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovaTumblrHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovaTumblrHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
