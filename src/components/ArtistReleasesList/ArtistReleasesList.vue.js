import Router from './../../ecosystems/vue-router/Router';
import Routes from './../../ecosystems/vue-router/Routes';
import Repeater from '../Repeater/Repeater';
import DataLoader from './../../scripts/DataLoader';

export default {
  name: 'ArtistReleasesList',
  
  components: {Router, Repeater},
  
  props: {
    id: {},
  },
  
  data: () => {
    return {
      dataLoader: new DataLoader('artists/releasesById'), hideEmptyState: false,
    };
  },
  
  mounted: function() {
    this.dataLoader.onAfter = this.onAfter;
    this.dataLoader.load({id: this.id}, true).then(() => {
      // ignore
    }).catch((r) => {
      console.error(r);
    });
  },
  
  methods: {
    
    doRoute: function(name) {
      let encodedName = encodeURIComponent(name);
      let uri = Routes.private.artists.releasesLookup.root.replace(':name',
        encodedName).replace(':id', this.id);
      Router.push(uri);
    },
    
    onAfter: function(loader) {
      let d = {};
      
      loader.dataSource.data.forEach(x => {
        let title = x.Title;
        let country = x.Country;
        
        let entry = d[title];
        if (entry) {
          entry.variations++;
          
          if (country && entry.countries.indexOf(country) < 0) {
            entry.countries.push(country);
          }
          return;
        }
        
        d[title] = {
          variations: 1, countries: country ? [country] : [], title,
        };
      });
      
      loader.dataSource.data = d;
    },
  },
};
