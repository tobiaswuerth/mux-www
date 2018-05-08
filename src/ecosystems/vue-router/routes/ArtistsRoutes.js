import Router from './../Router';
import {prepareRoute} from './../RouterUtils';
import List from './../../../components/List/List';
import {clone, makeUnique} from '../../../scripts/DataUtils';
import {
  onAfterFilter,
  onAfterMap,
  onAfterSort,
  onAfterUniqueByKey,
  simplyLoad,
  simplyLoadAll,
} from './../../../scripts/DataLoaderUtils';
import ReleasesListDetailed from '../../../components/ReleasesListDetailed/ReleasesListDetailed';
import {secondsToReadableString} from './../../../scripts/Utils';
import Store from './../../vuex/Store';

const ArtistDetailsPage = () => import('./../../../components/ArtistDetailsPage/ArtistDetailsPage');
const ArtistReleasesList = () => import('./../../../components/ArtistReleasesList/ArtistReleasesList');
const ArtistReleaseDetailsPage = () => import('./../../../components/ArtistReleaseDetailsPage/ArtistReleaseDetailsPage');
const ArtistRecordDetailsPage = () => import('./../../../components/ArtistRecordDetailsPage/ArtistRecordDetailsPage');

export const paths = {
  root: '/a',
  lookup: '/a/l/:name',
  search: '/a/s/:name',
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
    tracksFull: '/a/:id/r/:generic1?/s/:name/t',
    tracksShort: '/a/:id/s/:name/t',
  },
};

export default [
  {
    path: paths.root,
    component: clone(List),
    props: {
      route: 'artists/all', toString1: (i) => i.Name, onClick: (i) => {
        Router.push(prepareRoute(paths.lookup, {name: i.Name}));
      },
    },
  },
  {
    path: paths.search,
    component: clone(List),
    props: {
      route: 'artists/likeName',
      toString1: (i) => i.Name,
      payload: async (p) => p,
      onClick: (i) => {
        Router.push(prepareRoute(paths.lookup, {name: i.Name}));
      },
    },
  },
  {
    path: paths.lookup,
    component: clone(List),
    props: {
      route: 'artists/byName',
      toString1: (i) => i.Name,
      toString2: (i) => i.Disambiguation,
      toString3: (i) => i.Aliases.length > 0 ? `a.k.a. ${i.Aliases.map(
        a => a.Name).
        join(', ')}` : '',
      onAfter: (p) => {
        let data = p.dataSource.data;
        if (data.length === 1) {
          Router.push(prepareRoute(paths.details, {id: data[0].UniqueId}));
        }
      },
      showAvatar: true,
      doInsetDivider: true,
      payload: async (p) => p,
      onClick: (i) => Router.push(
        prepareRoute(paths.details, {id: i.UniqueId})),
    },
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
          id: {},
          name: {},
          toString1: (i) => i.Title,
          payload: async (p) => p,
          onAfter: onAfterUniqueByKey('Title'),
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
          toString1: (i) => i.Title,
          onAfter: [onAfterUniqueByKey('Title'), onAfterSort],
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
        component: clone(ReleasesListDetailed),
        props: {
          route: 'releases/byName', payload: async (p) => p.name.variations().
            map(n => Object.assign({name: n})), doPreload: true,
        },
      },
      {
        path: paths.releasesLookup.artists,
        component: clone(List),
        props: {
          route: 'artists/byId',
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
              catch(console.error);
            
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
            await Promise.all(promises).catch(console.error);
            
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
          toString1: (i) => i.Name,
          toString2: (i) => i.Disambiguation,
          toString3: (i) => i.Aliases.length > 0 ? `a.k.a. ${i.Aliases.map(
            a => a.Name).
            join(', ')}` : '',
          onAfter: [
            onAfterMap(i => i.Artist),
            onAfterUniqueByKey('UniqueId'),
            onAfterSort],
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
                catch(console.error);
              return await simplyLoadAll('releases/recordsById', payloads,
                [onAfterFilter(filterFactory(p.name)), keyMapper]).
                catch(console.error);
            }
            
            // load direct
            return await simplyLoad('artists/recordsById', payload,
              [onAfterFilter(filterFactory(p.name)), keyMapper]).
              catch(console.error);
          },
          onClick: (i) => Router.push(
            prepareRoute(paths.details, {id: i.UniqueId})),
        },
      },
      {
        path: paths.recordsLookup.releasesFull,
        alias: paths.recordsLookup.releasesShort,
        component: clone(ReleasesListDetailed),
        props: {
          route: 'records/releasesById', payload: async (p) => {
            let filterTitleBy = (x) => (i) => i.Title.normalize() ===
              x.normalize();
            let keyMapper = onAfterMap((i) => Object.assign({id: i.UniqueId}));
            let payload = {id: p.id};
            
            // load via release
            if (p.generic1) {
              let payloads = await simplyLoad('artists/releasesById', payload,
                [onAfterFilter(filterTitleBy(p.generic1)), keyMapper]).
                catch(console.error);
              return await simplyLoadAll('releases/recordsById', payloads,
                [onAfterFilter(filterTitleBy(p.name)), keyMapper]).
                catch(console.error);
            }
            
            // load direct
            return await simplyLoad('artists/recordsById', payload,
              [onAfterFilter(filterTitleBy(p.name)), keyMapper]).
              catch(console.error);
          }, doPreload: true,
        },
      },
      {
        path: paths.recordsLookup.tracksFull,
        alias: paths.recordsLookup.tracksShort,
        component: clone(List),
        props: {
          route: 'records/tracksById',
          payload: async (p) => {
            let filterTitleBy = (x) => (i) => i.Title.normalize() ===
              x.normalize();
            let keyMapper = onAfterMap((i) => Object.assign({id: i.UniqueId}));
            let payload = {id: p.id};
            
            // load via release
            if (p.generic1) {
              let payloads = await simplyLoad('artists/releasesById', payload,
                [onAfterFilter(filterTitleBy(p.generic1)), keyMapper]).
                catch(console.error);
              return await simplyLoadAll('releases/recordsById', payloads,
                [onAfterFilter(filterTitleBy(p.name)), keyMapper]).
                catch(console.error);
            }
            
            // load direct
            return await simplyLoad('artists/recordsById', payload,
              [onAfterFilter(filterTitleBy(p.name)), keyMapper]).
              catch(console.error);
          },
          doPreload: true,
          onClick: () => {},
          toString1: (i) => i.Track.Path,
          toString2: (i) => secondsToReadableString(i.Track.Duration),
          toString3: (i) => `Match: ${i.Score}`,
          actionsLeft: [
            {
              icon: 'play_arrow',
              onClick: (i) => Store.dispatch('audio/play', {track: i.Track}).
                catch(console.error),
              isRaised: true,
              isRound: true,
            }],
          actionsRight: [
            {
              icon: 'playlist_add',
              onClick: (i) => Store.dispatch('audio/addToPlaylist',
                {track: i.Track}).
                catch(console.error),
              isRaised: false,
              isRound: false,
            }],
        },
      },],
  }];
