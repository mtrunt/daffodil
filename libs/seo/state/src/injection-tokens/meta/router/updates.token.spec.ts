import { TestBed } from '@angular/core/testing';
import {
  Event,
  NavigationEnd,
} from '@angular/router';

import { DaffSeoMetaDefinition } from '@daffodil/seo';

import { DaffSeoUpdateEventPair } from '../../../models/update-event-pair.interface';
import {
  daffProvideMetaRouterUpdates,
  DAFF_SEO_META_ROUTER_UPDATES,
} from './updates.token';

describe('daffProvideMetaUpdates', () => {
  let updates: DaffSeoUpdateEventPair<Event, DaffSeoMetaDefinition>[];
  let result: DaffSeoUpdateEventPair<Event, DaffSeoMetaDefinition>[];

  beforeEach(() => {
    updates = [
      {
        event: NavigationEnd,
        getData: () => null,
      },
    ];

    TestBed.configureTestingModule({
      providers: [
        ...daffProvideMetaRouterUpdates(...updates),
      ],
    });

    result = TestBed.inject(DAFF_SEO_META_ROUTER_UPDATES);
  });

  it('should provide the updates to the token', () => {
    updates.forEach(update => {
      expect(result).toContain(update);
    });
  });
});
