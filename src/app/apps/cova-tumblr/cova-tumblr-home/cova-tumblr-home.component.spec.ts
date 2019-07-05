import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovaTumblrHomeComponent } from './cova-tumblr-home.component';

describe('CovaTumblrHomeComponent', () => {
  let component: CovaTumblrHomeComponent;
  let fixture: ComponentFixture<CovaTumblrHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovaTumblrHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovaTumblrHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
