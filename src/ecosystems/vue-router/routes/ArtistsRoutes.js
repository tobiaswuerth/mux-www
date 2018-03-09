import Router from './../Router';
import {prepareRoute} from './../RouterUtils';
import List from './../../../components/List/List';
import {clone, makeUnique} from './../../../scripts/Utils';
import {
  onAfterFilter,
  onAfterMap,
  onAfterSort,
  onAfterUnique,
  simplyLoad,
  simplyLoadAll,
} from './../../../scripts/DataLoaderUtils';

const ArtistsListDetailed = () => import('./../../../components/ArtistsListDetailed/ArtistsListDetailed');
const ArtistDetailsPage = () => import('./../../../components/ArtistDetailsPage/ArtistDetailsPage');
const ArtistReleasesList = () => import('./../../../components/ArtistReleasesList/ArtistReleasesList');
const ArtistReleaseDetailsPage = () => import('./../../../components/ArtistReleaseDetailsPage/ArtistReleaseDetailsPage');
const ArtistReleaseVariationsList = () => import('./../../../components/ArtistReleaseVariationsList/ArtistReleaseVariationsList');
const ArtistRecordDetailsPage = () => import('./../../../components/ArtistRecordDetailsPage/ArtistRecordDetailsPage');
const ArtistRecordReleasesList = () => import('./../../../components/ArtistRecordReleasesList/ArtistRecordReleasesList');

export const paths = {
  root: '/a',
  lookup: '/a/l/:name',
  details: '/a/:id',
  releases: '/a/:id/r',
  releasesLookup: {
    root: '/a/:id/r/:name',
    variants: '/a/:id/r/:name/v',
    artists: '/a/:id/r/:name/a',
    records: '/a/:id/r/:name/s',
  },
  records: '/a/:id/s',
  recordsLookup: {
    rootFull: '/a/:id/r/:generic1?/s/:name',
    rootShort: '/a/:id/s/:name',
    artistsFull: '/a/:id/r/:generic1?/s/:name/a',
    artistsShort: '/a/:id/s/:name/a',
    releasesFull: '/a/:id/r/:generic1?/s/:name/r',
    releasesShort: '/a/:id/s/:name/r',
  },
};

