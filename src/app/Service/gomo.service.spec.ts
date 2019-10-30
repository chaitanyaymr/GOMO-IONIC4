import { TestBed } from '@angular/core/testing';

import { GomoService } from './gomo.service';

describe('GomoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GomoService = TestBed.get(GomoService);
    expect(service).toBeTruthy();
  });
});
