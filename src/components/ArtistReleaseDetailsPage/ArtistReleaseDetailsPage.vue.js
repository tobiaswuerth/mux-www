import Vue from 'vue';
import SubContentHub from './../SubContentHub/SubContentHub';

import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ArtistReleaseDetailsPage',
  
  components: {
    SubContentHub,
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
      let c = [];
      this.data.filter(x => x.Country).map(x => x.Country).forEach(x => {
        if (c.indexOf(x) < 0) {
          c.push(x);
        }
      });
      console.log(c);
      return c;
    },
  },
  
  methods: {
    
    load: function() {
      if (this.state === this.states.loading) {
        return;
      }
      
      this.state = this.states.loading;
      
      this.$store.dispatch('artists/releasesById',
        {id: this.id, pageIndex: this.pageIndex}).
        then(v => {
          let relevant = v.data.filter(x => x.Title === this.name);
          this.data = this.data.concat(relevant);
          this.hasMore = v.hasMore;
          
          if (this.hasMore) {
            this.state = this.states.ready;
            this.loadMore();
          }
        }).catch(x => {
        console.error(x);
      }).finally(() => {
        this.state = this.states.ready;
      });
    },
    
  },
});
