import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { DeveloperProfileComponent } from './developer-profile';

describe('DeveloperProfileComponent', () => {
  let component: DeveloperProfileComponent;
  let fixture: ComponentFixture<DeveloperProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperProfileComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeveloperProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the profile when follow state changes', () => {
    expect(component.developer()?.following).toBe(false);

    component.toggleFollow();

    expect(component.developer()?.following).toBe(true);
  });
});
