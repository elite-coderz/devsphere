import { TestBed } from '@angular/core/testing';
import { DeveloperProfileComponent } from '../components/developer-profile/developer-profile';

describe('Developer', () => {
  let service: DeveloperProfileComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeveloperProfileComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
