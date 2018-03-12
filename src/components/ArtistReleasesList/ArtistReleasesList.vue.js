import Router, {paths} from './../../ecosystems/vue-router/Router';
import {simplyLoad} from './../../scripts/DataLoaderUtils';

export default {
  name: 'ArtistReleasesList',
  
  props: {
    id: {},
  },
  
  data: () => {
    return {
      data: [], hideEmptyState: false, isLoading: true,
    };
  },
  
  mounted: function() {
    simplyLoad('artists/releasesById', {id: this.id}, this.onAfter).
      then((data) => {
        this.data = data;
        this.isLoading = false;
      }).
      catch((r) => {
        console.error(r);
      });
  },
  
  methods: {
    
    doRoute: function(name) {
      let encodedName = encodeURIComponent(name);
      let uri = paths.private.artists.releasesLookup.root.replace(':name',
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
