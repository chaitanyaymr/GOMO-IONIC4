import { TestBed } from '@angular/core/testing';

import { GomodbService } from './gomodb.service';

describe('GomodbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GomodbService = TestBed.get(GomodbService);
    expect(service).toBeTruthy();
  });
});
