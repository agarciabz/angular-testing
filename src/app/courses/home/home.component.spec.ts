import {async, ComponentFixture, fakeAsync, flush, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {CoursesService} from '../services/courses.service';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: CoursesService;

  const beginnersCourses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED');

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: CoursesService,
          useValue: coursesServiceSpy
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display only beginner courses', () => {
    (coursesService.findAllCourses as jasmine.Spy).and.returnValue(of(beginnersCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });

  it('should display only advanced courses', () => {
    (coursesService.findAllCourses as jasmine.Spy).and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });

  it('should display both tabs', () => {
    (coursesService.findAllCourses as jasmine.Spy).and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Expected to find 2 tabs');
  });

  it('should display advanced courses when tab clicked - fakeAsync', fakeAsync(() => {
    (coursesService.findAllCourses as jasmine.Spy).and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);
    fixture.detectChanges();
    // This is needed because animations are asynchronous
    // Also is not a microtask
    // Could be replaced by tick(16): takes 16 ms for animation frame
    flush();

    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card title');
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  // Async would be needed when testing actual HTTP requests
  fit('should display advanced courses when tab clicked - waitForAsync', waitForAsync(() => {
    (coursesService.findAllCourses as jasmine.Spy).and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      console.log('whenStable');
      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card title');
      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    });
  }));

});
