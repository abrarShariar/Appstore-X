import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TumblrTabsComponent } from './tumblr-tabs.component';

describe('TumblrTabsComponent', () => {
  let component: TumblrTabsComponent;
  let fixture: ComponentFixture<TumblrTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TumblrTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TumblrTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
