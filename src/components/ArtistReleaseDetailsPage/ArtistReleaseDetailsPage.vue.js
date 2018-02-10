import Vue from 'vue';
import Router from './../../ecosystems/vue-router/Router';

import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistReleaseDetailsPage',
  
  components: {
    Router,
  },
  
  mixins: [AsyncDataLoader],
  
  props: {
    id: {}, name: {},
  },
  
  computed: {
    variations: function() {
      return this.data.length;
    },
    
    countries: function() {
      let countries = [];
      this.data.forEach(x => {
        if (countries.indexOf(x) < 0) {
          countries.push(x);
        }
      });
      return countries;
    },
  },
  
  methods: {
    
    load: function() {
      this.state = this.states.loading;
      
      this.$store.dispatch('artists/releasesById', {id: this.id}).
        then(v => {
          this.data = v.data.filter(x => x.Title === this.name);
          
        }).finally(() => {
        this.state = this.states.ready;
      });
    },
    
  },
});
