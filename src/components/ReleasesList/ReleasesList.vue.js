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
