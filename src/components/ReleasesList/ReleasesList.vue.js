import Vue from 'vue';

import AsyncDataLoader from '../../mixins/AsyncDataLoader';

export default Vue.extend({
  name: 'ReleasesList',

  mixins: [AsyncDataLoader],

  props: {
    artistId: {},
  },

  computed: {
    processedData: function() {
      let d = {};
      this.data.forEach(x => {
        let title = x.Title;
        let country = x.Country;

        if (!d[title]) {
          d[title] = {
            countries: [
              country],
          };
        } else if (d[title].countries.indexOf(country) === 0) {
          d[title].countries = d[title].countries.concat(country);
        }
      });
      return d;
    },
  },

  methods: {
    load: function() {
      // validate
      if (this.state === this.states.loading) {
        return;
      }

      // execute
      this.state = this.states.loading;
      this.$store.dispatch('artists/releasesById',
        {id: this.artistId, pageIndex: this.pageIndex}).
        then(v => {
          this.data = this.data.concat(v.data);
          this.hasMore = v.hasMore;
        }).
        catch(v => {
          console.error(v);
        }).finally(() => {
        this.state = this.states.ready;
      });
    },
  },
});
