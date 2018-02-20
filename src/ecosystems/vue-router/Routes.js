export default {
  public: {
    login: '/login',
  },
  
  private: {
    root: '/',
    
    artists: {
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
        root: '/a/:id/s/:name',
        artists: '/a/:id/s/:name/a',
        releases: '/a/:id/s/:name/r',
      },
    },
    
    releases: {
      root: '/r', lookup: '/r/l/:name', details: '/r/:id',
    },
    
    records: {
      root: '/s',
      lookup: '/s/l/:name',
      details: '/s/:id',
      artists: '/s/:id/a',
      releases: '/s/:id/r',
    },
    
    tracks: {
      root: '/t',
    },
  },
};
