import Router, {routes} from './../../ecosystems/vue-router/Router';
import Repeater from './../DataRepeater/DataRepeater';

export default {
  name: 'ArtistReleasesList',
  
  components: {Router, Repeater},
  
  props: {
    id: {},
  },
  
  data: () => {
    return {
      routes, route: 'artists/releasesById', doPreload: true,
    };
  },
  
  computed: {
    payload: function() {
      return {
        id: this.id,
      };
    },
  },
  
  methods: {
    doRoute: function(name) {
      let encodedName = encodeURIComponent(name);
      let uri = this.routes.private.artists.releasesLookup.root.replace(':name',
        encodedName).replace(':id', this.id);
      Router.push(uri);
    },
    
    postProcessor: function(data) {
      let d = {};
      
      data.forEach(x => {
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
      
      return d;
    },
  },
};