export default [
  {
    path: paths.root,
    component: clone(List),
    props: {
      route: 'artists/all',
      toString1: (i) => i.Name,
      valueKey: 'Name',
      onClick: (i) => {
        Router.push(prepareRoute(paths.lookup, {name: i.Name}));
      },
    },
  },
  {
    path: paths.lookup,
    component: ArtistsListDetailed,
    props: true,
  },
  {
    path: paths.details,
    component: ArtistDetailsPage,
    redirect: paths.releases,
    props: true,
    children: [
      {
        path: paths.releases, component: ArtistReleasesList, props: true,
      }, {
        path: paths.records, component: clone(List), props: {
          route: 'artists/recordsById',
          valueKey: 'Title',
          id: {},
          name: {},
          toString1: (i) => i.Title,
          payload: async (p) => p,
          onAfter: onAfterUnique,
          onClick: (i, p) => {
            Router.push(prepareRoute(p.generic
              ? paths.recordsLookup.rootFull
              : paths.recordsLookup.rootShort,
              {id: p.id, name: i.Title, 'generic1?': p.generic1}));
          },
        },
      }],
  },
  {
    path: paths.releasesLookup.root,
    component: ArtistReleaseDetailsPage,
    redirect: paths.releasesLookup.records,
    props: true,
    children: [
      {
        path: paths.releasesLookup.records,
        component: clone(List),
        props: {
          route: 'releases/recordsById',
          valueKey: 'Title',
          toString1: (i) => i.Title,
          onAfter: [onAfterUnique, onAfterSort],
          doPreload: true,
          payload: async (p) => await simplyLoad('artists/releasesById',
            {id: p.id}, [
              onAfterFilter((i) => i.Title.normalize() === p.name.normalize()),
              onAfterMap((i) => Object.assign({id: i.UniqueId}))]),
          onClick: (i, p) => {
            Router.push(prepareRoute(paths.recordsLookup.rootFull,
              {id: p.id, name: i.Title, 'generic1?': p.name}));
          },
        },
      },
      {
        path: paths.releasesLookup.variants,
        component: ArtistReleaseVariationsList,
        props: true,
      },
      {
        path: paths.releasesLookup.artists,
        component: clone(List),
        props: {
          route: 'artists/byId',
          valueKey: 'UniqueId',
          toString1: (i) => i.Name,
          toString2: (i) => i.Disambiguation,
          toString3: (i) => i.Aliases.length > 0 ? `a.k.a. ${i.Aliases.map(
            a => a.Name).
            join(', ')}` : '',
          onAfter: onAfterSort,
          showAvatar: true,
          doInsetDivider: true,
          payload: async (p) => {
            // load artist releases
            let payloads = await simplyLoad('artists/releasesById', {id: p.id},
              [
                onAfterFilter(
                  (i) => i.Title.normalize() === p.name.normalize()),
                onAfterMap((i) => Object.assign({id: i.UniqueId}))]).
              catch((r) => {
                console.error(r);
              });
  
            let data = [];
            let append = (d) => data = data.concat(d);
            let promises = [];
  
            // get artists via release
            promises.push(simplyLoadAll('releases/artistsById', payloads,
              onAfterMap(i => i.Artist.UniqueId)).
              then(append));
  
            // get artists via records
            payloads = await simplyLoadAll('releases/recordsById', payloads,
              onAfterMap((i) => Object.assign({id: i.UniqueId})));
            promises.push(simplyLoadAll('records/artistsById', payloads,
              onAfterMap(i => i.Artist.UniqueId)).
              then(append));
  
            // wait for all to be loaded
            await Promise.all(promises).catch((r) => {
              console.error(r);
            });
  
            data = makeUnique(data);
            data = data.map(d => Object.assign({id: d}));
  
            return Promise.resolve(data);
          },
          onClick: (i) => Router.push(
            prepareRoute(paths.details, {id: i.UniqueId})),
        },
      },],
  },
  {
    path: paths.recordsLookup.rootFull,
    alias: paths.recordsLookup.rootShort,
    component: ArtistRecordDetailsPage,
    redirect: (r) => r.params.generic1
      ? paths.recordsLookup.artistsFull
      : paths.recordsLookup.artistsShort,
    props: true,
    children: [
      {
        path: paths.recordsLookup.artistsFull,
        alias: paths.recordsLookup.artistsShort,
        component: clone(List),
        props: {
          route: 'records/artistsById',
          valueKey: 'UniqueId',
          toString1: (i) => i.Name,
          toString2: (i) => i.Disambiguation,
          toString3: (i) => i.Aliases.length > 0 ? `a.k.a. ${i.Aliases.map(
            a => a.Name).
            join(', ')}` : '',
          onAfter: [
            onAfterMap(i => i.Artist), onAfterUnique, onAfterSort],
          showAvatar: true,
          doInsetDivider: true,
          payload: async (p) => {
            let filterFactory = (x) => (i) => i.Title.normalize() ===
              x.normalize();
            let keyMapper = onAfterMap((i) => Object.assign({id: i.UniqueId}));
            let payload = {id: p.id};
  
            // load via release
            if (p.generic1) {
              let payloads = await simplyLoad('artists/releasesById', payload,
                [onAfterFilter(filterFactory(p.generic1)), keyMapper]).
                catch((r) => {
                  console.error(r);
                });
              return await simplyLoadAll('releases/recordsById', payloads,
                [onAfterFilter(filterFactory(p.name)), keyMapper]).
                catch((r) => {
                  console.error(r);
                });
            }
  
            // load direct
            return await simplyLoad('artists/recordsById', payload,
              [onAfterFilter(filterFactory(p.name)), keyMapper]).catch((r) => {
              console.error(r);
            });
          },
          onClick: (i) => Router.push(
            prepareRoute(paths.details, {id: i.UniqueId})),
        },
      },
      {
        path: paths.recordsLookup.releasesFull,
        alias: paths.recordsLookup.releasesShort,
        component: ArtistRecordReleasesList,
        props: true,
      },],
  }];
